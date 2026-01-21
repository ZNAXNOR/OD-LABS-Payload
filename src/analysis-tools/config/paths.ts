/**
 * Path Configuration for Analysis Tools
 * Centralized configuration for all hardcoded paths to support project restructuring
 */

import { join } from 'path'

export interface PathConfig {
  // Project root paths
  projectRoot: string

  // Source directories
  srcDir: string
  blocksDir: string
  componentsDir: string
  collectionsDir: string
  globalsDir: string
  fieldsDir: string
  hooksDir: string
  accessDir: string
  utilitiesDir: string
  typesDir: string

  // Analysis output paths
  outputDir: string
  reportsDir: string
  cacheDir: string

  // Test directories
  testsDir: string
  unitTestsDir: string
  integrationTestsDir: string
  e2eTestsDir: string
  performanceTestsDir: string
  propertyTestsDir: string
}

/**
 * Default path configuration for the restructured project
 */
export const DEFAULT_PATHS: PathConfig = {
  // Project root
  projectRoot: process.cwd(),

  // Source directories (updated for new structure)
  srcDir: 'src',
  blocksDir: 'src/blocks',
  componentsDir: 'src/components',
  collectionsDir: 'src/collections',
  globalsDir: 'src/globals',
  fieldsDir: 'src/fields',
  hooksDir: 'src/hooks',
  accessDir: 'src/access',
  utilitiesDir: 'src/utilities',
  typesDir: 'src/types',

  // Analysis output
  outputDir: 'analysis-output',
  reportsDir: 'analysis-output/reports',
  cacheDir: 'analysis-output/cache',

  // Test directories (updated for new structure)
  testsDir: 'tests',
  unitTestsDir: 'tests/unit',
  integrationTestsDir: 'tests/integration',
  e2eTestsDir: 'tests/e2e',
  performanceTestsDir: 'tests/performance',
  propertyTestsDir: 'tests/property-based',
}

/**
 * Legacy path configuration for backward compatibility
 */
export const LEGACY_PATHS: PathConfig = {
  // Project root
  projectRoot: process.cwd(),

  // Legacy source directories
  srcDir: 'src',
  blocksDir: 'src/blocks',
  componentsDir: 'src/components',
  collectionsDir: 'src/collections',
  globalsDir: 'src/globals',
  fieldsDir: 'src/fields',
  hooksDir: 'src/hooks',
  accessDir: 'src/access',
  utilitiesDir: 'src/utilities',
  typesDir: 'src/payload-types.ts',

  // Analysis output
  outputDir: 'analysis-output',
  reportsDir: 'analysis-output/reports',
  cacheDir: 'analysis-output/cache',

  // Legacy test directories
  testsDir: 'tests',
  unitTestsDir: 'tests/unit',
  integrationTestsDir: 'tests/int',
  e2eTestsDir: 'tests/e2e',
  performanceTestsDir: 'tests/performance',
  propertyTestsDir: 'tests/pbt',
}

/**
 * Path resolver utility
 */
export class PathResolver {
  private config: PathConfig

  constructor(config: PathConfig = DEFAULT_PATHS) {
    this.config = config
  }

  /**
   * Resolve a path relative to project root
   */
  resolve(relativePath: string): string {
    return join(this.config.projectRoot, relativePath)
  }

  /**
   * Get absolute path for a configured directory
   */
  getPath(key: keyof PathConfig): string {
    const path = this.config[key] as string
    return this.resolve(path)
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<PathConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  /**
   * Get current configuration
   */
  getConfig(): PathConfig {
    return { ...this.config }
  }

  /**
   * Auto-detect project structure and return appropriate configuration
   */
  static async detectProjectStructure(projectRoot: string = process.cwd()): Promise<PathConfig> {
    const fs = await import('fs')
    const path = await import('path')

    // Check for restructured project indicators
    const restructuredIndicators = [
      'src/types/index.ts',
      'src/blocks/index.ts',
      'src/components/index.ts',
      'tests/unit',
      'tests/integration',
      'tests/property-based',
    ]

    const hasRestructuredIndicators = restructuredIndicators.some((indicator) => {
      try {
        return fs.existsSync(path.join(projectRoot, indicator))
      } catch {
        return false
      }
    })

    if (hasRestructuredIndicators) {
      return { ...DEFAULT_PATHS, projectRoot }
    } else {
      return { ...LEGACY_PATHS, projectRoot }
    }
  }
}

/**
 * Global path resolver instance
 */
export const pathResolver = new PathResolver()

/**
 * Convenience functions for common paths
 */
export const getPaths = {
  blocks: () => pathResolver.getPath('blocksDir'),
  components: () => pathResolver.getPath('componentsDir'),
  collections: () => pathResolver.getPath('collectionsDir'),
  globals: () => pathResolver.getPath('globalsDir'),
  fields: () => pathResolver.getPath('fieldsDir'),
  hooks: () => pathResolver.getPath('hooksDir'),
  access: () => pathResolver.getPath('accessDir'),
  utilities: () => pathResolver.getPath('utilitiesDir'),
  types: () => pathResolver.getPath('typesDir'),
  tests: () => pathResolver.getPath('testsDir'),
  unitTests: () => pathResolver.getPath('unitTestsDir'),
  integrationTests: () => pathResolver.getPath('integrationTestsDir'),
  e2eTests: () => pathResolver.getPath('e2eTestsDir'),
  performanceTests: () => pathResolver.getPath('performanceTestsDir'),
  propertyTests: () => pathResolver.getPath('propertyTestsDir'),
  reports: () => pathResolver.getPath('reportsDir'),
  cache: () => pathResolver.getPath('cacheDir'),
}
