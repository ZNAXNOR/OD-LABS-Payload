/**
 * Database Schema Analyzer
 *
 * This utility inspects the actual PostgreSQL database to identify existing
 * header-related tables and their naming patterns. It helps understand the
 * mismatch between configured dbName properties and actual database schema.
 *
 * Requirements addressed: 1.2, 1.4, 1.5
 */

import config from '@payload-config'
import type { Payload } from 'payload'
import { getPayload } from 'payload'

/**
 * Database table information
 */
export interface TableInfo {
  tableName: string
  schemaName: string
  tableType: 'BASE TABLE' | 'VIEW' | 'MATERIALIZED VIEW'
  columns: ColumnInfo[]
  constraints: ConstraintInfo[]
  indexes: IndexInfo[]
}

/**
 * Database column information
 */
export interface ColumnInfo {
  columnName: string
  dataType: string
  isNullable: boolean
  defaultValue: string | null
  characterMaximumLength: number | null
}

/**
 * Database constraint information
 */
export interface ConstraintInfo {
  constraintName: string
  constraintType: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK'
  columnNames: string[]
  referencedTable?: string
  referencedColumns?: string[]
}

/**
 * Database index information
 */
export interface IndexInfo {
  indexName: string
  columnNames: string[]
  isUnique: boolean
  indexType: string
}

/**
 * Header-related table analysis result
 */
export interface HeaderTableAnalysis {
  expectedTables: string[]
  actualTables: string[]
  missingTables: string[]
  unexpectedTables: string[]
  tableMapping: Record<string, string>
  namingPatterns: {
    pattern: string
    examples: string[]
    count: number
  }[]
}

/**
 * Database schema analyzer class
 */
export class DatabaseSchemaAnalyzer {
  private payload: Payload | null = null

  /**
   * Initialize the analyzer with Payload instance
   */
  async initialize(): Promise<void> {
    if (!this.payload) {
      this.payload = await getPayload({ config })
    }
  }

  /**
   * Get all tables in the database
   */
  async getAllTables(): Promise<TableInfo[]> {
    await this.initialize()

    if (!this.payload?.db?.drizzle) {
      throw new Error('Database connection not available')
    }

    const query = `
      SELECT 
        t.table_name,
        t.table_schema,
        t.table_type,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c ON t.table_name = c.table_name 
        AND t.table_schema = c.table_schema
      WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name, c.ordinal_position
    `

    const result = await this.payload.db.drizzle.execute(query)
    const rows = Array.isArray(result) ? result : result.rows || []
    return this.groupTableResults(rows)
  }

  /**
   * Get header-related tables specifically
   */
  async getHeaderRelatedTables(): Promise<TableInfo[]> {
    const allTables = await this.getAllTables()

    // Filter tables that are likely related to the header global
    return allTables.filter(
      (table) =>
        table.tableName.includes('header') ||
        table.tableName.includes('nav') ||
        table.tableName.includes('dropdown') ||
        table.tableName.includes('menu'),
    )
  }

  /**
   * Analyze header table naming patterns
   */
  async analyzeHeaderTableNaming(): Promise<HeaderTableAnalysis> {
    const headerTables = await this.getHeaderRelatedTables()
    const actualTables = headerTables.map((t) => t.tableName)

    // Expected tables based on current configuration
    const expectedTables = this.getExpectedHeaderTables()

    // Find missing and unexpected tables
    const missingTables = expectedTables.filter(
      (expected) => !actualTables.some((actual) => this.tablesMatch(expected, actual)),
    )

    const unexpectedTables = actualTables.filter(
      (actual) => !expectedTables.some((expected) => this.tablesMatch(expected, actual)),
    )

    // Create mapping between expected and actual tables
    const tableMapping: Record<string, string> = {}
    expectedTables.forEach((expected) => {
      const match = actualTables.find((actual) => this.tablesMatch(expected, actual))
      if (match) {
        tableMapping[expected] = match
      }
    })

    // Analyze naming patterns
    const namingPatterns = this.analyzeNamingPatterns(actualTables)

    return {
      expectedTables,
      actualTables,
      missingTables,
      unexpectedTables,
      tableMapping,
      namingPatterns,
    }
  }

  /**
   * Get expected header tables based on configuration
   */
  private getExpectedHeaderTables(): string[] {
    // Based on the current Header configuration with dbName properties
    return [
      'header', // Main global table
      'header_tabs', // Navigation tabs array (no dbName, uses default)
      'header_tabs_dropdown_description_links', // Description links array
      'header_tabs_dropdown_nav_items', // Navigation items array (dbName: 'nav_items')
      'header_tabs_dropdown_nav_items_featured_link_links', // Featured links array (dbName: 'links')
      'header_tabs_dropdown_nav_items_list_links_links', // List links array (dbName: 'links')
    ]
  }

  /**
   * Check if two table names match (accounting for naming variations)
   */
  private tablesMatch(expected: string, actual: string): boolean {
    // Direct match
    if (expected === actual) return true

    // Check if actual table name contains the expected pattern
    const expectedParts = expected.split('_')
    const actualParts = actual.split('_')

    // If actual has fewer parts, it might be a shortened version
    if (actualParts.length < expectedParts.length) {
      return actualParts.every(
        (part, index) =>
          expectedParts[index] &&
          (expectedParts[index] === part ||
            expectedParts[index].startsWith(part) ||
            part.startsWith(expectedParts[index])),
      )
    }

    // Check for partial matches
    return expectedParts.some((expectedPart) =>
      actualParts.some(
        (actualPart) =>
          expectedPart === actualPart ||
          expectedPart.includes(actualPart) ||
          actualPart.includes(expectedPart),
      ),
    )
  }

  /**
   * Analyze naming patterns in table names
   */
  private analyzeNamingPatterns(tableNames: string[]): Array<{
    pattern: string
    examples: string[]
    count: number
  }> {
    const patterns = new Map<string, string[]>()

    tableNames.forEach((tableName) => {
      // Analyze different patterns
      const parts = tableName.split('_')

      // Pattern: prefix_*
      if (parts.length > 1) {
        const prefix = parts[0]
        if (!patterns.has(`${prefix}_*`)) {
          patterns.set(`${prefix}_*`, [])
        }
        patterns.get(`${prefix}_*`)!.push(tableName)
      }

      // Pattern: *_array_table (for array fields)
      if (parts.length > 2) {
        const pattern = `${parts[0]}_*_array`
        if (!patterns.has(pattern)) {
          patterns.set(pattern, [])
        }
        patterns.get(pattern)!.push(tableName)
      }

      // Pattern: deeply nested (3+ underscores)
      if (parts.length >= 4) {
        const pattern = 'deeply_nested_table'
        if (!patterns.has(pattern)) {
          patterns.set(pattern, [])
        }
        patterns.get(pattern)!.push(tableName)
      }
    })

    return Array.from(patterns.entries()).map(([pattern, examples]) => ({
      pattern,
      examples,
      count: examples.length,
    }))
  }

  /**
   * Group database query results by table
   */
  private groupTableResults(results: any[]): TableInfo[] {
    const tablesMap = new Map<string, TableInfo>()

    results.forEach((row) => {
      const tableName = row.table_name

      if (!tablesMap.has(tableName)) {
        tablesMap.set(tableName, {
          tableName: row.table_name,
          schemaName: row.table_schema,
          tableType: row.table_type,
          columns: [],
          constraints: [],
          indexes: [],
        })
      }

      const table = tablesMap.get(tableName)!

      if (row.column_name) {
        table.columns.push({
          columnName: row.column_name,
          dataType: row.data_type,
          isNullable: row.is_nullable === 'YES',
          defaultValue: row.column_default,
          characterMaximumLength: row.character_maximum_length,
        })
      }
    })

    return Array.from(tablesMap.values())
  }

  /**
   * Generate a detailed report of the database schema analysis
   */
  async generateSchemaReport(): Promise<string> {
    const analysis = await this.analyzeHeaderTableNaming()
    const headerTables = await this.getHeaderRelatedTables()

    let report = '# Database Schema Analysis Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`

    // Summary
    report += '## Summary\n\n'
    report += `- Expected tables: ${analysis.expectedTables.length}\n`
    report += `- Actual header-related tables: ${analysis.actualTables.length}\n`
    report += `- Missing tables: ${analysis.missingTables.length}\n`
    report += `- Unexpected tables: ${analysis.unexpectedTables.length}\n\n`

    // Expected vs Actual Tables
    report += '## Expected vs Actual Tables\n\n'
    report += '| Expected Table | Actual Table | Status |\n'
    report += '|---|---|---|\n'

    analysis.expectedTables.forEach((expected) => {
      const actual = analysis.tableMapping[expected]
      const status = actual ? '✅ Found' : '❌ Missing'
      report += `| ${expected} | ${actual || 'N/A'} | ${status} |\n`
    })

    report += '\n'

    // Missing Tables
    if (analysis.missingTables.length > 0) {
      report += '## Missing Tables\n\n'
      analysis.missingTables.forEach((table) => {
        report += `- \`${table}\`\n`
      })
      report += '\n'
    }

    // Unexpected Tables
    if (analysis.unexpectedTables.length > 0) {
      report += '## Unexpected Tables\n\n'
      analysis.unexpectedTables.forEach((table) => {
        report += `- \`${table}\`\n`
      })
      report += '\n'
    }

    // Naming Patterns
    report += '## Naming Patterns\n\n'
    analysis.namingPatterns.forEach((pattern) => {
      report += `### ${pattern.pattern} (${pattern.count} tables)\n\n`
      pattern.examples.forEach((example) => {
        report += `- \`${example}\`\n`
      })
      report += '\n'
    })

    // Detailed Table Information
    report += '## Detailed Table Information\n\n'
    headerTables.forEach((table) => {
      report += `### ${table.tableName}\n\n`
      report += `- Schema: ${table.schemaName}\n`
      report += `- Type: ${table.tableType}\n`
      report += `- Columns: ${table.columns.length}\n\n`

      if (table.columns.length > 0) {
        report += '| Column | Type | Nullable | Default |\n'
        report += '|---|---|---|---|\n'
        table.columns.forEach((col) => {
          report += `| ${col.columnName} | ${col.dataType} | ${col.isNullable ? 'Yes' : 'No'} | ${col.defaultValue || 'None'} |\n`
        })
        report += '\n'
      }
    })

    return report
  }

  /**
   * Create a mapping between expected and actual table names
   */
  async createTableMapping(): Promise<Record<string, string>> {
    const analysis = await this.analyzeHeaderTableNaming()
    return analysis.tableMapping
  }

  /**
   * Validate that all expected tables exist
   */
  async validateTableExistence(): Promise<{
    valid: boolean
    missingTables: string[]
    issues: string[]
  }> {
    const analysis = await this.analyzeHeaderTableNaming()

    const issues: string[] = []

    if (analysis.missingTables.length > 0) {
      issues.push(`Missing tables: ${analysis.missingTables.join(', ')}`)
    }

    if (analysis.unexpectedTables.length > 0) {
      issues.push(`Unexpected tables found: ${analysis.unexpectedTables.join(', ')}`)
    }

    return {
      valid: analysis.missingTables.length === 0,
      missingTables: analysis.missingTables,
      issues,
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    // Payload cleanup is handled automatically
    this.payload = null
  }
}

/**
 * Standalone function to analyze database schema
 */
export async function analyzeDatabaseSchema(): Promise<HeaderTableAnalysis> {
  const analyzer = new DatabaseSchemaAnalyzer()
  try {
    return await analyzer.analyzeHeaderTableNaming()
  } finally {
    await analyzer.cleanup()
  }
}

/**
 * Standalone function to generate schema report
 */
export async function generateDatabaseSchemaReport(): Promise<string> {
  const analyzer = new DatabaseSchemaAnalyzer()
  try {
    return await analyzer.generateSchemaReport()
  } finally {
    await analyzer.cleanup()
  }
}

/**
 * CLI function for database schema analysis
 */
export async function runDatabaseSchemaAnalysis(): Promise<void> {
  console.log('🔍 Analyzing database schema...\n')

  try {
    const analyzer = new DatabaseSchemaAnalyzer()

    // Generate and display report
    const report = await analyzer.generateSchemaReport()
    console.log(report)

    // Validate table existence
    const validation = await analyzer.validateTableExistence()

    if (validation.valid) {
      console.log('✅ All expected tables found in database')
    } else {
      console.log('❌ Database schema validation failed:')
      validation.issues.forEach((issue) => {
        console.log(`  - ${issue}`)
      })
    }

    await analyzer.cleanup()
  } catch (error) {
    console.error('💥 Database schema analysis failed:', error)
    process.exit(1)
  }
}
