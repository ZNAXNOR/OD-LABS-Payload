/**
 * DbNameAnalyzer implementation for strategic value evaluation
 *
 * This module implements the DbNameAnalyzer interface to:
 * - Analyze dbName usage patterns and determine recommended actions
 * - Evaluate strategic value for nested fields and long identifiers
 * - Calculate identifier length impacts and database benefits
 * - Check field type support for dbName properties
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { DBNAME_POSTGRES_IDENTIFIER_LIMIT, FieldTypeRegistry } from './index'
import type { DbNameAnalyzer } from './interfaces'
import type { AnalysisResult, DbNameUsage } from './types'

/**
 * Implementation of DbNameAnalyzer for PayloadCMS projects
 */
export class PayloadDbNameAnalyzer implements DbNameAnalyzer {
  private readonly maxIdentifierLength: number
  private readonly strategicThreshold: number

  constructor(
    maxIdentifierLength: number = DBNAME_POSTGRES_IDENTIFIER_LIMIT,
    strategicThreshold: number = 3,
  ) {
    this.maxIdentifierLength = maxIdentifierLength
    this.strategicThreshold = strategicThreshold
  }

  /**
   * Analyze a specific dbName usage and determine recommended action
   */
  analyzeUsage(usage: DbNameUsage): AnalysisResult {
    // Check field type support first
    if (!this.checkFieldTypeSupport(usage.fieldType)) {
      return {
        action: 'remove',
        reason: `Field type '${usage.fieldType}' does not support dbName property`,
        riskLevel: 'low',
      }
    }

    // Check for redundancy
    if (this.isRedundantDbName(usage)) {
      return {
        action: 'remove',
        reason: 'dbName is redundant - equals field name or provides no benefit',
        riskLevel: 'low',
      }
    }

    // Check strategic value
    if (this.evaluateStrategicValue(usage)) {
      return {
        action: 'keep',
        reason: this.getStrategicValueReason(usage),
        riskLevel: 'medium',
      }
    }

    // Check if dbName is longer than field name (anti-pattern)
    if (usage.dbNameValue.length > usage.fieldName.length) {
      const suggestedValue = this.generateOptimalDbName(usage)
      if (suggestedValue && suggestedValue !== usage.dbNameValue) {
        return {
          action: 'modify',
          reason: 'dbName is longer than field name - suggesting shorter alternative',
          riskLevel: 'low',
          suggestedValue,
        }
      } else {
        return {
          action: 'remove',
          reason: 'dbName is longer than field name and provides no benefit',
          riskLevel: 'low',
        }
      }
    }

    // Default action for non-strategic dbName
    return {
      action: 'remove',
      reason: 'dbName provides no strategic value and can be safely removed',
      riskLevel: 'low',
    }
  }

  /**
   * Evaluate whether a dbName usage provides strategic value
   */
  evaluateStrategicValue(usage: DbNameUsage): boolean {
    const context = usage.context

    // Strategic if it prevents identifier length violations
    if (context.wouldExceedLimit || this.wouldExceedLimitWithoutDbName(usage)) {
      return true
    }

    // Strategic if it significantly reduces identifier length
    if (this.providesSignificantLengthReduction(usage)) {
      return true
    }

    // Strategic if field is deeply nested
    if (usage.nestingLevel >= this.strategicThreshold) {
      return true
    }

    // Strategic if it's in complex nesting structures
    if (this.isInComplexNestingStructure(usage)) {
      return true
    }

    // Strategic if it provides meaningful abbreviation
    if (this.providesMeaningfulAbbreviation(usage)) {
      return true
    }

    // Strategic for high-impact field types in nested contexts
    if (this.isHighImpactFieldInNestedContext(usage)) {
      return true
    }

    return false
  }

  /**
   * Check if a field type supports dbName property
   */
  checkFieldTypeSupport(fieldType: string): boolean {
    return FieldTypeRegistry.supportsDbName(fieldType)
  }

  /**
   * Calculate the full database identifier length for a field
   */
  calculateIdentifierLength(usage: DbNameUsage): number {
    const context = usage.context

    // Use estimated database name if available
    if (context.estimatedDatabaseName) {
      return context.estimatedDatabaseName.length
    }

    // Fallback calculation
    const segments: string[] = []

    // Add collection slug for nested fields
    if (usage.nestingLevel > 0) {
      segments.push(context.collectionSlug)
    }

    // Add parent field segments
    segments.push(...context.parentFields)

    // Add current field (use dbName if provided)
    segments.push(usage.dbNameValue)

    return segments.join('_').length
  }

  /**
   * Check if dbName is redundant
   */
  private isRedundantDbName(usage: DbNameUsage): boolean {
    // Exact match
    if (usage.dbNameValue === usage.fieldName) {
      return true
    }

    // Case-insensitive match
    if (usage.dbNameValue.toLowerCase() === usage.fieldName.toLowerCase()) {
      return true
    }

    // Simple transformations that don't add value
    const fieldNameVariations = [
      usage.fieldName.replace(/([A-Z])/g, '_$1').toLowerCase(), // camelCase to snake_case
      usage.fieldName.replace(/_/g, ''), // remove underscores
      usage.fieldName.replace(/-/g, ''), // remove hyphens
    ]

    return fieldNameVariations.some((variation) => variation === usage.dbNameValue.toLowerCase())
  }

  /**
   * Check if identifier would exceed limit without dbName
   */
  private wouldExceedLimitWithoutDbName(usage: DbNameUsage): boolean {
    const context = usage.context

    // Calculate what the identifier would be without dbName
    const segments: string[] = []

    if (usage.nestingLevel > 0) {
      segments.push(context.collectionSlug)
    }

    segments.push(...context.parentFields)
    segments.push(usage.fieldName) // Use original field name instead of dbName

    const identifierWithoutDbName = segments.join('_')
    return identifierWithoutDbName.length > this.maxIdentifierLength
  }

  /**
   * Check if dbName provides significant length reduction
   */
  private providesSignificantLengthReduction(usage: DbNameUsage): boolean {
    const originalLength = usage.fieldName.length
    const dbNameLength = usage.dbNameValue.length

    // Consider significant if reduces by at least 30% and saves at least 3 characters
    const reductionPercentage = (originalLength - dbNameLength) / originalLength
    const absoluteReduction = originalLength - dbNameLength

    return reductionPercentage >= 0.3 && absoluteReduction >= 3
  }

  /**
   * Check if field is in complex nesting structure
   */
  private isInComplexNestingStructure(usage: DbNameUsage): boolean {
    const context = usage.context

    // Complex if multiple nesting types are involved
    const nestingTypes = [context.isInArray, context.isInGroup, context.isInBlocks].filter(
      Boolean,
    ).length

    if (nestingTypes >= 2) {
      return true
    }

    // Complex if deep array nesting
    if (context.arrayNestingLevel && context.arrayNestingLevel >= 2) {
      return true
    }

    // Complex if in blocks (always adds complexity)
    if (context.isInBlocks) {
      return true
    }

    // Complex if field depth is high with container fields
    if (context.fieldDepth && context.fieldDepth >= 2 && this.hasContainerFieldsInPath(usage)) {
      return true
    }

    return false
  }

  /**
   * Check if dbName provides meaningful abbreviation
   */
  private providesMeaningfulAbbreviation(usage: DbNameUsage): boolean {
    const fieldName = usage.fieldName
    const dbName = usage.dbNameValue

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
    const isKnownAbbreviation = meaningfulAbbreviations.some(
      ({ full, abbrev }) =>
        fieldName.toLowerCase().includes(full) && dbName.toLowerCase() === abbrev,
    )

    if (isKnownAbbreviation) {
      return true
    }

    // Check if it preserves key parts of the field name
    const fieldNameLower = fieldName.toLowerCase()
    const dbNameLower = dbName.toLowerCase()

    // Should contain at least the first few characters or key consonants
    if (fieldNameLower.startsWith(dbNameLower)) {
      return true
    }

    // Check for consonant-based abbreviation
    const consonants = fieldNameLower.replace(/[aeiou]/g, '')
    if (
      consonants.length > 2 &&
      dbNameLower === consonants.substring(0, Math.min(4, consonants.length))
    ) {
      return true
    }

    return false
  }

  /**
   * Check if field is high-impact type in nested context
   */
  private isHighImpactFieldInNestedContext(usage: DbNameUsage): boolean {
    const impact = FieldTypeRegistry.getIdentifierImpact(usage.fieldType)

    // High impact fields in any nested context are strategic
    if (impact === 'high' && usage.nestingLevel > 0) {
      return true
    }

    // Medium impact fields in deep nesting are strategic
    if (impact === 'medium' && usage.nestingLevel >= 2) {
      return true
    }

    return false
  }

  /**
   * Check if field path contains container fields
   */
  private hasContainerFieldsInPath(usage: DbNameUsage): boolean {
    const context = usage.context

    if (!context.parentFieldTypes) {
      return false
    }

    const containerTypes = ['array', 'group', 'blocks']
    return context.parentFieldTypes.some((type) => containerTypes.includes(type))
  }

  /**
   * Get strategic value reason for keeping dbName
   */
  private getStrategicValueReason(usage: DbNameUsage): string {
    const reasons: string[] = []

    if (usage.context.wouldExceedLimit || this.wouldExceedLimitWithoutDbName(usage)) {
      reasons.push('prevents database identifier length limit violation')
    }

    if (this.providesSignificantLengthReduction(usage)) {
      reasons.push('provides significant identifier length reduction')
    }

    if (usage.nestingLevel >= this.strategicThreshold) {
      reasons.push(`field is deeply nested (level ${usage.nestingLevel})`)
    }

    if (this.isInComplexNestingStructure(usage)) {
      reasons.push('field is in complex nesting structure')
    }

    if (this.providesMeaningfulAbbreviation(usage)) {
      reasons.push('provides meaningful abbreviation')
    }

    if (this.isHighImpactFieldInNestedContext(usage)) {
      reasons.push('high-impact field type in nested context')
    }

    return `Strategic dbName: ${reasons.join(', ')}`
  }

  /**
   * Generate optimal dbName suggestion
   */
  private generateOptimalDbName(usage: DbNameUsage): string | undefined {
    const fieldName = usage.fieldName
    const maxLength = Math.min(this.maxIdentifierLength - 10, 20) // Leave room for prefixes

    // If field name is already short enough, suggest removal
    if (fieldName.length <= maxLength) {
      return undefined
    }

    // Try meaningful abbreviations first
    const abbreviations = [
      { pattern: /description/i, replacement: 'desc' },
      { pattern: /information/i, replacement: 'info' },
      { pattern: /configuration/i, replacement: 'config' },
      { pattern: /identifier/i, replacement: 'id' },
      { pattern: /reference/i, replacement: 'ref' },
      { pattern: /category/i, replacement: 'cat' },
      { pattern: /organization/i, replacement: 'org' },
      { pattern: /administration/i, replacement: 'admin' },
      { pattern: /authentication/i, replacement: 'auth' },
      { pattern: /thumbnail/i, replacement: 'thumb' },
      { pattern: /maximum/i, replacement: 'max' },
      { pattern: /minimum/i, replacement: 'min' },
      { pattern: /temporary/i, replacement: 'temp' },
      { pattern: /previous/i, replacement: 'prev' },
      { pattern: /current/i, replacement: 'curr' },
    ]

    for (const { pattern, replacement } of abbreviations) {
      if (pattern.test(fieldName)) {
        const abbreviated = fieldName.replace(pattern, replacement)
        if (abbreviated.length <= maxLength && abbreviated !== fieldName) {
          return abbreviated
        }
      }
    }

    // Fallback: consonant-based abbreviation
    const consonants = fieldName.toLowerCase().replace(/[aeiou]/g, '')
    if (consonants.length > 2 && consonants.length <= maxLength) {
      return consonants.substring(0, maxLength)
    }

    // Final fallback: truncate with meaningful suffix
    if (fieldName.length > maxLength) {
      return fieldName.substring(0, maxLength - 2) + 'id'
    }

    return undefined
  }
}

/**
 * Factory function to create a DbNameAnalyzer instance
 */
export function createDbNameAnalyzer(
  maxIdentifierLength?: number,
  strategicThreshold?: number,
): DbNameAnalyzer {
  return new PayloadDbNameAnalyzer(maxIdentifierLength, strategicThreshold)
}
