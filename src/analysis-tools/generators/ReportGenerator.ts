/**
 * Report Generator
 * Generates comprehensive analysis reports with prioritized issues and implementation guides
 * Requirements: 6.1, 6.2, 6.3, 6.5, 6.6
 */

import type {
  Report,
  Summary,
  BlockReport,
  ComponentReport,
  IntegrationReport,
  PatternReport,
  ImplementationGuide,
  PrioritizedImprovement,
  Issue,
  Recommendation,
  BlockAnalysisResult,
  ComponentAnalysisResult,
  IntegrationResult,
  PatternComparisonResult,
  MissingFeature,
  CodeExample,
  ImplementationStep,
} from '../types'

export class ReportGenerator {
  /**
   * Generate complete analysis report
   * Requirements: 6.1, 6.6
   */
  generateReport(
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
    integration: IntegrationResult[],
    patterns: PatternComparisonResult[],
    missingFeatures: MissingFeature[] = [],
  ): Report {
    // Collect all issues
    const allIssues = this.collectAllIssues(blocks, components, integration)

    // Generate summary with metrics
    const summary = this.generateSummary(allIssues, blocks, components)

    // Generate block analysis section
    const blockAnalysis = this.generateBlockAnalysis(blocks)

    // Generate component analysis section
    const componentAnalysis = this.generateComponentAnalysis(components)

    // Generate integration analysis section
    const integrationAnalysis = this.generateIntegrationAnalysis(integration)

    // Generate pattern comparison section
    const patternComparison = this.generatePatternComparison(patterns, missingFeatures)

    // Generate implementation guide section
    const implementationGuide = this.generateImplementationGuide(
      allIssues,
      blocks,
      components,
      patterns,
      missingFeatures,
    )

    return {
      summary,
      blockAnalysis,
      componentAnalysis,
      integrationAnalysis,
      patternComparison,
      implementationGuide,
      generatedAt: new Date(),
    }
  }

  /**
   * Generate summary section with metrics
   * Requirements: 6.6
   */
  generateSummary(
    issues: Issue[],
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
  ): Summary {
    // Calculate aggregate metrics
    const totalBlocks = blocks.length
    const totalComponents = components.length
    const totalIssues = issues.length

    // Count issues by severity
    const issuesBySeverity = this.countIssuesBySeverity(issues)

    // Calculate overall quality score (0-100)
    const overallScore = this.calculateOverallScore(issues, blocks, components)

    // Identify top issues (highest severity and impact)
    const topIssues = this.identifyTopIssues(issues, 10)

    return {
      totalBlocks,
      totalComponents,
      totalIssues,
      issuesBySeverity,
      overallScore,
      topIssues,
    }
  }

  /**
   * Generate block analysis section
   * Requirements: 6.1
   */
  private generateBlockAnalysis(blocks: BlockAnalysisResult[]): BlockReport[] {
    return blocks.map((block) => ({
      blockSlug: block.blockSlug,
      blockPath: block.blockPath,
      issues: block.issues,
      metrics: block.metrics,
      recommendations: this.generateRecommendationsFromIssues(block.issues),
    }))
  }

  /**
   * Generate component analysis section
   * Requirements: 6.1
   */
  private generateComponentAnalysis(components: ComponentAnalysisResult[]): ComponentReport[] {
    return components.map((component) => ({
      componentName: component.componentName,
      componentPath: component.componentPath,
      componentType: component.componentType,
      issues: component.issues,
      metrics: component.metrics,
      recommendations: this.generateRecommendationsFromIssues(component.issues),
    }))
  }

  /**
   * Generate integration analysis section
   * Requirements: 6.1
   */
  private generateIntegrationAnalysis(integration: IntegrationResult[]): IntegrationReport {
    const validPairs = integration.filter((result) => result.isValid).length
    const invalidPairs = integration.filter((result) => !result.isValid).length

    // Collect all integration issues
    const issues = integration.flatMap((result) => result.issues)

    // Generate recommendations
    const recommendations = this.generateRecommendationsFromIntegrationIssues(issues)

    return {
      validPairs,
      invalidPairs,
      issues,
      recommendations,
    }
  }

  /**
   * Generate pattern comparison section
   * Requirements: 6.1
   */
  private generatePatternComparison(
    patterns: PatternComparisonResult[],
    missingFeatures: MissingFeature[],
  ): PatternReport {
    const recommendations = this.generatePatternRecommendations(patterns, missingFeatures)

    return {
      comparisonResults: patterns,
      missingFeatures,
      recommendations,
    }
  }

  /**
   * Generate implementation guide section
   * Requirements: 6.1, 6.3
   */
  private generateImplementationGuide(
    issues: Issue[],
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
    patterns: PatternComparisonResult[],
    missingFeatures: MissingFeature[],
  ): ImplementationGuide {
    // Prioritize issues
    const prioritizedIssues = this.prioritizeIssues(issues)

    // Generate improvements from prioritized issues
    const improvements = this.generateImprovements(
      prioritizedIssues,
      blocks,
      components,
      patterns,
      missingFeatures,
    )

    // Calculate total estimated effort
    const estimatedEffort = this.calculateTotalEffort(improvements)

    return {
      improvements,
      estimatedEffort,
    }
  }

  /**
   * Collect all issues from all analysis results
   */
  private collectAllIssues(
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
    integration: IntegrationResult[],
  ): Issue[] {
    const blockIssues = blocks.flatMap((block) => block.issues)
    const componentIssues = components.flatMap((component) => component.issues)

    // Convert integration issues to standard Issue format
    const integrationIssues = integration.flatMap((result) =>
      result.issues.map((issue) => this.convertIntegrationIssueToIssue(issue, result)),
    )

    return [...blockIssues, ...componentIssues, ...integrationIssues]
  }

  /**
   * Convert integration issue to standard Issue format
   */
  private convertIntegrationIssueToIssue(issue: any, result: IntegrationResult): Issue {
    const issueId = `integration-${result.blockSlug}-${Date.now()}-${Math.random()}`

    if ('type' in issue && issue.type === 'missing-prop') {
      return {
        id: issueId,
        type: 'field-prop-mismatch',
        severity: issue.severity,
        category: 'best-practice',
        title: `Missing prop: ${issue.fieldName}`,
        description: `Field "${issue.fieldName}" in block config has no corresponding prop in component`,
        location: {
          file: result.componentName,
        },
        remediation: `Add prop "${issue.fieldName}" to component interface`,
      }
    }

    if ('type' in issue && issue.type === 'slug-mismatch') {
      return {
        id: issueId,
        type: 'naming-inconsistency',
        severity: 'medium',
        category: 'best-practice',
        title: 'Naming inconsistency',
        description: `Expected "${issue.expected}" but found "${issue.actual}"`,
        location: {
          file: result.blockSlug,
        },
        remediation: `Rename to match expected naming convention`,
      }
    }

    // Default conversion
    return {
      id: issueId,
      type: 'field-prop-mismatch',
      severity: 'medium',
      category: 'best-practice',
      title: 'Integration issue',
      description: JSON.stringify(issue),
      location: {
        file: result.blockSlug,
      },
      remediation: 'Review integration between block and component',
    }
  }

  /**
   * Count issues by severity
   * Requirements: 6.2
   */
  private countIssuesBySeverity(issues: Issue[]): Record<string, number> {
    return issues.reduce(
      (acc, issue) => {
        acc[issue.severity] = (acc[issue.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  /**
   * Calculate overall quality score (0-100)
   * Requirements: 6.6
   */
  private calculateOverallScore(
    issues: Issue[],
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
  ): number {
    // Start with perfect score
    let score = 100

    // Deduct points for issues based on severity
    issues.forEach((issue) => {
      switch (issue.severity) {
        case 'critical':
          score -= 10
          break
        case 'high':
          score -= 5
          break
        case 'medium':
          score -= 2
          break
        case 'low':
          score -= 1
          break
      }
    })

    // Bonus points for good metrics
    blocks.forEach((block) => {
      if (block.metrics.hasAccessControl) score += 1
      if (block.metrics.hasValidation) score += 1
      if (block.metrics.hasInterfaceName) score += 1
    })

    components.forEach((component) => {
      if (component.metrics.hasErrorBoundary) score += 1
      if (component.metrics.hasLoadingState) score += 1
      if (component.metrics.accessibilityScore > 80) score += 2
    })

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score))
  }

  /**
   * Identify top issues by severity and impact
   * Requirements: 6.6
   */
  private identifyTopIssues(issues: Issue[], limit: number): Issue[] {
    // Sort by severity (critical > high > medium > low)
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }

    return issues
      .sort((a, b) => {
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
        if (severityDiff !== 0) return severityDiff

        // If same severity, sort by category (security > accessibility > performance > typing > best-practice)
        const categoryOrder = {
          security: 0,
          accessibility: 1,
          performance: 2,
          typing: 3,
          'best-practice': 4,
        }
        return categoryOrder[a.category] - categoryOrder[b.category]
      })
      .slice(0, limit)
  }

  /**
   * Prioritize issues based on severity, impact, and frequency
   * Requirements: 6.2, 6.5
   */
  prioritizeIssues(issues: Issue[]): Issue[] {
    // Group related issues together
    const groupedIssues = this.groupRelatedIssues(issues)

    // Score each issue
    const scoredIssues = groupedIssues.map((issue) => ({
      issue,
      score: this.calculateIssueScore(issue, groupedIssues),
    }))

    // Sort by score (highest first)
    scoredIssues.sort((a, b) => b.score - a.score)

    return scoredIssues.map((item) => item.issue)
  }

  /**
   * Group related issues together
   * Requirements: 6.5
   */
  private groupRelatedIssues(issues: Issue[]): Issue[] {
    // Group by file
    const issuesByFile = new Map<string, Issue[]>()

    issues.forEach((issue) => {
      const file = issue.location.file
      if (!issuesByFile.has(file)) {
        issuesByFile.set(file, [])
      }
      issuesByFile.get(file)!.push(issue)
    })

    // Link related issues
    const processedIssues: Issue[] = []

    issuesByFile.forEach((fileIssues, file) => {
      fileIssues.forEach((issue, index) => {
        const relatedIssues = fileIssues
          .filter((_, i) => i !== index)
          .map((relatedIssue) => relatedIssue.id)

        processedIssues.push({
          ...issue,
          relatedIssues: relatedIssues.length > 0 ? relatedIssues : undefined,
        })
      })
    })

    return processedIssues
  }

  /**
   * Calculate issue score for prioritization
   * Requirements: 6.2
   */
  private calculateIssueScore(issue: Issue, allIssues: Issue[]): number {
    let score = 0

    // Severity score
    switch (issue.severity) {
      case 'critical':
        score += 100
        break
      case 'high':
        score += 50
        break
      case 'medium':
        score += 25
        break
      case 'low':
        score += 10
        break
    }

    // Category impact score
    switch (issue.category) {
      case 'security':
        score += 50
        break
      case 'accessibility':
        score += 30
        break
      case 'performance':
        score += 20
        break
      case 'typing':
        score += 15
        break
      case 'best-practice':
        score += 10
        break
    }

    // Frequency score (how many similar issues exist)
    const similarIssues = allIssues.filter((i) => i.type === issue.type).length
    score += similarIssues * 5

    return score
  }

  /**
   * Generate recommendations from issues
   * Requirements: 6.3
   */
  private generateRecommendationsFromIssues(issues: Issue[]): Recommendation[] {
    return issues.map((issue, index) => ({
      priority: index + 1,
      title: issue.title,
      description: issue.remediation,
      codeExample: issue.codeExample
        ? {
            title: `Fix for ${issue.title}`,
            after: issue.codeExample,
            language: 'typescript',
          }
        : undefined,
      estimatedTime: this.estimateTimeForIssue(issue),
    }))
  }

  /**
   * Generate recommendations from integration issues
   */
  private generateRecommendationsFromIntegrationIssues(issues: any[]): Recommendation[] {
    return issues.map((issue, index) => ({
      priority: index + 1,
      title: `Integration: ${issue.type}`,
      description: JSON.stringify(issue),
      estimatedTime: '30 minutes',
    }))
  }

  /**
   * Generate recommendations from pattern comparison
   */
  private generatePatternRecommendations(
    patterns: PatternComparisonResult[],
    missingFeatures: MissingFeature[],
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Recommendations from missing features
    missingFeatures.forEach((feature, index) => {
      recommendations.push({
        priority: index + 1,
        title: `Adopt feature: ${feature.featureName}`,
        description: `${feature.description}\n\nBenefit: ${feature.benefit}`,
        estimatedTime: this.estimateTimeForComplexity(feature.implementationComplexity),
      })
    })

    return recommendations
  }

  /**
   * Generate improvements from prioritized issues
   * Requirements: 6.3
   */
  private generateImprovements(
    prioritizedIssues: Issue[],
    blocks: BlockAnalysisResult[],
    components: ComponentAnalysisResult[],
    patterns: PatternComparisonResult[],
    missingFeatures: MissingFeature[],
  ): PrioritizedImprovement[] {
    const improvements: PrioritizedImprovement[] = []

    // Group issues by file for better organization
    const issuesByFile = new Map<string, Issue[]>()
    prioritizedIssues.forEach((issue) => {
      const file = issue.location.file
      if (!issuesByFile.has(file)) {
        issuesByFile.set(file, [])
      }
      issuesByFile.get(file)!.push(issue)
    })

    // Create improvements for each file
    let priority = 1
    issuesByFile.forEach((fileIssues, file) => {
      const improvement = this.createImprovementFromIssues(file, fileIssues, priority)
      improvements.push(improvement)
      priority++
    })

    return improvements
  }

  /**
   * Create improvement from issues
   * Requirements: 6.3
   */
  private createImprovementFromIssues(
    file: string,
    issues: Issue[],
    priority: number,
  ): PrioritizedImprovement {
    const title = `Fix ${issues.length} issue(s) in ${file}`
    const description = issues.map((issue) => `- ${issue.title}: ${issue.description}`).join('\n')

    const steps: ImplementationStep[] = issues.map((issue, index) => ({
      stepNumber: index + 1,
      description: issue.remediation,
      code: issue.codeExample,
      affectedFiles: [file],
    }))

    const codeExamples: CodeExample[] = issues
      .filter((issue) => issue.codeExample)
      .map((issue) => ({
        title: issue.title,
        after: issue.codeExample!,
        language: 'typescript',
      }))

    const estimatedTime = this.calculateTotalTimeForIssues(issues)

    return {
      priority,
      title,
      description,
      affectedFiles: [file],
      steps,
      codeExamples,
      estimatedTime,
    }
  }

  /**
   * Calculate total effort for all improvements
   */
  private calculateTotalEffort(improvements: PrioritizedImprovement[]): string {
    const totalMinutes = improvements.reduce((total, improvement) => {
      const minutes = this.parseTimeToMinutes(improvement.estimatedTime)
      return total + minutes
    }, 0)

    return this.formatMinutesToTime(totalMinutes)
  }

  /**
   * Calculate total time for multiple issues
   */
  private calculateTotalTimeForIssues(issues: Issue[]): string {
    const totalMinutes = issues.reduce((total, issue) => {
      const time = this.estimateTimeForIssue(issue)
      return total + this.parseTimeToMinutes(time)
    }, 0)

    return this.formatMinutesToTime(totalMinutes)
  }

  /**
   * Estimate time for a single issue
   */
  private estimateTimeForIssue(issue: Issue): string {
    switch (issue.severity) {
      case 'critical':
        return '2 hours'
      case 'high':
        return '1 hour'
      case 'medium':
        return '30 minutes'
      case 'low':
        return '15 minutes'
      default:
        return '30 minutes'
    }
  }

  /**
   * Estimate time based on complexity
   */
  private estimateTimeForComplexity(complexity: 'low' | 'medium' | 'high'): string {
    switch (complexity) {
      case 'low':
        return '1 hour'
      case 'medium':
        return '4 hours'
      case 'high':
        return '1 day'
      default:
        return '2 hours'
    }
  }

  /**
   * Parse time string to minutes
   */
  private parseTimeToMinutes(time: string): number {
    if (time.includes('day')) {
      const days = parseInt(time)
      return days * 8 * 60 // 8 hours per day
    }
    if (time.includes('hour')) {
      const hours = parseInt(time)
      return hours * 60
    }
    if (time.includes('minute')) {
      return parseInt(time)
    }
    return 30 // default
  }

  /**
   * Format minutes to readable time string
   */
  private formatMinutesToTime(minutes: number): string {
    if (minutes >= 480) {
      const days = Math.ceil(minutes / 480)
      return `${days} day${days > 1 ? 's' : ''}`
    }
    if (minutes >= 60) {
      const hours = Math.ceil(minutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''}`
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
}
