/**
 * Analysis Orchestrator
 * Main orchestrator that coordinates all analyzers and manages the analysis workflow
 * Implements parallel execution, result aggregation, and progress reporting
 * Requirements: All requirements (orchestration)
 */

import type {
  AnalysisOptions,
  AnalysisResult,
  BlockAnalysisResult,
  ComponentAnalysisResult,
  IntegrationResult,
  PatternComparisonResult,
  TestGenerationResult,
  Report,
  Block,
  Component,
} from '../types'
import { BlockAnalyzer } from './BlockAnalyzer'
import { ComponentAnalyzer } from './ComponentAnalyzer'
import { IntegrationValidator } from './IntegrationValidator'
import { PatternComparator } from './PatternComparator'
import { TestGenerator } from '../generators/TestGenerator'
import { ReportGenerator } from '../generators/ReportGenerator'
import { BlockConfigParser } from './BlockConfigParser'
import { ComponentParser } from './ComponentParser'
// import { PathResolver } from '../config/paths' // Unused - commented out
import * as fs from 'fs'
import * as path from 'path'

export interface ProgressCallback {
  (phase: string, current: number, total: number, message?: string): void
}

export interface OrchestratorConfig {
  githubToken?: string
  cacheDir?: string
  cacheTTL?: number
  onProgress?: ProgressCallback
  enableCache?: boolean
  continueOnError?: boolean
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  fileHash: string
}

interface AnalysisError {
  phase: string
  file: string
  error: Error
  timestamp: Date
}

export class AnalysisOrchestrator {
  private blockAnalyzer: BlockAnalyzer
  private componentAnalyzer: ComponentAnalyzer
  private integrationValidator: IntegrationValidator
  private patternComparator: PatternComparator
  private testGenerator: TestGenerator
  private reportGenerator: ReportGenerator
  private blockParser: BlockConfigParser
  private componentParser: ComponentParser
  private config: OrchestratorConfig
  // private pathResolver: PathResolver // Unused - commented out

  // In-memory cache for analysis results
  private blockCache: Map<string, CacheEntry<BlockAnalysisResult>> = new Map()
  private componentCache: Map<string, CacheEntry<ComponentAnalysisResult>> = new Map()

  // File modification tracking
  private fileModTimes: Map<string, number> = new Map()

  // Error tracking
  private errors: AnalysisError[] = []

  constructor(config: OrchestratorConfig = {}) {
    this.config = {
      enableCache: true,
      cacheTTL: 3600000, // 1 hour default
      continueOnError: true, // Continue analysis even if individual files fail
      ...config,
    }
    this.blockAnalyzer = new BlockAnalyzer()
    this.componentAnalyzer = new ComponentAnalyzer()
    this.integrationValidator = new IntegrationValidator()
    this.patternComparator = new PatternComparator({
      githubToken: config.githubToken,
      cacheDir: config.cacheDir,
      cacheTTL: config.cacheTTL,
    })
    this.testGenerator = new TestGenerator()
    this.reportGenerator = new ReportGenerator()
    this.blockParser = new BlockConfigParser()
    this.componentParser = new ComponentParser()
    // this.pathResolver = new PathResolver() // Commented out - property doesn't exist

    // Load cache from disk if cache directory is specified
    if (this.config.cacheDir && this.config.enableCache) {
      this.loadCacheFromDisk()
    }
  }

  /**
   * Main analysis entry point
   * Coordinates all analyzers and generates comprehensive report
   */
  async analyze(options: AnalysisOptions): Promise<AnalysisResult> {
    try {
      this.reportProgress('initialization', 0, 1, 'Starting analysis...')

      // Phase 1: Discover files
      this.reportProgress('discovery', 0, 1, 'Discovering files...')
      const blockPaths = await this.discoverBlockFiles(options.blockDir)
      const componentPaths = await this.discoverComponentFiles(options.componentDir)

      this.reportProgress(
        'discovery',
        1,
        1,
        `Found ${blockPaths.length} blocks and ${componentPaths.length} components`,
      )

      // Phase 2: Analyze blocks (parallel)
      this.reportProgress('blocks', 0, blockPaths.length, 'Analyzing blocks...')
      const blocks = await this.analyzeBlocks(blockPaths)

      // Phase 3: Analyze components (parallel)
      this.reportProgress('components', 0, componentPaths.length, 'Analyzing components...')
      const components = await this.analyzeComponents(componentPaths)

      // Phase 4: Validate integration
      this.reportProgress('integration', 0, 1, 'Validating block-component integration...')
      const integration = await this.validateIntegration(blocks, components)

      // Phase 5: Compare patterns (if enabled)
      let patterns: PatternComparisonResult[] = []
      if (options.compareOfficial) {
        this.reportProgress('patterns', 0, 1, 'Comparing against official patterns...')
        patterns = await this.comparePatterns(blocks)
      }

      // Phase 6: Generate tests (if enabled)
      let tests: TestGenerationResult = {
        blockTests: [],
        componentTests: [],
        integrationTests: [],
        propertyTests: [],
        accessibilityTests: [],
      }
      if (options.includeTests) {
        this.reportProgress('tests', 0, 1, 'Generating test suites...')
        tests = await this.generateTests(blocks, components, integration)
      }

      // Phase 7: Generate report
      this.reportProgress('report', 0, 1, 'Generating analysis report...')
      const report = await this.generateReport(blocks, components, integration, patterns)

      this.reportProgress('complete', 1, 1, 'Analysis complete!')

      return {
        blocks,
        components,
        integration: {
          blockSlug: 'all',
          componentName: 'all',
          isValid: integration.every((r) => r.isValid),
          issues: integration.flatMap((r) => r.issues),
          suggestions: integration.flatMap((r) => r.suggestions),
        },
        patterns: {
          blockSlug: 'all',
          structuralDifferences: patterns.flatMap((p) => p.structuralDifferences),
          featureDifferences: patterns.flatMap((p) => p.featureDifferences),
          organizationDifferences: patterns.flatMap((p) => p.organizationDifferences),
        },
        tests,
        report,
      }
    } catch (error) {
      this.reportProgress('error', 0, 1, `Analysis failed: ${(error as Error).message}`)
      throw error
    }
  }

  /**
   * Analyze all blocks in parallel
   */
  async analyzeBlocks(blockPaths: string[]): Promise<BlockAnalysisResult[]> {
    const results: BlockAnalysisResult[] = []

    // Analyze blocks in parallel with concurrency limit
    const concurrency = 5
    for (let i = 0; i < blockPaths.length; i += concurrency) {
      const batch = blockPaths.slice(i, i + concurrency)

      const batchResults = await Promise.all(
        batch.map(async (blockPath) => {
          try {
            // Check cache first (if enabled)
            if (this.config.enableCache) {
              const cached = await this.getCachedBlockResult(blockPath)
              if (cached) {
                this.reportProgress(
                  'blocks',
                  i + batch.indexOf(blockPath) + 1,
                  blockPaths.length,
                  `Using cached result for ${blockPath}`,
                )
                return cached
              }
            }

            // Analyze block
            const result = await this.blockAnalyzer.analyzeBlock(blockPath)

            // Cache result (if enabled)
            if (this.config.enableCache) {
              await this.cacheBlockResult(blockPath, result)
            }

            this.reportProgress('blocks', i + batch.indexOf(blockPath) + 1, blockPaths.length)

            return result
          } catch (error) {
            // Track error
            this.trackError('blocks', blockPath, error as Error)

            // Return error result but continue analysis (if configured)
            if (!this.config.continueOnError) {
              throw error
            }

            this.reportProgress(
              'blocks',
              i + batch.indexOf(blockPath) + 1,
              blockPaths.length,
              `Error analyzing ${blockPath}: ${(error as Error).message}`,
            )

            return {
              blockPath,
              blockSlug: 'unknown',
              issues: [
                {
                  id: `error-${Date.now()}`,
                  type: 'missing-validation',
                  severity: 'critical' as const,
                  category: 'best-practice' as const,
                  title: 'Analysis Failed',
                  description: `Failed to analyze block: ${(error as Error).message}`,
                  location: { file: blockPath },
                  remediation: 'Check block configuration for errors',
                },
              ],
              suggestions: [],
              metrics: {
                fieldCount: 0,
                nestedDepth: 0,
                hasAccessControl: false,
                hasValidation: false,
                hasInterfaceName: false,
                complexityScore: 0,
              },
            } as BlockAnalysisResult
          }
        }),
      )

      results.push(...batchResults)
    }

    return results
  }

  /**
   * Analyze all components in parallel
   */
  async analyzeComponents(componentPaths: string[]): Promise<ComponentAnalysisResult[]> {
    const results: ComponentAnalysisResult[] = []

    // Analyze components in parallel with concurrency limit
    const concurrency = 5
    for (let i = 0; i < componentPaths.length; i += concurrency) {
      const batch = componentPaths.slice(i, i + concurrency)

      const batchResults = await Promise.all(
        batch.map(async (componentPath) => {
          try {
            // Check cache first (if enabled)
            if (this.config.enableCache) {
              const cached = await this.getCachedComponentResult(componentPath)
              if (cached) {
                this.reportProgress(
                  'components',
                  i + batch.indexOf(componentPath) + 1,
                  componentPaths.length,
                  `Using cached result for ${componentPath}`,
                )
                return cached
              }
            }

            // Analyze component
            const result = await this.componentAnalyzer.analyzeComponent(componentPath)

            // Cache result (if enabled)
            if (this.config.enableCache) {
              await this.cacheComponentResult(componentPath, result)
            }

            this.reportProgress(
              'components',
              i + batch.indexOf(componentPath) + 1,
              componentPaths.length,
            )

            return result
          } catch (error) {
            // Track error
            this.trackError('components', componentPath, error as Error)

            // Return error result but continue analysis (if configured)
            if (!this.config.continueOnError) {
              throw error
            }

            this.reportProgress(
              'components',
              i + batch.indexOf(componentPath) + 1,
              componentPaths.length,
              `Error analyzing ${componentPath}: ${(error as Error).message}`,
            )

            return {
              componentPath,
              componentName: 'unknown',
              componentType: 'server' as const,
              issues: [
                {
                  id: `error-${Date.now()}`,
                  type: 'missing-validation',
                  severity: 'critical' as const,
                  category: 'best-practice' as const,
                  title: 'Analysis Failed',
                  description: `Failed to analyze component: ${(error as Error).message}`,
                  location: { file: componentPath },
                  remediation: 'Check component for syntax errors',
                },
              ],
              suggestions: [],
              metrics: {
                lineCount: 0,
                complexity: 0,
                hasErrorBoundary: false,
                hasLoadingState: false,
                accessibilityScore: 0,
                performanceScore: 0,
              },
            } as ComponentAnalysisResult
          }
        }),
      )

      results.push(...batchResults)
    }

    return results
  }

  /**
   * Validate integration between blocks and components
   */
  async validateIntegration(
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
  ): Promise<IntegrationResult[]> {
    const results: IntegrationResult[] = []

    // Match blocks with components
    const pairs = this.matchBlocksWithComponents(blocks, components)

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      if (!pair) continue

      const { block, component } = pair

      try {
        // Parse block and component for validation
        const blockConfig = await this.blockParser.parseBlockConfig(block.blockPath)
        const componentData = await this.componentParser.parseComponent(component.componentPath)

        // Validate integration
        const result = this.integrationValidator.validateIntegration(
          blockConfig.block,
          componentData.component,
        )

        results.push(result)

        this.reportProgress('integration', i + 1, pairs.length)
      } catch (error) {
        // Track error
        this.trackError(
          'integration',
          `${block.blockSlug}-${component.componentName}`,
          error as Error,
        )

        // Return error result but continue (if configured)
        if (!this.config.continueOnError) {
          throw error
        }

        this.reportProgress(
          'integration',
          i + 1,
          pairs.length,
          `Error validating ${block.blockSlug}: ${(error as Error).message}`,
        )

        results.push({
          blockSlug: block.blockSlug,
          componentName: component.componentName,
          isValid: false,
          issues: [],
          suggestions: [`Failed to validate integration: ${(error as Error).message}`],
        })
      }
    }

    return results
  }

  /**
   * Compare blocks against official patterns
   */
  async comparePatterns(blocks: BlockAnalysisResult[]): Promise<PatternComparisonResult[]> {
    const results: PatternComparisonResult[] = []

    try {
      // Fetch official patterns
      const officialPatterns = await this.patternComparator.fetchOfficialPatterns()

      // Compare each block
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if (!block) continue

        try {
          // Parse block config
          const blockConfig = await this.blockParser.parseBlockConfig(block.blockPath)

          // Find matching official pattern
          if (blockConfig.block) {
            const matchingPattern = this.patternComparator.findMatchingPattern(
              blockConfig.block,
              officialPatterns,
            )

            if (matchingPattern) {
              // Compare with official pattern
              const comparison = this.patternComparator.compareBlock(
                blockConfig.block,
                matchingPattern.config,
              )
              results.push(comparison)
            }
          }

          this.reportProgress('patterns', i + 1, blocks.length)
        } catch (error) {
          this.reportProgress(
            'patterns',
            i + 1,
            blocks.length,
            `Error comparing ${block?.blockSlug || 'unknown'}: ${(error as Error).message}`,
          )
        }
      }
    } catch (error) {
      this.reportProgress(
        'patterns',
        0,
        1,
        `Failed to fetch official patterns: ${(error as Error).message}`,
      )
    }

    return results
  }

  /**
   * Generate test suites
   */
  async generateTests(
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
    _integration: IntegrationResult[],
  ): Promise<TestGenerationResult> {
    try {
      // Parse blocks and components for test generation
      const blockConfigs: Block[] = []
      const componentData: Component[] = []
      const blockComponentPairs: Array<{ block: Block; component: Component }> = []

      // Parse blocks
      for (const block of blocks) {
        try {
          const parsed = await this.blockParser.parseBlockConfig(block.blockPath)
          blockConfigs.push(parsed.block)
        } catch (error) {
          // Skip blocks that fail to parse
        }
      }

      // Parse components
      for (const component of components) {
        try {
          const parsed = await this.componentParser.parseComponent(component.componentPath)
          componentData.push(parsed.component)
        } catch (error) {
          // Skip components that fail to parse
        }
      }

      // Match blocks with components for integration tests
      const pairs = this.matchBlocksWithComponents(blocks, components)
      for (const pair of pairs) {
        try {
          const blockConfig = await this.blockParser.parseBlockConfig(pair.block.blockPath)
          const componentParsed = await this.componentParser.parseComponent(
            pair.component.componentPath,
          )
          blockComponentPairs.push({
            block: blockConfig.block,
            component: componentParsed.component,
          })
        } catch (error) {
          // Skip pairs that fail to parse
        }
      }

      // Generate all tests
      const tests = this.testGenerator.generateAllTests(
        blockConfigs,
        componentData,
        blockComponentPairs,
      )

      this.reportProgress('tests', 1, 1, 'Test generation complete')

      return tests
    } catch (error) {
      this.reportProgress('tests', 0, 1, `Test generation failed: ${(error as Error).message}`)

      return {
        blockTests: [],
        componentTests: [],
        integrationTests: [],
        propertyTests: [],
        accessibilityTests: [],
      }
    }
  }

  /**
   * Generate comprehensive report
   */
  async generateReport(
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
    integration: IntegrationResult[],
    patterns: PatternComparisonResult[],
  ): Promise<Report> {
    try {
      // Identify missing features from pattern comparison
      const missingFeatures = await this.identifyMissingFeatures(blocks, patterns)

      // Generate report
      const report = this.reportGenerator.generateReport(
        blocks,
        components,
        integration,
        patterns,
        missingFeatures,
      )

      this.reportProgress('report', 1, 1, 'Report generation complete')

      return report
    } catch (error) {
      this.reportProgress('report', 0, 1, `Report generation failed: ${(error as Error).message}`)
      throw error
    }
  }

  /**
   * Match blocks with their corresponding components
   */
  private matchBlocksWithComponents(
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
  ): Array<{ block: BlockAnalysisResult; component: ComponentAnalysisResult }> {
    const pairs: Array<{ block: BlockAnalysisResult; component: ComponentAnalysisResult }> = []

    for (const block of blocks) {
      // Try to find matching component by slug
      const expectedComponentName = this.slugToComponentName(block.blockSlug)

      const matchingComponent = components.find(
        (c) =>
          c.componentName === expectedComponentName ||
          c.componentName.toLowerCase() === block.blockSlug.toLowerCase(),
      )

      if (matchingComponent) {
        pairs.push({ block, component: matchingComponent })
      }
    }

    return pairs
  }

  /**
   * Convert slug to component name (kebab-case to PascalCase)
   */
  private slugToComponentName(slug: string): string {
    return slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }

  /**
   * Identify missing features from pattern comparison
   */
  private async identifyMissingFeatures(
    blocks: BlockAnalysisResult[],
    _patterns: PatternComparisonResult[],
  ): Promise<any[]> {
    try {
      // Parse blocks
      const blockConfigs: Block[] = []
      for (const block of blocks) {
        try {
          const parsed = await this.blockParser.parseBlockConfig(block.blockPath)
          blockConfigs.push(parsed.block)
        } catch (error) {
          // Skip blocks that fail to parse
        }
      }

      // Fetch official patterns
      const officialPatterns = await this.patternComparator.fetchOfficialPatterns()
      const officialBlocks = officialPatterns.map((p) => p.config)

      // Identify missing features
      return this.patternComparator.identifyMissingFeatures(blockConfigs, officialBlocks)
    } catch (error) {
      return []
    }
  }

  /**
   * Report progress to callback
   */
  private reportProgress(phase: string, current: number, total: number, message?: string): void {
    if (this.config.onProgress) {
      this.config.onProgress(phase, current, total, message)
    }
  }

  /**
   * Discover block configuration files
   * Recursively searches for block config files (config.ts, config.js, index.ts)
   * Updated to support both legacy and restructured project layouts
   * Requirements: All requirements (discovery)
   */
  private async discoverBlockFiles(blockDir: string): Promise<string[]> {
    const blockFiles: string[] = []

    try {
      // Check if directory exists
      if (!fs.existsSync(blockDir)) {
        this.reportProgress('discovery', 0, 1, `Block directory not found: ${blockDir}`)
        return blockFiles
      }

      // Recursively find all config files
      await this.findFilesRecursive(blockDir, blockFiles, (file) => {
        const fileName = path.basename(file)
        // const dirName = path.basename(path.dirname(file)) // Unused - commented out

        // Match config.ts, config.js, or index.ts files in block directories
        // Support both legacy (config.ts) and restructured (index.ts) patterns
        const isConfigFile = fileName === 'config.ts' || fileName === 'config.js'
        const isIndexFile = fileName === 'index.ts' || fileName === 'index.js'

        // For restructured projects, look for index files in block subdirectories
        // For legacy projects, look for config files
        if (isConfigFile) {
          return true
        }

        if (isIndexFile) {
          // Check if this is likely a block index file by examining the directory structure
          const parentDir = path.dirname(file)
          const hasBlockIndicators = this.hasBlockIndicators(parentDir)
          return hasBlockIndicators
        }

        return false
      })

      return blockFiles
    } catch (error) {
      this.reportProgress(
        'discovery',
        0,
        1,
        `Error discovering block files: ${(error as Error).message}`,
      )
      return blockFiles
    }
  }

  /**
   * Check if a directory contains block indicators
   */
  private hasBlockIndicators(dirPath: string): boolean {
    try {
      const files = fs.readdirSync(dirPath)

      // Look for typical block files
      const blockIndicators = [
        'Component.tsx',
        'Component.jsx',
        'types.ts',
        'config.ts',
        'config.js',
      ]

      return blockIndicators.some((indicator) => files.includes(indicator))
    } catch {
      return false
    }
  }

  /**
   * Discover component files
   * Recursively searches for React component files (.tsx, .jsx)
   * Updated to support both legacy and restructured project layouts
   * Requirements: All requirements (discovery)
   */
  private async discoverComponentFiles(componentDir: string): Promise<string[]> {
    const componentFiles: string[] = []

    try {
      // Check if directory exists
      if (!fs.existsSync(componentDir)) {
        this.reportProgress('discovery', 0, 1, `Component directory not found: ${componentDir}`)
        return componentFiles
      }

      // Recursively find all component files
      await this.findFilesRecursive(componentDir, componentFiles, (file) => {
        const fileName = path.basename(file)
        const isTestFile =
          fileName.includes('.test.') ||
          fileName.includes('.spec.') ||
          fileName.includes('.stories.')
        const isNodeModules = file.includes('node_modules')
        const isTypeFile = fileName.endsWith('.d.ts')

        // Match .tsx or .jsx files, but exclude test files, type definitions, and node_modules
        const isComponentFile =
          (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) &&
          !isTestFile &&
          !isNodeModules &&
          !isTypeFile

        // Also include index.tsx files that are likely component exports
        if (isComponentFile && (fileName === 'index.tsx' || fileName === 'index.jsx')) {
          // Check if this is a component index file by looking for other component files in the same directory
          const dirPath = path.dirname(file)
          const hasComponentFiles = this.hasComponentIndicators(dirPath)
          return hasComponentFiles
        }

        return isComponentFile
      })

      return componentFiles
    } catch (error) {
      this.reportProgress(
        'discovery',
        0,
        1,
        `Error discovering component files: ${(error as Error).message}`,
      )
      return componentFiles
    }
  }

  /**
   * Check if a directory contains component indicators
   */
  private hasComponentIndicators(dirPath: string): boolean {
    try {
      const files = fs.readdirSync(dirPath)

      // Look for typical component files (excluding index files)
      const componentIndicators = files.filter(
        (file) =>
          (file.endsWith('.tsx') || file.endsWith('.jsx')) &&
          file !== 'index.tsx' &&
          file !== 'index.jsx' &&
          !file.includes('.test.') &&
          !file.includes('.spec.') &&
          !file.includes('.stories.'),
      )

      return componentIndicators.length > 0
    } catch {
      return false
    }
  }

  /**
   * Recursively find files matching a filter
   */
  private async findFilesRecursive(
    dir: string,
    results: string[],
    filter: (file: string) => boolean,
  ): Promise<void> {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          // Skip common directories that shouldn't be analyzed
          const skipDirs = [
            'node_modules',
            '.git',
            '.next',
            'dist',
            'build',
            'coverage',
            '.cache',
            'tmp',
            'temp',
          ]

          if (!skipDirs.includes(entry.name)) {
            await this.findFilesRecursive(fullPath, results, filter)
          }
        } else if (entry.isFile()) {
          if (filter(fullPath)) {
            results.push(fullPath)
          }
        }
      }
    } catch (error) {
      // Log error but continue with other directories
      this.reportProgress(
        'discovery',
        0,
        1,
        `Error reading directory ${dir}: ${(error as Error).message}`,
      )
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.blockCache.clear()
    this.componentCache.clear()
    this.fileModTimes.clear()

    // Clear disk cache if enabled
    if (this.config.cacheDir && this.config.enableCache) {
      this.clearDiskCache()
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { blocks: number; components: number } {
    return {
      blocks: this.blockCache.size,
      components: this.componentCache.size,
    }
  }

  /**
   * Track analysis error
   * Requirements: All requirements (error handling)
   */
  private trackError(phase: string, file: string, error: Error): void {
    this.errors.push({
      phase,
      file,
      error,
      timestamp: new Date(),
    })
  }

  /**
   * Get all tracked errors
   * Requirements: All requirements (error handling)
   */
  getErrors(): AnalysisError[] {
    return [...this.errors]
  }

  /**
   * Get error summary
   * Requirements: All requirements (error handling)
   */
  getErrorSummary(): {
    total: number
    byPhase: Record<string, number>
    criticalErrors: AnalysisError[]
  } {
    const byPhase: Record<string, number> = {}

    this.errors.forEach((error) => {
      byPhase[error.phase] = (byPhase[error.phase] || 0) + 1
    })

    // Identify critical errors (those that would prevent analysis)
    const criticalErrors = this.errors.filter((error) => {
      return (
        error.error.message.includes('ENOENT') ||
        error.error.message.includes('EACCES') ||
        error.error.message.includes('SyntaxError')
      )
    })

    return {
      total: this.errors.length,
      byPhase,
      criticalErrors,
    }
  }

  /**
   * Clear error tracking
   * Requirements: All requirements (error handling)
   */
  clearErrors(): void {
    this.errors = []
  }

  /**
   * Check if analysis had errors
   * Requirements: All requirements (error handling)
   */
  hasErrors(): boolean {
    return this.errors.length > 0
  }

  /**
   * Generate error report
   * Requirements: All requirements (error handling)
   */
  generateErrorReport(): string {
    if (this.errors.length === 0) {
      return 'No errors occurred during analysis.'
    }

    const lines: string[] = []
    lines.push(`Analysis Errors Report`)
    lines.push(`======================`)
    lines.push(`Total Errors: ${this.errors.length}`)
    lines.push(``)

    // Group by phase
    const byPhase = new Map<string, AnalysisError[]>()
    this.errors.forEach((error) => {
      if (!byPhase.has(error.phase)) {
        byPhase.set(error.phase, [])
      }
      byPhase.get(error.phase)!.push(error)
    })

    // Report errors by phase
    byPhase.forEach((errors, phase) => {
      lines.push(`${phase.toUpperCase()} Phase (${errors.length} errors):`)
      lines.push(`${'='.repeat(phase.length + 20)}`)

      errors.forEach((error, index) => {
        lines.push(`${index + 1}. File: ${error.file}`)
        lines.push(`   Error: ${error.error.message}`)
        lines.push(`   Time: ${error.timestamp.toISOString()}`)
        if (error.error.stack) {
          lines.push(`   Stack: ${error.error.stack.split('\n')[1]?.trim() || 'N/A'}`)
        }
        lines.push(``)
      })
    })

    return lines.join('\n')
  }

  /**
   * Get cached block result if valid
   * Requirements: All requirements (performance)
   */
  private async getCachedBlockResult(blockPath: string): Promise<BlockAnalysisResult | null> {
    try {
      // Check if file has been modified
      const isModified = await this.isFileModified(blockPath)
      if (isModified) {
        // Invalidate cache for this file
        this.blockCache.delete(blockPath)
        return null
      }

      // Check in-memory cache
      const cached = this.blockCache.get(blockPath)
      if (cached) {
        // Check if cache is still valid (TTL)
        const now = Date.now()
        const age = now - cached.timestamp
        if (age < (this.config.cacheTTL || 3600000)) {
          return cached.data
        } else {
          // Cache expired
          this.blockCache.delete(blockPath)
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Cache block result
   * Requirements: All requirements (performance)
   */
  private async cacheBlockResult(blockPath: string, result: BlockAnalysisResult): Promise<void> {
    try {
      const fileHash = await this.getFileHash(blockPath)
      const entry: CacheEntry<BlockAnalysisResult> = {
        data: result,
        timestamp: Date.now(),
        fileHash,
      }

      // Store in memory
      this.blockCache.set(blockPath, entry)

      // Update file modification time
      const stats = fs.statSync(blockPath)
      this.fileModTimes.set(blockPath, stats.mtimeMs)

      // Persist to disk if cache directory is specified
      if (this.config.cacheDir) {
        await this.saveCacheEntryToDisk('blocks', blockPath, entry)
      }
    } catch (error) {
      // Silently fail - caching is optional
    }
  }

  /**
   * Get cached component result if valid
   * Requirements: All requirements (performance)
   */
  private async getCachedComponentResult(
    componentPath: string,
  ): Promise<ComponentAnalysisResult | null> {
    try {
      // Check if file has been modified
      const isModified = await this.isFileModified(componentPath)
      if (isModified) {
        // Invalidate cache for this file
        this.componentCache.delete(componentPath)
        return null
      }

      // Check in-memory cache
      const cached = this.componentCache.get(componentPath)
      if (cached) {
        // Check if cache is still valid (TTL)
        const now = Date.now()
        const age = now - cached.timestamp
        if (age < (this.config.cacheTTL || 3600000)) {
          return cached.data
        } else {
          // Cache expired
          this.componentCache.delete(componentPath)
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Cache component result
   * Requirements: All requirements (performance)
   */
  private async cacheComponentResult(
    componentPath: string,
    result: ComponentAnalysisResult,
  ): Promise<void> {
    try {
      const fileHash = await this.getFileHash(componentPath)
      const entry: CacheEntry<ComponentAnalysisResult> = {
        data: result,
        timestamp: Date.now(),
        fileHash,
      }

      // Store in memory
      this.componentCache.set(componentPath, entry)

      // Update file modification time
      const stats = fs.statSync(componentPath)
      this.fileModTimes.set(componentPath, stats.mtimeMs)

      // Persist to disk if cache directory is specified
      if (this.config.cacheDir) {
        await this.saveCacheEntryToDisk('components', componentPath, entry)
      }
    } catch (error) {
      // Silently fail - caching is optional
    }
  }

  /**
   * Check if file has been modified since last cache
   * Requirements: All requirements (performance)
   */
  private async isFileModified(filePath: string): Promise<boolean> {
    try {
      const stats = fs.statSync(filePath)
      const lastModTime = this.fileModTimes.get(filePath)

      if (!lastModTime) {
        return true // No record, consider modified
      }

      return stats.mtimeMs > lastModTime
    } catch (error) {
      return true // Error reading file, consider modified
    }
  }

  /**
   * Get file hash for cache validation
   * Requirements: All requirements (performance)
   */
  private async getFileHash(filePath: string): Promise<string> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      // Simple hash using content length and first/last characters
      // In production, use a proper hash function like crypto.createHash
      return `${content.length}-${content.charAt(0)}-${content.charAt(content.length - 1)}`
    } catch (error) {
      return 'unknown'
    }
  }

  /**
   * Load cache from disk
   * Requirements: All requirements (performance)
   */
  private loadCacheFromDisk(): void {
    try {
      if (!this.config.cacheDir) return

      const cacheDir = this.config.cacheDir

      // Load block cache
      const blockCacheDir = path.join(cacheDir, 'blocks')
      if (fs.existsSync(blockCacheDir)) {
        const files = fs.readdirSync(blockCacheDir)
        files.forEach((file) => {
          try {
            const filePath = path.join(blockCacheDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const entry = JSON.parse(content) as CacheEntry<BlockAnalysisResult>

            // Restore original file path from cache file name
            const originalPath = Buffer.from(file.replace('.json', ''), 'base64').toString('utf-8')
            this.blockCache.set(originalPath, entry)
          } catch (error) {
            // Skip invalid cache files
          }
        })
      }

      // Load component cache
      const componentCacheDir = path.join(cacheDir, 'components')
      if (fs.existsSync(componentCacheDir)) {
        const files = fs.readdirSync(componentCacheDir)
        files.forEach((file) => {
          try {
            const filePath = path.join(componentCacheDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const entry = JSON.parse(content) as CacheEntry<ComponentAnalysisResult>

            // Restore original file path from cache file name
            const originalPath = Buffer.from(file.replace('.json', ''), 'base64').toString('utf-8')
            this.componentCache.set(originalPath, entry)
          } catch (error) {
            // Skip invalid cache files
          }
        })
      }
    } catch (error) {
      // Silently fail - caching is optional
    }
  }

  /**
   * Save cache entry to disk
   * Requirements: All requirements (performance)
   */
  private async saveCacheEntryToDisk(
    type: 'blocks' | 'components',
    filePath: string,
    entry: CacheEntry<any>,
  ): Promise<void> {
    try {
      if (!this.config.cacheDir) return

      const cacheDir = path.join(this.config.cacheDir, type)

      // Create cache directory if it doesn't exist
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }

      // Use base64 encoded file path as cache file name
      const cacheFileName = Buffer.from(filePath).toString('base64') + '.json'
      const cacheFilePath = path.join(cacheDir, cacheFileName)

      // Write cache entry to disk
      fs.writeFileSync(cacheFilePath, JSON.stringify(entry, null, 2), 'utf-8')
    } catch (error) {
      // Silently fail - caching is optional
    }
  }

  /**
   * Clear disk cache
   * Requirements: All requirements (performance)
   */
  private clearDiskCache(): void {
    try {
      if (!this.config.cacheDir) return

      const cacheDir = this.config.cacheDir

      // Clear block cache
      const blockCacheDir = path.join(cacheDir, 'blocks')
      if (fs.existsSync(blockCacheDir)) {
        const files = fs.readdirSync(blockCacheDir)
        files.forEach((file) => {
          fs.unlinkSync(path.join(blockCacheDir, file))
        })
      }

      // Clear component cache
      const componentCacheDir = path.join(cacheDir, 'components')
      if (fs.existsSync(componentCacheDir)) {
        const files = fs.readdirSync(componentCacheDir)
        files.forEach((file) => {
          fs.unlinkSync(path.join(componentCacheDir, file))
        })
      }
    } catch (error) {
      // Silently fail
    }
  }
}
