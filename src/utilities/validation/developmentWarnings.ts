/**
 * Development-Time Identifier Warnings
 *
 * This module provides real-time warnings during development for potential
 * database identifier length violations and naming convention issues.
 *
 * Requirements addressed: 6.2, 7.1, 7.4
 */

import type { CollectionConfig, Config, Field, GlobalConfig } from 'payload'
// import { fieldAffectsData, fieldHasSubFields } from 'payload'

// Local field type guard functions
const fieldAffectsData = (field: any): boolean => {
  return field && typeof field.name === 'string'
}

const fieldHasSubFields = (field: any): boolean => {
  return field && Array.isArray(field.fields)
}

/**
 * Warning severity levels
 */
export type WarningSeverity = 'info' | 'warning' | 'error'

/**
 * Development warning interface
 */
export interface DevelopmentWarning {
  severity: WarningSeverity
  message: string
  suggestion?: string
  path: string
  line?: number
  column?: number
  rule: string
}

/**
 * Warning configuration
 */
export interface WarningConfig {
  /** Maximum identifier length before warning */
  maxLength: number
  /** Length at which to show error instead of warning */
  errorLength: number
  /** Whether to enforce snake_case naming */
  enforceSnakeCase: boolean
  /** Whether to warn about missing dbName on nested fields */
  warnMissingDbName: boolean
  /** Minimum nesting depth before requiring dbName */
  dbNameRequiredDepth: number
}

/**
 * Default warning configuration
 */
export const DEFAULT_WARNING_CONFIG: WarningConfig = {
  maxLength: 50, // Warn before hitting PostgreSQL limit
  errorLength: 63, // Error at PostgreSQL limit
  enforceSnakeCase: true,
  warnMissingDbName: true,
  dbNameRequiredDepth: 3,
}

/**
 * Development warning checker
 */
export class DevelopmentWarningChecker {
  private config: WarningConfig
  private warnings: DevelopmentWarning[] = []

  constructor(config: Partial<WarningConfig> = {}) {
    this.config = { ...DEFAULT_WARNING_CONFIG, ...config }
  }

  /**
   * Check a Payload configuration for potential issues
   */
  checkPayloadConfig(payloadConfig: Config): DevelopmentWarning[] {
    this.warnings = []

    // Check collections
    if (payloadConfig.collections) {
      for (const collection of payloadConfig.collections) {
        this.checkCollection(collection)
      }
    }

    // Check globals
    if (payloadConfig.globals) {
      for (const global of payloadConfig.globals) {
        this.checkGlobal(global)
      }
    }

    return this.warnings
  }

  /**
   * Check a single collection configuration
   */
  checkCollection(collection: CollectionConfig): DevelopmentWarning[] {
    const collectionWarnings: DevelopmentWarning[] = []
    const basePath = `collections.${collection.slug}`

    // Check collection slug length - handle DBIdentifierName properly
    const collectionIdentifier =
      typeof collection.dbName === 'function'
        ? collection.dbName({ tableName: collection.slug })
        : collection.dbName || collection.slug

    if (collectionIdentifier.length > this.config.maxLength) {
      collectionWarnings.push({
        severity: collectionIdentifier.length >= this.config.errorLength ? 'error' : 'warning',
        message: `Collection identifier '${collectionIdentifier}' is ${collectionIdentifier.length} characters long`,
        suggestion: `Consider adding a shorter 'dbName' property to the collection configuration`,
        path: basePath,
        rule: 'identifier-length',
      })
    }

    // Check snake_case naming
    if (this.config.enforceSnakeCase && !this.isSnakeCase(collectionIdentifier)) {
      collectionWarnings.push({
        severity: 'warning',
        message: `Collection identifier '${collectionIdentifier}' should use snake_case naming`,
        suggestion: `Use snake_case format like '${this.toSnakeCase(collectionIdentifier)}'`,
        path: basePath,
        rule: 'snake-case-naming',
      })
    }

    // Check fields
    if (collection.fields) {
      const fieldWarnings = this.checkFields(collection.fields, `${basePath}.fields`, [
        collectionIdentifier,
      ])
      collectionWarnings.push(...fieldWarnings)
    }

    this.warnings.push(...collectionWarnings)
    return collectionWarnings
  }

  /**
   * Check a single global configuration
   */
  checkGlobal(global: GlobalConfig): DevelopmentWarning[] {
    const globalWarnings: DevelopmentWarning[] = []
    const basePath = `globals.${global.slug}`

    // Check global slug length - handle DBIdentifierName properly
    const globalIdentifier =
      typeof global.dbName === 'function'
        ? global.dbName({ tableName: global.slug })
        : global.dbName || global.slug
    if (globalIdentifier.length > this.config.maxLength) {
      globalWarnings.push({
        severity: globalIdentifier.length >= this.config.errorLength ? 'error' : 'warning',
        message: `Global identifier '${globalIdentifier}' is ${globalIdentifier.length} characters long`,
        suggestion: `Consider adding a shorter 'dbName' property to the global configuration`,
        path: basePath,
        rule: 'identifier-length',
      })
    }

    // Check snake_case naming
    if (this.config.enforceSnakeCase && !this.isSnakeCase(globalIdentifier)) {
      globalWarnings.push({
        severity: 'warning',
        message: `Global identifier '${globalIdentifier}' should use snake_case naming`,
        suggestion: `Use snake_case format like '${this.toSnakeCase(globalIdentifier)}'`,
        path: basePath,
        rule: 'snake-case-naming',
      })
    }

    // Check fields
    if (global.fields) {
      const fieldWarnings = this.checkFields(global.fields, `${basePath}.fields`, [
        globalIdentifier,
      ])
      globalWarnings.push(...fieldWarnings)
    }

    this.warnings.push(...globalWarnings)
    return globalWarnings
  }

  /**
   * Check an array of fields recursively
   */
  checkFields(
    fields: Field[],
    basePath: string,
    identifierPath: string[] = [],
  ): DevelopmentWarning[] {
    const fieldWarnings: DevelopmentWarning[] = []

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const fieldPath = `${basePath}[${i}]`

      if (fieldAffectsData(field)) {
        // Type guard to ensure field has name property
        if (!field || !('name' in field) || typeof field.name !== 'string') {
          continue
        }

        const fieldIdentifier =
          'dbName' in field && field.dbName
            ? typeof field.dbName === 'function'
              ? field.dbName({ tableName: field.name })
              : field.dbName
            : field.name
        const currentPath = [...identifierPath, fieldIdentifier]
        const estimatedIdentifier = this.estimateIdentifierLength(currentPath)

        // Check field identifier length
        if (estimatedIdentifier.length > this.config.maxLength) {
          fieldWarnings.push({
            severity: estimatedIdentifier.length >= this.config.errorLength ? 'error' : 'warning',
            message: `Field '${field.name}' may generate long identifier: '${estimatedIdentifier}' (${estimatedIdentifier.length} chars)`,
            suggestion:
              'dbName' in field && field.dbName
                ? `Consider shortening the 'dbName' property`
                : `Add a 'dbName' property with a shorter name like '${this.suggestDbName(field.name)}'`,
            path: `${fieldPath}.name`,
            rule: 'identifier-length',
          })
        }

        // Check for missing dbName on deeply nested fields
        if (
          this.config.warnMissingDbName &&
          !('dbName' in field && field.dbName) &&
          currentPath.length >= this.config.dbNameRequiredDepth
        ) {
          fieldWarnings.push({
            severity: 'info',
            message: `Consider adding 'dbName' to deeply nested field '${field.name}'`,
            suggestion: `Add dbName: '${this.suggestDbName(field.name)}' to prevent long identifiers`,
            path: fieldPath,
            rule: 'missing-dbname',
          })
        }

        // Check snake_case naming
        if (this.config.enforceSnakeCase && !this.isSnakeCase(fieldIdentifier)) {
          fieldWarnings.push({
            severity: 'info',
            message: `Field identifier '${fieldIdentifier}' should use snake_case naming`,
            suggestion: `Use snake_case format like '${this.toSnakeCase(fieldIdentifier)}'`,
            path: fieldPath,
            rule: 'snake-case-naming',
          })
        }

        // Recursively check nested fields
        if (fieldHasSubFields(field) && 'fields' in field && Array.isArray(field.fields)) {
          const nestedWarnings = this.checkFields(field.fields, `${fieldPath}.fields`, currentPath)
          fieldWarnings.push(...nestedWarnings)
        }
      }
    }

    return fieldWarnings
  }

  /**
   * Estimate the length of a generated database identifier
   */
  private estimateIdentifierLength(identifierPath: string[]): string {
    // Simulate Payload's identifier generation logic
    return identifierPath.join('_').toLowerCase()
  }

  /**
   * Check if a string uses snake_case naming
   */
  private isSnakeCase(str: string): boolean {
    return /^[a-z][a-z0-9_]*$/.test(str)
  }

  /**
   * Convert a string to snake_case
   */
  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
  }

  /**
   * Suggest a shorter dbName for a field
   */
  private suggestDbName(fieldName: string): string {
    const abbreviations: Record<string, string> = {
      description: 'desc',
      navigation: 'nav',
      featured: 'feat',
      reference: 'ref',
      configuration: 'config',
      information: 'info',
      background: 'bg',
      foreground: 'fg',
      thumbnail: 'thumb',
      category: 'cat',
      categories: 'cats',
      subcategory: 'subcat',
      metadata: 'meta',
      attributes: 'attrs',
      properties: 'props',
      settings: 'opts',
      options: 'opts',
      parameters: 'params',
      statistics: 'stats',
      analytics: 'metrics',
      performance: 'perf',
      optimization: 'opt',
      customization: 'custom',
      personalization: 'personal',
      authentication: 'auth',
      authorization: 'authz',
      administration: 'admin',
      management: 'mgmt',
      development: 'dev',
      production: 'prod',
      environment: 'env',
      documentation: 'docs',
      specification: 'spec',
      implementation: 'impl',
      integration: 'integ',
      validation: 'valid',
      verification: 'verify',
      notification: 'notif',
      subscription: 'sub',
      publication: 'pub',
      registration: 'reg',
      organization: 'org',
      department: 'dept',
      location: 'loc',
      position: 'pos',
      coordinates: 'coords',
      dimensions: 'dims',
      measurements: 'measure',
      calculations: 'calc',
      operations: 'ops',
      transactions: 'txn',
      relationships: 'rel',
      connections: 'conn',
      associations: 'assoc',
      collections: 'coll',
      documents: 'docs',
      attachments: 'attach',
      extensions: 'ext',
      modifications: 'mod',
      revisions: 'rev',
      versions: 'ver',
      iterations: 'iter',
      generations: 'gen',
      createdAt: 'created',
      updatedAt: 'updated',
      deletedAt: 'deleted',
      publishedAt: 'published',
    }

    const snakeCase = this.toSnakeCase(fieldName)

    // Try to find abbreviations for each word
    const words = snakeCase.split('_')
    const abbreviated = words.map((word) => abbreviations[word] || word)

    return abbreviated.join('_')
  }
}

/**
 * Format warnings for console output
 */
export function formatWarningsForConsole(warnings: DevelopmentWarning[]): string {
  if (warnings.length === 0) {
    return '✅ No identifier warnings found'
  }

  const lines: string[] = []
  lines.push(`\n⚠️  Found ${warnings.length} identifier warning(s):\n`)

  const groupedWarnings = warnings.reduce(
    (groups, warning) => {
      if (!groups[warning.severity]) {
        groups[warning.severity] = []
      }
      groups[warning.severity].push(warning)
      return groups
    },
    {} as Record<WarningSeverity, DevelopmentWarning[]>,
  )

  // Show errors first, then warnings, then info
  const severityOrder: WarningSeverity[] = ['error', 'warning', 'info']

  for (const severity of severityOrder) {
    const severityWarnings = groupedWarnings[severity]
    if (!severityWarnings?.length) continue

    const icon = severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️'
    lines.push(`${icon} ${severity.toUpperCase()} (${severityWarnings.length})`)

    for (const warning of severityWarnings) {
      lines.push(`  ${warning.path}: ${warning.message}`)
      if (warning.suggestion) {
        lines.push(`    💡 ${warning.suggestion}`)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Format warnings for IDE/LSP integration
 */
export function formatWarningsForLSP(warnings: DevelopmentWarning[]): any[] {
  return warnings.map((warning) => ({
    severity: warning.severity === 'error' ? 1 : warning.severity === 'warning' ? 2 : 3,
    message: warning.message,
    source: 'payload-identifier-validator',
    code: warning.rule,
    range: {
      start: { line: warning.line || 0, character: warning.column || 0 },
      end: { line: warning.line || 0, character: (warning.column || 0) + 10 },
    },
    data: {
      suggestion: warning.suggestion,
      path: warning.path,
    },
  }))
}

/**
 * Create a development middleware for real-time validation
 */
export function createDevelopmentMiddleware(config?: Partial<WarningConfig>) {
  const checker = new DevelopmentWarningChecker(config)

  return {
    /**
     * Validate configuration and return warnings
     */
    validateConfig: (payloadConfig: Config) => {
      return checker.checkPayloadConfig(payloadConfig)
    },

    /**
     * Express middleware for development server
     */
    middleware: (req: any, res: any, next: any) => {
      // Add validation endpoint
      if (req.path === '/_payload/validate-identifiers') {
        try {
          const warnings = checker.checkPayloadConfig(req.payload?.config || {})
          res.json({
            success: true,
            warnings: warnings,
            formatted: formatWarningsForConsole(warnings),
          })
        } catch (error) {
          res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
        return
      }

      next()
    },

    /**
     * Webpack plugin for build-time warnings
     */
    webpackPlugin: class IdentifierWarningPlugin {
      apply(compiler: any) {
        compiler.hooks.compilation.tap('IdentifierWarningPlugin', (compilation: any) => {
          compilation.hooks.processWarnings.tap('IdentifierWarningPlugin', (warnings: any[]) => {
            // Add identifier warnings to webpack warnings
            try {
              const payloadConfig = require(process.cwd() + '/src/payload.config.ts').default
              const identifierWarnings = checker.checkPayloadConfig(payloadConfig)

              for (const warning of identifierWarnings) {
                if (warning.severity === 'error') {
                  compilation.errors.push(new Error(`[Identifier] ${warning.message}`))
                } else {
                  warnings.push(`[Identifier] ${warning.message}`)
                }
              }
            } catch (error) {
              // Silently ignore if config can't be loaded
            }

            return warnings
          })
        })
      }
    },
  }
}

/**
 * VSCode extension helper
 */
export function createVSCodeDiagnostics(warnings: DevelopmentWarning[]) {
  return warnings.map((warning) => ({
    severity: warning.severity === 'error' ? 0 : warning.severity === 'warning' ? 1 : 2,
    message: warning.message,
    source: 'Payload CMS',
    code: warning.rule,
    range: {
      start: { line: warning.line || 0, character: warning.column || 0 },
      end: { line: warning.line || 0, character: (warning.column || 0) + 10 },
    },
  }))
}

/**
 * Quick validation function for development use
 */
export function quickValidate(payloadConfig: Config): void {
  const checker = new DevelopmentWarningChecker()
  const warnings = checker.checkPayloadConfig(payloadConfig)

  if (warnings.length > 0) {
    console.log(formatWarningsForConsole(warnings))
  }
}
