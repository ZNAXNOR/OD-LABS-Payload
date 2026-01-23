/**
 * Database Identifier Analysis and Validation Utilities
 *
 * This module provides comprehensive analysis of Payload CMS configurations
 * to detect and prevent PostgreSQL identifier length violations.
 *
 * Requirements addressed: 2.1, 2.2, 2.3, 6.1, 6.2, 6.3
 */

import type {
  Block,
  CollapsibleField,
  CollectionConfig,
  Config,
  Field,
  GlobalConfig,
  RowField,
  TabsField,
} from 'payload'

// Field type guard functions - with fallbacks for testing
export const fieldAffectsData = (field: any): boolean => {
  return field && typeof field.name === 'string'
}

export const fieldHasSubFields = (field: any): boolean => {
  return field && Array.isArray(field.fields)
}

export const fieldIsArrayType = (field: any): boolean => {
  return field && field.type === 'array'
}

export const fieldIsBlockType = (field: any): boolean => {
  return field && field.type === 'blocks'
}

export const fieldIsGroupType = (field: any): boolean => {
  return field && field.type === 'group'
}

/**
 * PostgreSQL identifier length limit
 */
export const POSTGRES_IDENTIFIER_LIMIT = 63

/**
 * Configuration for identifier analysis
 */
export interface IdentifierAnalysisConfig {
  /** Maximum allowed identifier length (default: 63 for PostgreSQL) */
  maxLength?: number
  /** Whether to include warnings for identifiers approaching the limit */
  includeWarnings?: boolean
  /** Threshold for warnings (percentage of max length) */
  warningThreshold?: number
  /** Whether to analyze nested field structures */
  analyzeNested?: boolean
  /** Maximum depth to analyze (prevents infinite recursion) */
  maxDepth?: number
}

/**
 * Default analysis configuration
 */
export const DEFAULT_ANALYSIS_CONFIG: Required<IdentifierAnalysisConfig> = {
  maxLength: POSTGRES_IDENTIFIER_LIMIT,
  includeWarnings: true,
  warningThreshold: 0.8, // 80% of max length
  analyzeNested: true,
  maxDepth: 10,
}

/**
 * Represents a potential identifier length violation
 */
export interface IdentifierViolation {
  /** The field path that generates the identifier */
  fieldPath: string
  /** The estimated generated identifier name */
  estimatedIdentifier: string
  /** The length of the estimated identifier */
  length: number
  /** Severity of the violation */
  severity: 'error' | 'warning'
  /** The configuration type (collection, global, block) */
  configurationType: 'collection' | 'global' | 'block' | 'field'
  /** The configuration name/slug */
  configurationName: string
  /** Suggested dbName to fix the violation */
  suggestedDbName?: string
  /** Context about where this identifier is used */
  context: {
    /** Parent configuration slug */
    parentSlug: string
    /** Field type */
    fieldType: string
    /** Nesting level */
    nestingLevel: number
    /** Whether this is an enum identifier */
    isEnum?: boolean
    /** Whether this is a table/column identifier */
    isTable?: boolean
  }
}

/**
 * Analysis result for a configuration
 */
export interface ConfigurationAnalysis {
  /** Configuration name/slug */
  name: string
  /** Configuration type */
  type: 'collection' | 'global' | 'block'
  /** All potential violations found */
  violations: IdentifierViolation[]
  /** Maximum nesting depth found */
  maxDepth: number
  /** Total number of fields analyzed */
  fieldCount: number
  /** Whether this configuration has critical violations */
  hasCriticalViolations: boolean
  /** Suggested optimizations */
  suggestions: string[]
}

/**
 * Complete analysis result for entire Payload configuration
 */
export interface PayloadConfigAnalysis {
  /** Analysis results for each configuration */
  configurations: ConfigurationAnalysis[]
  /** Summary statistics */
  summary: {
    totalConfigurations: number
    totalViolations: number
    criticalViolations: number
    warningViolations: number
    configurationsWithViolations: number
  }
  /** Global recommendations */
  recommendations: string[]
}

/**
 * Generate estimated database identifier for a field path
 */
export function generateEstimatedIdentifier(
  fieldPath: string,
  context: {
    parentSlug: string
    fieldType: string
    isEnum?: boolean
  },
): string {
  const { parentSlug, fieldType, isEnum } = context

  // Convert camelCase/PascalCase to snake_case
  const snakeCasePath = fieldPath
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')

  // Split path into segments
  const segments = snakeCasePath.split('.')

  // Build identifier based on type
  if (isEnum && fieldType === 'select') {
    // Enum identifiers: enum_{parent}_{field_path}_{option}
    return `enum_${parentSlug}_${segments.join('_')}`
  } else if (fieldType === 'array') {
    // Array table identifiers: {parent}_{field_path}
    return `${parentSlug}_${segments.join('_')}`
  } else {
    // Regular column identifiers: {field_path}
    return segments.join('_')
  }
}

/**
 * Analyze a single field for identifier violations
 */
export function analyzeField(
  field: Field,
  context: {
    parentSlug: string
    fieldPath: string
    nestingLevel: number
    configurationType: 'collection' | 'global' | 'block'
  },
  config: Required<IdentifierAnalysisConfig>,
): IdentifierViolation[] {
  const violations: IdentifierViolation[] = []
  const { parentSlug, fieldPath, nestingLevel, configurationType } = context

  // Skip if field doesn't affect data or we've exceeded max depth
  if (!fieldAffectsData(field) || nestingLevel > config.maxDepth) {
    return violations
  }

  // Check if field has name property
  if (!('name' in field) || typeof field.name !== 'string') {
    return []
  }

  const fieldName = field.name
  const currentPath = fieldPath ? `${fieldPath}.${fieldName}` : fieldName

  // Generate estimated identifier
  const estimatedIdentifier = generateEstimatedIdentifier(currentPath, {
    parentSlug,
    fieldType: field.type,
    isEnum: field.type === 'select',
  })

  // Check for violations
  const length = estimatedIdentifier.length
  const warningThreshold = Math.floor(config.maxLength * config.warningThreshold)

  if (length > config.maxLength) {
    violations.push({
      fieldPath: currentPath,
      estimatedIdentifier,
      length,
      severity: 'error',
      configurationType,
      configurationName: parentSlug,
      context: {
        parentSlug,
        fieldType: field.type,
        nestingLevel,
        isEnum: field.type === 'select',
        isTable: field.type === 'array',
      },
    })
  } else if (config.includeWarnings && length > warningThreshold) {
    violations.push({
      fieldPath: currentPath,
      estimatedIdentifier,
      length,
      severity: 'warning',
      configurationType,
      configurationName: parentSlug,
      context: {
        parentSlug,
        fieldType: field.type,
        nestingLevel,
        isEnum: field.type === 'select',
        isTable: field.type === 'array',
      },
    })
  }

  // Analyze nested fields if enabled
  if (
    config.analyzeNested &&
    fieldHasSubFields(field) &&
    'fields' in field &&
    Array.isArray(field.fields)
  ) {
    const nestedViolations = analyzeFields(
      field.fields,
      {
        parentSlug,
        fieldPath: currentPath,
        nestingLevel: nestingLevel + 1,
        configurationType,
      },
      config,
    )
    violations.push(...nestedViolations)
  }

  // Special handling for blocks
  if (fieldIsBlockType(field) && 'blocks' in field && Array.isArray(field.blocks)) {
    field.blocks.forEach((block: any) => {
      const blockViolations = analyzeFields(
        block.fields,
        {
          parentSlug: `${parentSlug}_${block.slug}`,
          fieldPath: currentPath,
          nestingLevel: nestingLevel + 1,
          configurationType: 'block',
        },
        config,
      )
      violations.push(...blockViolations)
    })
  }

  return violations
}

/**
 * Analyze an array of fields for identifier violations
 */
export function analyzeFields(
  fields: Field[],
  context: {
    parentSlug: string
    fieldPath: string
    nestingLevel: number
    configurationType: 'collection' | 'global' | 'block'
  },
  config: Required<IdentifierAnalysisConfig>,
): IdentifierViolation[] {
  const violations: IdentifierViolation[] = []

  for (const field of fields) {
    // Handle different field types
    if (field.type === 'tabs') {
      // Analyze tab fields
      const tabsField = field as TabsField
      tabsField.tabs.forEach((tab) => {
        if ('fields' in tab) {
          const tabViolations = analyzeFields(
            tab.fields,
            {
              ...context,
              fieldPath:
                'name' in tab && tab.name ? `${context.fieldPath}.${tab.name}` : context.fieldPath,
            },
            config,
          )
          violations.push(...tabViolations)
        }
      })
    } else if (field.type === 'row') {
      // Analyze row fields
      const rowField = field as RowField
      const rowViolations = analyzeFields(rowField.fields, context, config)
      violations.push(...rowViolations)
    } else if (field.type === 'collapsible') {
      // Analyze collapsible fields
      const collapsibleField = field as CollapsibleField
      const collapsibleViolations = analyzeFields(collapsibleField.fields, context, config)
      violations.push(...collapsibleViolations)
    } else {
      // Regular field analysis
      const fieldViolations = analyzeField(field, context, config)
      violations.push(...fieldViolations)
    }
  }

  return violations
}

/**
 * Analyze a collection configuration for identifier violations
 */
export function analyzeCollectionConfig(
  collection: CollectionConfig,
  config: Required<IdentifierAnalysisConfig> = DEFAULT_ANALYSIS_CONFIG,
): ConfigurationAnalysis {
  const violations = analyzeFields(
    collection.fields,
    {
      parentSlug: collection.slug,
      fieldPath: '',
      nestingLevel: 0,
      configurationType: 'collection',
    },
    config,
  )

  const criticalViolations = violations.filter((v) => v.severity === 'error')
  const suggestions: string[] = []

  // Generate suggestions based on violations
  if (criticalViolations.length > 0) {
    suggestions.push(
      `Add dbName properties to ${criticalViolations.length} fields with identifier length violations`,
    )
  }

  const maxDepth = Math.max(0, ...violations.map((v) => v.context.nestingLevel))

  if (maxDepth > 5) {
    suggestions.push('Consider flattening deeply nested field structures')
  }

  return {
    name: collection.slug,
    type: 'collection',
    violations,
    maxDepth,
    fieldCount: countFields(collection.fields),
    hasCriticalViolations: criticalViolations.length > 0,
    suggestions,
  }
}

/**
 * Analyze a global configuration for identifier violations
 */
export function analyzeGlobalConfig(
  global: GlobalConfig,
  config: Required<IdentifierAnalysisConfig> = DEFAULT_ANALYSIS_CONFIG,
): ConfigurationAnalysis {
  const violations = analyzeFields(
    global.fields,
    {
      parentSlug: global.slug,
      fieldPath: '',
      nestingLevel: 0,
      configurationType: 'global',
    },
    config,
  )

  const criticalViolations = violations.filter((v) => v.severity === 'error')
  const suggestions: string[] = []

  if (criticalViolations.length > 0) {
    suggestions.push(
      `Add dbName properties to ${criticalViolations.length} fields with identifier length violations`,
    )
  }

  const maxDepth = Math.max(0, ...violations.map((v) => v.context.nestingLevel))

  if (maxDepth > 5) {
    suggestions.push('Consider flattening deeply nested field structures')
  }

  return {
    name: global.slug,
    type: 'global',
    violations,
    maxDepth,
    fieldCount: countFields(global.fields),
    hasCriticalViolations: criticalViolations.length > 0,
    suggestions,
  }
}

/**
 * Analyze a block configuration for identifier violations
 */
export function analyzeBlockConfig(
  block: Block,
  config: Required<IdentifierAnalysisConfig> = DEFAULT_ANALYSIS_CONFIG,
): ConfigurationAnalysis {
  const violations = analyzeFields(
    block.fields,
    {
      parentSlug: block.slug,
      fieldPath: '',
      nestingLevel: 0,
      configurationType: 'block',
    },
    config,
  )

  const criticalViolations = violations.filter((v) => v.severity === 'error')
  const suggestions: string[] = []

  if (criticalViolations.length > 0) {
    suggestions.push(
      `Add dbName properties to ${criticalViolations.length} fields with identifier length violations`,
    )
  }

  return {
    name: block.slug,
    type: 'block',
    violations,
    maxDepth: Math.max(0, ...violations.map((v) => v.context.nestingLevel)),
    fieldCount: countFields(block.fields),
    hasCriticalViolations: criticalViolations.length > 0,
    suggestions,
  }
}

/**
 * Analyze entire Payload configuration for identifier violations
 */
export function analyzePayloadConfig(
  payloadConfig: Config,
  config: IdentifierAnalysisConfig = {},
): PayloadConfigAnalysis {
  const analysisConfig = { ...DEFAULT_ANALYSIS_CONFIG, ...config }
  const configurations: ConfigurationAnalysis[] = []

  // Analyze collections
  if (payloadConfig.collections) {
    for (const collection of payloadConfig.collections) {
      configurations.push(analyzeCollectionConfig(collection, analysisConfig))
    }
  }

  // Analyze globals
  if (payloadConfig.globals) {
    for (const global of payloadConfig.globals) {
      configurations.push(analyzeGlobalConfig(global, analysisConfig))
    }
  }

  // Calculate summary statistics
  const allViolations = configurations.flatMap((c) => c.violations)
  const criticalViolations = allViolations.filter((v) => v.severity === 'error')
  const warningViolations = allViolations.filter((v) => v.severity === 'warning')
  const configurationsWithViolations = configurations.filter((c) => c.violations.length > 0)

  // Generate global recommendations
  const recommendations: string[] = []

  if (criticalViolations.length > 0) {
    recommendations.push(
      `${criticalViolations.length} critical identifier length violations must be fixed`,
    )
  }

  if (warningViolations.length > 0) {
    recommendations.push(`${warningViolations.length} identifiers are approaching the length limit`)
  }

  const deeplyNestedConfigs = configurations.filter((c) => c.maxDepth > 5)
  if (deeplyNestedConfigs.length > 0) {
    recommendations.push(
      `${deeplyNestedConfigs.length} configurations have deep nesting that may cause issues`,
    )
  }

  if (
    configurations.length > 0 &&
    configurationsWithViolations.length / configurations.length > 0.5
  ) {
    recommendations.push(
      'Consider implementing a systematic dbName strategy across all configurations',
    )
  }

  return {
    configurations,
    summary: {
      totalConfigurations: configurations.length,
      totalViolations: allViolations.length,
      criticalViolations: criticalViolations.length,
      warningViolations: warningViolations.length,
      configurationsWithViolations: configurationsWithViolations.length,
    },
    recommendations,
  }
}

/**
 * Count total number of fields in a field array (recursive)
 */
function countFields(fields: Field[]): number {
  let count = 0

  for (const field of fields) {
    if (fieldAffectsData(field)) {
      count++
    }

    if (fieldHasSubFields(field) && 'fields' in field && Array.isArray(field.fields)) {
      count += countFields(field.fields)
    }

    if (fieldIsBlockType(field) && 'blocks' in field && Array.isArray(field.blocks)) {
      for (const block of field.blocks) {
        count += countFields(block.fields)
      }
    }

    if (field.type === 'tabs') {
      const tabsField = field as TabsField
      for (const tab of tabsField.tabs) {
        if ('fields' in tab) {
          count += countFields(tab.fields)
        }
      }
    }
  }

  return count
}

/**
 * Get the most problematic configurations (highest violation count)
 */
export function getMostProblematicConfigurations(
  analysis: PayloadConfigAnalysis,
  limit = 5,
): ConfigurationAnalysis[] {
  return analysis.configurations
    .filter((c) => c.hasCriticalViolations)
    .sort((a, b) => {
      const aCritical = a.violations.filter((v) => v.severity === 'error').length
      const bCritical = b.violations.filter((v) => v.severity === 'error').length
      return bCritical - aCritical
    })
    .slice(0, limit)
}

/**
 * Get violations by configuration type
 */
export function getViolationsByType(
  analysis: PayloadConfigAnalysis,
): Record<'collection' | 'global' | 'block', IdentifierViolation[]> {
  const violations = analysis.configurations.flatMap((c) => c.violations)

  return {
    collection: violations.filter((v) => v.configurationType === 'collection'),
    global: violations.filter((v) => v.configurationType === 'global'),
    block: violations.filter((v) => v.configurationType === 'block'),
  }
}

/**
 * Generate a summary report of the analysis
 */
export function generateAnalysisReport(analysis: PayloadConfigAnalysis): string {
  const { summary, recommendations } = analysis

  let report = '# Database Identifier Analysis Report\n\n'

  // Summary section
  report += '## Summary\n\n'
  report += `- **Total Configurations**: ${summary.totalConfigurations}\n`
  report += `- **Total Violations**: ${summary.totalViolations}\n`
  report += `- **Critical Violations**: ${summary.criticalViolations}\n`
  report += `- **Warning Violations**: ${summary.warningViolations}\n`
  report += `- **Configurations with Issues**: ${summary.configurationsWithViolations}\n\n`

  // Most problematic configurations
  const problematic = getMostProblematicConfigurations(analysis)
  if (problematic.length > 0) {
    report += '## Most Problematic Configurations\n\n'
    for (const config of problematic) {
      const criticalCount = config.violations.filter((v) => v.severity === 'error').length
      report += `- **${config.name}** (${config.type}): ${criticalCount} critical violations\n`
    }
    report += '\n'
  }

  // Violations by type
  const violationsByType = getViolationsByType(analysis)
  report += '## Violations by Type\n\n'
  report += `- **Collections**: ${violationsByType.collection.length} violations\n`
  report += `- **Globals**: ${violationsByType.global.length} violations\n`
  report += `- **Blocks**: ${violationsByType.block.length} violations\n\n`

  // Recommendations
  if (recommendations.length > 0) {
    report += '## Recommendations\n\n'
    for (const recommendation of recommendations) {
      report += `- ${recommendation}\n`
    }
    report += '\n'
  }

  return report
}
