import { writeFile } from 'fs/promises'
import type { OutputFormatter, AnalysisResult } from '../../types/index.js'

export class JsonFormatter implements OutputFormatter {
  async format(result: AnalysisResult): Promise<string> {
    // Create a clean, serializable version of the result
    const cleanResult = this.sanitizeResult(result)

    return JSON.stringify(cleanResult, null, 2)
  }

  async writeToFile(content: string, filePath: string): Promise<void> {
    await writeFile(filePath, content, 'utf-8')
  }

  private sanitizeResult(result: AnalysisResult): any {
    // Remove any non-serializable properties and create a clean structure
    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        format: 'json',
      },
      summary: result.report?.summary
        ? {
            totalBlocks: result.report.summary.totalBlocks,
            totalComponents: result.report.summary.totalComponents,
            totalIssues: result.report.summary.totalIssues,
            issuesBySeverity: result.report.summary.issuesBySeverity,
            overallScore: result.report.summary.overallScore,
            topIssues: result.report.summary.topIssues?.map((issue) => ({
              id: issue.id,
              type: issue.type,
              severity: issue.severity,
              category: issue.category,
              title: issue.title,
              description: issue.description,
              location: issue.location,
            })),
          }
        : null,
      blocks:
        result.blocks?.map((block) => ({
          blockSlug: block.blockSlug,
          blockPath: block.blockPath,
          metrics: {
            fieldCount: block.metrics?.fieldCount || 0,
            nestedDepth: block.metrics?.nestedDepth || 0,
            hasAccessControl: block.metrics?.hasAccessControl || false,
            hasValidation: block.metrics?.hasValidation || false,
            hasInterfaceName: block.metrics?.hasInterfaceName || false,
            complexityScore: block.metrics?.complexityScore || 0,
          },
          issues:
            block.issues?.map((issue) => ({
              id: issue.id,
              type: issue.type,
              severity: issue.severity,
              category: issue.category,
              title: issue.title,
              description: issue.description,
              location: {
                file: issue.location.file,
                line: issue.location.line,
                column: issue.location.column,
                snippet: issue.location.snippet,
              },
              remediation: issue.remediation,
              codeExample: issue.codeExample,
            })) || [],
          suggestions:
            block.suggestions?.map((suggestion) => ({
              type: suggestion.type,
              title: suggestion.title,
              description: suggestion.description,
              benefit: suggestion.benefit,
              effort: suggestion.effort,
            })) || [],
        })) || [],
      components:
        result.components?.map((component) => ({
          componentName: component.componentName,
          componentPath: component.componentPath,
          componentType: component.componentType,
          metrics: {
            lineCount: component.metrics?.lineCount || 0,
            complexity: component.metrics?.complexity || 0,
            hasErrorBoundary: component.metrics?.hasErrorBoundary || false,
            hasLoadingState: component.metrics?.hasLoadingState || false,
            accessibilityScore: component.metrics?.accessibilityScore || 0,
            performanceScore: component.metrics?.performanceScore || 0,
          },
          issues:
            component.issues?.map((issue) => ({
              id: issue.id,
              type: issue.type,
              severity: issue.severity,
              category: issue.category,
              title: issue.title,
              description: issue.description,
              location: {
                file: issue.location.file,
                line: issue.location.line,
                column: issue.location.column,
                snippet: issue.location.snippet,
              },
              remediation: issue.remediation,
              codeExample: issue.codeExample,
            })) || [],
          suggestions:
            component.suggestions?.map((suggestion) => ({
              type: suggestion.type,
              title: suggestion.title,
              description: suggestion.description,
              benefit: suggestion.benefit,
              effort: suggestion.effort,
            })) || [],
        })) || [],
      integration: result.integration
        ? {
            blockSlug: result.integration.blockSlug,
            componentName: result.integration.componentName,
            isValid: result.integration.isValid,
            issues:
              result.integration.issues?.map((issue) => ({
                type: issue.type,
                description: 'description' in issue ? issue.description : undefined,
                fieldName: 'fieldName' in issue ? issue.fieldName : undefined,
                expected: 'expected' in issue ? issue.expected : undefined,
                actual: 'actual' in issue ? issue.actual : undefined,
                severity: 'severity' in issue ? issue.severity : undefined,
                remediation: 'remediation' in issue ? issue.remediation : undefined,
              })) || [],
            suggestions: result.integration.suggestions || [],
          }
        : null,
      patterns: result.patterns
        ? {
            blockSlug: result.patterns.blockSlug,
            structuralDifferences:
              result.patterns.structuralDifferences?.map((diff) => ({
                type: diff.type,
                description: diff.description,
                officialApproach: diff.officialApproach,
                currentApproach: diff.currentApproach,
              })) || [],
            featureDifferences:
              result.patterns.featureDifferences?.map((diff) => ({
                featureName: diff.featureName,
                presentInOfficial: diff.presentInOfficial,
                presentInCurrent: diff.presentInCurrent,
                description: diff.description,
              })) || [],
            organizationDifferences:
              result.patterns.organizationDifferences?.map((diff) => ({
                type: diff.type,
                description: diff.description,
                recommendation: diff.recommendation,
              })) || [],
          }
        : null,
      tests: result.tests
        ? {
            blockTests: result.tests.blockTests?.length || 0,
            componentTests: result.tests.componentTests?.length || 0,
            integrationTests: result.tests.integrationTests?.length || 0,
            propertyTests: result.tests.propertyTests?.length || 0,
            accessibilityTests: result.tests.accessibilityTests?.length || 0,
          }
        : null,
      implementationGuide: result.report?.implementationGuide
        ? {
            estimatedEffort: result.report.implementationGuide.estimatedEffort,
            improvements:
              result.report.implementationGuide.improvements?.map((improvement) => ({
                priority: improvement.priority,
                title: improvement.title,
                description: improvement.description,
                affectedFiles: improvement.affectedFiles,
                estimatedTime: improvement.estimatedTime,
                steps:
                  improvement.steps?.map((step) => ({
                    stepNumber: step.stepNumber,
                    description: step.description,
                    code: step.code,
                    affectedFiles: step.affectedFiles,
                  })) || [],
                codeExamples:
                  improvement.codeExamples?.map((example) => ({
                    title: example.title,
                    before: example.before,
                    after: example.after,
                    language: example.language,
                  })) || [],
              })) || [],
            migrationPlan: result.report.implementationGuide.migrationPlan
              ? {
                  phases:
                    result.report.implementationGuide.migrationPlan.phases?.map((phase) => ({
                      phaseNumber: phase.phaseNumber,
                      title: phase.title,
                      description: phase.description,
                      estimatedTime: phase.estimatedTime,
                      steps:
                        phase.steps?.map((step) => ({
                          stepNumber: step.stepNumber,
                          description: step.description,
                          code: step.code,
                          affectedFiles: step.affectedFiles,
                        })) || [],
                    })) || [],
                  breakingChanges:
                    result.report.implementationGuide.migrationPlan.breakingChanges?.map(
                      (change) => ({
                        type: change.type,
                        description: change.description,
                        impact: change.impact,
                        mitigation: change.mitigation,
                      }),
                    ) || [],
                  rollbackStrategy:
                    result.report.implementationGuide.migrationPlan.rollbackStrategy,
                }
              : null,
          }
        : null,
    }
  }
}
