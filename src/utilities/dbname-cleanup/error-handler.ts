/**
 * Comprehensive Error Handling for DbName Cleanup System
 *
 * Provides structured error handling, recovery mechanisms, and meaningful
 * error messages for all phases of the cleanup process. Handles file system
 * errors, configuration parsing failures, and provides recovery suggestions.
 */

import { promises as fs } from 'fs'
import * as path from 'path'

// ============================================================================
// Error Classification System
// ============================================================================

export enum ErrorCategory {
  FILESYSTEM = 'filesystem',
  CONFIGURATION = 'configuration',
  VALIDATION = 'validation',
  ANALYSIS = 'analysis',
  MODIFICATION = 'modification',
  ORCHESTRATION = 'orchestration',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ============================================================================
// Structured Error Types
// ============================================================================

export interface ErrorContext {
  phase: string
  filePath?: string
  location?: string
  operation?: string
  additionalInfo?: Record<string, any>
}

export interface RecoveryAction {
  action: string
  description: string
  automated: boolean
  command?: string
}

export interface CleanupErrorDetails {
  code: string
  category: ErrorCategory
  severity: ErrorSeverity
  message: string
  context: ErrorContext
  cause?: Error
  recoveryActions: RecoveryAction[]
  timestamp: string
}

// ============================================================================
// Base Error Classes
// ============================================================================

export abstract class BaseCleanupError extends Error {
  public readonly details: CleanupErrorDetails

  constructor(details: Omit<CleanupErrorDetails, 'timestamp'>) {
    super(details.message)
    this.name = this.constructor.name
    this.details = {
      ...details,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get formatted error message with context
   */
  getFormattedMessage(): string {
    const { category, severity, message, context } = this.details
    let formatted = `[${category.toUpperCase()}:${severity.toUpperCase()}] ${message}`

    if (context.filePath) {
      formatted += `\n  File: ${context.filePath}`
    }
    if (context.location) {
      formatted += `\n  Location: ${context.location}`
    }
    if (context.operation) {
      formatted += `\n  Operation: ${context.operation}`
    }

    return formatted
  }

  /**
   * Get recovery suggestions
   */
  getRecoveryActions(): RecoveryAction[] {
    return this.details.recoveryActions
  }
}

// ============================================================================
// Specific Error Classes
// ============================================================================

export class FileSystemError extends BaseCleanupError {
  constructor(
    message: string,
    context: ErrorContext,
    cause?: Error,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
  ) {
    super({
      code: 'FS_ERROR',
      category: ErrorCategory.FILESYSTEM,
      severity,
      message,
      context,
      cause,
      recoveryActions: FileSystemError.generateRecoveryActions(context, cause),
    })
  }

  private static generateRecoveryActions(context: ErrorContext, cause?: Error): RecoveryAction[] {
    const actions: RecoveryAction[] = []

    if (context.filePath) {
      actions.push({
        action: 'check_file_permissions',
        description: `Check file permissions for: ${context.filePath}`,
        automated: false,
        command: `ls -la "${context.filePath}"`,
      })

      actions.push({
        action: 'verify_file_exists',
        description: `Verify file exists: ${context.filePath}`,
        automated: false,
        command: `test -f "${context.filePath}" && echo "File exists" || echo "File not found"`,
      })
    }

    if (cause?.message.includes('ENOENT')) {
      actions.push({
        action: 'create_missing_directory',
        description: 'Create missing directory structure',
        automated: false,
        command: context.filePath ? `mkdir -p "${path.dirname(context.filePath)}"` : undefined,
      })
    }

    if (cause?.message.includes('EACCES')) {
      actions.push({
        action: 'fix_permissions',
        description: 'Fix file permissions',
        automated: false,
        command: context.filePath ? `chmod 644 "${context.filePath}"` : undefined,
      })
    }

    return actions
  }
}

export class ConfigurationParsingError extends BaseCleanupError {
  constructor(
    message: string,
    context: ErrorContext,
    cause?: Error,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  ) {
    super({
      code: 'CONFIG_PARSE_ERROR',
      category: ErrorCategory.CONFIGURATION,
      severity,
      message,
      context,
      cause,
      recoveryActions: ConfigurationParsingError.generateRecoveryActions(context, cause),
    })
  }

  private static generateRecoveryActions(context: ErrorContext, cause?: Error): RecoveryAction[] {
    const actions: RecoveryAction[] = []

    actions.push({
      action: 'validate_syntax',
      description: 'Validate TypeScript/JavaScript syntax',
      automated: false,
      command: context.filePath ? `npx tsc --noEmit "${context.filePath}"` : undefined,
    })

    actions.push({
      action: 'check_imports',
      description: 'Verify all imports are valid',
      automated: false,
    })

    if (cause?.message.includes('Unexpected token')) {
      actions.push({
        action: 'fix_syntax_error',
        description: 'Fix syntax error in configuration file',
        automated: false,
      })
    }

    if (cause?.message.includes('Cannot resolve module')) {
      actions.push({
        action: 'install_dependencies',
        description: 'Install missing dependencies',
        automated: false,
        command: 'npm install',
      })
    }

    return actions
  }
}

export class ValidationError extends BaseCleanupError {
  constructor(
    message: string,
    context: ErrorContext,
    cause?: Error,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
  ) {
    super({
      code: 'VALIDATION_ERROR',
      category: ErrorCategory.VALIDATION,
      severity,
      message,
      context,
      cause,
      recoveryActions: ValidationError.generateRecoveryActions(context),
    })
  }

  private static generateRecoveryActions(_context: ErrorContext): RecoveryAction[] {
    const actions: RecoveryAction[] = []

    actions.push({
      action: 'review_changes',
      description: 'Review proposed changes for conflicts',
      automated: false,
    })

    actions.push({
      action: 'check_database_schema',
      description: 'Verify current database schema compatibility',
      automated: false,
    })

    actions.push({
      action: 'run_dry_run',
      description: 'Run cleanup in dry-run mode first',
      automated: false,
    })

    return actions
  }
}

export class AnalysisError extends BaseCleanupError {
  constructor(
    message: string,
    context: ErrorContext,
    cause?: Error,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  ) {
    super({
      code: 'ANALYSIS_ERROR',
      category: ErrorCategory.ANALYSIS,
      severity,
      message,
      context,
      cause,
      recoveryActions: AnalysisError.generateRecoveryActions(context),
    })
  }

  private static generateRecoveryActions(_context: ErrorContext): RecoveryAction[] {
    return [
      {
        action: 'skip_problematic_file',
        description: 'Skip analysis of problematic file and continue',
        automated: true,
      },
      {
        action: 'review_field_configuration',
        description: 'Review field configuration for PayloadCMS compliance',
        automated: false,
      },
    ]
  }
}

export class ModificationError extends BaseCleanupError {
  constructor(
    message: string,
    context: ErrorContext,
    cause?: Error,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
  ) {
    super({
      code: 'MODIFICATION_ERROR',
      category: ErrorCategory.MODIFICATION,
      severity,
      message,
      context,
      cause,
      recoveryActions: ModificationError.generateRecoveryActions(context),
    })
  }

  private static generateRecoveryActions(context: ErrorContext): RecoveryAction[] {
    const actions: RecoveryAction[] = []

    actions.push({
      action: 'create_backup',
      description: 'Create backup of files before modification',
      automated: false,
      command: context.filePath
        ? `cp "${context.filePath}" "${context.filePath}.backup"`
        : undefined,
    })

    actions.push({
      action: 'check_file_locks',
      description: 'Check if files are locked by other processes',
      automated: false,
    })

    actions.push({
      action: 'verify_write_permissions',
      description: 'Verify write permissions on target files',
      automated: false,
      command: context.filePath
        ? `test -w "${context.filePath}" && echo "Writable" || echo "Not writable"`
        : undefined,
    })

    return actions
  }
}

// ============================================================================
// Error Handler Class
// ============================================================================

export class ErrorHandler {
  private errors: CleanupErrorDetails[] = []
  private warnings: string[] = []
  private recoveryAttempts: Map<string, number> = new Map()

  /**
   * Handle an error with automatic recovery attempts
   */
  async handleError(error: BaseCleanupError, attemptRecovery: boolean = true): Promise<boolean> {
    this.errors.push(error.details)

    if (attemptRecovery) {
      return await this.attemptRecovery(error)
    }

    return false
  }

  /**
   * Add a warning message
   */
  addWarning(message: string, context?: ErrorContext): void {
    const warning = context
      ? `${message} (${context.filePath || context.operation || 'unknown context'})`
      : message
    this.warnings.push(warning)
  }

  /**
   * Get all errors
   */
  getErrors(): CleanupErrorDetails[] {
    return [...this.errors]
  }

  /**
   * Get all warnings
   */
  getWarnings(): string[] {
    return [...this.warnings]
  }

  /**
   * Check if there are any critical errors
   */
  hasCriticalErrors(): boolean {
    return this.errors.some((error) => error.severity === ErrorSeverity.CRITICAL)
  }

  /**
   * Get error summary
   */
  getErrorSummary(): {
    total: number
    bySeverity: Record<ErrorSeverity, number>
    byCategory: Record<ErrorCategory, number>
  } {
    const bySeverity = Object.values(ErrorSeverity).reduce(
      (acc, severity) => {
        acc[severity] = this.errors.filter((e) => e.severity === severity).length
        return acc
      },
      {} as Record<ErrorSeverity, number>,
    )

    const byCategory = Object.values(ErrorCategory).reduce(
      (acc, category) => {
        acc[category] = this.errors.filter((e) => e.category === category).length
        return acc
      },
      {} as Record<ErrorCategory, number>,
    )

    return {
      total: this.errors.length,
      bySeverity,
      byCategory,
    }
  }

  /**
   * Generate error report
   */
  generateErrorReport(): string {
    const summary = this.getErrorSummary()
    let report = `\n=== DbName Cleanup Error Report ===\n`
    report += `Total Errors: ${summary.total}\n`
    report += `Warnings: ${this.warnings.length}\n\n`

    if (summary.total > 0) {
      report += `Errors by Severity:\n`
      Object.entries(summary.bySeverity).forEach(([severity, count]) => {
        if (count > 0) {
          report += `  ${severity.toUpperCase()}: ${count}\n`
        }
      })

      report += `\nErrors by Category:\n`
      Object.entries(summary.byCategory).forEach(([category, count]) => {
        if (count > 0) {
          report += `  ${category.toUpperCase()}: ${count}\n`
        }
      })

      report += `\nDetailed Errors:\n`
      this.errors.forEach((error, index) => {
        report += `\n${index + 1}. ${error.message}\n`
        report += `   Category: ${error.category}, Severity: ${error.severity}\n`
        if (error.context.filePath) {
          report += `   File: ${error.context.filePath}\n`
        }
        if (error.context.location) {
          report += `   Location: ${error.context.location}\n`
        }
        if (error.recoveryActions.length > 0) {
          report += `   Recovery Actions:\n`
          error.recoveryActions.forEach((action) => {
            report += `     - ${action.description}\n`
            if (action.command) {
              report += `       Command: ${action.command}\n`
            }
          })
        }
      })
    }

    if (this.warnings.length > 0) {
      report += `\nWarnings:\n`
      this.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`
      })
    }

    return report
  }

  /**
   * Clear all errors and warnings
   */
  clear(): void {
    this.errors = []
    this.warnings = []
    this.recoveryAttempts.clear()
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Attempt automatic recovery for an error
   */
  private async attemptRecovery(error: BaseCleanupError): Promise<boolean> {
    const errorKey = `${error.details.code}_${error.details.context.filePath || 'global'}`
    const attempts = this.recoveryAttempts.get(errorKey) || 0

    // Limit recovery attempts to prevent infinite loops
    if (attempts >= 3) {
      this.addWarning(`Maximum recovery attempts reached for: ${error.message}`)
      return false
    }

    this.recoveryAttempts.set(errorKey, attempts + 1)

    // Try automated recovery actions
    for (const action of error.details.recoveryActions) {
      if (action.automated) {
        try {
          const success = await this.executeRecoveryAction(action, error.details.context)
          if (success) {
            this.addWarning(`Automatic recovery successful: ${action.description}`)
            return true
          }
        } catch (recoveryError) {
          this.addWarning(
            `Recovery action failed: ${action.description} - ${recoveryError instanceof Error ? recoveryError.message : String(recoveryError)}`,
          )
        }
      }
    }

    return false
  }

  /**
   * Execute a recovery action
   */
  private async executeRecoveryAction(
    action: RecoveryAction,
    context: ErrorContext,
  ): Promise<boolean> {
    switch (action.action) {
      case 'skip_problematic_file':
        // This is handled by the caller - just return success
        return true

      case 'create_missing_directory':
        if (context.filePath) {
          try {
            await fs.mkdir(path.dirname(context.filePath), { recursive: true })
            return true
          } catch {
            return false
          }
        }
        return false

      default:
        // Most recovery actions require manual intervention
        return false
    }
  }
}

// ============================================================================
// Error Factory Functions
// ============================================================================

export function createFileSystemError(
  message: string,
  filePath?: string,
  operation?: string,
  cause?: Error,
): FileSystemError {
  return new FileSystemError(
    message,
    {
      phase: 'filesystem',
      filePath,
      operation,
    },
    cause,
  )
}

export function createConfigurationError(
  message: string,
  filePath?: string,
  location?: string,
  cause?: Error,
): ConfigurationParsingError {
  return new ConfigurationParsingError(
    message,
    {
      phase: 'configuration',
      filePath,
      location,
    },
    cause,
  )
}

export function createValidationError(
  message: string,
  filePath?: string,
  location?: string,
  cause?: Error,
): ValidationError {
  return new ValidationError(
    message,
    {
      phase: 'validation',
      filePath,
      location,
    },
    cause,
  )
}

export function createAnalysisError(
  message: string,
  filePath?: string,
  operation?: string,
  cause?: Error,
): AnalysisError {
  return new AnalysisError(
    message,
    {
      phase: 'analysis',
      filePath,
      operation,
    },
    cause,
  )
}

export function createModificationError(
  message: string,
  filePath?: string,
  location?: string,
  cause?: Error,
): ModificationError {
  return new ModificationError(
    message,
    {
      phase: 'modification',
      filePath,
      location,
    },
    cause,
  )
}

// ============================================================================
// Global Error Handler Instance
// ============================================================================

export const globalErrorHandler = new ErrorHandler()
