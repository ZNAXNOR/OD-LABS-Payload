/**
 * RuleEngine implementation for PayloadCMS compliance
 *
 * This module implements the RuleEngine interface to:
 * - Create collection-level cleanup rules
 * - Add field-level cleanup rules with field type support checking
 * - Implement validation rules for database compatibility
 * - Ensure PayloadCMS best practices compliance
 *
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 8.1, 8.2
 */

import { DBNAME_POSTGRES_IDENTIFIER_LIMIT, FieldTypeRegistry } from './index'
import type { RuleEngine } from './interfaces'
import type {
  CleanupRules,
  CollectionRule,
  DbNameUsage,
  FieldRule,
  RuleResult,
  ValidationRule,
} from './types'

/**
 * Implementation of RuleEngine for PayloadCMS projects
 */
export class PayloadRuleEngine implements RuleEngine {
  private readonly rules: CleanupRules
  private readonly maxIdentifierLength: number

  constructor(maxIdentifierLength: number = DBNAME_POSTGRES_IDENTIFIER_LIMIT) {
    this.maxIdentifierLength = maxIdentifierLength
    this.rules = this.initializeRules()
  }

  /**
   * Apply collection-level cleanup rules
   */
  applyCollectionRules(usage: DbNameUsage): RuleResult {
    // Only apply to collection-level usages
    if (usage.fieldType !== 'collection') {
      return {
        shouldRemove: false,
        shouldKeep: false,
        reason: 'Not a collection-level usage',
        confidence: 0,
      }
    }

    // Apply each collection rule
    for (const rule of this.rules.collectionLevel) {
      if (rule.condition(usage)) {
        return {
          shouldRemove: rule.action === 'remove',
          shouldKeep: rule.action === 'keep',
          reason: rule.reason,
          confidence: 0.9,
        }
      }
    }

    // No specific rule matched
    return {
      shouldRemove: false,
      shouldKeep: false,
      reason: 'No collection rule matched',
      confidence: 0,
    }
  }

  /**
   * Apply field-level cleanup rules
   */
  applyFieldRules(usage: DbNameUsage): RuleResult {
    // Skip collection-level usages
    if (usage.fieldType === 'collection') {
      return {
        shouldRemove: false,
        shouldKeep: false,
        reason: 'Collection-level usage, not field-level',
        confidence: 0,
      }
    }

    // Apply each field rule
    for (const rule of this.rules.fieldLevel) {
      // Check if rule applies to this field type
      if (rule.fieldTypes.length > 0 && !rule.fieldTypes.includes(usage.fieldType)) {
        continue
      }

      if (rule.condition(usage)) {
        return {
          shouldRemove: rule.action === 'remove',
          shouldKeep: rule.action === 'keep',
          reason: rule.reason,
          confidence: 0.8,
        }
      }
    }

    // No specific rule matched
    return {
      shouldRemove: false,
      shouldKeep: false,
      reason: 'No field rule matched',
      confidence: 0,
    }
  }

  /**
   * Apply validation rules to ensure database compatibility
   */
  applyValidationRules(usage: DbNameUsage): RuleResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Apply each validation rule
    for (const rule of this.rules.validation) {
      if (!rule.check(usage)) {
        if (rule.severity === 'error') {
          errors.push(rule.message)
        } else {
          warnings.push(rule.message)
        }
      }
    }

    // If there are errors, recommend keeping the dbName
    if (errors.length > 0) {
      return {
        shouldRemove: false,
        shouldKeep: true,
        reason: `Validation errors: ${errors.join(', ')}`,
        confidence: 0.95,
      }
    }

    // If there are warnings, be cautious
    if (warnings.length > 0) {
      return {
        shouldRemove: false,
        shouldKeep: false,
        reason: `Validation warnings: ${warnings.join(', ')}`,
        confidence: 0.3,
      }
    }

    // All validations passed
    return {
      shouldRemove: false,
      shouldKeep: false,
      reason: 'All validation rules passed',
      confidence: 0.1,
    }
  }

  /**
   * Check if a field type is compatible with dbName property
   */
  checkFieldTypeCompatibility(fieldType: string): boolean {
    return FieldTypeRegistry.supportsDbName(fieldType)
  }

  /**
   * Initialize all cleanup rules
   */
  private initializeRules(): CleanupRules {
    return {
      collectionLevel: this.createCollectionRules(),
      fieldLevel: this.createFieldRules(),
      validation: this.createValidationRules(),
    }
  }

  /**
   * Create collection-level cleanup rules
   */
  private createCollectionRules(): CollectionRule[] {
    return [
      // Rule 1.1: Remove dbName that equals collection slug
      {
        name: 'redundant-collection-dbname',
        condition: (usage: DbNameUsage) => {
          return usage.dbNameValue === usage.context.collectionSlug
        },
        action: 'remove',
        reason: 'Collection dbName equals slug - redundant and violates PayloadCMS conventions',
      },

      // Rule 1.2: Remove dbName that provides no meaningful database benefit
      {
        name: 'no-benefit-collection-dbname',
        condition: (usage: DbNameUsage) => {
          const slug = usage.context.collectionSlug
          const dbName = usage.dbNameValue

          // Check for simple transformations that don't add value
          const variations = [
            slug.toLowerCase(),
            slug.toUpperCase(),
            slug.replace(/([A-Z])/g, '_$1').toLowerCase(),
            slug.replace(/_/g, ''),
            slug.replace(/-/g, ''),
          ]

          return variations.some((variation) => variation === dbName.toLowerCase())
        },
        action: 'remove',
        reason: 'Collection dbName provides no meaningful database benefit',
      },

      // Rule 1.3: Keep dbName that solves identifier length issues
      {
        name: 'strategic-collection-dbname',
        condition: (usage: DbNameUsage) => {
          const slug = usage.context.collectionSlug
          return (
            slug.length > this.maxIdentifierLength &&
            usage.dbNameValue.length <= this.maxIdentifierLength
          )
        },
        action: 'keep',
        reason: 'Collection dbName solves identifier length issues',
      },
    ]
  }

  /**
   * Create field-level cleanup rules
   */
  private createFieldRules(): FieldRule[] {
    return [
      // Rule 2.1: Remove dbName that equals field name
      {
        name: 'redundant-field-dbname',
        fieldTypes: [], // Apply to all field types
        condition: (usage: DbNameUsage) => {
          return usage.dbNameValue === usage.fieldName
        },
        action: 'remove',
        reason: 'Field dbName equals field name - redundant',
      },

      // Rule 2.2: Evaluate dbName longer than field name
      {
        name: 'longer-field-dbname',
        fieldTypes: [], // Apply to all field types
        condition: (usage: DbNameUsage) => {
          return usage.dbNameValue.length > usage.fieldName.length && usage.nestingLevel === 0
        },
        action: 'remove',
        reason: 'Field dbName is longer than field name and field is not nested',
      },

      // Rule 2.3: Remove dbName from simple non-nested fields without strategic value
      {
        name: 'simple-non-nested-field',
        fieldTypes: ['text', 'textarea', 'email', 'number', 'date', 'checkbox', 'select', 'radio'],
        condition: (usage: DbNameUsage) => {
          return (
            usage.nestingLevel === 0 &&
            usage.dbNameValue.length >= usage.fieldName.length &&
            !this.hasStrategicValue(usage)
          )
        },
        action: 'remove',
        reason: 'Simple non-nested field with non-strategic dbName',
      },

      // Rule 2.4: Keep meaningful abbreviations
      {
        name: 'meaningful-abbreviation',
        fieldTypes: [], // Apply to all field types
        condition: (usage: DbNameUsage) => {
          return this.isMeaningfulAbbreviation(usage)
        },
        action: 'keep',
        reason: 'Field dbName provides meaningful abbreviation',
      },

      // Rule 5.1: Remove dbName from unsupported field types
      {
        name: 'unsupported-field-type',
        fieldTypes: ['ui', 'tabs', 'row', 'collapsible'],
        condition: (usage: DbNameUsage) => {
          return !FieldTypeRegistry.supportsDbName(usage.fieldType)
        },
        action: 'remove',
        reason: 'Field type does not support dbName according to PayloadCMS documentation',
      },

      // Rule 5.2: Remove dbName from UI/presentational fields
      {
        name: 'ui-presentational-field',
        fieldTypes: ['ui'],
        condition: (usage: DbNameUsage) => {
          return FieldTypeRegistry.isUIField(usage.fieldType)
        },
        action: 'remove',
        reason: 'UI/presentational fields do not support dbName',
      },

      // Rule 8.1: Keep dbName that follows PayloadCMS best practices
      {
        name: 'payloadcms-best-practice',
        fieldTypes: [], // Apply to all field types
        condition: (usage: DbNameUsage) => {
          return this.followsPayloadCMSBestPractices(usage)
        },
        action: 'keep',
        reason: 'dbName follows PayloadCMS best practices',
      },

      // Rule for deeply nested fields
      {
        name: 'deeply-nested-field',
        fieldTypes: [], // Apply to all field types
        condition: (usage: DbNameUsage) => {
          return usage.nestingLevel >= 3 && usage.dbNameValue.length < usage.fieldName.length
        },
        action: 'keep',
        reason: 'Deeply nested field with meaningful dbName abbreviation',
      },

      // Rule for high-impact container fields
      {
        name: 'high-impact-container-field',
        fieldTypes: ['array', 'group', 'blocks'],
        condition: (usage: DbNameUsage) => {
          const impact = FieldTypeRegistry.getIdentifierImpact(usage.fieldType)
          return impact === 'high' && usage.nestingLevel > 0
        },
        action: 'keep',
        reason: 'High-impact container field in nested context',
      },
    ]
  }

  /**
   * Create validation rules for database compatibility
   */
  private createValidationRules(): ValidationRule[] {
    return [
      // Rule 6.1: Validate identifier length limits
      {
        name: 'identifier-length-limit',
        check: (usage: DbNameUsage) => {
          const estimatedLength =
            usage.context.estimatedDatabaseName?.length || this.estimateIdentifierLength(usage)
          return estimatedLength <= this.maxIdentifierLength
        },
        severity: 'error',
        message: 'Removing dbName would create identifier exceeding length limits',
      },

      // Rule 6.2: Check for potential naming conflicts
      {
        name: 'naming-conflict-check',
        check: (_usage: DbNameUsage) => {
          // This is a simplified check - in practice, you'd check against other fields
          // For now, we'll assume no conflicts
          return true
        },
        severity: 'warning',
        message: 'Potential naming conflict detected',
      },

      // Rule 6.3: Ensure backward compatibility
      {
        name: 'backward-compatibility',
        check: (usage: DbNameUsage) => {
          // Check if removing dbName would break existing database schema
          // This is a simplified check - in practice, you'd check against existing data
          return usage.nestingLevel === 0 || usage.dbNameValue.length >= usage.fieldName.length
        },
        severity: 'warning',
        message: 'Removing dbName may affect backward compatibility',
      },

      // Rule 6.4: Validate database constraints
      {
        name: 'database-constraints',
        check: (usage: DbNameUsage) => {
          // Check for valid database identifier format
          const identifier = usage.dbNameValue
          const validIdentifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
          return validIdentifierRegex.test(identifier)
        },
        severity: 'error',
        message: 'dbName contains invalid characters for database identifier',
      },

      // Rule 8.2: PayloadCMS compliance validation
      {
        name: 'payloadcms-compliance',
        check: (usage: DbNameUsage) => {
          // Check if dbName follows PayloadCMS naming conventions
          return this.validatePayloadCMSCompliance(usage)
        },
        severity: 'warning',
        message: 'dbName may not follow PayloadCMS best practices',
      },
    ]
  }

  /**
   * Check if dbName has strategic value
   */
  private hasStrategicValue(usage: DbNameUsage): boolean {
    // Strategic if it prevents identifier length violations
    if (usage.context.wouldExceedLimit) {
      return true
    }

    // Strategic if it provides significant length reduction
    const reductionPercentage =
      (usage.fieldName.length - usage.dbNameValue.length) / usage.fieldName.length
    if (reductionPercentage >= 0.3 && usage.fieldName.length - usage.dbNameValue.length >= 3) {
      return true
    }

    // Strategic if field is in complex nesting
    if (usage.context.isInArray || usage.context.isInGroup || usage.context.isInBlocks) {
      return true
    }

    return false
  }

  /**
   * Check if dbName is a meaningful abbreviation
   */
  private isMeaningfulAbbreviation(usage: DbNameUsage): boolean {
    const fieldName = usage.fieldName.toLowerCase()
    const dbName = usage.dbNameValue.toLowerCase()

    // Must be shorter
    if (dbName.length >= fieldName.length) {
      return false
    }

    // Check for common meaningful abbreviations
    const meaningfulAbbreviations = [
      { full: 'description', abbrev: 'desc' },
      { full: 'information', abbrev: 'info' },
      { full: 'configuration', abbrev: 'config' },
      { full: 'identifier', abbrev: 'id' },
      { full: 'reference', abbrev: 'ref' },
      { full: 'category', abbrev: 'cat' },
      { full: 'organization', abbrev: 'org' },
      { full: 'administration', abbrev: 'admin' },
      { full: 'authentication', abbrev: 'auth' },
      { full: 'authorization', abbrev: 'authz' },
      { full: 'thumbnail', abbrev: 'thumb' },
      { full: 'maximum', abbrev: 'max' },
      { full: 'minimum', abbrev: 'min' },
      { full: 'temporary', abbrev: 'temp' },
      { full: 'previous', abbrev: 'prev' },
      { full: 'current', abbrev: 'curr' },
    ]

    // Check if it's a known meaningful abbreviation
    return meaningfulAbbreviations.some(
      ({ full, abbrev }) => fieldName.includes(full) && dbName === abbrev,
    )
  }

  /**
   * Check if dbName follows PayloadCMS best practices
   */
  private followsPayloadCMSBestPractices(usage: DbNameUsage): boolean {
    // PayloadCMS best practices:
    // 1. Use dbName only when necessary (length/nesting issues)
    // 2. Keep dbName short and meaningful
    // 3. Use snake_case for database identifiers
    // 4. Avoid redundant dbName

    const dbName = usage.dbNameValue

    // Should be shorter than field name or solve nesting issues
    if (dbName.length >= usage.fieldName.length && usage.nestingLevel === 0) {
      return false
    }

    // Should use valid database identifier format
    const validIdentifierRegex = /^[a-z][a-z0-9_]*$/
    if (!validIdentifierRegex.test(dbName)) {
      return false
    }

    // Should not be redundant
    if (dbName === usage.fieldName.toLowerCase()) {
      return false
    }

    // Should provide value for nested or complex fields
    if (usage.nestingLevel > 0 || this.hasStrategicValue(usage)) {
      return true
    }

    return false
  }

  /**
   * Validate PayloadCMS compliance
   */
  private validatePayloadCMSCompliance(usage: DbNameUsage): boolean {
    const dbName = usage.dbNameValue

    // Check naming conventions
    const hasValidFormat = /^[a-z][a-z0-9_]*$/.test(dbName)
    if (!hasValidFormat) {
      return false
    }

    // Check for reserved words (simplified list)
    const reservedWords = [
      'id',
      'createdAt',
      'updatedAt',
      'user',
      'admin',
      'auth',
      'login',
      'password',
      'select',
      'insert',
      'update',
      'delete',
      'drop',
      'create',
      'alter',
      'table',
      'index',
      'view',
      'trigger',
      'function',
      'procedure',
    ]

    if (reservedWords.includes(dbName.toLowerCase())) {
      return false
    }

    // Check length (should be reasonable)
    if (dbName.length > 30) {
      return false
    }

    return true
  }

  /**
   * Estimate identifier length for validation
   */
  private estimateIdentifierLength(usage: DbNameUsage): number {
    const segments: string[] = []

    // Add collection slug for nested fields
    if (usage.nestingLevel > 0) {
      segments.push(usage.context.collectionSlug)
    }

    // Add parent field segments
    segments.push(...usage.context.parentFields)

    // Add current field (use dbName)
    segments.push(usage.dbNameValue)

    return segments.join('_').length
  }
}

/**
 * Factory function to create a RuleEngine instance
 */
export function createRuleEngine(maxIdentifierLength?: number): RuleEngine {
  return new PayloadRuleEngine(maxIdentifierLength)
}
