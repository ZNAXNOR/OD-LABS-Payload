/**
 * Identifier Validation Pipeline
 *
 * This module provides a comprehensive validation pipeline for build-time
 * identifier length checking and automated fix suggestions.
 *
 * Requirements addressed: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import type { Config } from 'payload'
import {
  analyzeDatabaseName,
  generateDbNameSuggestions,
  type DbNameAnalysis,
} from './databaseNameGeneration'
import {
  analyzePayloadConfig,
  generateAnalysisReport,
  type IdentifierViolation,
  type PayloadConfigAnalysis,
} from './identifierAnalysis'

/**
 * Validation pipeline configuration
 */
export interface ValidationPipelineConfig {
  /** Whether to fail the build on critical violations */
  failOnCritical?: boolean
  /** Whether to show warnings for approaching limits */
  showWarnings?: boolean
  /** Whether to generate fix suggestions */
  generateSuggestions?: boolean
  /** Output format for reports */
  outputFormat?: 'console' | 'json' | 'markdown' | 'html'
  /** File path to write detailed report */
  reportOutputPath?: string
  /** Whether to include performance metrics */
  includeMetrics?: boolean
}

/**
 * Default validation pipeline configuration
 */
export const DEFAULT_PIPELINE_CONFIG: Required<ValidationPipelineConfig> = {
  failOnCritical: true,
  showWarnings: true,
  generateSuggestions: true,
  outputFormat: 'console',
  reportOutputPath: '',
  includeMetrics: false,
}

/**
 * Validation result with actionable information
 */
export interface ValidationResult {
  /** Whether validation passed (no critical violations) */
  passed: boolean
  /** Analysis results */
  analysis: PayloadConfigAnalysis
  /** Generated fix suggestions */
  suggestions: FixSuggestion[]
  /** Performance metrics */
  metrics?: ValidationMetrics
  /** Formatted report */
  report: string
}

/**
 * Fix suggestion for a violation
 */
export interface FixSuggestion {
  /** The violation this suggestion fixes */
  violation: IdentifierViolation
  /** Suggested dbName values */
  suggestedDbNames: string[]
  /** Analysis of each suggestion */
  dbNameAnalyses: DbNameAnalysis[]
  /** Recommended dbName (best quality score) */
  recommendedDbName: string
  /** Code snippet showing how to apply the fix */
  codeSnippet: string
  /** Explanation of why this fix is needed */
  explanation: string
}

/**
 * Performance metrics for validation
 */
export interface ValidationMetrics {
  /** Total validation time in milliseconds */
  totalTime: number
  /** Time spent on analysis */
  analysisTime: number
  /** Time spent generating suggestions */
  suggestionTime: number
  /** Number of configurations analyzed */
  configurationsAnalyzed: number
  /** Number of fields analyzed */
  fieldsAnalyzed: number
}

/**
 * Main validation pipeline function
 */
export async function validateIdentifiers(
  payloadConfig: Config,
  config: ValidationPipelineConfig = {},
): Promise<ValidationResult> {
  const startTime = Date.now()
  const finalConfig = { ...DEFAULT_PIPELINE_CONFIG, ...config }

  // Perform analysis
  const analysisStartTime = Date.now()
  const analysis = analyzePayloadConfig(payloadConfig)
  const analysisTime = Date.now() - analysisStartTime

  // Generate suggestions if requested
  const suggestionStartTime = Date.now()
  const suggestions = finalConfig.generateSuggestions ? await generateFixSuggestions(analysis) : []
  const suggestionTime = Date.now() - suggestionStartTime

  // Calculate metrics
  const totalTime = Date.now() - startTime
  const metrics: ValidationMetrics = {
    totalTime,
    analysisTime,
    suggestionTime,
    configurationsAnalyzed: analysis.configurations.length,
    fieldsAnalyzed: analysis.configurations.reduce((sum, c) => sum + c.fieldCount, 0),
  }

  // Generate report
  const report = generateValidationReport(analysis, suggestions, finalConfig, metrics)

  // Determine if validation passed
  const passed = !finalConfig.failOnCritical || analysis.summary.criticalViolations === 0

  return {
    passed,
    analysis,
    suggestions,
    metrics: finalConfig.includeMetrics ? metrics : undefined,
    report,
  }
}

/**
 * Generate fix suggestions for all violations
 */
export async function generateFixSuggestions(
  analysis: PayloadConfigAnalysis,
): Promise<FixSuggestion[]> {
  const suggestions: FixSuggestion[] = []

  // Get all violations that need fixing
  const violations = analysis.configurations.flatMap((c) => c.violations)
  const criticalViolations = violations.filter((v) => v.severity === 'error')

  for (const violation of criticalViolations) {
    const suggestion = await generateFixSuggestion(violation)
    if (suggestion) {
      suggestions.push(suggestion)
    }
  }

  return suggestions
}

/**
 * Generate a fix suggestion for a single violation
 */
export async function generateFixSuggestion(
  violation: IdentifierViolation,
): Promise<FixSuggestion | null> {
  // Extract the field name from the path
  const fieldPathParts = violation.fieldPath.split('.')
  const fieldName = fieldPathParts[fieldPathParts.length - 1]

  // Skip if fieldName is undefined
  if (!fieldName) {
    return null
  }

  // Generate dbName suggestions
  const suggestedDbNames = generateDbNameSuggestions(fieldName, violation.context.fieldType, 3)

  // Analyze each suggestion
  const dbNameAnalyses = suggestedDbNames.map((dbName) => analyzeDatabaseName(dbName, fieldName))

  // Find the best suggestion (highest quality score)
  const bestAnalysis = dbNameAnalyses.reduce((best, current) =>
    current.qualityScore > best.qualityScore ? current : best,
  )
  const recommendedDbName = bestAnalysis.dbName

  // Generate code snippet
  const codeSnippet = generateCodeSnippet(violation, recommendedDbName)

  // Generate explanation
  const explanation = generateExplanation(violation, recommendedDbName)

  return {
    violation,
    suggestedDbNames,
    dbNameAnalyses,
    recommendedDbName,
    codeSnippet,
    explanation,
  }
}

/**
 * Generate code snippet showing how to apply the fix
 */
function generateCodeSnippet(violation: IdentifierViolation, recommendedDbName: string): string {
  const fieldPathParts = violation.fieldPath.split('.')
  const fieldName = fieldPathParts[fieldPathParts.length - 1]

  // Generate TypeScript field configuration
  return `{
  name: '${fieldName}',
  type: '${violation.context.fieldType}',
  dbName: '${recommendedDbName}', // Fixes identifier length violation
  // ... other field properties
}`
}

/**
 * Generate explanation for why the fix is needed
 */
function generateExplanation(violation: IdentifierViolation, recommendedDbName: string): string {
  const lengthReduction = violation.length - recommendedDbName.length

  return (
    `The field path "${violation.fieldPath}" generates a ${violation.length}-character ` +
    `identifier "${violation.estimatedIdentifier}" which exceeds PostgreSQL's 63-character limit. ` +
    `Adding dbName: '${recommendedDbName}' reduces the identifier length by ${lengthReduction} ` +
    `characters while preserving semantic meaning.`
  )
}

/**
 * Generate comprehensive validation report
 */
function generateValidationReport(
  analysis: PayloadConfigAnalysis,
  suggestions: FixSuggestion[],
  config: Required<ValidationPipelineConfig>,
  metrics?: ValidationMetrics,
): string {
  switch (config.outputFormat) {
    case 'json':
      return generateJsonReport(analysis, suggestions, metrics)
    case 'markdown':
      return generateMarkdownReport(analysis, suggestions, metrics)
    case 'html':
      return generateHtmlReport(analysis, suggestions, metrics)
    default:
      return generateConsoleReport(analysis, suggestions, config, metrics)
  }
}

/**
 * Generate console-friendly report
 */
function generateConsoleReport(
  analysis: PayloadConfigAnalysis,
  suggestions: FixSuggestion[],
  config: Required<ValidationPipelineConfig>,
  metrics?: ValidationMetrics,
): string {
  let report = '\n🔍 Database Identifier Validation Report\n'
  report += '═'.repeat(50) + '\n\n'

  // Summary
  const { summary } = analysis
  report += `📊 Summary:\n`
  report += `   Configurations: ${summary.totalConfigurations}\n`
  report += `   Total Issues: ${summary.totalViolations}\n`

  if (summary.criticalViolations > 0) {
    report += `   🚨 Critical: ${summary.criticalViolations}\n`
  }

  if (summary.warningViolations > 0 && config.showWarnings) {
    report += `   ⚠️  Warnings: ${summary.warningViolations}\n`
  }

  report += '\n'

  // Critical violations
  if (summary.criticalViolations > 0) {
    report += '🚨 Critical Violations (Must Fix):\n'
    report += '─'.repeat(40) + '\n'

    const criticalViolations = analysis.configurations
      .flatMap((c) => c.violations)
      .filter((v) => v.severity === 'error')

    criticalViolations.forEach((violation, index) => {
      report += `${index + 1}. ${violation.configurationName} (${violation.configurationType})\n`
      report += `   Field: ${violation.fieldPath}\n`
      report += `   Identifier: ${violation.estimatedIdentifier} (${violation.length} chars)\n`

      // Find suggestion for this violation
      const suggestion = suggestions.find((s) => s.violation === violation)
      if (suggestion) {
        report += `   💡 Fix: Add dbName: '${suggestion.recommendedDbName}'\n`
      }
      report += '\n'
    })
  }

  // Warnings
  if (config.showWarnings && summary.warningViolations > 0) {
    report += '⚠️  Warnings (Approaching Limit):\n'
    report += '─'.repeat(40) + '\n'

    const warningViolations = analysis.configurations
      .flatMap((c) => c.violations)
      .filter((v) => v.severity === 'warning')
      .slice(0, 5) // Show first 5 warnings

    warningViolations.forEach((violation, index) => {
      report += `${index + 1}. ${violation.configurationName}: ${violation.fieldPath} (${violation.length} chars)\n`
    })

    if (summary.warningViolations > 5) {
      report += `   ... and ${summary.warningViolations - 5} more\n`
    }
    report += '\n'
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    report += '💡 Recommendations:\n'
    report += '─'.repeat(40) + '\n'
    analysis.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`
    })
    report += '\n'
  }

  // Performance metrics
  if (metrics) {
    report += `⏱️  Performance: ${metrics.totalTime}ms (${metrics.configurationsAnalyzed} configs, ${metrics.fieldsAnalyzed} fields)\n\n`
  }

  // Final status
  const passed = summary.criticalViolations === 0
  if (passed) {
    report += '✅ Validation PASSED - No critical violations found\n'
  } else {
    report += `❌ Validation FAILED - ${summary.criticalViolations} critical violations must be fixed\n`
  }

  return report
}

/**
 * Generate JSON report
 */
function generateJsonReport(
  analysis: PayloadConfigAnalysis,
  suggestions: FixSuggestion[],
  metrics?: ValidationMetrics,
): string {
  return JSON.stringify(
    {
      analysis,
      suggestions,
      metrics,
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
}

/**
 * Generate Markdown report
 */
function generateMarkdownReport(
  analysis: PayloadConfigAnalysis,
  suggestions: FixSuggestion[],
  metrics?: ValidationMetrics,
): string {
  let report = generateAnalysisReport(analysis)

  if (suggestions.length > 0) {
    report += '\n## Fix Suggestions\n\n'
    suggestions.forEach((suggestion, index) => {
      report += `### ${index + 1}. ${suggestion.violation.configurationName}\n\n`
      report += `**Field:** \`${suggestion.violation.fieldPath}\`\n\n`
      report += `**Issue:** ${suggestion.explanation}\n\n`
      report += `**Recommended Fix:**\n\n`
      report += '```typescript\n'
      report += suggestion.codeSnippet
      report += '\n```\n\n'
    })
  }

  if (metrics) {
    report += '\n## Performance Metrics\n\n'
    report += `- **Total Time:** ${metrics.totalTime}ms\n`
    report += `- **Analysis Time:** ${metrics.analysisTime}ms\n`
    report += `- **Suggestion Time:** ${metrics.suggestionTime}ms\n`
    report += `- **Configurations Analyzed:** ${metrics.configurationsAnalyzed}\n`
    report += `- **Fields Analyzed:** ${metrics.fieldsAnalyzed}\n`
  }

  return report
}

/**
 * Generate HTML report
 */
function generateHtmlReport(
  analysis: PayloadConfigAnalysis,
  suggestions: FixSuggestion[],
  metrics?: ValidationMetrics,
): string {
  // Convert markdown to HTML (simplified)
  const markdownReport = generateMarkdownReport(analysis, suggestions, metrics)

  return `<!DOCTYPE html>
<html>
<head>
  <title>Database Identifier Validation Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .critical { color: #d73a49; }
    .warning { color: #f66a0a; }
    .success { color: #28a745; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; }
    code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
  </style>
</head>
<body>
  <pre>${markdownReport}</pre>
</body>
</html>`
}

/**
 * CLI-friendly validation function
 */
export async function validateIdentifiersCLI(
  payloadConfig: Config,
  options: {
    verbose?: boolean
    failOnWarnings?: boolean
    outputFile?: string
    format?: 'console' | 'json' | 'markdown'
  } = {},
): Promise<{ exitCode: number; report: string }> {
  const config: ValidationPipelineConfig = {
    failOnCritical: true,
    showWarnings: options.verbose || false,
    generateSuggestions: true,
    outputFormat: options.format || 'console',
    reportOutputPath: options.outputFile || '',
    includeMetrics: options.verbose || false,
  }

  const result = await validateIdentifiers(payloadConfig, config)

  // Determine exit code
  let exitCode = 0
  if (!result.passed) {
    exitCode = 1
  } else if (options.failOnWarnings && result.analysis.summary.warningViolations > 0) {
    exitCode = 1
  }

  return {
    exitCode,
    report: result.report,
  }
}
