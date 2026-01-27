/**
 * Schema Validator for DbName Cleanup Optimization
 *
 * Validates that cleanup changes maintain database compatibility by checking
 * identifier length limits, naming conflicts, backward compatibility, and
 * database constraints according to PostgreSQL standards.
 *
 * @author PayloadCMS DbName Cleanup System
 * @version 1.0.0
 */

import { DBNAME_POSTGRES_IDENTIFIER_LIMIT, isValidDatabaseIdentifier } from './index'
import type { SchemaValidator } from './interfaces'
import type { CleanupChange, DbNameUsage, DbNameValidationResult, FieldContext } from './types'

// ============================================================================
// Schema Validator Implementation
// ============================================================================

export class PayloadSchemaValidator implements SchemaValidator {
  private readonly maxIdentifierLength: number
  private readonly reservedKeywords: Set<string>

  constructor(maxIdentifierLength: number = DBNAME_POSTGRES_IDENTIFIER_LIMIT) {
    this.maxIdentifierLength = maxIdentifierLength
    this.reservedKeywords = new Set([
      // PostgreSQL reserved keywords that could cause conflicts
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
  }

  /**
   * Validate that a database identifier doesn't exceed length limits
   */
  validateIdentifierLength(identifier: string): boolean {
    if (!identifier || typeof identifier !== 'string') {
      return false
    }

    // Check length constraint
    if (identifier.length > this.maxIdentifierLength) {
      return false
    }

    // Check format validity
    return isValidDatabaseIdentifier(identifier)
  }

  /**
   * Check for naming conflicts in proposed cleanup changes
   */
  checkForConflicts(changes: CleanupChange[]): DbNameValidationResult {
    const result: DbNameValidationResult = {
      isValid: true,
      conflicts: [],
      warnings: [],
      suggestions: [],
    }

    // Group changes by file path for analysis
    const changesByFile = this.groupChangesByFile(changes)

    // Check for conflicts within each file
    for (const [filePath, fileChanges] of changesByFile.entries()) {
      const fileConflicts = this.checkFileConflicts(filePath, fileChanges)
      result.conflicts.push(...fileConflicts.conflicts)
      result.warnings.push(...fileConflicts.warnings)
      result.suggestions.push(...fileConflicts.suggestions)
    }

    // Check for cross-file conflicts
    const crossFileConflicts = this.checkCrossFileConflicts(changesByFile)
    result.conflicts.push(...crossFileConflicts.conflicts)
    result.warnings.push(...crossFileConflicts.warnings)
    result.suggestions.push(...crossFileConflicts.suggestions)

    // Set overall validity
    result.isValid = result.conflicts.length === 0

    return result
  }

  /**
   * Ensure that a cleanup change maintains backward compatibility
   */
  ensureBackwardCompatibility(change: CleanupChange): boolean {
    // Removing dbName is generally backward compatible since PayloadCMS
    // will fall back to using the field name as the database column name
    if (change.action === 'remove') {
      return this.validateRemovalCompatibility(change)
    }

    // Modifying dbName requires careful validation
    if (change.action === 'modify' && change.newValue) {
      return this.validateModificationCompatibility(change)
    }

    return false
  }

  /**
   * Validate that a cleanup change meets database constraints
   */
  validateDatabaseConstraints(change: CleanupChange): boolean {
    // For removal, validate that the resulting field name is valid
    if (change.action === 'remove') {
      const fieldName = this.extractFieldNameFromLocation(change.location)
      return (
        this.validateIdentifierLength(fieldName) &&
        !this.reservedKeywords.has(fieldName.toLowerCase())
      )
    }

    // For modification, validate the new value
    if (change.action === 'modify' && change.newValue) {
      return (
        this.validateIdentifierLength(change.newValue) &&
        !this.reservedKeywords.has(change.newValue.toLowerCase())
      )
    }

    return false
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Group cleanup changes by file path for organized analysis
   */
  private groupChangesByFile(changes: CleanupChange[]): Map<string, CleanupChange[]> {
    const grouped = new Map<string, CleanupChange[]>()

    for (const change of changes) {
      const existing = grouped.get(change.filePath) || []
      existing.push(change)
      grouped.set(change.filePath, existing)
    }

    return grouped
  }

  /**
   * Check for conflicts within a single file
   */
  private checkFileConflicts(filePath: string, changes: CleanupChange[]): DbNameValidationResult {
    const result: DbNameValidationResult = {
      isValid: true,
      conflicts: [],
      warnings: [],
      suggestions: [],
    }

    // Track resulting database names after changes
    const resultingNames = new Set<string>()
    const duplicateNames = new Set<string>()

    for (const change of changes) {
      let resultingName: string

      if (change.action === 'remove') {
        // After removal, field name becomes the database name
        resultingName = this.extractFieldNameFromLocation(change.location)
      } else if (change.action === 'modify' && change.newValue) {
        // After modification, new value becomes the database name
        resultingName = change.newValue
      } else {
        continue
      }

      // Check for duplicates
      if (resultingNames.has(resultingName)) {
        duplicateNames.add(resultingName)
        result.conflicts.push(
          `Duplicate database name '${resultingName}' would be created in ${filePath}`,
        )
      } else {
        resultingNames.add(resultingName)
      }

      // Check identifier length
      if (!this.validateIdentifierLength(resultingName)) {
        result.conflicts.push(
          `Invalid database identifier '${resultingName}' in ${filePath} (length: ${resultingName.length}/${this.maxIdentifierLength})`,
        )
      }

      // Check reserved keywords
      if (this.reservedKeywords.has(resultingName.toLowerCase())) {
        result.warnings.push(
          `Database name '${resultingName}' in ${filePath} conflicts with reserved keyword`,
        )
        result.suggestions.push(
          `Consider using a different name for '${resultingName}' to avoid reserved keyword conflicts`,
        )
      }
    }

    // Provide suggestions for duplicate names
    for (const duplicateName of duplicateNames) {
      result.suggestions.push(
        `Resolve duplicate database name '${duplicateName}' by using unique dbName values or field names`,
      )
    }

    result.isValid = result.conflicts.length === 0

    return result
  }

  /**
   * Check for conflicts across multiple files
   */
  private checkCrossFileConflicts(
    changesByFile: Map<string, CleanupChange[]>,
  ): DbNameValidationResult {
    const result: DbNameValidationResult = {
      isValid: true,
      conflicts: [],
      warnings: [],
      suggestions: [],
    }

    // For cross-file conflicts, we mainly check for collection-level naming issues
    const collectionNames = new Set<string>()
    const duplicateCollections = new Set<string>()

    for (const [filePath, changes] of changesByFile.entries()) {
      // Extract collection name from file path
      const collectionName = this.extractCollectionFromPath(filePath)

      if (collectionName && collectionNames.has(collectionName)) {
        duplicateCollections.add(collectionName)
        result.warnings.push(
          `Multiple files affect collection '${collectionName}' - ensure consistency`,
        )
      } else if (collectionName) {
        collectionNames.add(collectionName)
      }
    }

    // Provide suggestions for cross-file consistency
    if (duplicateCollections.size > 0) {
      result.suggestions.push(
        'Review changes across related files to ensure consistent dbName patterns',
      )
    }

    return result
  }

  /**
   * Validate that removing a dbName property maintains compatibility
   */
  private validateRemovalCompatibility(change: CleanupChange): boolean {
    const fieldName = this.extractFieldNameFromLocation(change.location)

    // Field name must be a valid database identifier
    if (!this.validateIdentifierLength(fieldName)) {
      return false
    }

    // Field name should not conflict with reserved keywords
    if (this.reservedKeywords.has(fieldName.toLowerCase())) {
      return false
    }

    // Additional checks could be added here for specific field types
    // or collection-specific constraints

    return true
  }

  /**
   * Validate that modifying a dbName property maintains compatibility
   */
  private validateModificationCompatibility(change: CleanupChange): boolean {
    if (!change.newValue) {
      return false
    }

    // New value must be a valid database identifier
    if (!this.validateIdentifierLength(change.newValue)) {
      return false
    }

    // New value should not conflict with reserved keywords
    if (this.reservedKeywords.has(change.newValue.toLowerCase())) {
      return false
    }

    // New value should be meaningfully different from old value
    if (change.newValue === change.oldValue) {
      return false
    }

    return true
  }

  /**
   * Extract field name from a JSON path location
   */
  private extractFieldNameFromLocation(location: string): string {
    // Location format: "fields[0].name" or "fields.fieldName.dbName"
    const parts = location.split('.')

    // Look for the field name in the path
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]

      // Handle array notation: fields[0]
      if (part.includes('[') && part.includes(']')) {
        const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/)
        if (arrayMatch && arrayMatch[1] === 'fields') {
          // This is a field array index, the name should be in the next part
          if (i + 1 < parts.length && parts[i + 1] === 'name') {
            // We need to look at the actual field configuration to get the name
            // For now, return a placeholder that indicates we need more context
            return 'field_name_unknown'
          }
        }
      }

      // Handle direct field reference
      if (part === 'fields' && i + 1 < parts.length) {
        const nextPart = parts[i + 1]
        if (nextPart !== 'dbName' && !nextPart.includes('[')) {
          return nextPart
        }
      }
    }

    // Fallback: try to extract from the end of the path
    const lastPart = parts[parts.length - 2] // -2 because last part is usually 'dbName'
    return lastPart || 'unknown_field'
  }

  /**
   * Extract collection name from file path
   */
  private extractCollectionFromPath(filePath: string): string | null {
    const pathParts = filePath.split('/')
    const collectionsIndex = pathParts.findIndex((part) => part === 'collections')

    if (collectionsIndex !== -1 && collectionsIndex + 1 < pathParts.length) {
      return pathParts[collectionsIndex + 1]
    }

    // Check if this is a collection config file
    const fileName = pathParts[pathParts.length - 1]
    if (fileName && (fileName.includes('collection') || fileName.includes('config'))) {
      return fileName.replace(/\.(ts|js)$/, '').replace(/[-_]?(config|collection)[-_]?/gi, '')
    }

    return null
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new SchemaValidator instance with optional configuration
 */
export function createSchemaValidator(
  maxIdentifierLength: number = DBNAME_POSTGRES_IDENTIFIER_LIMIT,
): SchemaValidator {
  return new PayloadSchemaValidator(maxIdentifierLength)
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Utility function to validate a single dbName usage against schema constraints
 */
export function validateDbNameUsage(
  usage: DbNameUsage,
  maxLength: number = DBNAME_POSTGRES_IDENTIFIER_LIMIT,
): DbNameValidationResult {
  const validator = createSchemaValidator(maxLength)
  const result: DbNameValidationResult = {
    isValid: true,
    conflicts: [],
    warnings: [],
    suggestions: [],
  }

  // Validate the current dbName value
  if (usage.dbNameValue && !validator.validateIdentifierLength(usage.dbNameValue)) {
    result.isValid = false
    result.conflicts.push(
      `DbName '${usage.dbNameValue}' exceeds maximum length of ${maxLength} characters`,
    )
  }

  // Validate the field name as fallback
  if (!validator.validateIdentifierLength(usage.fieldName)) {
    result.warnings.push(
      `Field name '${usage.fieldName}' would be invalid as database identifier if dbName is removed`,
    )
    result.suggestions.push(
      `Consider keeping dbName for field '${usage.fieldName}' or renaming the field`,
    )
  }

  // Check for potential identifier length issues with nesting
  if (usage.context.estimatedDatabaseName) {
    const estimatedLength = usage.context.estimatedDatabaseName.length
    if (estimatedLength > maxLength) {
      result.warnings.push(
        `Estimated database name '${usage.context.estimatedDatabaseName}' (${estimatedLength} chars) may exceed limits`,
      )
      result.suggestions.push(
        `Consider preserving strategic dbName for deeply nested field '${usage.fieldName}'`,
      )
    }
  }

  return result
}

/**
 * Utility function to check if a field context indicates potential schema issues
 */
export function hasSchemaRisks(context: FieldContext): boolean {
  // High nesting level increases schema complexity
  if (context.fieldDepth && context.fieldDepth > 3) {
    return true
  }

  // Multiple array nesting levels create complex identifiers
  if (context.arrayNestingLevel && context.arrayNestingLevel > 2) {
    return true
  }

  // Estimated database name exceeding limits
  if (context.wouldExceedLimit) {
    return true
  }

  // Complex parent field types
  if (context.parentFieldTypes?.some((type) => ['blocks', 'array', 'group'].includes(type))) {
    return true
  }

  return false
}
