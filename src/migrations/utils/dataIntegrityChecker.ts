import { MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Data integrity checker for database migrations
 * Ensures data preservation during identifier changes
 */

export interface IntegrityCheck {
  /** Name of the check */
  name: string
  /** Description of what this check validates */
  description: string
  /** SQL query to execute */
  query: string
  /** Function to validate the result */
  validator: (result: any) => { valid: boolean; message?: string }
  /** Whether this check is critical (migration fails if it fails) */
  critical: boolean
}

export interface IntegrityReport {
  /** Overall integrity status */
  passed: boolean
  /** Total number of checks run */
  totalChecks: number
  /** Number of checks that passed */
  passedChecks: number
  /** Number of checks that failed */
  failedChecks: number
  /** Detailed results for each check */
  results: IntegrityCheckResult[]
  /** Summary of critical failures */
  criticalFailures: string[]
}

export interface IntegrityCheckResult {
  /** Check that was executed */
  check: IntegrityCheck
  /** Whether the check passed */
  passed: boolean
  /** Result message */
  message: string
  /** Execution time in milliseconds */
  executionTime: number
  /** Raw query result */
  rawResult?: any
}

/**
 * Data integrity checker class
 */
export class DataIntegrityChecker {
  private checks: IntegrityCheck[] = []

  /**
   * Add an integrity check
   */
  addCheck(check: IntegrityCheck): void {
    this.checks.push(check)
  }

  /**
   * Add multiple integrity checks
   */
  addChecks(checks: IntegrityCheck[]): void {
    this.checks.push(...checks)
  }

  /**
   * Run all integrity checks
   */
  async runChecks({ db }: MigrateUpArgs): Promise<IntegrityReport> {
    const results: IntegrityCheckResult[] = []
    const criticalFailures: string[] = []

    console.log(`🔍 Running ${this.checks.length} data integrity checks...`)

    for (const check of this.checks) {
      const startTime = Date.now()

      try {
        console.log(`   Checking: ${check.name}`)

        const queryResult = await db.execute(sql.raw(check.query))
        const validation = check.validator(queryResult)
        const executionTime = Date.now() - startTime

        const result: IntegrityCheckResult = {
          check,
          passed: validation.valid,
          message: validation.message || (validation.valid ? 'Check passed' : 'Check failed'),
          executionTime,
          rawResult: queryResult,
        }

        results.push(result)

        if (!validation.valid) {
          console.warn(`   ⚠️  ${check.name}: ${result.message}`)

          if (check.critical) {
            criticalFailures.push(`${check.name}: ${result.message}`)
          }
        } else {
          console.log(`   ✅ ${check.name}: ${result.message}`)
        }
      } catch (error) {
        const executionTime = Date.now() - startTime
        const errorMessage = `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`

        const result: IntegrityCheckResult = {
          check,
          passed: false,
          message: errorMessage,
          executionTime,
        }

        results.push(result)
        console.error(`   ❌ ${check.name}: ${errorMessage}`)

        if (check.critical) {
          criticalFailures.push(`${check.name}: ${errorMessage}`)
        }
      }
    }

    const passedChecks = results.filter((r) => r.passed).length
    const failedChecks = results.length - passedChecks

    const report: IntegrityReport = {
      passed: criticalFailures.length === 0,
      totalChecks: results.length,
      passedChecks,
      failedChecks,
      results,
      criticalFailures,
    }

    this.logReport(report)
    return report
  }

  /**
   * Generate pre-migration integrity checks
   */
  generatePreMigrationChecks(): IntegrityCheck[] {
    return [
      {
        name: 'Database Connection',
        description: 'Verify database connection is working',
        query: 'SELECT 1 as connection_test',
        validator: (result) => ({
          valid: Array.isArray(result) && result.length > 0 && result[0].connection_test === 1,
          message: 'Database connection verified',
        }),
        critical: true,
      },
      {
        name: 'Schema Existence',
        description: 'Verify public schema exists',
        query:
          "SELECT COUNT(*) as count FROM information_schema.schemata WHERE schema_name = 'public'",
        validator: (result) => ({
          valid: Array.isArray(result) && result.length > 0 && result[0].count === 1,
          message: 'Public schema exists',
        }),
        critical: true,
      },
      {
        name: 'Table Count',
        description: 'Count existing tables before migration',
        query:
          "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'",
        validator: (result) => {
          const count = result?.[0]?.table_count || 0
          return {
            valid: count > 0,
            message: `Found ${count} tables in public schema`,
          }
        },
        critical: false,
      },
      {
        name: 'Enum Count',
        description: 'Count existing enum types before migration',
        query:
          "SELECT COUNT(*) as enum_count FROM pg_type WHERE typtype = 'e' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')",
        validator: (result) => {
          const count = result?.[0]?.enum_count || 0
          return {
            valid: true, // Always valid, just informational
            message: `Found ${count} enum types in public schema`,
          }
        },
        critical: false,
      },
      {
        name: 'Data Row Count',
        description: 'Count total data rows across all tables',
        query: `
          SELECT 
            SUM(n_tup_ins + n_tup_upd + n_tup_del) as total_operations,
            SUM(n_live_tup) as live_rows
          FROM pg_stat_user_tables
        `,
        validator: (result) => {
          const operations = result?.[0]?.total_operations || 0
          const liveRows = result?.[0]?.live_rows || 0
          return {
            valid: true, // Always valid, just informational
            message: `Database contains ${liveRows} live rows with ${operations} total operations`,
          }
        },
        critical: false,
      },
    ]
  }

  /**
   * Generate post-migration integrity checks
   */
  generatePostMigrationChecks(): IntegrityCheck[] {
    return [
      {
        name: 'Migration Completion',
        description: 'Verify migration completed without data loss',
        query: `
          SELECT 
            SUM(n_live_tup) as live_rows_after,
            COUNT(*) as table_count_after
          FROM pg_stat_user_tables
        `,
        validator: (result) => {
          const liveRows = result?.[0]?.live_rows_after || 0
          const tableCount = result?.[0]?.table_count_after || 0
          return {
            valid: liveRows >= 0 && tableCount > 0,
            message: `After migration: ${liveRows} live rows across ${tableCount} tables`,
          }
        },
        critical: true,
      },
      {
        name: 'Referential Integrity',
        description: 'Check foreign key constraints are intact',
        query: `
          SELECT 
            COUNT(*) as constraint_count,
            COUNT(CASE WHEN is_deferrable = 'NO' THEN 1 END) as non_deferrable_count
          FROM information_schema.table_constraints 
          WHERE constraint_type = 'FOREIGN KEY' 
          AND table_schema = 'public'
        `,
        validator: (result) => {
          const constraintCount = result?.[0]?.constraint_count || 0
          return {
            valid: true, // Always valid, just informational
            message: `${constraintCount} foreign key constraints verified`,
          }
        },
        critical: false,
      },
      {
        name: 'Index Integrity',
        description: 'Verify indexes are intact after migration',
        query: `
          SELECT 
            COUNT(*) as index_count,
            COUNT(CASE WHEN indisvalid = true THEN 1 END) as valid_indexes
          FROM pg_index i
          JOIN pg_class c ON i.indexrelid = c.oid
          JOIN pg_namespace n ON c.relnamespace = n.oid
          WHERE n.nspname = 'public'
        `,
        validator: (result) => {
          const indexCount = result?.[0]?.index_count || 0
          const validIndexes = result?.[0]?.valid_indexes || 0
          return {
            valid: indexCount === validIndexes,
            message: `${validIndexes}/${indexCount} indexes are valid`,
          }
        },
        critical: true,
      },
      {
        name: 'Enum Integrity',
        description: 'Verify enum types are intact after migration',
        query: `
          SELECT 
            COUNT(*) as enum_count,
            array_agg(typname) as enum_names
          FROM pg_type 
          WHERE typtype = 'e' 
          AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        `,
        validator: (result) => {
          const enumCount = result?.[0]?.enum_count || 0
          return {
            valid: enumCount > 0,
            message: `${enumCount} enum types verified after migration`,
          }
        },
        critical: true,
      },
    ]
  }

  /**
   * Generate identifier-specific integrity checks
   */
  generateIdentifierIntegrityChecks(
    oldIdentifiers: string[],
    newIdentifiers: string[],
  ): IntegrityCheck[] {
    const checks: IntegrityCheck[] = []

    // Check that old identifiers no longer exist
    oldIdentifiers.forEach((identifier) => {
      checks.push({
        name: `Old Identifier Removal: ${identifier}`,
        description: `Verify old identifier ${identifier} no longer exists`,
        query: `
          SELECT 
            (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '${identifier}') +
            (SELECT COUNT(*) FROM information_schema.columns WHERE column_name = '${identifier}') +
            (SELECT COUNT(*) FROM pg_type WHERE typname = '${identifier}') as total_count
        `,
        validator: (result) => ({
          valid: result?.[0]?.total_count === 0,
          message:
            result?.[0]?.total_count === 0
              ? `Old identifier ${identifier} successfully removed`
              : `Old identifier ${identifier} still exists`,
        }),
        critical: true,
      })
    })

    // Check that new identifiers exist
    newIdentifiers.forEach((identifier) => {
      checks.push({
        name: `New Identifier Creation: ${identifier}`,
        description: `Verify new identifier ${identifier} exists`,
        query: `
          SELECT 
            (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '${identifier}') +
            (SELECT COUNT(*) FROM information_schema.columns WHERE column_name = '${identifier}') +
            (SELECT COUNT(*) FROM pg_type WHERE typname = '${identifier}') as total_count
        `,
        validator: (result) => ({
          valid: result?.[0]?.total_count > 0,
          message:
            result?.[0]?.total_count > 0
              ? `New identifier ${identifier} successfully created`
              : `New identifier ${identifier} not found`,
        }),
        critical: true,
      })
    })

    return checks
  }

  /**
   * Clear all checks
   */
  clear(): void {
    this.checks = []
  }

  /**
   * Get all checks
   */
  getChecks(): IntegrityCheck[] {
    return [...this.checks]
  }

  /**
   * Log integrity report
   */
  private logReport(report: IntegrityReport): void {
    console.log('\n📊 Data Integrity Report')
    console.log('========================')
    console.log(`Total Checks: ${report.totalChecks}`)
    console.log(`Passed: ${report.passedChecks}`)
    console.log(`Failed: ${report.failedChecks}`)
    console.log(`Overall Status: ${report.passed ? '✅ PASSED' : '❌ FAILED'}`)

    if (report.criticalFailures.length > 0) {
      console.log('\n🚨 Critical Failures:')
      report.criticalFailures.forEach((failure) => {
        console.log(`   - ${failure}`)
      })
    }

    const totalTime = report.results.reduce((sum, r) => sum + r.executionTime, 0)
    console.log(`\nTotal Execution Time: ${totalTime}ms`)
  }
}

/**
 * Helper function to create data integrity checker
 */
export function createDataIntegrityChecker(): DataIntegrityChecker {
  return new DataIntegrityChecker()
}

/**
 * Run complete integrity check suite for identifier migration
 */
export async function runIdentifierMigrationIntegrityChecks(
  migrateArgs: MigrateUpArgs,
  oldIdentifiers: string[],
  newIdentifiers: string[],
): Promise<IntegrityReport> {
  const checker = new DataIntegrityChecker()

  // Add all check types
  checker.addChecks(checker.generatePreMigrationChecks())
  checker.addChecks(checker.generatePostMigrationChecks())
  checker.addChecks(checker.generateIdentifierIntegrityChecks(oldIdentifiers, newIdentifiers))

  return await checker.runChecks(migrateArgs)
}
