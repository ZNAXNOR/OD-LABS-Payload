/**
 * DbName Cleanup Optimization System
 *
 * This module provides a comprehensive system for analyzing and cleaning up
 * excessive dbName usage in PayloadCMS projects. It follows PayloadCMS best
 * practices and ensures database schema compatibility while reducing
 * configuration complexity and maintenance overhead.
 *
 * @author PayloadCMS DbName Cleanup System
 * @version 1.0.0
 */

// ============================================================================
// Core Types and Interfaces
// ============================================================================

export type {
  // Analysis Types
  AnalysisResult,
  CleanupChange,
  // Cleanup Rules
  CleanupRules,
  CollectionConfig,
  CollectionRule,
  // Configuration Types
  ConfigurationFile,
  DbNameUsage,
  // Validation Types
  DbNameValidationResult,
  FieldConfig,
  FieldContext,
  FieldRule,
  // Field Type Registry
  FieldTypeInfo,
  GlobalConfig,
  // File Modification Types
  ModificationResult,
  RuleResult,
  ValidationRule,
} from './types'

// ============================================================================
// Component Interfaces
// ============================================================================

export type {
  // Supporting Types
  CleanupOptions,
  CleanupOrchestrator,
  CleanupReport,
  CleanupResult,
  CleanupSummary,
  // Core Component Interfaces
  ConfigurationScanner,
  DbNameAnalyzer,
  FileModifier,
  RuleEngine,
  SchemaValidator,
} from './interfaces'

// ============================================================================
// Component Implementations
// ============================================================================

export {
  CleanupError,
  cleanupOrchestrator,
  createCleanupOrchestrator,
  PayloadCleanupOrchestrator,
} from './cleanup-orchestrator'
export { createConfigurationScanner, PayloadConfigurationScanner } from './configuration-scanner'
export { createDbNameAnalyzer, PayloadDbNameAnalyzer } from './dbname-analyzer'
export { createDbNameUsageExtractor, DbNameUsageExtractor } from './dbname-usage-extractor'
export type { EnhancedDbNameUsage, EnhancedFieldContext } from './dbname-usage-extractor'
export { createFileModifier, fileModifier, PayloadFileModifier } from './file-modifier'
export {
  createInvalidDbNameRemover,
  InvalidDbNameRemover,
  invalidDbNameRemover,
} from './invalid-dbname-remover'
export type { InvalidDbNameLogEntry, InvalidDbNameRemovalResult } from './invalid-dbname-remover'
export { createRuleEngine, PayloadRuleEngine } from './rule-engine'

// ============================================================================
// Error Handling
// ============================================================================

export {
  createAnalysisError,
  createConfigurationError,
  createFileSystemError,
  createModificationError,
  createValidationError,
  ErrorCategory,
  ErrorHandler,
  ErrorSeverity,
  globalErrorHandler,
} from './error-handler'
export type {
  AnalysisError,
  BaseCleanupError,
  CleanupErrorDetails,
  ConfigurationParsingError,
  ErrorContext,
  FileSystemError,
  ModificationError,
  RecoveryAction,
  ValidationError,
} from './error-handler'

// Import CleanupOptions for use in constants
import type { CleanupOptions } from './interfaces'

// ============================================================================
// Field Type Registry
// ============================================================================

export { FIELD_TYPE_REGISTRY, FieldTypeRegistry } from './field-type-registry'

// ============================================================================
// Constants and Utilities
// ============================================================================

/**
 * PostgreSQL identifier length limit (63 characters)
 */
export const DBNAME_POSTGRES_IDENTIFIER_LIMIT = 63

/**
 * Default nesting level threshold for strategic dbName preservation
 */
export const DEFAULT_NESTING_THRESHOLD = 3

/**
 * Default cleanup options
 */
export const DEFAULT_CLEANUP_OPTIONS: CleanupOptions = {
  dryRun: false,
  verbose: false,
  preserveStrategic: true,
  maxIdentifierLength: DBNAME_POSTGRES_IDENTIFIER_LIMIT,
  excludePatterns: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
  includePatterns: ['**/*.ts', '**/*.js'],
}

/**
 * Common file patterns for PayloadCMS configuration files
 */
export const PAYLOAD_CONFIG_PATTERNS = [
  '**/collections/**/*.ts',
  '**/collections/**/*.js',
  '**/globals/**/*.ts',
  '**/globals/**/*.js',
  '**/fields/**/*.ts',
  '**/fields/**/*.js',
  'payload.config.ts',
  'payload.config.js',
]

/**
 * Utility function to check if a string is a valid database identifier
 */
export function isValidDatabaseIdentifier(identifier: string): boolean {
  // Check length
  if (identifier.length > DBNAME_POSTGRES_IDENTIFIER_LIMIT) {
    return false
  }

  // Check format (must start with letter or underscore, contain only alphanumeric and underscores)
  const validIdentifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
  return validIdentifierRegex.test(identifier)
}

/**
 * Utility function to generate a shortened identifier while preserving meaning
 */
export function generateShortIdentifier(
  original: string,
  maxLength: number = DBNAME_POSTGRES_IDENTIFIER_LIMIT,
): string {
  if (original.length <= maxLength) {
    return original
  }

  // Simple truncation strategy - can be enhanced with more sophisticated algorithms
  return original.substring(0, maxLength - 3) + '_id'
}

/**
 * Utility function to calculate nesting level from field path
 */
export function calculateNestingLevel(fieldPath: string): number {
  return fieldPath.split('.').length - 1
}

/**
 * Utility function to extract collection slug from file path
 */
export function extractCollectionSlug(filePath: string): string {
  const pathParts = filePath.split('/')
  const collectionsIndex = pathParts.findIndex((part) => part === 'collections')

  if (collectionsIndex !== -1 && collectionsIndex + 1 < pathParts.length) {
    const collectionSlug = pathParts[collectionsIndex + 1]
    if (collectionSlug) {
      return collectionSlug
    }
  }

  // Fallback: use filename without extension
  const filename = pathParts[pathParts.length - 1]
  if (filename) {
    return filename.replace(/\.(ts|js)$/, '')
  }

  // Final fallback
  return 'unknown'
}
