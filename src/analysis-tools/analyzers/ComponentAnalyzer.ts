/**
 * Component Analyzer
 * Main analyzer that orchestrates all component analysis
 * Analyzes React components for type safety, accessibility, performance, and error handling
 */

import type {
  Component,
  ComponentAnalysisResult,
  ComponentMetrics,
  Issue,
  Suggestion,
  AccessibilityIssue,
  PerformanceIssue,
  TypingIssue,
  SecurityIssue,
} from '../types'
import { ComponentParser } from './ComponentParser'
import { PropTypeAnalyzer } from './PropTypeAnalyzer'
import { AccessibilityAnalyzer } from './AccessibilityAnalyzer'
import { PerformanceAnalyzer } from './PerformanceAnalyzer'
import { ErrorHandlingAnalyzer, type ErrorHandlingIssue } from './ErrorHandlingAnalyzer'
import { generateId } from '../utils'

export class ComponentAnalyzer {
  private parser: ComponentParser
  private propTypeAnalyzer: PropTypeAnalyzer
  private accessibilityAnalyzer: AccessibilityAnalyzer
  private performanceAnalyzer: PerformanceAnalyzer
  private errorHandlingAnalyzer: ErrorHandlingAnalyzer

  constructor() {
    this.parser = new ComponentParser()
    this.propTypeAnalyzer = new PropTypeAnalyzer()
    this.accessibilityAnalyzer = new AccessibilityAnalyzer()
    this.performanceAnalyzer = new PerformanceAnalyzer()
    this.errorHandlingAnalyzer = new ErrorHandlingAnalyzer()
  }

  /**
   * Analyze a React component file
   */
  async analyzeComponent(componentPath: string): Promise<ComponentAnalysisResult> {
    try {
      // Parse the component
      const parsed = await this.parser.parseComponent(componentPath)
      const component = parsed.component

      // If parsing failed, return error result
      if (parsed.errors.length > 0) {
        return this.createErrorResult(componentPath, parsed.errors)
      }

      // Run all analyzers
      const issues: Issue[] = []
      const suggestions: Suggestion[] = []

      // 1. Prop type analysis
      const typingIssues = this.propTypeAnalyzer.checkPropTypes(component)
      issues.push(...this.convertTypingIssuesToIssues(typingIssues, componentPath, component.name))

      const typingSuggestions = this.propTypeAnalyzer.suggestImprovements(component)
      suggestions.push(
        ...typingSuggestions.map((s) => ({
          type: 'improvement' as const,
          title: 'Type Safety Improvement',
          description: s,
          benefit: 'Better type safety and developer experience',
          effort: 'low' as const,
        })),
      )

      // 2. Accessibility analysis
      const accessibilityIssues = this.accessibilityAnalyzer.checkAccessibility(component)
      issues.push(
        ...this.convertAccessibilityIssuesToIssues(
          accessibilityIssues,
          componentPath,
          component.name,
        ),
      )

      const accessibilitySuggestions = this.accessibilityAnalyzer.suggestImprovements(component)
      suggestions.push(
        ...accessibilitySuggestions.map((s) => ({
          type: 'improvement' as const,
          title: 'Accessibility Improvement',
          description: s,
          benefit: 'Better accessibility for all users',
          effort: 'medium' as const,
        })),
      )

      // 3. Performance analysis
      const performanceIssues = this.performanceAnalyzer.checkPerformance(component)
      issues.push(
        ...this.convertPerformanceIssuesToIssues(performanceIssues, componentPath, component.name),
      )

      const performanceSuggestions = this.performanceAnalyzer.suggestImprovements(component)
      suggestions.push(
        ...performanceSuggestions.map((s) => ({
          type: 'optimization' as const,
          title: 'Performance Optimization',
          description: s,
          benefit: 'Improved rendering performance',
          effort: 'medium' as const,
        })),
      )

      // 4. Error handling analysis
      const errorHandlingIssues = this.errorHandlingAnalyzer.checkErrorHandling(component)
      issues.push(
        ...this.convertErrorHandlingIssuesToIssues(
          errorHandlingIssues,
          componentPath,
          component.name,
        ),
      )

      const errorHandlingSuggestions = this.errorHandlingAnalyzer.suggestPatterns(component)
      suggestions.push(
        ...errorHandlingSuggestions.map((s) => ({
          type: 'improvement' as const,
          title: 'Error Handling Pattern',
          description: s,
          benefit: 'Better error handling and user experience',
          effort: 'medium' as const,
        })),
      )

      // Calculate metrics
      const metrics = this.calculateMetrics(
        component,
        accessibilityIssues,
        performanceIssues,
        errorHandlingIssues,
      )

      return {
        componentPath,
        componentName: component.name,
        componentType: component.type,
        issues,
        suggestions,
        metrics,
      }
    } catch (error) {
      return this.createErrorResult(componentPath, [
        {
          message: `Failed to analyze component: ${(error as Error).message}`,
        },
      ])
    }
  }

  /**
   * Detect component type (Server or Client)
   */
  detectComponentType(source: string): 'server' | 'client' {
    return this.parser.detectComponentType(source)
  }

  /**
   * Check accessibility
   */
  checkAccessibility(component: Component): AccessibilityIssue[] {
    return this.accessibilityAnalyzer.checkAccessibility(component)
  }

  /**
   * Check performance
   */
  checkPerformance(component: Component): PerformanceIssue[] {
    return this.performanceAnalyzer.checkPerformance(component)
  }

  /**
   * Check typing
   */
  checkTyping(component: Component): TypingIssue[] {
    return this.propTypeAnalyzer.checkPropTypes(component)
  }

  /**
   * Check security (placeholder for future implementation)
   */
  checkSecurity(component: Component): SecurityIssue[] {
    // TODO: Implement security checks (XSS, injection, etc.)
    return []
  }

  /**
   * Calculate component metrics
   */
  private calculateMetrics(
    component: Component,
    accessibilityIssues: AccessibilityIssue[],
    performanceIssues: PerformanceIssue[],
    errorHandlingIssues: ErrorHandlingIssue[],
  ): ComponentMetrics {
    const lineCount = this.calculateLineCount(component)
    const complexity = this.calculateComplexity(component)
    const errorHandlingMetrics = this.errorHandlingAnalyzer.calculateMetrics(component)
    const accessibilityScore =
      this.accessibilityAnalyzer.calculateAccessibilityScore(accessibilityIssues)
    const performanceScore = this.performanceAnalyzer.calculatePerformanceScore(performanceIssues)

    return {
      lineCount,
      complexity,
      hasErrorBoundary: errorHandlingMetrics.hasErrorBoundary,
      hasLoadingState: errorHandlingMetrics.hasLoadingState,
      accessibilityScore,
      performanceScore,
    }
  }

  /**
   * Calculate line count
   */
  private calculateLineCount(component: Component): number {
    if (!component.ast) return 0
    const text = component.ast.getFullText()
    return text.split('\n').length
  }

  /**
   * Calculate complexity (simplified cyclomatic complexity)
   */
  private calculateComplexity(component: Component): number {
    // Simplified complexity calculation
    let complexity = 1 // Base complexity

    // Add complexity for hooks
    complexity += component.hooks.length

    // Add complexity for props
    complexity += component.props.length

    // Add complexity for JSX elements
    complexity += component.jsx.length

    return complexity
  }

  /**
   * Convert typing issues to standard issues
   */
  private convertTypingIssuesToIssues(
    typingIssues: TypingIssue[],
    componentPath: string,
    componentName: string,
  ): Issue[] {
    return typingIssues.map((issue) => ({
      id: generateId('typing'),
      type: issue.type,
      severity: issue.type === 'any-type' ? 'high' : 'medium',
      category: 'typing' as const,
      title: 'Type Safety Issue',
      description: issue.suggestion,
      location: {
        file: componentPath,
        snippet: issue.location,
      },
      remediation: issue.suggestion,
    }))
  }

  /**
   * Convert accessibility issues to standard issues
   */
  private convertAccessibilityIssuesToIssues(
    accessibilityIssues: AccessibilityIssue[],
    componentPath: string,
    componentName: string,
  ): Issue[] {
    return accessibilityIssues.map((issue) => ({
      id: generateId('accessibility'),
      type: issue.type,
      severity: issue.wcagLevel === 'A' ? 'high' : issue.wcagLevel === 'AA' ? 'medium' : 'low',
      category: 'accessibility' as const,
      title: `Accessibility Issue (WCAG ${issue.wcagLevel})`,
      description: `${issue.element}: ${issue.remediation}`,
      location: {
        file: componentPath,
        line: issue.line,
        snippet: `Element: ${issue.element}`,
      },
      remediation: issue.remediation,
    }))
  }

  /**
   * Convert performance issues to standard issues
   */
  private convertPerformanceIssuesToIssues(
    performanceIssues: PerformanceIssue[],
    componentPath: string,
    componentName: string,
  ): Issue[] {
    return performanceIssues.map((issue) => ({
      id: generateId('performance'),
      type: issue.type,
      severity: issue.impact === 'high' ? 'high' : issue.impact === 'medium' ? 'medium' : 'low',
      category: 'performance' as const,
      title: 'Performance Issue',
      description: issue.description,
      location: {
        file: componentPath,
      },
      remediation: issue.suggestion,
    }))
  }

  /**
   * Convert error handling issues to standard issues
   */
  private convertErrorHandlingIssuesToIssues(
    errorHandlingIssues: ErrorHandlingIssue[],
    componentPath: string,
    componentName: string,
  ): Issue[] {
    return errorHandlingIssues.map((issue) => ({
      id: generateId('error-handling'),
      type: 'missing-validation', // Using generic type
      severity: issue.severity,
      category: 'best-practice' as const,
      title: 'Error Handling Issue',
      description: issue.description,
      location: {
        file: componentPath,
        line: issue.line,
      },
      remediation: issue.suggestion,
    }))
  }

  /**
   * Create error result when analysis fails
   */
  private createErrorResult(
    componentPath: string,
    errors: Array<{ message: string; line?: number }>,
  ): ComponentAnalysisResult {
    return {
      componentPath,
      componentName: 'unknown',
      componentType: 'server',
      issues: errors.map((error) => ({
        id: generateId('error'),
        type: 'missing-validation',
        severity: 'critical',
        category: 'best-practice',
        title: 'Component Analysis Failed',
        description: error.message,
        location: {
          file: componentPath,
          line: error.line,
        },
        remediation: 'Fix syntax errors or invalid component structure.',
      })),
      suggestions: [],
      metrics: {
        lineCount: 0,
        complexity: 0,
        hasErrorBoundary: false,
        hasLoadingState: false,
        accessibilityScore: 0,
        performanceScore: 0,
      },
    }
  }
}
