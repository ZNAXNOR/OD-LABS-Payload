/**
 * Invalid DbName Remover Implementation
 *
 * Handles removal of dbName properties from field types that don't support it,
 * including UI fields and presentational-only fields. Provides detailed logging
 * of all removals with explanations.
 */

import { FieldTypeRegistry } from './field-type-registry'
import type { CleanupChange, DbNameUsage } from './types'

/**
 * Result of invalid dbName removal analysis
 */
export interface InvalidDbNameRemovalResult {
  /** Changes to be applied */
  changes: CleanupChange[]
  /** Detailed log entries for each removal */
  logEntries: InvalidDbNameLogEntry[]
  /** Summary statistics */
  summary: {
    totalInvalidUsages: number
    uiFieldRemovals: number
    unsupportedFieldRemovals: number
    presentationalFieldRemovals: number
  }
}

/**
 * Log entry for invalid dbName removal
 */
export interface InvalidDbNameLogEntry {
  /** File path where the invalid usage was found */
  filePath: string
  /** Location within the file */
  location: string
  /** Field name */
  fieldName: string
  /** Field type */
  fieldType: string
  /** DbName value that was removed */
  dbNameValue: string
  /** Reason for removal */
  reason: string
  /** Category of removal */
  category: 'ui_field' | 'unsupported_field' | 'presentational_field'
  /** Detailed explanation */
  explanation: string
}

/**
 * Implementation for removing invalid dbName properties
 */
export class InvalidDbNameRemover {
  private readonly logger: (message: string) => void

  constructor(logger?: (message: string) => void) {
    this.logger = logger || (() => {})
  }

  /**
   * Analyze and generate removal changes for invalid dbName usages
   */
  analyzeInvalidUsages(usages: DbNameUsage[]): InvalidDbNameRemovalResult {
    const changes: CleanupChange[] = []
    const logEntries: InvalidDbNameLogEntry[] = []
    const summary = {
      totalInvalidUsages: 0,
      uiFieldRemovals: 0,
      unsupportedFieldRemovals: 0,
      presentationalFieldRemovals: 0,
    }

    for (const usage of usages) {
      const removalResult = this.analyzeUsageForRemoval(usage)

      if (removalResult) {
        changes.push(removalResult.change)
        logEntries.push(removalResult.logEntry)
        summary.totalInvalidUsages++

        // Update category counters
        switch (removalResult.logEntry.category) {
          case 'ui_field':
            summary.uiFieldRemovals++
            break
          case 'unsupported_field':
            summary.unsupportedFieldRemovals++
            break
          case 'presentational_field':
            summary.presentationalFieldRemovals++
            break
        }
      }
    }

    // Log summary
    this.logRemovalSummary(summary)

    return {
      changes,
      logEntries,
      summary,
    }
  }

  /**
   * Analyze a single usage for potential removal
   */
  private analyzeUsageForRemoval(usage: DbNameUsage): {
    change: CleanupChange
    logEntry: InvalidDbNameLogEntry
  } | null {
    const fieldType = usage.fieldType.toLowerCase()

    // Check if field type is a UI field
    if (FieldTypeRegistry.isUIField(fieldType)) {
      return this.createUIFieldRemoval(usage)
    }

    // Check if field type doesn't support dbName
    if (!FieldTypeRegistry.supportsDbName(fieldType)) {
      return this.createUnsupportedFieldRemoval(usage)
    }

    // Check if field is presentational-only
    if (this.isPresentationalField(usage)) {
      return this.createPresentationalFieldRemoval(usage)
    }

    return null
  }

  /**
   * Create removal for UI field
   */
  private createUIFieldRemoval(usage: DbNameUsage): {
    change: CleanupChange
    logEntry: InvalidDbNameLogEntry
  } {
    const change: CleanupChange = {
      filePath: usage.context.fullPath,
      location: usage.location,
      action: 'remove',
      oldValue: usage.dbNameValue,
      impact: 'low',
    }

    const logEntry: InvalidDbNameLogEntry = {
      filePath: usage.context.fullPath,
      location: usage.location,
      fieldName: usage.fieldName,
      fieldType: usage.fieldType,
      dbNameValue: usage.dbNameValue,
      reason: `UI field type '${usage.fieldType}' does not support dbName property`,
      category: 'ui_field',
      explanation: `The field '${usage.fieldName}' is of type '${usage.fieldType}', which is a UI/layout field that does not affect the database schema. The dbName property '${usage.dbNameValue}' has no effect and should be removed to clean up the configuration.`,
    }

    this.logger(
      `REMOVAL: UI field '${usage.fieldName}' (${usage.fieldType}) - dbName '${usage.dbNameValue}' removed from ${usage.context.fullPath}`,
    )

    return { change, logEntry }
  }

  /**
   * Create removal for unsupported field type
   */
  private createUnsupportedFieldRemoval(usage: DbNameUsage): {
    change: CleanupChange
    logEntry: InvalidDbNameLogEntry
  } {
    const change: CleanupChange = {
      filePath: usage.context.fullPath,
      location: usage.location,
      action: 'remove',
      oldValue: usage.dbNameValue,
      impact: 'medium',
    }

    const logEntry: InvalidDbNameLogEntry = {
      filePath: usage.context.fullPath,
      location: usage.location,
      fieldName: usage.fieldName,
      fieldType: usage.fieldType,
      dbNameValue: usage.dbNameValue,
      reason: `Field type '${usage.fieldType}' does not support dbName property according to PayloadCMS documentation`,
      category: 'unsupported_field',
      explanation: `The field '${usage.fieldName}' is of type '${usage.fieldType}', which does not support the dbName property according to PayloadCMS field type documentation. The dbName property '${usage.dbNameValue}' should be removed to ensure configuration validity.`,
    }

    this.logger(
      `REMOVAL: Unsupported field '${usage.fieldName}' (${usage.fieldType}) - dbName '${usage.dbNameValue}' removed from ${usage.context.fullPath}`,
    )

    return { change, logEntry }
  }

  /**
   * Create removal for presentational field
   */
  private createPresentationalFieldRemoval(usage: DbNameUsage): {
    change: CleanupChange
    logEntry: InvalidDbNameLogEntry
  } {
    const change: CleanupChange = {
      filePath: usage.context.fullPath,
      location: usage.location,
      action: 'remove',
      oldValue: usage.dbNameValue,
      impact: 'low',
    }

    const logEntry: InvalidDbNameLogEntry = {
      filePath: usage.context.fullPath,
      location: usage.location,
      fieldName: usage.fieldName,
      fieldType: usage.fieldType,
      dbNameValue: usage.dbNameValue,
      reason: `Field '${usage.fieldName}' is presentational-only and does not affect database schema`,
      category: 'presentational_field',
      explanation: `The field '${usage.fieldName}' appears to be used for presentational purposes only and does not store data in the database. The dbName property '${usage.dbNameValue}' has no database impact and should be removed.`,
    }

    this.logger(
      `REMOVAL: Presentational field '${usage.fieldName}' (${usage.fieldType}) - dbName '${usage.dbNameValue}' removed from ${usage.context.fullPath}`,
    )

    return { change, logEntry }
  }

  /**
   * Check if a field is presentational-only
   */
  private isPresentationalField(usage: DbNameUsage): boolean {
    // Check if field doesn't affect database
    if (!FieldTypeRegistry.affectsDatabase(usage.fieldType)) {
      return true
    }

    // Check for common presentational field patterns
    // Only check for clearly presentational field names, not content fields
    const presentationalPatterns = [
      /^(display|show|render|view)_/i, // Only if followed by underscore
      /^(separator|divider|spacer)$/i,
      /^(ui_|layout_|admin_)/i, // Prefixed UI fields
    ]

    return presentationalPatterns.some((pattern) => pattern.test(usage.fieldName))
  }

  /**
   * Log removal summary
   */
  private logRemovalSummary(summary: {
    totalInvalidUsages: number
    uiFieldRemovals: number
    unsupportedFieldRemovals: number
    presentationalFieldRemovals: number
  }): void {
    this.logger(`\n=== Invalid DbName Removal Summary ===`)
    this.logger(`Total invalid usages found: ${summary.totalInvalidUsages}`)
    this.logger(`UI field removals: ${summary.uiFieldRemovals}`)
    this.logger(`Unsupported field removals: ${summary.unsupportedFieldRemovals}`)
    this.logger(`Presentational field removals: ${summary.presentationalFieldRemovals}`)
    this.logger(`=====================================\n`)
  }

  /**
   * Generate detailed removal report
   */
  generateRemovalReport(result: InvalidDbNameRemovalResult): string {
    const lines: string[] = []

    lines.push('# Invalid DbName Removal Report')
    lines.push('')
    lines.push(`Generated: ${new Date().toISOString()}`)
    lines.push('')

    // Summary section
    lines.push('## Summary')
    lines.push('')
    lines.push(`- Total invalid usages: ${result.summary.totalInvalidUsages}`)
    lines.push(`- UI field removals: ${result.summary.uiFieldRemovals}`)
    lines.push(`- Unsupported field removals: ${result.summary.unsupportedFieldRemovals}`)
    lines.push(`- Presentational field removals: ${result.summary.presentationalFieldRemovals}`)
    lines.push('')

    // Detailed removals section
    lines.push('## Detailed Removals')
    lines.push('')

    // Group by category
    const categories = ['ui_field', 'unsupported_field', 'presentational_field'] as const
    const categoryTitles = {
      ui_field: 'UI Fields',
      unsupported_field: 'Unsupported Field Types',
      presentational_field: 'Presentational Fields',
    }

    for (const category of categories) {
      const categoryEntries = result.logEntries.filter((entry) => entry.category === category)

      if (categoryEntries.length > 0) {
        lines.push(`### ${categoryTitles[category]}`)
        lines.push('')

        for (const entry of categoryEntries) {
          lines.push(`**File:** ${entry.filePath}`)
          lines.push(`**Field:** ${entry.fieldName} (${entry.fieldType})`)
          lines.push(`**Location:** ${entry.location}`)
          lines.push(`**DbName Value:** "${entry.dbNameValue}"`)
          lines.push(`**Reason:** ${entry.reason}`)
          lines.push(`**Explanation:** ${entry.explanation}`)
          lines.push('')
        }
      }
    }

    return lines.join('\n')
  }
}

/**
 * Factory function to create an InvalidDbNameRemover instance
 */
export function createInvalidDbNameRemover(
  logger?: (message: string) => void,
): InvalidDbNameRemover {
  return new InvalidDbNameRemover(logger)
}

/**
 * Default InvalidDbNameRemover instance
 */
export const invalidDbNameRemover = createInvalidDbNameRemover()
