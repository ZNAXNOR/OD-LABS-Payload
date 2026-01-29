/**
 * ConfigurationScanner implementation for discovering and parsing PayloadCMS configuration files
 *
 * This module implements the ConfigurationScanner interface to:
 * - Scan project directories for PayloadCMS configuration files
 * - Parse collection and global configuration files
 * - Extract dbName usages with full context information
 *
 * Requirements: 9.1, 9.5
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { DbNameUsageExtractor } from './dbname-usage-extractor'
import { extractCollectionSlug } from './index'
import type { ConfigurationScanner } from './interfaces'
import type {
  CollectionConfig,
  ConfigurationFile,
  DbNameUsage,
  FieldConfig,
  GlobalConfig,
} from './types'

/**
 * Implementation of ConfigurationScanner for PayloadCMS projects
 */
export class PayloadConfigurationScanner implements ConfigurationScanner {
  private readonly excludePatterns: string[] = [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    '**/*.test.ts',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.spec.js',
  ]

  private readonly usageExtractor: DbNameUsageExtractor

  constructor() {
    this.usageExtractor = new DbNameUsageExtractor()
  }

  /**
   * Scan a project directory for PayloadCMS configuration files
   */
  async scanProject(rootPath: string): Promise<ConfigurationFile[]> {
    const configFiles: ConfigurationFile[] = []

    try {
      // Recursively find PayloadCMS configuration files
      const files = await this.findConfigurationFiles(rootPath)

      for (const filePath of files) {
        try {
          const configFile = await this.parseConfigurationFile(filePath)
          if (configFile) {
            configFiles.push(configFile)
          }
        } catch (error) {
          console.warn(`Failed to parse configuration file ${filePath}:`, error)
          // Continue processing other files
        }
      }

      return configFiles
    } catch (error) {
      console.error(`Error scanning project at ${rootPath}:`, error)
      throw new Error(
        `Failed to scan project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Recursively find configuration files in a directory
   */
  private async findConfigurationFiles(dirPath: string): Promise<string[]> {
    const files: string[] = []

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)

        // Skip excluded patterns
        if (this.shouldExcludePath(fullPath)) {
          continue
        }

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subFiles = await this.findConfigurationFiles(fullPath)
          files.push(...subFiles)
        } else if (entry.isFile() && this.isConfigurationFile(fullPath)) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      // Skip directories we can't read
      console.warn(`Cannot read directory ${dirPath}:`, error)
    }

    return files
  }

  /**
   * Check if a path should be excluded from scanning
   */
  private shouldExcludePath(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/')

    return this.excludePatterns.some((pattern) => {
      const normalizedPattern = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
      const regex = new RegExp(normalizedPattern)
      return regex.test(normalizedPath)
    })
  }

  /**
   * Check if a file is a PayloadCMS configuration file
   */
  private isConfigurationFile(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/')

    // Check if file matches PayloadCMS configuration patterns
    const isInCollections = normalizedPath.includes('/collections/')
    const isInGlobals = normalizedPath.includes('/globals/')
    const isInFields = normalizedPath.includes('/fields/')
    const isPayloadConfig =
      normalizedPath.endsWith('payload.config.ts') || normalizedPath.endsWith('payload.config.js')

    const isTypeScriptOrJavaScript =
      normalizedPath.endsWith('.ts') || normalizedPath.endsWith('.js')

    return (
      isTypeScriptOrJavaScript && (isInCollections || isInGlobals || isInFields || isPayloadConfig)
    )
  }

  /**
   * Parse a collection configuration file
   */
  async parseCollectionConfig(filePath: string): Promise<CollectionConfig> {
    try {
      const config = await this.loadConfigurationModule(filePath)

      // Validate that it's a collection config
      if (!config.slug) {
        throw new Error('Collection configuration must have a slug property')
      }

      return {
        slug: config.slug,
        dbName: config.dbName,
        fields: config.fields || [],
        ...config,
      }
    } catch (error) {
      throw new Error(
        `Failed to parse collection config ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Parse a global configuration file
   */
  async parseGlobalConfig(filePath: string): Promise<GlobalConfig> {
    try {
      const config = await this.loadConfigurationModule(filePath)

      // Validate that it's a global config
      if (!config.slug) {
        throw new Error('Global configuration must have a slug property')
      }

      return {
        slug: config.slug,
        dbName: config.dbName,
        fields: config.fields || [],
        ...config,
      }
    } catch (error) {
      throw new Error(
        `Failed to parse global config ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Extract dbName usages from a configuration object
   */
  extractDbNameUsages(config: any, filePath: string): DbNameUsage[] {
    try {
      // Use the enhanced extractor for comprehensive nesting analysis
      return this.usageExtractor.extractUsagesWithNestingAnalysis(config, filePath)
    } catch (error) {
      console.warn(`Failed to extract dbName usages from ${filePath}:`, error)

      // Fallback to basic extraction
      return this.basicExtractDbNameUsages(config, filePath)
    }
  }

  /**
   * Basic fallback extraction method
   */
  private basicExtractDbNameUsages(config: any, filePath: string): DbNameUsage[] {
    const usages: DbNameUsage[] = []
    const collectionSlug = this.determineCollectionSlug(config, filePath)

    // Check collection-level dbName
    if (config.dbName) {
      usages.push({
        location: 'dbName',
        fieldName: config.slug || 'collection',
        dbNameValue: config.dbName,
        fieldType: 'collection',
        nestingLevel: 0,
        context: {
          parentFields: [],
          collectionSlug,
          isNested: false,
          fullPath: config.slug || 'collection',
        },
      })
    }

    // Extract field-level dbName usages
    if (config.fields && Array.isArray(config.fields)) {
      this.extractFieldDbNameUsages(config.fields, usages, collectionSlug, [], 'fields')
    }

    return usages
  }

  /**
   * Parse a configuration file and determine its type
   */
  private async parseConfigurationFile(filePath: string): Promise<ConfigurationFile | null> {
    try {
      const config = await this.loadConfigurationModule(filePath)

      if (!config || typeof config !== 'object') {
        return null
      }

      // Determine configuration type
      const type = this.determineConfigurationType(config, filePath)
      if (!type) {
        return null
      }

      // Extract dbName usages
      const dbNameUsages = this.extractDbNameUsages(config, filePath)

      return {
        path: filePath,
        type,
        config,
        dbNameUsages,
      }
    } catch (error) {
      console.warn(`Failed to parse configuration file ${filePath}:`, error)
      return null
    }
  }

  /**
   * Load a configuration module from file system
   */
  private async loadConfigurationModule(filePath: string): Promise<any> {
    try {
      // Read file content
      const content = await fs.readFile(filePath, 'utf-8')

      // For TypeScript/JavaScript files, we need to handle module loading
      // This is a simplified approach - in production, you might want to use
      // a more sophisticated module loader or AST parsing

      // Check if file exists and is readable
      const stats = await fs.stat(filePath)
      if (!stats.isFile()) {
        throw new Error('Path is not a file')
      }

      // For now, we'll use a simple approach to extract configuration
      // In a real implementation, you might want to use TypeScript compiler API
      // or a more robust module loading mechanism

      // Try to extract exported configuration using regex patterns
      const config = this.parseConfigurationFromContent(content, filePath)
      return config
    } catch (error) {
      throw new Error(
        `Failed to load configuration module: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Parse configuration from file content using pattern matching
   */
  private parseConfigurationFromContent(content: string, filePath: string): any {
    try {
      // This is a simplified parser - in production, you'd want to use
      // proper AST parsing with TypeScript compiler API

      // Look for common export patterns
      const exportPatterns = [
        /export\s+const\s+\w+\s*:\s*CollectionConfig\s*=\s*({[\s\S]*?});?\s*$/m,
        /export\s+const\s+\w+\s*:\s*GlobalConfig\s*=\s*({[\s\S]*?});?\s*$/m,
        /export\s+const\s+\w+\s*=\s*({[\s\S]*?});?\s*$/m,
        /export\s+default\s+({[\s\S]*?});?\s*$/m,
      ]

      for (const pattern of exportPatterns) {
        const match = content.match(pattern)
        if (match && match[1]) {
          try {
            // This is a very basic approach - extract the object literal
            // In production, use proper AST parsing
            const configStr = match[1]

            // Create a mock configuration object based on common patterns
            const config = this.createMockConfigFromContent(configStr, filePath)
            return config
          } catch (parseError) {
            continue
          }
        }
      }

      // Fallback: create minimal config based on file path
      return this.createFallbackConfig(filePath)
    } catch (error) {
      throw new Error(
        `Failed to parse configuration content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Create a mock configuration object from content string
   */
  private createMockConfigFromContent(configStr: string, filePath: string): any {
    // Extract basic properties using regex
    const slug = this.extractProperty(configStr, 'slug') || extractCollectionSlug(filePath)
    const dbName = this.extractProperty(configStr, 'dbName')
    const fields = this.extractFieldsArray(configStr)

    return {
      slug,
      dbName,
      fields,
    }
  }

  /**
   * Extract a property value from configuration string
   */
  private extractProperty(configStr: string, propertyName: string): string | undefined {
    const patterns = [
      new RegExp(`${propertyName}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`, 'i'),
      new RegExp(`${propertyName}\\s*:\\s*([a-zA-Z_][a-zA-Z0-9_]*)`, 'i'),
    ]

    for (const pattern of patterns) {
      const match = configStr.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return undefined
  }

  /**
   * Extract fields array from configuration string
   */
  private extractFieldsArray(configStr: string): FieldConfig[] {
    const fields: FieldConfig[] = []

    // Look for fields array
    const fieldsMatch = configStr.match(/fields\s*:\s*\[([\s\S]*?)\]/i)
    if (fieldsMatch && fieldsMatch[1]) {
      const fieldsContent = fieldsMatch[1]

      // Extract individual field objects (simplified)
      const fieldMatches = fieldsContent.match(/{[^{}]*}/g) || []

      for (const fieldMatch of fieldMatches) {
        const name = this.extractProperty(fieldMatch, 'name')
        const type = this.extractProperty(fieldMatch, 'type')
        const dbName = this.extractProperty(fieldMatch, 'dbName')

        if (name && type) {
          fields.push({
            name,
            type,
            dbName,
          })
        }
      }
    }

    return fields
  }

  /**
   * Create a fallback configuration based on file path
   */
  private createFallbackConfig(filePath: string): any {
    const slug = extractCollectionSlug(filePath)

    return {
      slug,
      fields: [],
    }
  }

  /**
   * Determine the type of configuration file
   */
  private determineConfigurationType(
    config: any,
    filePath: string,
  ): 'collection' | 'global' | 'field' | null {
    // Check file path patterns
    if (filePath.includes('/collections/')) {
      return 'collection'
    }

    if (filePath.includes('/globals/')) {
      return 'global'
    }

    if (filePath.includes('/fields/')) {
      return 'field'
    }

    // Check configuration properties
    if (config.slug && config.fields) {
      // Could be either collection or global
      return filePath.includes('global') ? 'global' : 'collection'
    }

    return null
  }

  /**
   * Determine collection slug from configuration or file path
   */
  private determineCollectionSlug(config: any, filePath: string): string {
    return config.slug || extractCollectionSlug(filePath)
  }

  /**
   * Recursively extract dbName usages from fields array
   */
  private extractFieldDbNameUsages(
    fields: FieldConfig[],
    usages: DbNameUsage[],
    collectionSlug: string,
    parentFields: string[],
    basePath: string,
    nestingLevel: number = 0,
  ): void {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const fieldPath = `${basePath}[${i}]`
      const fieldName = field?.name || `field_${i}`
      const currentParentFields = [...parentFields, fieldName].filter(Boolean)
      const fullPath = currentParentFields.join('.')

      // Check if field has dbName
      if (field?.dbName) {
        usages.push({
          location: `${fieldPath}.dbName`,
          fieldName: fieldName,
          dbNameValue: field.dbName,
          fieldType: field.type || 'unknown',
          nestingLevel,
          context: {
            parentFields,
            collectionSlug,
            isNested: nestingLevel > 0,
            fullPath,
          },
        })
      }

      // Recursively check nested fields
      if (field?.fields && Array.isArray(field.fields)) {
        this.extractFieldDbNameUsages(
          field.fields,
          usages,
          collectionSlug,
          currentParentFields,
          `${fieldPath}.fields`,
          nestingLevel + 1,
        )
      }
    }
  }
}

/**
 * Factory function to create a ConfigurationScanner instance
 */
export function createConfigurationScanner(): ConfigurationScanner {
  return new PayloadConfigurationScanner()
}
