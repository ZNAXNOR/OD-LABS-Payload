/**
 * Core interfaces for the DbName cleanup optimization system components
 * Defines the contracts for configuration scanning, analysis, validation, and modification
 */

import type {
  AnalysisResult,
  CleanupChange,
  CollectionConfig,
  ConfigurationFile,
  DbNameUsage,
  DbNameValidationResult,
  GlobalConfig,
  ModificationResult,
  RuleResult,
} from './types'

// ============================================================================
// Configuration Scanner Interface
// ============================================================================

/**
 * Responsible for discovering and parsing PayloadCMS configuration files
 */
export interface ConfigurationScanner {
  /**
   * Scan a project directory for PayloadCMS configuration files
   * @param rootPath - Root directory path to scan
   * @returns Promise resolving to array of configuration files
   */
  scanProject(rootPath: string): Promise<ConfigurationFile[]>

  /**
   * Parse a collection configuration file
   * @param filePath - Path to the collection config file
   * @returns Promise resolving to parsed collection configuration
   */
  parseCollectionConfig(filePath: string): Promise<CollectionConfig>

  /**
   * Parse a global configuration file
   * @param filePath - Path to the global config file
   * @returns Promise resolving to parsed global configuration
   */
  parseGlobalConfig(filePath: string): Promise<GlobalConfig>

  /**
   * Extract dbName usages from a configuration object
   * @param config - Configuration object to analyze
   * @param filePath - Path to the configuration file
   * @returns Array of dbName usages found
   */
  extractDbNameUsages(config: any, filePath: string): DbNameUsage[]
}

// ============================================================================
// DbName Analyzer Interface
// ============================================================================

/**
 * Core analysis engine that evaluates dbName usage patterns
 */
export interface DbNameAnalyzer {
  /**
   * Analyze a specific dbName usage and determine recommended action
   * @param usage - DbName usage to analyze
   * @returns Analysis result with recommended action and reasoning
   */
  analyzeUsage(usage: DbNameUsage): AnalysisResult

  /**
   * Evaluate whether a dbName usage provides strategic value
   * @param usage - DbName usage to evaluate
   * @returns True if the dbName provides strategic value, false otherwise
   */
  evaluateStrategicValue(usage: DbNameUsage): boolean

  /**
   * Check if a field type supports dbName property
   * @param fieldType - PayloadCMS field type to check
   * @returns True if field type supports dbName, false otherwise
   */
  checkFieldTypeSupport(fieldType: string): boolean

  /**
   * Calculate the full database identifier length for a field
   * @param usage - DbName usage to calculate identifier length for
   * @returns Estimated database identifier length
   */
  calculateIdentifierLength(usage: DbNameUsage): number
}

// ============================================================================
// Rule Engine Interface
// ============================================================================

/**
 * Implements cleanup rules based on PayloadCMS best practices
 */
export interface RuleEngine {
  /**
   * Apply collection-level cleanup rules
   * @param usage - DbName usage at collection level
   * @returns Rule evaluation result
   */
  applyCollectionRules(usage: DbNameUsage): RuleResult

  /**
   * Apply field-level cleanup rules
   * @param usage - DbName usage at field level
   * @returns Rule evaluation result
   */
  applyFieldRules(usage: DbNameUsage): RuleResult

  /**
   * Apply validation rules to ensure database compatibility
   * @param usage - DbName usage to validate
   * @returns Rule evaluation result
   */
  applyValidationRules(usage: DbNameUsage): RuleResult

  /**
   * Check if a field type is compatible with dbName property
   * @param fieldType - PayloadCMS field type to check
   * @returns True if compatible, false otherwise
   */
  checkFieldTypeCompatibility(fieldType: string): boolean
}

// ============================================================================
// Schema Validator Interface
// ============================================================================

/**
 * Validates that cleanup changes maintain database compatibility
 */
export interface SchemaValidator {
  /**
   * Validate that a database identifier doesn't exceed length limits
   * @param identifier - Database identifier to validate
   * @returns True if identifier is valid, false otherwise
   */
  validateIdentifierLength(identifier: string): boolean

  /**
   * Check for naming conflicts in proposed cleanup changes
   * @param changes - Array of cleanup changes to validate
   * @returns Validation result with conflicts and warnings
   */
  checkForConflicts(changes: CleanupChange[]): DbNameValidationResult

  /**
   * Ensure that a cleanup change maintains backward compatibility
   * @param change - Cleanup change to validate
   * @returns True if change is backward compatible, false otherwise
   */
  ensureBackwardCompatibility(change: CleanupChange): boolean

  /**
   * Validate that a cleanup change meets database constraints
   * @param change - Cleanup change to validate
   * @returns True if change meets constraints, false otherwise
   */
  validateDatabaseConstraints(change: CleanupChange): boolean
}

// ============================================================================
// File Modifier Interface
// ============================================================================

/**
 * Handles safe modification of configuration files
 */
export interface FileModifier {
  /**
   * Apply an array of cleanup changes to configuration files
   * @param changes - Array of changes to apply
   * @returns Promise resolving to modification result summary
   */
  applyChanges(changes: CleanupChange[]): Promise<ModificationResult>

  /**
   * Remove a dbName property from a configuration file
   * @param filePath - Path to the configuration file
   * @param location - JSON path location of the dbName property
   * @returns Promise that resolves when removal is complete
   */
  removeDbNameProperty(filePath: string, location: string): Promise<void>

  /**
   * Modify a dbName value in a configuration file
   * @param filePath - Path to the configuration file
   * @param location - JSON path location of the dbName property
   * @param newValue - New value for the dbName property
   * @returns Promise that resolves when modification is complete
   */
  modifyDbNameValue(filePath: string, location: string, newValue: string): Promise<void>

  /**
   * Preserve existing file formatting and structure during modifications
   * @param filePath - Path to the configuration file
   * @returns Promise that resolves when formatting is preserved
   */
  preserveFormatting(filePath: string): Promise<void>
}

// ============================================================================
// Cleanup Orchestrator Interface
// ============================================================================

/**
 * Main orchestrator that coordinates all cleanup phases
 */
export interface CleanupOrchestrator {
  /**
   * Execute the complete cleanup process for a project
   * @param projectPath - Root path of the PayloadCMS project
   * @param options - Cleanup options and configuration
   * @returns Promise resolving to cleanup results
   */
  executeCleanup(projectPath: string, options?: CleanupOptions): Promise<CleanupResult>

  /**
   * Perform a dry run of the cleanup process without making changes
   * @param projectPath - Root path of the PayloadCMS project
   * @param options - Cleanup options and configuration
   * @returns Promise resolving to proposed changes
   */
  dryRun(projectPath: string, options?: CleanupOptions): Promise<CleanupChange[]>

  /**
   * Generate a comprehensive report of cleanup analysis
   * @param projectPath - Root path of the PayloadCMS project
   * @param options - Cleanup options and configuration
   * @returns Promise resolving to cleanup report
   */
  generateReport(projectPath: string, options?: CleanupOptions): Promise<CleanupReport>
}

// ============================================================================
// Supporting Types for Interfaces
// ============================================================================

export interface CleanupOptions {
  dryRun?: boolean
  verbose?: boolean
  preserveStrategic?: boolean
  maxIdentifierLength?: number
  excludePatterns?: string[]
  includePatterns?: string[]
}

export interface CleanupResult {
  filesProcessed: number
  changesApplied: number
  errorsEncountered: string[]
  summary: CleanupSummary
}

export interface CleanupSummary {
  collectionsProcessed: number
  fieldsProcessed: number
  dbNamePropertiesRemoved: number
  dbNamePropertiesModified: number
  strategicDbNamesPreserved: number
}

export interface CleanupReport {
  projectPath: string
  timestamp: string
  summary: CleanupSummary
  changes: CleanupChange[]
  recommendations: string[]
  warnings: string[]
}
