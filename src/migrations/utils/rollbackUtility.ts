import { MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { DbIdentifierChange, MigrationOperation } from './migrationGenerator'

/**
 * Rollback utility for database migrations
 * Provides safe rollback capabilities with data integrity checks
 */

export interface RollbackPlan {
  /** Migration name being rolled back */
  migrationName: string
  /** Operations to execute for rollback */
  operations: MigrationOperation[]
  /** Pre-rollback validation checks */
  validationChecks: ValidationCheck[]
  /** Post-rollback verification steps */
  verificationSteps: VerificationStep[]
}

export interface ValidationCheck {
  /** Description of the check */
  description: string
  /** SQL query to execute for validation */
  query: string
  /** Expected result for validation to pass */
  expectedResult: any
  /** Whether this check is critical (rollback fails if it fails) */
  critical: boolean
}

export interface VerificationStep {
  /** Description of the verification */
  description: string
  /** SQL query to execute for verification */
  query: string
  /** Function to validate the result */
  validator: (result: any) => boolean
}

/**
 * Rollback utility class
 */
export class MigrationRollbackUtility {
  private rollbackPlan: RollbackPlan | null = null

  /**
   * Create a rollback plan for identifier changes
   */
  createRollbackPlan(migrationName: string, changes: DbIdentifierChange[]): RollbackPlan {
    const operations: MigrationOperation[] = []
    const validationChecks: ValidationCheck[] = []
    const verificationSteps: VerificationStep[] = []

    // Generate rollback operations (reverse of the original changes)
    changes.forEach((change, index) => {
      const rollbackOp = this.createRollbackOperation(change, index)
      if (rollbackOp) {
        operations.push(rollbackOp)
      }

      // Add validation checks
      validationChecks.push(...this.createValidationChecks(change))

      // Add verification steps
      verificationSteps.push(...this.createVerificationSteps(change))
    })

    this.rollbackPlan = {
      migrationName,
      operations: operations.sort((a, b) => b.order - a.order), // Reverse order
      validationChecks,
      verificationSteps,
    }

    return this.rollbackPlan
  }

  /**
   * Execute rollback with safety checks
   */
  async executeRollback(
    { db }: MigrateDownArgs,
    plan: RollbackPlan,
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = []

    try {
      // Step 1: Run pre-rollback validation
      console.log('🔍 Running pre-rollback validation...')
      for (const check of plan.validationChecks) {
        try {
          const result = await db.execute(sql.raw(check.query))

          if (check.critical && !this.validateCheckResult(result, check.expectedResult)) {
            errors.push(`Critical validation failed: ${check.description}`)
            return { success: false, errors }
          }
        } catch (error) {
          if (check.critical) {
            errors.push(
              `Critical validation error: ${check.description} - ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
            return { success: false, errors }
          } else {
            console.warn(
              `Non-critical validation warning: ${check.description} - ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
          }
        }
      }

      // Step 2: Execute rollback operations in transaction
      console.log('🔄 Executing rollback operations...')

      // Build combined SQL for transaction
      const rollbackSql = plan.operations
        .map((op) => `-- ${op.description}\n${op.downSql}`)
        .join('\n\n')

      await db.execute(sql.raw(rollbackSql))

      // Step 3: Run post-rollback verification
      console.log('✅ Running post-rollback verification...')
      for (const step of plan.verificationSteps) {
        try {
          const result = await db.execute(sql.raw(step.query))

          if (!step.validator(result)) {
            errors.push(`Verification failed: ${step.description}`)
          }
        } catch (error) {
          errors.push(
            `Verification error: ${step.description} - ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
        }
      }

      if (errors.length > 0) {
        console.warn('⚠️  Rollback completed with warnings:', errors)
      } else {
        console.log('🎉 Rollback completed successfully!')
      }

      return { success: true, errors }
    } catch (error) {
      errors.push(
        `Rollback execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      return { success: false, errors }
    }
  }

  /**
   * Generate rollback script as string
   */
  generateRollbackScript(plan: RollbackPlan): string {
    const timestamp = new Date().toISOString()

    return `-- Rollback Script for ${plan.migrationName}
-- Generated: ${timestamp}
-- 
-- This script rolls back database identifier changes while preserving data integrity.
-- Execute this script if you need to revert the identifier optimization migration.

BEGIN;

-- Pre-rollback validation checks
${plan.validationChecks
  .map((check) => `-- Validation: ${check.description}\n-- Query: ${check.query}`)
  .join('\n\n')}

-- Rollback operations (executed in reverse order)
${plan.operations.map((op) => `-- ${op.description}\n${op.downSql};`).join('\n\n')}

-- Post-rollback verification
${plan.verificationSteps
  .map((step) => `-- Verification: ${step.description}\n-- Query: ${step.query}`)
  .join('\n\n')}

COMMIT;

-- Manual verification queries (run these after rollback)
${plan.verificationSteps.map((step) => `-- ${step.description}\n${step.query};`).join('\n\n')}
`
  }

  /**
   * Create rollback operation for a single change
   */
  private createRollbackOperation(
    change: DbIdentifierChange,
    order: number,
  ): MigrationOperation | null {
    const schema = change.schemaName || 'public'

    switch (change.type) {
      case 'table':
        return {
          upSql: `ALTER TABLE "${schema}"."${change.newName}" RENAME TO "${change.oldName}";`,
          downSql: `ALTER TABLE "${schema}"."${change.oldName}" RENAME TO "${change.newName}";`,
          description: `Rollback table rename: ${change.newName} → ${change.oldName}`,
          order,
        }

      case 'column':
        if (!change.tableName) return null
        return {
          upSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME COLUMN "${change.newName}" TO "${change.oldName}";`,
          downSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME COLUMN "${change.oldName}" TO "${change.newName}";`,
          description: `Rollback column rename: ${change.tableName}.${change.newName} → ${change.oldName}`,
          order,
        }

      case 'enum':
        return {
          upSql: `ALTER TYPE "${schema}"."${change.newName}" RENAME TO "${change.oldName}";`,
          downSql: `ALTER TYPE "${schema}"."${change.oldName}" RENAME TO "${change.newName}";`,
          description: `Rollback enum rename: ${change.newName} → ${change.oldName}`,
          order,
        }

      case 'constraint':
        if (!change.tableName) return null
        return {
          upSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME CONSTRAINT "${change.newName}" TO "${change.oldName}";`,
          downSql: `ALTER TABLE "${schema}"."${change.tableName}" RENAME CONSTRAINT "${change.oldName}" TO "${change.newName}";`,
          description: `Rollback constraint rename: ${change.tableName}.${change.newName} → ${change.oldName}`,
          order,
        }

      case 'index':
        return {
          upSql: `ALTER INDEX "${schema}"."${change.newName}" RENAME TO "${change.oldName}";`,
          downSql: `ALTER INDEX "${schema}"."${change.oldName}" RENAME TO "${change.newName}";`,
          description: `Rollback index rename: ${change.newName} → ${change.oldName}`,
          order,
        }

      default:
        return null
    }
  }

  /**
   * Create validation checks for a change
   */
  private createValidationChecks(change: DbIdentifierChange): ValidationCheck[] {
    const checks: ValidationCheck[] = []
    const schema = change.schemaName || 'public'

    switch (change.type) {
      case 'table':
        checks.push({
          description: `Verify table ${change.newName} exists`,
          query: `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '${schema}' AND table_name = '${change.newName}'`,
          expectedResult: { count: 1 },
          critical: true,
        })
        break

      case 'enum':
        checks.push({
          description: `Verify enum ${change.newName} exists`,
          query: `SELECT COUNT(*) as count FROM pg_type WHERE typname = '${change.newName}' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = '${schema}')`,
          expectedResult: { count: 1 },
          critical: true,
        })
        break

      case 'column':
        if (change.tableName) {
          checks.push({
            description: `Verify column ${change.tableName}.${change.newName} exists`,
            query: `SELECT COUNT(*) as count FROM information_schema.columns WHERE table_schema = '${schema}' AND table_name = '${change.tableName}' AND column_name = '${change.newName}'`,
            expectedResult: { count: 1 },
            critical: true,
          })
        }
        break
    }

    return checks
  }

  /**
   * Create verification steps for a change
   */
  private createVerificationSteps(change: DbIdentifierChange): VerificationStep[] {
    const steps: VerificationStep[] = []
    const schema = change.schemaName || 'public'

    switch (change.type) {
      case 'table':
        steps.push({
          description: `Verify table ${change.oldName} exists after rollback`,
          query: `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '${schema}' AND table_name = '${change.oldName}'`,
          validator: (result) => result?.[0]?.count === 1,
        })
        break

      case 'enum':
        steps.push({
          description: `Verify enum ${change.oldName} exists after rollback`,
          query: `SELECT COUNT(*) as count FROM pg_type WHERE typname = '${change.oldName}' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = '${schema}')`,
          validator: (result) => result?.[0]?.count === 1,
        })
        break

      case 'column':
        if (change.tableName) {
          steps.push({
            description: `Verify column ${change.tableName}.${change.oldName} exists after rollback`,
            query: `SELECT COUNT(*) as count FROM information_schema.columns WHERE table_schema = '${schema}' AND table_name = '${change.tableName}' AND column_name = '${change.oldName}'`,
            validator: (result) => result?.[0]?.count === 1,
          })
        }
        break
    }

    return steps
  }

  /**
   * Validate check result against expected result
   */
  private validateCheckResult(actual: any, expected: any): boolean {
    if (Array.isArray(actual) && actual.length > 0) {
      const result = actual[0]
      return Object.keys(expected).every((key) => result[key] === expected[key])
    }
    return false
  }
}

/**
 * Helper function to create rollback utility
 */
export function createRollbackUtility(): MigrationRollbackUtility {
  return new MigrationRollbackUtility()
}

/**
 * Generate rollback script for identifier optimization migration
 */
export function generateIdentifierOptimizationRollback(changes: DbIdentifierChange[]): string {
  const utility = new MigrationRollbackUtility()
  const plan = utility.createRollbackPlan('Database Identifier Optimization', changes)
  return utility.generateRollbackScript(plan)
}
