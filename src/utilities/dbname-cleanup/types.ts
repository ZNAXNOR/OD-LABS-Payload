/**
 * Core TypeScript interfaces for DbName cleanup optimization system
 * Defines data models for configuration scanning, analysis, and cleanup operations
 */

// ============================================================================
// Configuration File Types
// ============================================================================

export interface ConfigurationFile {
  path: string
  type: 'collection' | 'global' | 'field'
  config: any
  dbNameUsages: DbNameUsage[]
}

export interface DbNameUsage {
  location: string // JSON path to the dbName property
  fieldName: string
  dbNameValue: string
  fieldType: string
  nestingLevel: number
  context: FieldContext
}

export interface FieldContext {
  parentFields: string[]
  collectionSlug: string
  isNested: boolean
  fullPath: string
  identifierPath?: string
  estimatedDatabaseName?: string
  wouldExceedLimit?: boolean
  parentFieldTypes?: string[]
  fieldDepth?: number
  isInArray?: boolean
  isInGroup?: boolean
  isInBlocks?: boolean
  arrayNestingLevel?: number
  groupNestingLevel?: number
  blocksNestingLevel?: number
}

// ============================================================================
// Analysis Types
// ============================================================================

export interface AnalysisResult {
  action: 'remove' | 'keep' | 'modify'
  reason: string
  riskLevel: 'low' | 'medium' | 'high'
  suggestedValue?: string
}

export interface RuleResult {
  shouldRemove: boolean
  shouldKeep: boolean
  reason: string
  confidence: number
}

// ============================================================================
// Validation Types
// ============================================================================

export interface DbNameValidationResult {
  isValid: boolean
  conflicts: string[]
  warnings: string[]
  suggestions: string[]
}

export interface CleanupChange {
  filePath: string
  location: string
  action: 'remove' | 'modify'
  oldValue: string
  newValue?: string
  impact: 'low' | 'medium' | 'high'
}

// ============================================================================
// File Modification Types
// ============================================================================

export interface ModificationResult {
  filesModified: number
  propertiesRemoved: number
  propertiesModified: number
  errors: string[]
}

// ============================================================================
// PayloadCMS Field Type Registry
// ============================================================================

export interface FieldTypeInfo {
  name: string
  supportsDbName: boolean
  affectsDatabase: boolean
  canBeNested: boolean
  identifierImpact: 'none' | 'low' | 'medium' | 'high'
}

// ============================================================================
// Cleanup Rules Configuration
// ============================================================================

export interface CleanupRules {
  collectionLevel: CollectionRule[]
  fieldLevel: FieldRule[]
  validation: ValidationRule[]
}

export interface CollectionRule {
  name: string
  condition: (usage: DbNameUsage) => boolean
  action: 'remove' | 'keep'
  reason: string
}

export interface FieldRule {
  name: string
  fieldTypes: string[]
  condition: (usage: DbNameUsage) => boolean
  action: 'remove' | 'keep' | 'modify'
  reason: string
}

export interface ValidationRule {
  name: string
  check: (usage: DbNameUsage) => boolean
  severity: 'error' | 'warning'
  message: string
}

// ============================================================================
// PayloadCMS Configuration Types
// ============================================================================

export interface CollectionConfig {
  slug: string
  dbName?: string
  fields: FieldConfig[]
  [key: string]: any
}

export interface GlobalConfig {
  slug: string
  dbName?: string
  fields: FieldConfig[]
  [key: string]: any
}

export interface FieldConfig {
  name: string
  type: string
  dbName?: string
  fields?: FieldConfig[]
  [key: string]: any
}
