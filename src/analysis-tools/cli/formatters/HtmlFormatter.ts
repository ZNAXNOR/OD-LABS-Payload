import { writeFile } from 'fs/promises'
import type { OutputFormatter, AnalysisResult, Issue } from '../../types/index.js'

export class HtmlFormatter implements OutputFormatter {
  async format(result: AnalysisResult): Promise<string> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payload CMS Analysis Report</title>
    <style>
        ${this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🔍 Payload CMS Blocks & Components Analysis Report</h1>
            <p class="generated-at">Generated on ${new Date().toLocaleString()}</p>
        </header>

        ${this.formatSummarySection(result.report?.summary)}
        ${this.formatBlocksSection(result.blocks)}
        ${this.formatComponentsSection(result.components)}
        ${this.formatIntegrationSection(result.integration)}
        ${this.formatPatternsSection(result.patterns)}
        ${this.formatImplementationGuideSection(result.report?.implementationGuide)}
    </div>

    <script>
        ${this.getScripts()}
    </script>
</body>
</html>`

    return html.trim()
  }

  async writeToFile(content: string, filePath: string): Promise<void> {
    await writeFile(filePath, content, 'utf-8')
  }

  private getStyles(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .generated-at {
            opacity: 0.9;
            font-size: 0.9rem;
        }
        
        .section {
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .section-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .section-header h2 {
            color: #495057;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-content {
            padding: 20px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .summary-card h3 {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary-card .value {
            font-size: 2rem;
            font-weight: bold;
            color: #495057;
        }
        
        .score {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .score.high { background: #d4edda; color: #155724; }
        .score.medium { background: #fff3cd; color: #856404; }
        .score.low { background: #f8d7da; color: #721c24; }
        
        .severity {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .severity.critical { background: #dc3545; color: white; }
        .severity.high { background: #fd7e14; color: white; }
        .severity.medium { background: #ffc107; color: #212529; }
        .severity.low { background: #17a2b8; color: white; }
        
        .item {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .item-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 5px;
        }
        
        .item-path {
            color: #6c757d;
            font-size: 0.9rem;
            font-family: monospace;
        }
        
        .item-content {
            padding: 20px;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .metric-label {
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .metric-value {
            font-weight: bold;
        }
        
        .issues {
            margin-top: 15px;
        }
        
        .issue {
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 0 6px 6px 0;
        }
        
        .issue.critical { border-left-color: #dc3545; }
        .issue.high { border-left-color: #fd7e14; }
        .issue.medium { border-left-color: #ffc107; }
        .issue.low { border-left-color: #17a2b8; }
        
        .issue-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .issue-description {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .code-example {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }
        
        .improvement {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        
        .improvement-header {
            background: #e3f2fd;
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .improvement-title {
            font-weight: bold;
            color: #1976d2;
        }
        
        .improvement-meta {
            font-size: 0.9rem;
            color: #6c757d;
            margin-top: 5px;
        }
        
        .improvement-content {
            padding: 15px;
        }
        
        .collapsible {
            cursor: pointer;
            user-select: none;
        }
        
        .collapsible:hover {
            background: #f0f0f0;
        }
        
        .collapsible-content {
            display: none;
        }
        
        .collapsible.active + .collapsible-content {
            display: block;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 8px;
            background: #6c757d;
            color: white;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-left: 10px;
        }
        
        .type-server { background: #28a745; }
        .type-client { background: #007bff; }
        
        .status-valid { color: #28a745; }
        .status-invalid { color: #dc3545; }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .summary-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics {
                grid-template-columns: 1fr;
            }
        }
    `
  }

  private formatSummarySection(summary: any): string {
    if (!summary) return ''

    return `
        <section class="section">
            <div class="section-header">
                <h2>📊 Summary</h2>
            </div>
            <div class="section-content">
                <div class="summary-grid">
                    <div class="summary-card">
                        <h3>Blocks Analyzed</h3>
                        <div class="value">${summary.totalBlocks || 0}</div>
                    </div>
                    <div class="summary-card">
                        <h3>Components Analyzed</h3>
                        <div class="value">${summary.totalComponents || 0}</div>
                    </div>
                    <div class="summary-card">
                        <h3>Total Issues</h3>
                        <div class="value">${summary.totalIssues || 0}</div>
                    </div>
                    <div class="summary-card">
                        <h3>Overall Score</h3>
                        <div class="value">
                            <span class="score ${this.getScoreClass(summary.overallScore)}">${summary.overallScore || 0}/100</span>
                        </div>
                    </div>
                </div>
                
                ${this.formatIssuesBySeverity(summary.issuesBySeverity)}
                ${this.formatTopIssues(summary.topIssues)}
            </div>
        </section>
    `
  }

  private formatIssuesBySeverity(issuesBySeverity: Record<string, number>): string {
    if (!issuesBySeverity || Object.keys(issuesBySeverity).length === 0) return ''

    const severityItems = Object.entries(issuesBySeverity)
      .map(
        ([severity, count]) => `
        <div class="metric">
            <span class="metric-label">
                <span class="severity ${severity}">${severity}</span>
            </span>
            <span class="metric-value">${count}</span>
        </div>
      `,
      )
      .join('')

    return `
        <h3>Issues by Severity</h3>
        <div class="metrics">
            ${severityItems}
        </div>
    `
  }

  private formatTopIssues(topIssues: Issue[]): string {
    if (!topIssues || topIssues.length === 0) return ''

    const issueItems = topIssues
      .slice(0, 5)
      .map(
        (issue, index) => `
        <div class="issue ${issue.severity}">
            <div class="issue-title">
                ${index + 1}. ${this.escapeHtml(issue.title)}
                <span class="severity ${issue.severity}">${issue.severity}</span>
            </div>
            <div class="issue-description">${this.escapeHtml(issue.description)}</div>
        </div>
    `,
      )
      .join('')

    return `
        <h3>Top Issues</h3>
        <div class="issues">
            ${issueItems}
        </div>
    `
  }

  private formatBlocksSection(blocks: any[]): string {
    if (!blocks || blocks.length === 0) return ''

    const blockItems = blocks
      .map(
        (block) => `
        <div class="item">
            <div class="item-header">
                <div class="item-title">📦 ${this.escapeHtml(block.blockSlug)}</div>
                <div class="item-path">${this.escapeHtml(block.blockPath)}</div>
            </div>
            <div class="item-content">
                ${this.formatBlockMetrics(block.metrics)}
                ${this.formatIssues(block.issues)}
            </div>
        </div>
    `,
      )
      .join('')

    return `
        <section class="section">
            <div class="section-header">
                <h2>📦 Block Analysis</h2>
            </div>
            <div class="section-content">
                ${blockItems}
            </div>
        </section>
    `
  }

  private formatBlockMetrics(metrics: any): string {
    if (!metrics) return ''

    return `
        <div class="metrics">
            <div class="metric">
                <span class="metric-label">Fields</span>
                <span class="metric-value">${metrics.fieldCount || 0}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Complexity</span>
                <span class="metric-value">${metrics.complexityScore || 0}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Access Control</span>
                <span class="metric-value">${metrics.hasAccessControl ? '✅' : '❌'}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Validation</span>
                <span class="metric-value">${metrics.hasValidation ? '✅' : '❌'}</span>
            </div>
            <div class="metric">
                <span class="metric-label">TypeScript</span>
                <span class="metric-value">${metrics.hasInterfaceName ? '✅' : '❌'}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Nested Depth</span>
                <span class="metric-value">${metrics.nestedDepth || 0}</span>
            </div>
        </div>
    `
  }

  private formatComponentsSection(components: any[]): string {
    if (!components || components.length === 0) return ''

    const componentItems = components
      .map(
        (component) => `
        <div class="item">
            <div class="item-header">
                <div class="item-title">
                    ⚛️ ${this.escapeHtml(component.componentName)}
                    <span class="badge type-${component.componentType}">${component.componentType}</span>
                </div>
                <div class="item-path">${this.escapeHtml(component.componentPath)}</div>
            </div>
            <div class="item-content">
                ${this.formatComponentMetrics(component.metrics)}
                ${this.formatIssues(component.issues)}
            </div>
        </div>
    `,
      )
      .join('')

    return `
        <section class="section">
            <div class="section-header">
                <h2>⚛️ Component Analysis</h2>
            </div>
            <div class="section-content">
                ${componentItems}
            </div>
        </section>
    `
  }

  private formatComponentMetrics(metrics: any): string {
    if (!metrics) return ''

    return `
        <div class="metrics">
            <div class="metric">
                <span class="metric-label">Lines</span>
                <span class="metric-value">${metrics.lineCount || 0}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Complexity</span>
                <span class="metric-value">${metrics.complexity || 0}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Accessibility</span>
                <span class="metric-value">
                    <span class="score ${this.getScoreClass(metrics.accessibilityScore)}">${metrics.accessibilityScore || 0}/100</span>
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Performance</span>
                <span class="metric-value">
                    <span class="score ${this.getScoreClass(metrics.performanceScore)}">${metrics.performanceScore || 0}/100</span>
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Error Boundary</span>
                <span class="metric-value">${metrics.hasErrorBoundary ? '✅' : '❌'}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Loading State</span>
                <span class="metric-value">${metrics.hasLoadingState ? '✅' : '❌'}</span>
            </div>
        </div>
    `
  }

  private formatIntegrationSection(integration: any): string {
    if (!integration) return ''

    return `
        <section class="section">
            <div class="section-header">
                <h2>🔗 Integration Analysis</h2>
            </div>
            <div class="section-content">
                <div class="item">
                    <div class="item-header">
                        <div class="item-title">
                            Block-Component Integration
                            <span class="status-${integration.isValid ? 'valid' : 'invalid'}">
                                ${integration.isValid ? '✅ Valid' : '❌ Invalid'}
                            </span>
                        </div>
                        <div class="item-path">
                            Block: ${this.escapeHtml(integration.blockSlug)} → 
                            Component: ${this.escapeHtml(integration.componentName)}
                        </div>
                    </div>
                    <div class="item-content">
                        ${this.formatIssues(integration.issues)}
                        ${this.formatSuggestions(integration.suggestions)}
                    </div>
                </div>
            </div>
        </section>
    `
  }

  private formatPatternsSection(patterns: any): string {
    if (!patterns) return ''

    return `
        <section class="section">
            <div class="section-header">
                <h2>📋 Pattern Comparison</h2>
            </div>
            <div class="section-content">
                <p>Comparison against official Payload CMS patterns</p>
                ${this.formatPatternComparison(patterns)}
            </div>
        </section>
    `
  }

  private formatPatternComparison(patterns: any): string {
    // This would format the pattern comparison results
    // For now, return a placeholder
    return `
        <div class="item">
            <div class="item-header">
                <div class="item-title">Pattern Analysis Results</div>
            </div>
            <div class="item-content">
                <p>Pattern comparison results would be displayed here.</p>
            </div>
        </div>
    `
  }

  private formatImplementationGuideSection(guide: any): string {
    if (!guide) return ''

    const improvements = guide.improvements
      ?.slice(0, 10)
      .map(
        (improvement: any, index: number) => `
        <div class="improvement">
            <div class="improvement-header collapsible" onclick="toggleCollapsible(this)">
                <div class="improvement-title">${index + 1}. ${this.escapeHtml(improvement.title)}</div>
                <div class="improvement-meta">
                    Priority: ${improvement.priority} | 
                    Estimated Time: ${improvement.estimatedTime} |
                    Files: ${improvement.affectedFiles?.length || 0}
                </div>
            </div>
            <div class="improvement-content collapsible-content">
                <p>${this.escapeHtml(improvement.description)}</p>
                ${
                  improvement.codeExamples?.length > 0
                    ? `
                    <h4>Code Example:</h4>
                    <div class="code-example">${this.escapeHtml(improvement.codeExamples[0].after)}</div>
                `
                    : ''
                }
            </div>
        </div>
    `,
      )
      .join('')

    return `
        <section class="section">
            <div class="section-header">
                <h2>🚀 Implementation Guide</h2>
            </div>
            <div class="section-content">
                <div class="summary-card">
                    <h3>Estimated Effort</h3>
                    <div class="value">${guide.estimatedEffort}</div>
                </div>
                
                <h3>Priority Improvements</h3>
                ${improvements}
            </div>
        </section>
    `
  }

  private formatIssues(issues: Issue[]): string {
    if (!issues || issues.length === 0) return ''

    const issueItems = issues
      .map(
        (issue) => `
        <div class="issue ${issue.severity}">
            <div class="issue-title">
                ${this.escapeHtml(issue.title)}
                <span class="severity ${issue.severity}">${issue.severity}</span>
            </div>
            <div class="issue-description">${this.escapeHtml(issue.description)}</div>
            ${issue.codeExample ? `<div class="code-example">${this.escapeHtml(issue.codeExample)}</div>` : ''}
        </div>
    `,
      )
      .join('')

    return `
        <h4>Issues (${issues.length})</h4>
        <div class="issues">
            ${issueItems}
        </div>
    `
  }

  private formatSuggestions(suggestions: string[]): string {
    if (!suggestions || suggestions.length === 0) return ''

    const suggestionItems = suggestions
      .map(
        (suggestion) => `
        <li>${this.escapeHtml(suggestion)}</li>
    `,
      )
      .join('')

    return `
        <h4>Suggestions</h4>
        <ul>
            ${suggestionItems}
        </ul>
    `
  }

  private getScoreClass(score: number): string {
    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    return 'low'
  }

  private escapeHtml(text: string): string {
    if (typeof text !== 'string') return String(text)

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  private getScripts(): string {
    return `
        function toggleCollapsible(element) {
            element.classList.toggle('active');
        }
        
        // Initialize collapsible elements
        document.addEventListener('DOMContentLoaded', function() {
            const collapsibles = document.querySelectorAll('.collapsible');
            collapsibles.forEach(function(collapsible) {
                collapsible.addEventListener('click', function() {
                    this.classList.toggle('active');
                });
            });
        });
    `
  }
}
