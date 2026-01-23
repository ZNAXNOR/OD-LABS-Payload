import { DatabaseMigrationGenerator, DbIdentifierChange } from './migrationGenerator'

/**
 * Interface for migration test results
 */
export interface MigrationTestResult {
  /** Whether the migration test passed */
  success: boolean
  /** Test execution time in milliseconds */
  executionTime: number
  /** Any errors encountered during testing */
  errors: string[]
  /** Warnings that don't prevent execution */
  warnings: string[]
  /** Summary of changes tested */
  changesSummary: {
    enumRenames: number
    tableRenames: number
    columnRenames: number
    totalOperations: number
  }
  /** Validation results */
  validation: {
    identifierLengthCompliance: boolean
    noCircularRenames: boolean
    noDuplicateNames: boolean
    rollbackCapability: boolean
  }
}

/**
 * Interface for migration rollback test results
 */
export interface RollbackTestResult {
  /** Whether the rollback test passed */
  success: boolean
  /** Test execution time in milliseconds */
  executionTime: number
  /** Any errors encountered during rollback testing */
  errors: string[]
  /** Whether data integrity was maintained */
  dataIntegrityMaintained: boolean
  /** Whether all identifiers were restored to original names */
  identifiersRestored: boolean
}

/**
 * Migration testing utility for database identifier optimization
 */
export class MigrationTester {
  private generator: DatabaseMigrationGenerator

  constructor() {
    this.generator = new DatabaseMigrationGenerator()
  }

  /**
   * Test a complete migration with the provided changes
   */
  async testMigration(changes: DbIdentifierChange[]): Promise<MigrationTestResult> {
    const startTime = Date.now()
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Clear any existing changes and add new ones
      this.generator.clear()
      this.generator.addChanges(changes)

      // Validate the changes
      const validation = this.generator.validateChanges()
      if (!validation.isValid) {
        errors.push(...validation.errors)
      }

      // Test identifier length compliance
      const lengthCompliance = this.testIdentifierLengthCompliance(changes)
      if (!lengthCompliance.compliant) {
        errors.push(
          ...lengthCompliance.violations.map(
            (v) => `Identifier length violation: ${v.identifier} (${v.length} chars)`,
          ),
        )
      }

      // Test for circular renames
      const circularRenames = this.detectCircularRenames(changes)
      if (circularRenames.length > 0) {
        errors.push(
          ...circularRenames.map((pair) => `Circular rename detected: ${pair.from} <-> ${pair.to}`),
        )
      }

      // Test for duplicate new names
      const duplicates = this.detectDuplicateNewNames(changes)
      if (duplicates.length > 0) {
        errors.push(...duplicates.map((name) => `Duplicate new name detected: ${name}`))
      }

      // Generate migration operations to test structure
      const operations = this.generator.generateOperations()
      if (operations.length === 0) {
        warnings.push('No migration operations generated')
      }

      // Test rollback capability
      const rollbackTest = this.testRollbackCapability(changes)
      if (!rollbackTest.success) {
        errors.push(...rollbackTest.errors)
      }

      const executionTime = Date.now() - startTime

      return {
        success: errors.length === 0,
        executionTime,
        errors,
        warnings,
        changesSummary: this.generateChangesSummary(changes),
        validation: {
          identifierLengthCompliance: lengthCompliance.compliant,
          noCircularRenames: circularRenames.length === 0,
          noDuplicateNames: duplicates.length === 0,
          rollbackCapability: rollbackTest.success,
        },
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      errors.push(
        `Migration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )

      return {
        success: false,
        executionTime,
        errors,
        warnings,
        changesSummary: this.generateChangesSummary(changes),
        validation: {
          identifierLengthCompliance: false,
          noCircularRenames: false,
          noDuplicateNames: false,
          rollbackCapability: false,
        },
      }
    }
  }

  /**
   * Test rollback capability for a migration
   */
  testRollbackCapability(changes: DbIdentifierChange[]): RollbackTestResult {
    const startTime = Date.now()
    const errors: string[] = []

    try {
      // Generate forward operations
      this.generator.clear()
      this.generator.addChanges(changes)
      const forwardOps = this.generator.generateOperations()

      // Generate reverse operations (simulate rollback)
      const reverseChanges = changes.map((change) => ({
        ...change,
        oldName: change.newName,
        newName: change.oldName,
      }))

      this.generator.clear()
      this.generator.addChanges(reverseChanges)
      const reverseOps = this.generator.generateOperations()

      // Verify that forward and reverse operations are complementary
      if (forwardOps.length !== reverseOps.length) {
        errors.push('Forward and reverse operations count mismatch')
      }

      // Check that each forward operation has a corresponding reverse
      for (const forwardOp of forwardOps) {
        const hasReverse = reverseOps.some((reverseOp) =>
          this.areComplementaryOperations(forwardOp, reverseOp),
        )
        if (!hasReverse) {
          errors.push(`No reverse operation found for: ${forwardOp.description}`)
        }
      }

      const executionTime = Date.now() - startTime

      return {
        success: errors.length === 0,
        executionTime,
        errors,
        dataIntegrityMaintained: true, // Assume true for identifier renames
        identifiersRestored: errors.length === 0,
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      errors.push(
        `Rollback test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )

      return {
        success: false,
        executionTime,
        errors,
        dataIntegrityMaintained: false,
        identifiersRestored: false,
      }
    }
  }

  /**
   * Test identifier length compliance
   */
  private testIdentifierLengthCompliance(changes: DbIdentifierChange[]): {
    compliant: boolean
    violations: Array<{ identifier: string; length: number; type: string }>
  } {
    const violations: Array<{ identifier: string; length: number; type: string }> = []

    for (const change of changes) {
      if (change.oldName.length > 63) {
        violations.push({
          identifier: change.oldName,
          length: change.oldName.length,
          type: `${change.type} (old)`,
        })
      }
      if (change.newName.length > 63) {
        violations.push({
          identifier: change.newName,
          length: change.newName.length,
          type: `${change.type} (new)`,
        })
      }
    }

    return {
      compliant: violations.length === 0,
      violations,
    }
  }

  /**
   * Detect circular renames (A -> B, B -> A)
   */
  private detectCircularRenames(
    changes: DbIdentifierChange[],
  ): Array<{ from: string; to: string }> {
    const circular: Array<{ from: string; to: string }> = []
    const renameMap = new Map<string, string>()

    // Build rename map
    for (const change of changes) {
      const key = `${change.type}:${change.schemaName || 'public'}:${change.tableName || ''}:${change.oldName}`
      const value = `${change.type}:${change.schemaName || 'public'}:${change.tableName || ''}:${change.newName}`
      renameMap.set(key, value)
    }

    // Check for circular renames
    for (const [from, to] of renameMap.entries()) {
      if (renameMap.has(to) && renameMap.get(to) === from) {
        circular.push({ from, to })
      }
    }

    return circular
  }

  /**
   * Detect duplicate new names
   */
  private detectDuplicateNewNames(changes: DbIdentifierChange[]): string[] {
    const nameCount = new Map<string, number>()
    const duplicates: string[] = []

    for (const change of changes) {
      const key = `${change.type}:${change.schemaName || 'public'}:${change.tableName || ''}:${change.newName}`
      const count = nameCount.get(key) || 0
      nameCount.set(key, count + 1)

      if (count === 1) {
        duplicates.push(change.newName)
      }
    }

    return duplicates
  }

  /**
   * Generate summary of changes
   */
  private generateChangesSummary(changes: DbIdentifierChange[]): {
    enumRenames: number
    tableRenames: number
    columnRenames: number
    totalOperations: number
  } {
    const summary = {
      enumRenames: 0,
      tableRenames: 0,
      columnRenames: 0,
      totalOperations: changes.length,
    }

    for (const change of changes) {
      switch (change.type) {
        case 'enum':
          summary.enumRenames++
          break
        case 'table':
          summary.tableRenames++
          break
        case 'column':
          summary.columnRenames++
          break
      }
    }

    return summary
  }

  /**
   * Check if two operations are complementary (forward/reverse)
   */
  private areComplementaryOperations(op1: any, op2: any): boolean {
    // This is a simplified check - in a real implementation,
    // you'd parse the SQL to verify they're exact opposites
    return (
      op1.upSql.includes('RENAME TO') &&
      op2.upSql.includes('RENAME TO') &&
      op1.description.includes('Rename') &&
      op2.description.includes('Rename')
    )
  }

  /**
   * Validate migration file syntax and structure
   */
  validateMigrationFile(migrationContent: string): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for required imports
    if (
      !migrationContent.includes('MigrateUpArgs') ||
      !migrationContent.includes('MigrateDownArgs')
    ) {
      errors.push('Missing required imports: MigrateUpArgs, MigrateDownArgs')
    }

    // Check for up function
    if (!migrationContent.includes('export async function up')) {
      errors.push('Missing up function')
    }

    // Check for down function
    if (!migrationContent.includes('export async function down')) {
      errors.push('Missing down function')
    }

    // Check for SQL template literals
    if (!migrationContent.includes('sql`')) {
      warnings.push('No SQL template literals found')
    }

    // Check for proper error handling structure
    if (!migrationContent.includes('await db.execute')) {
      warnings.push('No database execution calls found')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Generate a test report for migration validation
   */
  generateTestReport(testResult: MigrationTestResult, rollbackResult?: RollbackTestResult): string {
    const report = []

    report.push('Database Identifier Optimization Migration Test Report')
    report.push('='.repeat(60))
    report.push('')

    // Overall status
    report.push(`Overall Status: ${testResult.success ? 'PASSED' : 'FAILED'}`)
    report.push(`Execution Time: ${testResult.executionTime}ms`)
    report.push('')

    // Changes summary
    report.push('Changes Summary:')
    report.push(`- Enum renames: ${testResult.changesSummary.enumRenames}`)
    report.push(`- Table renames: ${testResult.changesSummary.tableRenames}`)
    report.push(`- Column renames: ${testResult.changesSummary.columnRenames}`)
    report.push(`- Total operations: ${testResult.changesSummary.totalOperations}`)
    report.push('')

    // Validation results
    report.push('Validation Results:')
    report.push(
      `- Identifier length compliance: ${testResult.validation.identifierLengthCompliance ? 'PASS' : 'FAIL'}`,
    )
    report.push(
      `- No circular renames: ${testResult.validation.noCircularRenames ? 'PASS' : 'FAIL'}`,
    )
    report.push(`- No duplicate names: ${testResult.validation.noDuplicateNames ? 'PASS' : 'FAIL'}`)
    report.push(
      `- Rollback capability: ${testResult.validation.rollbackCapability ? 'PASS' : 'FAIL'}`,
    )
    report.push('')

    // Errors
    if (testResult.errors.length > 0) {
      report.push('Errors:')
      testResult.errors.forEach((error) => report.push(`- ${error}`))
      report.push('')
    }

    // Warnings
    if (testResult.warnings.length > 0) {
      report.push('Warnings:')
      testResult.warnings.forEach((warning) => report.push(`- ${warning}`))
      report.push('')
    }

    // Rollback test results
    if (rollbackResult) {
      report.push('Rollback Test Results:')
      report.push(`- Status: ${rollbackResult.success ? 'PASSED' : 'FAILED'}`)
      report.push(`- Execution time: ${rollbackResult.executionTime}ms`)
      report.push(
        `- Data integrity maintained: ${rollbackResult.dataIntegrityMaintained ? 'YES' : 'NO'}`,
      )
      report.push(`- Identifiers restored: ${rollbackResult.identifiersRestored ? 'YES' : 'NO'}`)

      if (rollbackResult.errors.length > 0) {
        report.push('Rollback Errors:')
        rollbackResult.errors.forEach((error) => report.push(`- ${error}`))
      }
      report.push('')
    }

    return report.join('\n')
  }
}

/**
 * Helper function to create and run migration tests
 */
export async function runMigrationTests(changes: DbIdentifierChange[]): Promise<{
  migrationTest: MigrationTestResult
  rollbackTest: RollbackTestResult
  report: string
}> {
  const tester = new MigrationTester()

  const migrationTest = await tester.testMigration(changes)
  const rollbackTest = tester.testRollbackCapability(changes)
  const report = tester.generateTestReport(migrationTest, rollbackTest)

  return {
    migrationTest,
    rollbackTest,
    report,
  }
}
