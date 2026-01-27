/**
 * CleanupOrchestrator - Main orchestrator for DbName cleanup optimization
 *
 * Coordinates all phases of the cleanup process:
 * 1. Discovery Phase: Scan and catalog PayloadCMS configuration files
 * 2. Analysis Phase: Evaluate each dbName usage against cleanup rules
 * 3. Validation Phase: Ensure proposed changes maintain database compatibility
 * 4. Cleanup Phase: Apply approved modifications to configuration files
 * 5. Reporting Phase: Generate comprehensive cleanup analysis
 *
 * Implements comprehensive error handling and recovery mechanisms while
 * ensuring PayloadCMS compliance throughout the process.
 */

import { promises as fs } from 'fs'
import { createConfigurationScanner } from './configuration-scanner'
import { createDbNameAnalyzer } from './dbname-analyzer'
import {
  createAnalysisError,
  createFileSystemError,
  createModificationError,
  createValidationError,
  ErrorHandler,
} from './error-handler'
import { createFileModifier } from './file-modifier'
import { DEFAULT_CLEANUP_OPTIONS } from './index'
import type {
  CleanupOptions,
  CleanupOrchestrator,
  CleanupReport,
  CleanupResult,
  CleanupSummary,
  ConfigurationScanner,
  DbNameAnalyzer,
  FileModifier,
  RuleEngine,
  SchemaValidator,
} from './interfaces'
import { createRuleEngine } from './rule-engine'
import type { CleanupChange, ConfigurationFile, DbNameValidationResult } from './types'

// ============================================================================
// Legacy Error Types (for backward compatibility)
// ============================================================================

export class CleanupError extends Error {
  constructor(
    message: string,
    public readonly phase: string,
    public readonly cause?: Error,
  ) {
    super(message)
    this.name = 'CleanupError'
  }
}

// ============================================================================
// PayloadCleanupOrchestrator Implementation
// ============================================================================

export class PayloadCleanupOrchestrator implements CleanupOrchestrator {
  private readonly configurationScanner: ConfigurationScanner
  private readonly dbNameAnalyzer: DbNameAnalyzer
  private readonly ruleEngine: RuleEngine
  private readonly schemaValidator: SchemaValidator
  private readonly fileModifier: FileModifier
  private readonly errorHandler: ErrorHandler

  constructor(
    configurationScanner?: ConfigurationScanner,
    dbNameAnalyzer?: DbNameAnalyzer,
    ruleEngine?: RuleEngine,
    schemaValidator?: SchemaValidator,
    fileModifier?: FileModifier,
  ) {
    this.configurationScanner = configurationScanner || createConfigurationScanner()
    this.dbNameAnalyzer = dbNameAnalyzer || createDbNameAnalyzer()
    this.ruleEngine = ruleEngine || createRuleEngine()
    this.schemaValidator = schemaValidator || this.createSchemaValidator()
    this.fileModifier = fileModifier || createFileModifier()
    this.errorHandler = new ErrorHandler()
  }

  /**
   * Execute the complete cleanup process for a project
   */
  async executeCleanup(projectPath: string, options: CleanupOptions = {}): Promise<CleanupResult> {
    const mergedOptions = { ...DEFAULT_CLEANUP_OPTIONS, ...options }
    this.errorHandler.clear() // Clear previous errors
    let filesProcessed = 0
    let changesApplied = 0

    try {
      // Validate project path
      await this.validateProjectPath(projectPath)

      if (mergedOptions.verbose) {
        console.log(`Starting DbName cleanup for project: ${projectPath}`)
      }

      // Phase 1: Discovery - Scan and catalog configuration files
      const configFiles = await this.executeDiscoveryPhase(projectPath, mergedOptions)
      filesProcessed = configFiles.length

      if (mergedOptions.verbose) {
        console.log(`Discovery phase completed. Found ${configFiles.length} configuration files.`)
      }

      // Phase 2: Analysis - Evaluate dbName usages
      const proposedChanges = await this.executeAnalysisPhase(configFiles, mergedOptions)

      if (mergedOptions.verbose) {
        console.log(`Analysis phase completed. Proposed ${proposedChanges.length} changes.`)
      }

      // Phase 3: Validation - Ensure database compatibility
      const validatedChanges = await this.executeValidationPhase(proposedChanges, mergedOptions)

      if (mergedOptions.verbose) {
        console.log(`Validation phase completed. ${validatedChanges.length} changes validated.`)
      }

      // Phase 4: Cleanup - Apply modifications (unless dry run)
      if (!mergedOptions.dryRun) {
        changesApplied = await this.executeCleanupPhase(validatedChanges, mergedOptions)

        if (mergedOptions.verbose) {
          console.log(`Cleanup phase completed. Applied ${changesApplied} changes.`)
        }
      } else {
        if (mergedOptions.verbose) {
          console.log('Dry run mode - no changes applied.')
        }
      }

      // Generate summary
      const summary = this.generateSummary(configFiles, validatedChanges)

      // Check for critical errors
      if (this.errorHandler.hasCriticalErrors()) {
        throw new CleanupError(
          'Critical errors encountered during cleanup process',
          'orchestration',
        )
      }

      return {
        filesProcessed,
        changesApplied: mergedOptions.dryRun ? 0 : changesApplied,
        errorsEncountered: this.errorHandler.getErrors().map((e) => e.message),
        summary,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      if (mergedOptions.verbose) {
        console.error('Cleanup failed:', error)
        console.error(this.errorHandler.generateErrorReport())
      }

      throw new CleanupError(
        `Cleanup process failed: ${errorMessage}`,
        'orchestration',
        error instanceof Error ? error : undefined,
      )
    }
  }

  /**
   * Perform a dry run of the cleanup process without making changes
   */
  async dryRun(projectPath: string, options: CleanupOptions = {}): Promise<CleanupChange[]> {
    const dryRunOptions = { ...options, dryRun: true }

    // Execute the phases needed for dry run
    const configFiles = await this.executeDiscoveryPhase(projectPath, dryRunOptions)
    const proposedChanges = await this.executeAnalysisPhase(configFiles, dryRunOptions)
    return await this.executeValidationPhase(proposedChanges, dryRunOptions)
  }

  /**
   * Generate a comprehensive report of cleanup analysis
   */
  async generateReport(projectPath: string, options: CleanupOptions = {}): Promise<CleanupReport> {
    const mergedOptions = { ...DEFAULT_CLEANUP_OPTIONS, ...options }
    this.errorHandler.clear()

    try {
      // Run analysis phases
      const configFiles = await this.executeDiscoveryPhase(projectPath, mergedOptions)
      const proposedChanges = await this.executeAnalysisPhase(configFiles, mergedOptions)
      const validatedChanges = await this.executeValidationPhase(proposedChanges, mergedOptions)

      // Generate summary and recommendations
      const summary = this.generateSummary(configFiles, validatedChanges)
      const recommendations = this.generateRecommendations(validatedChanges)
      const warnings = this.generateWarnings(validatedChanges)

      return {
        projectPath,
        timestamp: new Date().toISOString(),
        summary,
        changes: validatedChanges,
        recommendations,
        warnings,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new CleanupError(
        `Report generation failed: ${errorMessage}`,
        'reporting',
        error instanceof Error ? error : undefined,
      )
    }
  }

  // ============================================================================
  // Phase Implementation Methods
  // ============================================================================

  /**
   * Phase 1: Discovery - Scan and catalog PayloadCMS configuration files
   */
  private async executeDiscoveryPhase(
    projectPath: string,
    options: CleanupOptions,
  ): Promise<ConfigurationFile[]> {
    try {
      if (options.verbose) {
        console.log('Executing discovery phase...')
      }

      const configFiles = await this.configurationScanner.scanProject(projectPath)

      if (configFiles.length === 0) {
        this.errorHandler.addWarning('No PayloadCMS configuration files found in project', {
          phase: 'discovery',
          operation: 'scan_project',
        })
      }

      return configFiles
    } catch (error) {
      const cleanupError = createFileSystemError(
        `Discovery phase failed: ${error instanceof Error ? error.message : String(error)}`,
        projectPath,
        'scan_project',
        error instanceof Error ? error : undefined,
      )

      await this.errorHandler.handleError(cleanupError, true)
      throw cleanupError
    }
  }

  /**
   * Phase 2: Analysis - Evaluate each dbName usage against cleanup rules
   */
  private async executeAnalysisPhase(
    configFiles: ConfigurationFile[],
    options: CleanupOptions,
  ): Promise<CleanupChange[]> {
    const proposedChanges: CleanupChange[] = []

    try {
      if (options.verbose) {
        console.log('Executing analysis phase...')
      }

      for (const configFile of configFiles) {
        try {
          for (const usage of configFile.dbNameUsages) {
            const analysisResult = this.dbNameAnalyzer.analyzeUsage(usage)
            const ruleResult = this.ruleEngine.applyFieldRules(usage)

            // Determine final action based on analysis and rules
            if (analysisResult.action === 'remove' && ruleResult.shouldRemove) {
              proposedChanges.push({
                filePath: configFile.path,
                location: usage.location,
                action: 'remove',
                oldValue: usage.dbNameValue,
                impact: analysisResult.riskLevel,
              })
            } else if (analysisResult.action === 'modify' && analysisResult.suggestedValue) {
              proposedChanges.push({
                filePath: configFile.path,
                location: usage.location,
                action: 'modify',
                oldValue: usage.dbNameValue,
                newValue: analysisResult.suggestedValue,
                impact: analysisResult.riskLevel,
              })
            }
            // 'keep' action results in no change
          }
        } catch (error) {
          const analysisError = createAnalysisError(
            `Error analyzing file ${configFile.path}: ${error instanceof Error ? error.message : String(error)}`,
            configFile.path,
            'analyze_usage',
            error instanceof Error ? error : undefined,
          )

          await this.errorHandler.handleError(analysisError, true)
          // Continue with other files
        }
      }

      return proposedChanges
    } catch (error) {
      const analysisError = createAnalysisError(
        `Analysis phase failed: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        'execute_analysis_phase',
        error instanceof Error ? error : undefined,
      )

      await this.errorHandler.handleError(analysisError, false)
      throw analysisError
    }
  }

  /**
   * Phase 3: Validation - Ensure proposed changes maintain database compatibility
   */
  private async executeValidationPhase(
    proposedChanges: CleanupChange[],
    options: CleanupOptions,
  ): Promise<CleanupChange[]> {
    const validatedChanges: CleanupChange[] = []

    try {
      if (options.verbose) {
        console.log('Executing validation phase...')
      }

      // Check for conflicts across all changes
      const conflictResult = this.schemaValidator.checkForConflicts(proposedChanges)

      if (!conflictResult.isValid) {
        for (const conflict of conflictResult.conflicts) {
          const validationError = createValidationError(
            `Validation conflict: ${conflict}`,
            undefined,
            'conflict_check',
          )
          await this.errorHandler.handleError(validationError, false)
        }
        for (const warning of conflictResult.warnings) {
          this.errorHandler.addWarning(`Validation warning: ${warning}`)
        }
      }

      // Validate individual changes
      for (const change of proposedChanges) {
        try {
          const isBackwardCompatible = this.schemaValidator.ensureBackwardCompatibility(change)
          const meetsConstraints = this.schemaValidator.validateDatabaseConstraints(change)

          if (isBackwardCompatible && meetsConstraints) {
            validatedChanges.push(change)
          } else {
            const reason = !isBackwardCompatible ? 'backward compatibility' : 'database constraints'
            const validationError = createValidationError(
              `Change rejected for ${reason}: ${change.filePath}:${change.location}`,
              change.filePath,
              change.location,
            )
            await this.errorHandler.handleError(validationError, false)
          }
        } catch (error) {
          const validationError = createValidationError(
            `Error validating change ${change.filePath}:${change.location}: ${error instanceof Error ? error.message : String(error)}`,
            change.filePath,
            change.location,
            error instanceof Error ? error : undefined,
          )
          await this.errorHandler.handleError(validationError, true)
        }
      }

      return validatedChanges
    } catch (error) {
      const validationError = createValidationError(
        `Validation phase failed: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        'execute_validation_phase',
        error instanceof Error ? error : undefined,
      )

      await this.errorHandler.handleError(validationError, false)
      throw validationError
    }
  }

  /**
   * Phase 4: Cleanup - Apply approved modifications to configuration files
   */
  private async executeCleanupPhase(
    validatedChanges: CleanupChange[],
    options: CleanupOptions,
  ): Promise<number> {
    try {
      if (options.verbose) {
        console.log('Executing cleanup phase...')
      }

      const modificationResult = await this.fileModifier.applyChanges(validatedChanges)

      // Handle file modification errors
      for (const error of modificationResult.errors) {
        const modificationError = createModificationError(error, undefined, 'apply_changes')
        await this.errorHandler.handleError(modificationError, true)
      }

      if (options.verbose) {
        console.log(
          `Modified ${modificationResult.filesModified} files, ` +
            `removed ${modificationResult.propertiesRemoved} properties, ` +
            `modified ${modificationResult.propertiesModified} properties`,
        )
      }

      return modificationResult.propertiesRemoved + modificationResult.propertiesModified
    } catch (error) {
      const modificationError = createModificationError(
        `Cleanup phase failed: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        'execute_cleanup_phase',
        error instanceof Error ? error : undefined,
      )

      await this.errorHandler.handleError(modificationError, false)
      throw modificationError
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Validate that the project path exists and is accessible
   */
  private async validateProjectPath(projectPath: string): Promise<void> {
    try {
      const stats = await fs.stat(projectPath)
      if (!stats.isDirectory()) {
        throw createFileSystemError(
          `Project path is not a directory: ${projectPath}`,
          projectPath,
          'validate_path',
        )
      }
    } catch (error) {
      if (error instanceof Error && error.name.includes('FileSystemError')) {
        throw error
      }
      throw createFileSystemError(
        `Cannot access project path: ${projectPath}`,
        projectPath,
        'validate_path',
        error instanceof Error ? error : undefined,
      )
    }
  }

  /**
   * Generate cleanup summary from configuration files and changes
   */
  private generateSummary(
    configFiles: ConfigurationFile[],
    changes: CleanupChange[],
  ): CleanupSummary {
    const collectionsProcessed = configFiles.filter((f) => f.type === 'collection').length
    const fieldsProcessed = configFiles.reduce((sum, f) => sum + f.dbNameUsages.length, 0)
    const dbNamePropertiesRemoved = changes.filter((c) => c.action === 'remove').length
    const dbNamePropertiesModified = changes.filter((c) => c.action === 'modify').length

    // Strategic dbNames are those that were kept (not in changes)
    const totalDbNameUsages = fieldsProcessed
    const changesCount = changes.length
    const strategicDbNamesPreserved = totalDbNameUsages - changesCount

    return {
      collectionsProcessed,
      fieldsProcessed,
      dbNamePropertiesRemoved,
      dbNamePropertiesModified,
      strategicDbNamesPreserved,
    }
  }

  /**
   * Generate recommendations based on validated changes
   */
  private generateRecommendations(changes: CleanupChange[]): string[] {
    const recommendations: string[] = []

    if (changes.length === 0) {
      recommendations.push('No dbName cleanup changes recommended. Configuration appears optimal.')
      return recommendations
    }

    const removeCount = changes.filter((c) => c.action === 'remove').length
    const modifyCount = changes.filter((c) => c.action === 'modify').length

    if (removeCount > 0) {
      recommendations.push(
        `Remove ${removeCount} unnecessary dbName properties to reduce configuration complexity.`,
      )
    }

    if (modifyCount > 0) {
      recommendations.push(
        `Modify ${modifyCount} dbName values to improve database schema efficiency.`,
      )
    }

    const highImpactChanges = changes.filter((c) => c.impact === 'high').length
    if (highImpactChanges > 0) {
      recommendations.push(
        `${highImpactChanges} high-impact changes detected. Review carefully before applying.`,
      )
    }

    recommendations.push('Run tests after applying changes to ensure PayloadCMS functionality.')
    recommendations.push('Consider running database migrations if schema changes are significant.')

    return recommendations
  }

  /**
   * Generate warnings based on changes and error handler state
   */
  private generateWarnings(changes: CleanupChange[]): string[] {
    const warnings: string[] = [...this.errorHandler.getWarnings()]

    // Add change-based warnings
    const highRiskChanges = changes.filter((c) => c.impact === 'high').length
    if (highRiskChanges > 0) {
      warnings.push(
        `${highRiskChanges} high-risk changes proposed. Backup your project before applying.`,
      )
    }

    const mediumRiskChanges = changes.filter((c) => c.impact === 'medium').length
    if (mediumRiskChanges > 0) {
      warnings.push(`${mediumRiskChanges} medium-risk changes proposed. Test thoroughly.`)
    }

    return warnings
  }

  /**
   * Create a basic schema validator (placeholder implementation)
   * This would be replaced with a proper SchemaValidator implementation
   */
  private createSchemaValidator(): SchemaValidator {
    return {
      validateIdentifierLength: (identifier: string): boolean => {
        return identifier.length <= 63 // PostgreSQL limit
      },

      checkForConflicts: (changes: CleanupChange[]): DbNameValidationResult => {
        // Basic conflict detection - can be enhanced
        const conflicts: string[] = []
        const warnings: string[] = []
        const suggestions: string[] = []

        // Check for duplicate new values
        const newValues = changes
          .filter((c) => c.action === 'modify' && c.newValue)
          .map((c) => c.newValue!)

        const duplicates = newValues.filter((value, index) => newValues.indexOf(value) !== index)
        if (duplicates.length > 0) {
          conflicts.push(`Duplicate dbName values would be created: ${duplicates.join(', ')}`)
        }

        return {
          isValid: conflicts.length === 0,
          conflicts,
          warnings,
          suggestions,
        }
      },

      ensureBackwardCompatibility: (change: CleanupChange): boolean => {
        // Basic compatibility check - removing dbName is generally safe
        // Modifying dbName needs more careful consideration
        return change.action === 'remove' || change.impact !== 'high'
      },

      validateDatabaseConstraints: (change: CleanupChange): boolean => {
        // Basic constraint validation
        if (change.action === 'modify' && change.newValue) {
          return this.createSchemaValidator().validateIdentifierLength(change.newValue)
        }
        return true
      },
    }
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new CleanupOrchestrator instance with default components
 */
export function createCleanupOrchestrator(
  configurationScanner?: ConfigurationScanner,
  dbNameAnalyzer?: DbNameAnalyzer,
  ruleEngine?: RuleEngine,
  schemaValidator?: SchemaValidator,
  fileModifier?: FileModifier,
): CleanupOrchestrator {
  return new PayloadCleanupOrchestrator(
    configurationScanner,
    dbNameAnalyzer,
    ruleEngine,
    schemaValidator,
    fileModifier,
  )
}

/**
 * Default CleanupOrchestrator instance
 */
export const cleanupOrchestrator = createCleanupOrchestrator()
