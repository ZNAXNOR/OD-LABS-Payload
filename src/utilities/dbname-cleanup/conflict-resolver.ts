/**
 * Conflict Resolver for DbName Cleanup Optimization
 *
 * Detects and resolves duplicate dbName values across fields, standardizes
 * patterns between related configuration files, and applies consistent naming
 * conventions following PayloadCMS best practices.
 *
 * @author PayloadCMS DbName Cleanup System
 * @version 1.0.0
 */

import { generateShortIdentifier, isValidDatabaseIdentifier } from './index'
import type { ConfigurationFile, DbNameUsage } from './types'

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export interface ConflictResolution {
  conflicts: DbNameConflict[]
  resolutions: ConflictResolutionAction[]
  warnings: string[]
  suggestions: string[]
}

export interface DbNameConflict {
  type: 'duplicate_dbname' | 'duplicate_field_name' | 'pattern_inconsistency' | 'reserved_keyword'
  severity: 'error' | 'warning'
  description: string
  affectedUsages: DbNameUsage[]
  suggestedResolution: string
}

export interface ConflictResolutionAction {
  usage: DbNameUsage
  action: 'remove' | 'modify' | 'keep'
  newValue?: string
  reason: string
  confidence: number
}

export interface NamingPattern {
  pattern: 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase' | 'mixed'
  examples: string[]
  frequency: number
}

// ============================================================================
// Conflict Resolver Implementation
// ============================================================================

export class PayloadConflictResolver {
  private readonly reservedKeywords: Set<string>
  private readonly commonAbbreviations: Map<string, string>

  constructor() {
    this.reservedKeywords = new Set([
      // PostgreSQL reserved keywords
      'user',
      'order',
      'group',
      'table',
      'column',
      'index',
      'constraint',
      'primary',
      'foreign',
      'key',
      'references',
      'check',
      'unique',
      'not',
      'null',
      'default',
      'create',
      'drop',
      'alter',
      'select',
      'insert',
      'update',
      'delete',
      'from',
      'where',
      'join',
      'on',
      'and',
      'or',
      'in',
      'exists',
      'between',
      'like',
      'is',
      'as',
      // PayloadCMS internal fields
      'id',
      'createdAt',
      'updatedAt',
      '_status',
      '_v',
    ])

    this.commonAbbreviations = new Map([
      ['description', 'desc'],
      ['information', 'info'],
      ['configuration', 'config'],
      ['administration', 'admin'],
      ['authentication', 'auth'],
      ['authorization', 'authz'],
      ['identification', 'id'],
      ['reference', 'ref'],
      ['relationship', 'rel'],
      ['category', 'cat'],
      ['categories', 'cats'],
      ['image', 'img'],
      ['images', 'imgs'],
      ['document', 'doc'],
      ['documents', 'docs'],
      ['content', 'cnt'],
      ['metadata', 'meta'],
      ['thumbnail', 'thumb'],
      ['featured', 'feat'],
      ['published', 'pub'],
      ['created', 'crt'],
      ['updated', 'upd'],
      ['modified', 'mod'],
      ['deleted', 'del'],
      ['archived', 'arch'],
      ['active', 'act'],
      ['inactive', 'inact'],
      ['enabled', 'en'],
      ['disabled', 'dis'],
      ['visible', 'vis'],
      ['hidden', 'hid'],
      ['public', 'pub'],
      ['private', 'priv'],
      ['internal', 'int'],
      ['external', 'ext'],
      ['temporary', 'temp'],
      ['permanent', 'perm'],
      ['original', 'orig'],
      ['backup', 'bak'],
      ['previous', 'prev'],
      ['current', 'curr'],
      ['next', 'nxt'],
      ['first', 'fst'],
      ['last', 'lst'],
      ['count', 'cnt'],
      ['total', 'tot'],
      ['maximum', 'max'],
      ['minimum', 'min'],
      ['average', 'avg'],
      ['percentage', 'pct'],
      ['position', 'pos'],
      ['location', 'loc'],
      ['address', 'addr'],
      ['telephone', 'tel'],
      ['email', 'mail'],
      ['website', 'web'],
      ['social', 'soc'],
      ['media', 'med'],
      ['video', 'vid'],
      ['audio', 'aud'],
      ['text', 'txt'],
      ['number', 'num'],
      ['date', 'dt'],
      ['time', 'tm'],
      ['datetime', 'dttm'],
      ['timestamp', 'ts'],
      ['boolean', 'bool'],
      ['string', 'str'],
      ['integer', 'int'],
      ['decimal', 'dec'],
      ['float', 'flt'],
      ['double', 'dbl'],
    ])
  }

  /**
   * Detect and resolve conflicts in dbName usage across configuration files
   */
  resolveConflicts(configFiles: ConfigurationFile[]): ConflictResolution {
    const allUsages = this.extractAllUsages(configFiles)
    const conflicts = this.detectConflicts(allUsages)
    const resolutions = this.generateResolutions(conflicts)

    return {
      conflicts,
      resolutions,
      warnings: this.generateWarnings(conflicts),
      suggestions: this.generateSuggestions(conflicts, resolutions),
    }
  }

  /**
   * Standardize dbName patterns across related configuration files
   */
  standardizePatterns(configFiles: ConfigurationFile[]): ConflictResolutionAction[] {
    const allUsages = this.extractAllUsages(configFiles)
    const patterns = this.analyzeNamingPatterns(allUsages)
    const dominantPattern = this.selectDominantPattern(patterns)

    return this.applyPatternStandardization(allUsages, dominantPattern)
  }

  /**
   * Apply consistent naming conventions following PayloadCMS best practices
   */
  applyNamingConventions(usages: DbNameUsage[]): ConflictResolutionAction[] {
    const actions: ConflictResolutionAction[] = []

    for (const usage of usages) {
      const action = this.evaluateNamingConvention(usage)
      if (action) {
        actions.push(action)
      }
    }

    return actions
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Extract all dbName usages from configuration files
   */
  private extractAllUsages(configFiles: ConfigurationFile[]): DbNameUsage[] {
    const allUsages: DbNameUsage[] = []

    for (const configFile of configFiles) {
      allUsages.push(...configFile.dbNameUsages)
    }

    return allUsages
  }

  /**
   * Detect various types of conflicts in dbName usage
   */
  private detectConflicts(usages: DbNameUsage[]): DbNameConflict[] {
    const conflicts: DbNameConflict[] = []

    // Detect duplicate dbName values
    conflicts.push(...this.detectDuplicateDbNames(usages))

    // Detect duplicate field names that would conflict after dbName removal
    conflicts.push(...this.detectDuplicateFieldNames(usages))

    // Detect pattern inconsistencies
    conflicts.push(...this.detectPatternInconsistencies(usages))

    // Detect reserved keyword conflicts
    conflicts.push(...this.detectReservedKeywordConflicts(usages))

    return conflicts
  }

  /**
   * Detect duplicate dbName values across fields
   */
  private detectDuplicateDbNames(usages: DbNameUsage[]): DbNameConflict[] {
    const conflicts: DbNameConflict[] = []
    const dbNameGroups = new Map<string, DbNameUsage[]>()

    // Group usages by dbName value
    for (const usage of usages) {
      if (usage.dbNameValue) {
        const existing = dbNameGroups.get(usage.dbNameValue) || []
        existing.push(usage)
        dbNameGroups.set(usage.dbNameValue, existing)
      }
    }

    // Find duplicates
    for (const [dbNameValue, groupedUsages] of dbNameGroups.entries()) {
      if (groupedUsages.length > 1) {
        conflicts.push({
          type: 'duplicate_dbname',
          severity: 'error',
          description: `Duplicate dbName value '${dbNameValue}' found in ${groupedUsages.length} fields`,
          affectedUsages: groupedUsages,
          suggestedResolution: `Make dbName values unique or remove redundant ones`,
        })
      }
    }

    return conflicts
  }

  /**
   * Detect duplicate field names that would conflict after dbName removal
   */
  private detectDuplicateFieldNames(usages: DbNameUsage[]): DbNameConflict[] {
    const conflicts: DbNameConflict[] = []
    const fieldNameGroups = new Map<string, DbNameUsage[]>()

    // Group usages by field name within the same collection
    for (const usage of usages) {
      const key = `${usage.context.collectionSlug}:${usage.fieldName}`
      const existing = fieldNameGroups.get(key) || []
      existing.push(usage)
      fieldNameGroups.set(key, existing)
    }

    // Find potential conflicts
    for (const [key, groupedUsages] of fieldNameGroups.entries()) {
      if (groupedUsages.length > 1) {
        // Check if removing dbName would cause conflicts
        const wouldConflict = groupedUsages.some(
          (usage) => usage.dbNameValue && usage.dbNameValue !== usage.fieldName,
        )

        if (wouldConflict) {
          conflicts.push({
            type: 'duplicate_field_name',
            severity: 'warning',
            description: `Field name '${groupedUsages[0].fieldName}' would conflict after dbName removal in collection '${groupedUsages[0].context.collectionSlug}'`,
            affectedUsages: groupedUsages,
            suggestedResolution: `Keep strategic dbName values to avoid field name conflicts`,
          })
        }
      }
    }

    return conflicts
  }

  /**
   * Detect pattern inconsistencies across related files
   */
  private detectPatternInconsistencies(usages: DbNameUsage[]): DbNameConflict[] {
    const conflicts: DbNameConflict[] = []
    const patterns = this.analyzeNamingPatterns(usages)

    // If there are multiple patterns with significant usage, flag as inconsistent
    const significantPatterns = patterns.filter((p) => p.frequency > 0.2) // 20% threshold

    if (significantPatterns.length > 1) {
      const affectedUsages = usages.filter(
        (usage) =>
          usage.dbNameValue && this.getPatternType(usage.dbNameValue) !== patterns[0].pattern,
      )

      if (affectedUsages.length > 0) {
        conflicts.push({
          type: 'pattern_inconsistency',
          severity: 'warning',
          description: `Inconsistent naming patterns detected: ${significantPatterns.map((p) => p.pattern).join(', ')}`,
          affectedUsages,
          suggestedResolution: `Standardize to ${patterns[0].pattern} pattern for consistency`,
        })
      }
    }

    return conflicts
  }

  /**
   * Detect conflicts with reserved keywords
   */
  private detectReservedKeywordConflicts(usages: DbNameUsage[]): DbNameConflict[] {
    const conflicts: DbNameConflict[] = []

    for (const usage of usages) {
      const identifierToCheck = usage.dbNameValue || usage.fieldName

      if (this.reservedKeywords.has(identifierToCheck.toLowerCase())) {
        conflicts.push({
          type: 'reserved_keyword',
          severity: 'error',
          description: `Identifier '${identifierToCheck}' conflicts with reserved keyword`,
          affectedUsages: [usage],
          suggestedResolution: `Use a different name or add prefix/suffix to avoid keyword conflict`,
        })
      }
    }

    return conflicts
  }

  /**
   * Generate resolution actions for detected conflicts
   */
  private generateResolutions(conflicts: DbNameConflict[]): ConflictResolutionAction[] {
    const resolutions: ConflictResolutionAction[] = []

    for (const conflict of conflicts) {
      switch (conflict.type) {
        case 'duplicate_dbname':
          resolutions.push(...this.resolveDuplicateDbNames(conflict))
          break
        case 'duplicate_field_name':
          resolutions.push(...this.resolveDuplicateFieldNames(conflict))
          break
        case 'pattern_inconsistency':
          resolutions.push(...this.resolvePatternInconsistencies(conflict))
          break
        case 'reserved_keyword':
          resolutions.push(...this.resolveReservedKeywordConflicts(conflict))
          break
      }
    }

    return resolutions
  }

  /**
   * Resolve duplicate dbName conflicts
   */
  private resolveDuplicateDbNames(conflict: DbNameConflict): ConflictResolutionAction[] {
    const actions: ConflictResolutionAction[] = []
    const usages = conflict.affectedUsages

    // Strategy: Keep the most strategic usage, remove or modify others
    const sortedUsages = usages.sort((a, b) => {
      // Prioritize deeply nested fields
      const aDepth = a.context.fieldDepth || 0
      const bDepth = b.context.fieldDepth || 0
      if (aDepth !== bDepth) return bDepth - aDepth

      // Prioritize fields that would exceed limits without dbName
      const aWouldExceed = a.context.wouldExceedLimit || false
      const bWouldExceed = b.context.wouldExceedLimit || false
      if (aWouldExceed !== bWouldExceed) return aWouldExceed ? -1 : 1

      // Prioritize shorter field names (more likely to need dbName)
      return a.fieldName.length - b.fieldName.length
    })

    // Keep the most strategic usage
    const keepUsage = sortedUsages[0]
    actions.push({
      usage: keepUsage,
      action: 'keep',
      reason: `Keeping strategic dbName for ${this.getStrategicReason(keepUsage)}`,
      confidence: 0.9,
    })

    // Handle remaining usages
    for (let i = 1; i < sortedUsages.length; i++) {
      const usage = sortedUsages[i]

      if (usage.dbNameValue === usage.fieldName) {
        // Remove redundant dbName
        actions.push({
          usage,
          action: 'remove',
          reason: 'Removing redundant dbName that equals field name',
          confidence: 0.95,
        })
      } else {
        // Generate unique dbName
        const newDbName = this.generateUniqueDbName(usage, usages)
        actions.push({
          usage,
          action: 'modify',
          newValue: newDbName,
          reason: `Modified to unique dbName to resolve conflict`,
          confidence: 0.8,
        })
      }
    }

    return actions
  }

  /**
   * Resolve duplicate field name conflicts
   */
  private resolveDuplicateFieldNames(conflict: DbNameConflict): ConflictResolutionAction[] {
    const actions: ConflictResolutionAction[] = []

    for (const usage of conflict.affectedUsages) {
      if (usage.dbNameValue && usage.dbNameValue !== usage.fieldName) {
        // Keep dbName to avoid field name conflict
        actions.push({
          usage,
          action: 'keep',
          reason: 'Keeping dbName to prevent field name conflict after cleanup',
          confidence: 0.85,
        })
      }
    }

    return actions
  }

  /**
   * Resolve pattern inconsistencies
   */
  private resolvePatternInconsistencies(conflict: DbNameConflict): ConflictResolutionAction[] {
    const actions: ConflictResolutionAction[] = []
    const allUsages = conflict.affectedUsages
    const patterns = this.analyzeNamingPatterns(allUsages)
    const dominantPattern = patterns[0]?.pattern || 'camelCase'

    for (const usage of allUsages) {
      if (usage.dbNameValue) {
        const currentPattern = this.getPatternType(usage.dbNameValue)

        if (currentPattern !== dominantPattern) {
          const standardizedName = this.convertToPattern(usage.dbNameValue, dominantPattern)

          if (standardizedName !== usage.dbNameValue) {
            actions.push({
              usage,
              action: 'modify',
              newValue: standardizedName,
              reason: `Standardizing to ${dominantPattern} pattern for consistency`,
              confidence: 0.7,
            })
          }
        }
      }
    }

    return actions
  }

  /**
   * Resolve reserved keyword conflicts
   */
  private resolveReservedKeywordConflicts(conflict: DbNameConflict): ConflictResolutionAction[] {
    const actions: ConflictResolutionAction[] = []

    for (const usage of conflict.affectedUsages) {
      const conflictingName = usage.dbNameValue || usage.fieldName

      if (usage.dbNameValue && this.reservedKeywords.has(usage.dbNameValue.toLowerCase())) {
        // Try to find a good alternative
        const alternative = this.generateNonConflictingName(usage.dbNameValue)

        actions.push({
          usage,
          action: 'modify',
          newValue: alternative,
          reason: `Resolving reserved keyword conflict with '${conflictingName}'`,
          confidence: 0.8,
        })
      } else if (this.reservedKeywords.has(usage.fieldName.toLowerCase())) {
        // Field name conflicts, need to keep or create dbName
        const alternative = this.generateNonConflictingName(usage.fieldName)

        actions.push({
          usage,
          action: usage.dbNameValue ? 'keep' : 'modify',
          newValue: usage.dbNameValue || alternative,
          reason: `Keeping/creating dbName to avoid field name keyword conflict`,
          confidence: 0.9,
        })
      }
    }

    return actions
  }

  /**
   * Analyze naming patterns in dbName values
   */
  private analyzeNamingPatterns(usages: DbNameUsage[]): NamingPattern[] {
    const patternCounts = new Map<string, { examples: string[]; count: number }>()
    const totalUsages = usages.filter((u) => u.dbNameValue).length

    for (const usage of usages) {
      if (usage.dbNameValue) {
        const pattern = this.getPatternType(usage.dbNameValue)
        const existing = patternCounts.get(pattern) || { examples: [], count: 0 }

        existing.count++
        if (existing.examples.length < 3) {
          existing.examples.push(usage.dbNameValue)
        }

        patternCounts.set(pattern, existing)
      }
    }

    const patterns: NamingPattern[] = []
    for (const [pattern, data] of patternCounts.entries()) {
      patterns.push({
        pattern: pattern as NamingPattern['pattern'],
        examples: data.examples,
        frequency: data.count / totalUsages,
      })
    }

    // Sort by frequency (most common first)
    return patterns.sort((a, b) => b.frequency - a.frequency)
  }

  /**
   * Select the dominant naming pattern
   */
  private selectDominantPattern(patterns: NamingPattern[]): NamingPattern['pattern'] {
    if (patterns.length === 0) return 'camelCase'

    // Return the most frequent pattern, with preference for camelCase in ties
    const dominant = patterns[0]
    if (patterns.length > 1 && patterns[0].frequency === patterns[1].frequency) {
      const camelCasePattern = patterns.find((p) => p.pattern === 'camelCase')
      if (camelCasePattern) return 'camelCase'
    }

    return dominant.pattern
  }

  /**
   * Apply pattern standardization to usages
   */
  private applyPatternStandardization(
    usages: DbNameUsage[],
    targetPattern: NamingPattern['pattern'],
  ): ConflictResolutionAction[] {
    const actions: ConflictResolutionAction[] = []

    for (const usage of usages) {
      if (usage.dbNameValue) {
        const currentPattern = this.getPatternType(usage.dbNameValue)

        if (currentPattern !== targetPattern) {
          const standardizedName = this.convertToPattern(usage.dbNameValue, targetPattern)

          actions.push({
            usage,
            action: 'modify',
            newValue: standardizedName,
            reason: `Standardizing naming pattern from ${currentPattern} to ${targetPattern}`,
            confidence: 0.75,
          })
        }
      }
    }

    return actions
  }

  /**
   * Evaluate naming convention for a single usage
   */
  private evaluateNamingConvention(usage: DbNameUsage): ConflictResolutionAction | null {
    if (!usage.dbNameValue) return null

    // Check if dbName follows PayloadCMS conventions
    const isValidIdentifier = isValidDatabaseIdentifier(usage.dbNameValue)
    const isReasonableLength = usage.dbNameValue.length <= 30 // Reasonable limit
    const followsPattern = this.followsPayloadConventions(usage.dbNameValue)

    if (!isValidIdentifier || !isReasonableLength || !followsPattern) {
      const improvedName = this.improveNamingConvention(usage.dbNameValue)

      return {
        usage,
        action: 'modify',
        newValue: improvedName,
        reason: 'Improving naming convention to follow PayloadCMS best practices',
        confidence: 0.8,
      }
    }

    return null
  }

  /**
   * Generate warnings for conflicts
   */
  private generateWarnings(conflicts: DbNameConflict[]): string[] {
    const warnings: string[] = []

    for (const conflict of conflicts) {
      if (conflict.severity === 'warning') {
        warnings.push(`${conflict.type}: ${conflict.description}`)
      }
    }

    return warnings
  }

  /**
   * Generate suggestions for conflict resolution
   */
  private generateSuggestions(
    conflicts: DbNameConflict[],
    resolutions: ConflictResolutionAction[],
  ): string[] {
    const suggestions: string[] = []

    // Add conflict-specific suggestions
    for (const conflict of conflicts) {
      suggestions.push(conflict.suggestedResolution)
    }

    // Add resolution-specific suggestions
    const modificationCount = resolutions.filter((r) => r.action === 'modify').length
    const removalCount = resolutions.filter((r) => r.action === 'remove').length

    if (modificationCount > 0) {
      suggestions.push(`${modificationCount} dbName values will be modified to resolve conflicts`)
    }

    if (removalCount > 0) {
      suggestions.push(`${removalCount} redundant dbName values will be removed`)
    }

    return suggestions
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Get the naming pattern type of a string
   */
  private getPatternType(name: string): string {
    if (/^[a-z][a-zA-Z0-9]*$/.test(name)) return 'camelCase'
    if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) return 'PascalCase'
    if (/^[a-z][a-z0-9_]*$/.test(name)) return 'snake_case'
    if (/^[a-z][a-z0-9-]*$/.test(name)) return 'kebab-case'
    return 'mixed'
  }

  /**
   * Convert a name to a specific pattern
   */
  private convertToPattern(name: string, pattern: NamingPattern['pattern']): string {
    // Split name into words
    const words = name
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.toLowerCase())

    switch (pattern) {
      case 'camelCase':
        return (
          words[0] +
          words
            .slice(1)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')
        )

      case 'PascalCase':
        return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')

      case 'snake_case':
        return words.join('_')

      case 'kebab-case':
        return words.join('-')

      default:
        return name
    }
  }

  /**
   * Check if a name follows PayloadCMS conventions
   */
  private followsPayloadConventions(name: string): boolean {
    // PayloadCMS typically uses camelCase for field names
    return /^[a-z][a-zA-Z0-9]*$/.test(name)
  }

  /**
   * Improve naming convention for a dbName value
   */
  private improveNamingConvention(name: string): string {
    // Convert to camelCase and ensure valid identifier
    const improved = this.convertToPattern(name, 'camelCase')

    // Ensure it starts with a letter
    if (!/^[a-zA-Z]/.test(improved)) {
      return 'field' + improved.charAt(0).toUpperCase() + improved.slice(1)
    }

    return improved
  }

  /**
   * Generate a unique dbName to resolve conflicts
   */
  private generateUniqueDbName(usage: DbNameUsage, allUsages: DbNameUsage[]): string {
    const baseNames = allUsages.map((u) => u.dbNameValue).filter(Boolean)
    const baseName = usage.fieldName

    // Try common abbreviations first
    const abbreviation = this.commonAbbreviations.get(baseName.toLowerCase())
    if (abbreviation && !baseNames.includes(abbreviation)) {
      return abbreviation
    }

    // Try shortened version
    const shortened = generateShortIdentifier(baseName)
    if (!baseNames.includes(shortened)) {
      return shortened
    }

    // Add numeric suffix
    let counter = 1
    let candidate = `${shortened}${counter}`
    while (baseNames.includes(candidate)) {
      counter++
      candidate = `${shortened}${counter}`
    }

    return candidate
  }

  /**
   * Generate a non-conflicting name for reserved keyword conflicts
   */
  private generateNonConflictingName(name: string): string {
    // Try adding common prefixes
    const prefixes = ['field', 'data', 'item', 'value']

    for (const prefix of prefixes) {
      const candidate = prefix + name.charAt(0).toUpperCase() + name.slice(1)
      if (!this.reservedKeywords.has(candidate.toLowerCase())) {
        return candidate
      }
    }

    // Fallback: add suffix
    return name + 'Field'
  }

  /**
   * Get strategic reason for keeping a dbName
   */
  private getStrategicReason(usage: DbNameUsage): string {
    if (usage.context.wouldExceedLimit) {
      return 'identifier length optimization'
    }

    if (usage.context.fieldDepth && usage.context.fieldDepth > 2) {
      return 'deep nesting optimization'
    }

    if (usage.context.arrayNestingLevel && usage.context.arrayNestingLevel > 1) {
      return 'array nesting optimization'
    }

    return 'database optimization'
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new ConflictResolver instance
 */
export function createConflictResolver(): PayloadConflictResolver {
  return new PayloadConflictResolver()
}
