// import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Interface for database identifier changes
 */
export interface DbIdentifierChange {
  /** The type of database object being renamed */
  type: 'table' | 'column' | 'enum' | 'constraint' | 'index'
  /** The old identifier name */
  oldName: string
  /** The new identifier name */
  newName: string
  /** The table name (for columns, constraints, indexes) */
  tableName?: string
  /** The schema name (defaults to 'public') */
  schemaName?: string
  /** Additional metadata for the change */
  metadata?: {
    /** Column data type (for column renames) */
    dataType?: string
    /** Constraint type (for constraint renames) */
    constraintType?: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK'
    /** Index type (for index renames) */
    indexType?: 'BTREE' | 'HASH' | 'GIN' | 'GIST'
    /** Referenced table (for foreign keys) */
    referencedTable?: string
    /** Referenced column (for foreign keys) */
    referencedColumn?: string
  }
}

/**
 * Interface for migration operation
 */
export interface MigrationOperation {
  /** SQL statement for the up migration */
  upSql: string
  /** SQL statement for the down migration (rollback) */
  downSql: string
  /** Description of the operation */
  description: string
  /** Order of execution (lower numbers execute first) */
  order: number
}

/**
 * Migration generator for database identifier changes
 */
export class DatabaseMigrationGenerator {
  private changes: DbIdentifierChange[] = []

  /**
   * Add a database identifier change
   */
  addChange(change: DbIdentifierChange): void {
    this.changes.push(change)
  }

  /**
   * Add multiple database identifier changes
   */
  addChanges(changes: DbIdentifierChange[]): void {
    this.changes.push(...changes)
  }

  /**
   * Generate migration operations for all changes
   */
  generateOperations(): MigrationOperation[] {
    const operations: MigrationOperation[] = []

    // Sort changes by type to ensure proper execution order
    const sortedChanges = this.sortChangesByExecutionOrder()

    sortedChanges.forEach((change, index) => {
      const operation = this.generateOperationForChange(change, index)
      if (operation) {
        operations.push(operation)
      }
    })

    return operations
  }

  /**
   * Generate a complete migration file content
   */
  generateMigrationFile(migrationName: string): string {
    const operations = this.generateOperations()
    // const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]

    const upStatements = operations
      .sort((a, b) => a.order - b.order)
      .map((op) => `    -- ${op.description}\n    ${op.upSql}`)
      .join('\n\n')

    const downStatements = operations
      .sort((a, b) => b.order - a.order) // Reverse order for rollback
      .map((op) => `    -- Rollback: ${op.description}\n    ${op.downSql}`)
      .join('\n\n')

    return `import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: ${migrationName}
 * Generated: ${new Date().toISOString()}
 * 
 * This migration handles database identifier renaming to comply with PostgreSQL
 * 63-character identifier length limits while preserving data integrity.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql\`
${upStatements}
  \`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql\`
${downStatements}
  \`)
}
`
  }

  /**
   * Sort changes by execution order to prevent dependency issues
   */
  private sortChangesByExecutionOrder(): DbIdentifierChange[] {
    const orderMap = {
      enum: 1, // Rename enums first
      table: 2, // Then tables
      column: 3, // Then columns
      constraint: 4, // Then constraints
      index: 5, // Finally indexes
    }

    return [...this.changes].sort((a, b) => {
      return (orderMap[a.type] || 999) - (orderMap[b.type] || 999)
    })
  }

  /**
   * Generate migration operation for a single change
   */
  private generateOperationForChange(
    change: DbIdentifierChange,
    order: number,
  ): MigrationOperation | null {
    const schema = change.schemaName || 'public'

    switch (change.type) {
      case 'table':
        return {
          upSql: `ALTER TABLE "${schema}"."${change.oldName}" RENAME TO "${change.newName}";`,
          downSql: `ALTER TABLE "${schema}"."${change.newName}" RENAME TO "${change.oldName}";`,
          description: `Rename table ${change.oldName} to ${change.newName}`,
          order,
        }

      case 'column':
        if (!change.tableName) {
          throw new Error(`Table name required for column rename: ${change.oldName}`)
        }
        return {
          upSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME COLUMN "${change.oldName}" TO "${change.newName}";`,
          downSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME COLUMN "${change.newName}" TO "${change.oldName}";`,
          description: `Rename column ${change.tableName}.${change.oldName} to ${change.newName}`,
          order,
        }

      case 'enum':
        return {
          upSql: `ALTER TYPE "${schema}"."${change.oldName}" RENAME TO "${change.newName}";`,
          downSql: `ALTER TYPE "${schema}"."${change.newName}" RENAME TO "${change.oldName}";`,
          description: `Rename enum type ${change.oldName} to ${change.newName}`,
          order,
        }

      case 'constraint':
        if (!change.tableName) {
          throw new Error(`Table name required for constraint rename: ${change.oldName}`)
        }
        return {
          upSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME CONSTRAINT "${change.oldName}" TO "${change.newName}";`,
          downSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME CONSTRAINT "${change.newName}" TO "${change.oldName}";`,
          description: `Rename constraint ${change.tableName}.${change.oldName} to ${change.newName}`,
          order,
        }

      case 'index':
        return {
          upSql: `ALTER INDEX "${schema}"."${change.oldName}" RENAME TO "${change.newName}";`,
          downSql: `ALTER INDEX "${schema}"."${change.newName}" RENAME TO "${change.oldName}";`,
          description: `Rename index ${change.oldName} to ${change.newName}`,
          order,
        }

      default:
        console.warn(`Unknown change type: ${change.type}`)
        return null
    }
  }

  /**
   * Validate that all changes are safe to execute
   */
  validateChanges(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check for duplicate new names
    const newNames = new Set<string>()
    for (const change of this.changes) {
      const key = `${change.type}:${change.schemaName || 'public'}:${change.tableName || ''}:${change.newName}`
      if (newNames.has(key)) {
        errors.push(`Duplicate new name: ${change.newName} for ${change.type}`)
      }
      newNames.add(key)
    }

    // Check for circular renames (A -> B, B -> A)
    const renameMap = new Map<string, string>()
    for (const change of this.changes) {
      const oldKey = `${change.type}:${change.schemaName || 'public'}:${change.tableName || ''}:${change.oldName}`
      const newKey = `${change.type}:${change.schemaName || 'public'}:${change.tableName || ''}:${change.newName}`

      if (renameMap.has(newKey) && renameMap.get(newKey) === oldKey) {
        errors.push(`Circular rename detected: ${change.oldName} <-> ${change.newName}`)
      }

      renameMap.set(oldKey, newKey)
    }

    // Validate identifier lengths
    for (const change of this.changes) {
      if (change.newName.length > 63) {
        errors.push(`New identifier too long (${change.newName.length} chars): ${change.newName}`)
      }
      if (change.oldName.length > 63) {
        errors.push(`Old identifier too long (${change.oldName.length} chars): ${change.oldName}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Clear all changes
   */
  clear(): void {
    this.changes = []
  }

  /**
   * Get all changes
   */
  getChanges(): DbIdentifierChange[] {
    return [...this.changes]
  }
}

/**
 * Helper function to create a migration generator with common identifier changes
 */
export function createIdentifierMigrationGenerator(): DatabaseMigrationGenerator {
  return new DatabaseMigrationGenerator()
}

/**
 * Helper function to generate enum rename changes based on patterns
 */
export function generateEnumRenames(enumMappings: Record<string, string>): DbIdentifierChange[] {
  return Object.entries(enumMappings).map(([oldName, newName]) => ({
    type: 'enum' as const,
    oldName,
    newName,
    schemaName: 'public',
  }))
}

/**
 * Helper function to generate table rename changes
 */
export function generateTableRenames(tableMappings: Record<string, string>): DbIdentifierChange[] {
  return Object.entries(tableMappings).map(([oldName, newName]) => ({
    type: 'table' as const,
    oldName,
    newName,
    schemaName: 'public',
  }))
}

/**
 * Helper function to generate column rename changes
 */
export function generateColumnRenames(
  tableName: string,
  columnMappings: Record<string, string>,
): DbIdentifierChange[] {
  return Object.entries(columnMappings).map(([oldName, newName]) => ({
    type: 'column' as const,
    oldName,
    newName,
    tableName,
    schemaName: 'public',
  }))
}
