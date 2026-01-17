import chalk from 'chalk'
import type { OutputFormatter, AnalysisResult, Issue, Summary } from '../../types/index.js'

export class ConsoleFormatter implements OutputFormatter {
  async format(result: AnalysisResult): Promise<string> {
    const output: string[] = []

    // Header
    output.push(chalk.bold.blue('🔍 Payload CMS Blocks & Components Analysis Report'))
    output.push(chalk.gray('═'.repeat(60)))
    output.push('')

    // Summary
    if (result.report?.summary) {
      output.push(this.formatSummary(result.report.summary))
      output.push('')
    }

    // Block Analysis
    if (result.blocks?.length > 0) {
      output.push(chalk.bold.yellow('📦 Block Analysis'))
      output.push(chalk.gray('─'.repeat(40)))
      result.blocks.forEach((block) => {
        output.push(this.formatBlockResult(block))
      })
      output.push('')
    }

    // Component Analysis
    if (result.components?.length > 0) {
      output.push(chalk.bold.green('⚛️  Component Analysis'))
      output.push(chalk.gray('─'.repeat(40)))
      result.components.forEach((component) => {
        output.push(this.formatComponentResult(component))
      })
      output.push('')
    }

    // Integration Results
    if (result.integration) {
      output.push(chalk.bold.cyan('🔗 Integration Analysis'))
      output.push(chalk.gray('─'.repeat(40)))
      output.push(this.formatIntegrationResult(result.integration))
      output.push('')
    }

    // Pattern Comparison
    if (result.patterns) {
      output.push(chalk.bold.magenta('📋 Pattern Comparison'))
      output.push(chalk.gray('─'.repeat(40)))
      output.push(this.formatPatternResult(result.patterns))
      output.push('')
    }

    // Implementation Guide
    if (result.report?.implementationGuide) {
      output.push(chalk.bold.white('🚀 Implementation Guide'))
      output.push(chalk.gray('─'.repeat(40)))
      output.push(this.formatImplementationGuide(result.report.implementationGuide))
    }

    return output.join('\n')
  }

  private formatSummary(summary: Summary): string {
    const output: string[] = []

    output.push(chalk.bold.white('📊 Summary'))
    output.push(`  Blocks analyzed: ${chalk.cyan(summary.totalBlocks)}`)
    output.push(`  Components analyzed: ${chalk.cyan(summary.totalComponents)}`)
    output.push(`  Total issues found: ${chalk.yellow(summary.totalIssues)}`)
    output.push(`  Overall score: ${this.formatScore(summary.overallScore)}`)

    if (summary.issuesBySeverity) {
      output.push('')
      output.push('  Issues by severity:')
      Object.entries(summary.issuesBySeverity).forEach(([severity, count]) => {
        const color = this.getSeverityColor(severity)
        output.push(`    ${color(`${severity}:`)} ${count}`)
      })
    }

    if (summary.topIssues?.length > 0) {
      output.push('')
      output.push('  Top issues:')
      summary.topIssues.slice(0, 3).forEach((issue, index) => {
        const color = this.getSeverityColor(issue.severity)
        output.push(`    ${index + 1}. ${color(issue.title)}`)
      })
    }

    return output.join('\n')
  }

  private formatBlockResult(block: any): string {
    const output: string[] = []

    output.push(`  ${chalk.bold(block.blockSlug)} ${chalk.gray(`(${block.blockPath})`)}`)

    if (block.metrics) {
      output.push(
        `    Fields: ${block.metrics.fieldCount}, Complexity: ${block.metrics.complexityScore}`,
      )
      output.push(`    Access Control: ${block.metrics.hasAccessControl ? '✅' : '❌'}`)
      output.push(`    Validation: ${block.metrics.hasValidation ? '✅' : '❌'}`)
      output.push(`    TypeScript: ${block.metrics.hasInterfaceName ? '✅' : '❌'}`)
    }

    if (block.issues?.length > 0) {
      output.push(`    Issues (${block.issues.length}):`)
      block.issues.slice(0, 3).forEach((issue: Issue) => {
        const color = this.getSeverityColor(issue.severity)
        output.push(`      • ${color(issue.title)}`)
      })
      if (block.issues.length > 3) {
        output.push(`      ... and ${block.issues.length - 3} more`)
      }
    }

    return output.join('\n')
  }

  private formatComponentResult(component: any): string {
    const output: string[] = []

    const typeIcon = component.componentType === 'server' ? '🖥️' : '💻'
    output.push(
      `  ${typeIcon} ${chalk.bold(component.componentName)} ${chalk.gray(`(${component.componentPath})`)}`,
    )

    if (component.metrics) {
      output.push(
        `    Lines: ${component.metrics.lineCount}, Complexity: ${component.metrics.complexity}`,
      )
      output.push(
        `    Accessibility Score: ${this.formatScore(component.metrics.accessibilityScore)}`,
      )
      output.push(`    Performance Score: ${this.formatScore(component.metrics.performanceScore)}`)
      output.push(`    Error Boundary: ${component.metrics.hasErrorBoundary ? '✅' : '❌'}`)
      output.push(`    Loading State: ${component.metrics.hasLoadingState ? '✅' : '❌'}`)
    }

    if (component.issues?.length > 0) {
      output.push(`    Issues (${component.issues.length}):`)
      component.issues.slice(0, 3).forEach((issue: Issue) => {
        const color = this.getSeverityColor(issue.severity)
        output.push(`      • ${color(issue.title)}`)
      })
      if (component.issues.length > 3) {
        output.push(`      ... and ${component.issues.length - 3} more`)
      }
    }

    return output.join('\n')
  }

  private formatIntegrationResult(integration: any): string {
    const output: string[] = []

    output.push(`  Block-Component Integration: ${integration.isValid ? '✅ Valid' : '❌ Invalid'}`)
    output.push(`  Block: ${integration.blockSlug}`)
    output.push(`  Component: ${integration.componentName}`)

    if (integration.issues?.length > 0) {
      output.push(`  Issues (${integration.issues.length}):`)
      integration.issues.forEach((issue: any) => {
        const color = this.getSeverityColor(issue.severity || 'medium')
        output.push(`    • ${color(issue.type)}: ${issue.description || issue.fieldName}`)
      })
    }

    if (integration.suggestions?.length > 0) {
      output.push(`  Suggestions:`)
      integration.suggestions.forEach((suggestion: string) => {
        output.push(`    • ${chalk.blue(suggestion)}`)
      })
    }

    return output.join('\n')
  }

  private formatPatternResult(patterns: any): string {
    const output: string[] = []

    if (patterns.comparisonResults?.length > 0) {
      output.push(`  Compared against ${patterns.comparisonResults.length} official patterns`)

      patterns.comparisonResults.forEach((result: any) => {
        output.push(`    ${chalk.bold(result.blockSlug)}:`)

        if (result.structuralDifferences?.length > 0) {
          output.push(`      Structural differences: ${result.structuralDifferences.length}`)
        }

        if (result.featureDifferences?.length > 0) {
          output.push(`      Feature differences: ${result.featureDifferences.length}`)
        }
      })
    }

    if (patterns.missingFeatures?.length > 0) {
      output.push(`  Missing features from official patterns:`)
      patterns.missingFeatures.slice(0, 5).forEach((feature: any) => {
        const complexity = feature.implementationComplexity
        const complexityColor =
          complexity === 'low' ? chalk.green : complexity === 'medium' ? chalk.yellow : chalk.red
        output.push(
          `    • ${chalk.bold(feature.featureName)} ${complexityColor(`(${complexity})`)}`,
        )
        output.push(`      ${feature.description}`)
      })
    }

    return output.join('\n')
  }

  private formatImplementationGuide(guide: any): string {
    const output: string[] = []

    output.push(`  Estimated effort: ${chalk.cyan(guide.estimatedEffort)}`)

    if (guide.improvements?.length > 0) {
      output.push(`  Priority improvements:`)
      guide.improvements.slice(0, 5).forEach((improvement: any, index: number) => {
        output.push(
          `    ${index + 1}. ${chalk.bold(improvement.title)} ${chalk.gray(`(${improvement.estimatedTime})`)}`,
        )
        output.push(`       ${improvement.description}`)
        if (improvement.affectedFiles?.length > 0) {
          output.push(
            `       Files: ${improvement.affectedFiles.slice(0, 3).join(', ')}${improvement.affectedFiles.length > 3 ? '...' : ''}`,
          )
        }
      })
    }

    if (guide.migrationPlan) {
      output.push(`  Migration plan: ${guide.migrationPlan.phases?.length || 0} phases`)
      if (guide.migrationPlan.breakingChanges?.length > 0) {
        output.push(`  ⚠️  Breaking changes: ${guide.migrationPlan.breakingChanges.length}`)
      }
    }

    return output.join('\n')
  }

  private formatScore(score: number): string {
    if (score >= 80) return chalk.green(`${score}/100`)
    if (score >= 60) return chalk.yellow(`${score}/100`)
    return chalk.red(`${score}/100`)
  }

  private getSeverityColor(severity: string): typeof chalk.red {
    switch (severity.toLowerCase()) {
      case 'critical':
        return chalk.red
      case 'high':
        return chalk.red
      case 'medium':
        return chalk.yellow
      case 'low':
        return chalk.blue
      default:
        return chalk.gray
    }
  }
}
