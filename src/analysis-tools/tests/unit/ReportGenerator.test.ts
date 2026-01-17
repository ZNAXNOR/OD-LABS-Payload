/**
 * Unit tests for ReportGenerator
 * Tests report generation, issue prioritization, and summary calculation
 */

import { describe, it, expect } from 'vitest'
import { ReportGenerator } from '../../generators/ReportGenerator'
import type {
  BlockAnalysisResult,
  ComponentAnalysisResult,
  IntegrationResult,
  PatternComparisonResult,
  Issue,
  MissingFeature,
} from '../../types'

describe('ReportGenerator', () => {
  const generator = new ReportGenerator()

  describe('generateReport', () => {
    it('should generate complete report with all sections', () => {
      const blocks: BlockAnalysisResult[] = [
        {
          blockPath: 'src/blocks/Hero/config.ts',
          blockSlug: 'hero',
          issues: [
            {
              id: 'issue-1',
              type: 'missing-validation',
              severity: 'high',
              category: 'best-practice',
              title: 'Missing validation',
              description: 'Field lacks validation',
              location: { file: 'src/blocks/Hero/config.ts', line: 10 },
              remediation: 'Add validation rule',
            },
          ],
          suggestions: [],
          metrics: {
            fieldCount: 5,
            nestedDepth: 2,
            hasAccessControl: true,
            hasValidation: false,
            hasInterfaceName: true,
            complexityScore: 15,
          },
        },
      ]

      const components: ComponentAnalysisResult[] = [
        {
          componentPath: 'src/components/blocks/hero/HeroBlock.tsx',
          componentName: 'HeroBlock',
          componentType: 'server',
          issues: [],
          suggestions: [],
          metrics: {
            lineCount: 100,
            complexity: 10,
            hasErrorBoundary: false,
            hasLoadingState: true,
            accessibilityScore: 85,
            performanceScore: 90,
          },
        },
      ]

      const integration: IntegrationResult[] = [
        {
          blockSlug: 'hero',
          componentName: 'HeroBlock',
          isValid: true,
          issues: [],
          suggestions: [],
        },
      ]

      const patterns: PatternComparisonResult[] = []
      const missingFeatures: MissingFeature[] = []

      const report = generator.generateReport(
        blocks,
        components,
        integration,
        patterns,
        missingFeatures,
      )

      expect(report).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.blockAnalysis).toHaveLength(1)
      expect(report.componentAnalysis).toHaveLength(1)
      expect(report.integrationAnalysis).toBeDefined()
      expect(report.patternComparison).toBeDefined()
      expect(report.implementationGuide).toBeDefined()
      expect(report.generatedAt).toBeInstanceOf(Date)
    })

    it('should handle empty analysis results', () => {
      const report = generator.generateReport([], [], [], [], [])

      expect(report.summary.totalBlocks).toBe(0)
      expect(report.summary.totalComponents).toBe(0)
      expect(report.summary.totalIssues).toBe(0)
      expect(report.blockAnalysis).toHaveLength(0)
      expect(report.componentAnalysis).toHaveLength(0)
    })
  })

  describe('generateSummary', () => {
    it('should calculate correct metrics', () => {
      const issues: Issue[] = [
        {
          id: '1',
          type: 'missing-validation',
          severity: 'critical',
          category: 'security',
          title: 'Critical issue',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix it',
        },
        {
          id: '2',
          type: 'missing-alt-text',
          severity: 'high',
          category: 'accessibility',
          title: 'High issue',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix it',
        },
        {
          id: '3',
          type: 'weak-typing',
          severity: 'medium',
          category: 'typing',
          title: 'Medium issue',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix it',
        },
      ]

      const blocks: BlockAnalysisResult[] = [
        {
          blockPath: 'test.ts',
          blockSlug: 'test',
          issues: [],
          suggestions: [],
          metrics: {
            fieldCount: 5,
            nestedDepth: 1,
            hasAccessControl: true,
            hasValidation: true,
            hasInterfaceName: true,
            complexityScore: 10,
          },
        },
      ]

      const components: ComponentAnalysisResult[] = []

      const summary = generator.generateSummary(issues, blocks, components)

      expect(summary.totalBlocks).toBe(1)
      expect(summary.totalComponents).toBe(0)
      expect(summary.totalIssues).toBe(3)
      expect(summary.issuesBySeverity.critical).toBe(1)
      expect(summary.issuesBySeverity.high).toBe(1)
      expect(summary.issuesBySeverity.medium).toBe(1)
      expect(summary.overallScore).toBeGreaterThan(0)
      expect(summary.overallScore).toBeLessThanOrEqual(100)
      expect(summary.topIssues).toHaveLength(3)
    })

    it('should prioritize critical issues in top issues', () => {
      const issues: Issue[] = [
        {
          id: '1',
          type: 'missing-validation',
          severity: 'low',
          category: 'best-practice',
          title: 'Low issue',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix it',
        },
        {
          id: '2',
          type: 'missing-access-control',
          severity: 'critical',
          category: 'security',
          title: 'Critical issue',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix it',
        },
      ]

      const summary = generator.generateSummary(issues, [], [])

      expect(summary.topIssues[0].severity).toBe('critical')
      expect(summary.topIssues[1].severity).toBe('low')
    })

    it('should calculate quality score correctly', () => {
      const noIssues: Issue[] = []
      const blocks: BlockAnalysisResult[] = [
        {
          blockPath: 'test.ts',
          blockSlug: 'test',
          issues: [],
          suggestions: [],
          metrics: {
            fieldCount: 5,
            nestedDepth: 1,
            hasAccessControl: true,
            hasValidation: true,
            hasInterfaceName: true,
            complexityScore: 10,
          },
        },
      ]

      const summary = generator.generateSummary(noIssues, blocks, [])

      // Should have high score with no issues and good metrics
      expect(summary.overallScore).toBeGreaterThan(90)
    })
  })

  describe('prioritizeIssues', () => {
    it('should prioritize by severity', () => {
      const issues: Issue[] = [
        {
          id: '1',
          type: 'weak-typing',
          severity: 'low',
          category: 'typing',
          title: 'Low',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix',
        },
        {
          id: '2',
          type: 'missing-access-control',
          severity: 'critical',
          category: 'security',
          title: 'Critical',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix',
        },
        {
          id: '3',
          type: 'missing-validation',
          severity: 'high',
          category: 'best-practice',
          title: 'High',
          description: 'Test',
          location: { file: 'test.ts' },
          remediation: 'Fix',
        },
      ]

      const prioritized = generator.prioritizeIssues(issues)

      expect(prioritized[0].severity).toBe('critical')
      expect(prioritized[1].severity).toBe('high')
      expect(prioritized[2].severity).toBe('low')
    })

    it('should group related issues by file', () => {
      const issues: Issue[] = [
        {
          id: '1',
          type: 'weak-typing',
          severity: 'medium',
          category: 'typing',
          title: 'Issue 1',
          description: 'Test',
          location: { file: 'file1.ts' },
          remediation: 'Fix',
        },
        {
          id: '2',
          type: 'missing-validation',
          severity: 'medium',
          category: 'best-practice',
          title: 'Issue 2',
          description: 'Test',
          location: { file: 'file1.ts' },
          remediation: 'Fix',
        },
      ]

      const prioritized = generator.prioritizeIssues(issues)

      // Both issues should have relatedIssues linking to each other
      expect(prioritized[0].relatedIssues).toBeDefined()
      expect(prioritized[0].relatedIssues).toContain(prioritized[1].id)
      expect(prioritized[1].relatedIssues).toContain(prioritized[0].id)
    })

    it('should handle empty issues array', () => {
      const prioritized = generator.prioritizeIssues([])
      expect(prioritized).toHaveLength(0)
    })
  })

  describe('integration analysis', () => {
    it('should count valid and invalid pairs', () => {
      const integration: IntegrationResult[] = [
        {
          blockSlug: 'hero',
          componentName: 'HeroBlock',
          isValid: true,
          issues: [],
          suggestions: [],
        },
        {
          blockSlug: 'banner',
          componentName: 'BannerBlock',
          isValid: false,
          issues: [
            {
              type: 'missing-prop',
              fieldName: 'title',
              expected: 'string',
              actual: 'undefined',
              severity: 'high',
            },
          ],
          suggestions: [],
        },
      ]

      const report = generator.generateReport([], [], integration, [], [])

      expect(report.integrationAnalysis.validPairs).toBe(1)
      expect(report.integrationAnalysis.invalidPairs).toBe(1)
      expect(report.integrationAnalysis.issues).toHaveLength(1)
    })
  })

  describe('pattern comparison', () => {
    it('should include missing features in recommendations', () => {
      const missingFeatures: MissingFeature[] = [
        {
          featureName: 'Conditional Fields',
          description: 'Use admin.condition for dynamic field visibility',
          usedInOfficial: ['hero', 'banner'],
          benefit: 'Better UX and cleaner admin interface',
          implementationComplexity: 'low',
        },
      ]

      const report = generator.generateReport([], [], [], [], missingFeatures)

      expect(report.patternComparison.missingFeatures).toHaveLength(1)
      expect(report.patternComparison.recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('implementation guide', () => {
    it('should generate improvements from issues', () => {
      const blocks: BlockAnalysisResult[] = [
        {
          blockPath: 'src/blocks/Hero/config.ts',
          blockSlug: 'hero',
          issues: [
            {
              id: 'issue-1',
              type: 'missing-validation',
              severity: 'high',
              category: 'best-practice',
              title: 'Missing validation',
              description: 'Field lacks validation',
              location: { file: 'src/blocks/Hero/config.ts', line: 10 },
              remediation: 'Add validation rule',
              codeExample: 'validate: (value) => Boolean(value) || "Required"',
            },
          ],
          suggestions: [],
          metrics: {
            fieldCount: 5,
            nestedDepth: 2,
            hasAccessControl: true,
            hasValidation: false,
            hasInterfaceName: true,
            complexityScore: 15,
          },
        },
      ]

      const report = generator.generateReport(blocks, [], [], [], [])

      expect(report.implementationGuide.improvements.length).toBeGreaterThan(0)
      expect(report.implementationGuide.estimatedEffort).toBeDefined()

      const improvement = report.implementationGuide.improvements[0]
      expect(improvement.priority).toBe(1)
      expect(improvement.affectedFiles).toContain('src/blocks/Hero/config.ts')
      expect(improvement.steps.length).toBeGreaterThan(0)
      expect(improvement.codeExamples.length).toBeGreaterThan(0)
    })

    it('should calculate total effort correctly', () => {
      const blocks: BlockAnalysisResult[] = [
        {
          blockPath: 'test.ts',
          blockSlug: 'test',
          issues: [
            {
              id: '1',
              type: 'missing-validation',
              severity: 'critical',
              category: 'security',
              title: 'Critical',
              description: 'Test',
              location: { file: 'test.ts' },
              remediation: 'Fix',
            },
            {
              id: '2',
              type: 'weak-typing',
              severity: 'low',
              category: 'typing',
              title: 'Low',
              description: 'Test',
              location: { file: 'test.ts' },
              remediation: 'Fix',
            },
          ],
          suggestions: [],
          metrics: {
            fieldCount: 5,
            nestedDepth: 1,
            hasAccessControl: true,
            hasValidation: false,
            hasInterfaceName: true,
            complexityScore: 10,
          },
        },
      ]

      const report = generator.generateReport(blocks, [], [], [], [])

      // Should have estimated effort for both issues
      expect(report.implementationGuide.estimatedEffort).toMatch(/hour|minute/)
    })
  })

  describe('edge cases', () => {
    it('should handle issues without code examples', () => {
      const blocks: BlockAnalysisResult[] = [
        {
          blockPath: 'test.ts',
          blockSlug: 'test',
          issues: [
            {
              id: '1',
              type: 'missing-validation',
              severity: 'medium',
              category: 'best-practice',
              title: 'Issue',
              description: 'Test',
              location: { file: 'test.ts' },
              remediation: 'Fix',
              // No codeExample
            },
          ],
          suggestions: [],
          metrics: {
            fieldCount: 5,
            nestedDepth: 1,
            hasAccessControl: true,
            hasValidation: false,
            hasInterfaceName: true,
            complexityScore: 10,
          },
        },
      ]

      const report = generator.generateReport(blocks, [], [], [], [])

      expect(report.implementationGuide.improvements[0].codeExamples).toHaveLength(0)
    })

    it('should handle components with perfect metrics', () => {
      const components: ComponentAnalysisResult[] = [
        {
          componentPath: 'perfect.tsx',
          componentName: 'Perfect',
          componentType: 'server',
          issues: [],
          suggestions: [],
          metrics: {
            lineCount: 50,
            complexity: 5,
            hasErrorBoundary: true,
            hasLoadingState: true,
            accessibilityScore: 100,
            performanceScore: 100,
          },
        },
      ]

      const summary = generator.generateSummary([], [], components)

      // Should have high score with perfect metrics
      expect(summary.overallScore).toBeGreaterThan(95)
    })
  })
})
