/**
 * Performance Analyzer
 * Analyzes React components for performance issues
 * Detects missing memoization, large lists without virtualization, missing lazy loading, etc.
 */

import * as ts from 'typescript'
import type { Component, JSXElement, PerformanceIssue } from '../types'

export class PerformanceAnalyzer {
  /**
   * Check component for performance issues
   */
  checkPerformance(component: Component): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []

    // Check for missing React.memo
    const memoIssues = this.checkMemoization(component)
    issues.push(...memoIssues)

    // Check for large lists without virtualization
    const listIssues = this.checkLargeListRendering(component)
    issues.push(...listIssues)

    // Check for images without lazy loading
    const imageIssues = this.checkImageOptimization(component)
    issues.push(...imageIssues)

    // Check for expensive computations without useMemo
    const computationIssues = this.checkExpensiveComputations(component)
    issues.push(...computationIssues)

    // Check for heavy dependencies
    const dependencyIssues = this.checkHeavyDependencies(component)
    issues.push(...dependencyIssues)

    return issues
  }

  /**
   * Check if component should use React.memo
   */
  private checkMemoization(component: Component): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []

    // Only check client components (server components don't need memo)
    if (component.type !== 'client') {
      return issues
    }

    // Check if component is wrapped with React.memo
    const isMemoized = this.isComponentMemoized(component)

    if (!isMemoized) {
      // Check if component receives object or array props
      const hasComplexProps = component.props.some((prop) => {
        const type = prop.type.toLowerCase()
        return (
          type.includes('object') ||
          type.includes('array') ||
          type.includes('[]') ||
          type.includes('{}') ||
          type.includes('function') ||
          type.includes('=>')
        )
      })

      if (hasComplexProps) {
        issues.push({
          type: 'missing-memo',
          description: `Component receives object/array/function props but is not memoized`,
          impact: 'medium',
          suggestion:
            `Wrap component with React.memo() to prevent unnecessary re-renders when props haven't changed. ` +
            `Example: export default React.memo(${component.name})`,
        })
      }

      // Check if component has many props (might benefit from memo)
      if (component.props.length > 5) {
        issues.push({
          type: 'missing-memo',
          description: `Component has ${component.props.length} props and might benefit from memoization`,
          impact: 'low',
          suggestion:
            `Consider wrapping component with React.memo() to optimize re-renders, ` +
            `especially if parent component re-renders frequently.`,
        })
      }
    }

    return issues
  }

  /**
   * Check if component is wrapped with React.memo
   */
  private isComponentMemoized(component: Component): boolean {
    if (!component.ast) return false

    let isMemoized = false

    const visit = (node: ts.Node) => {
      // Look for React.memo() calls
      if (ts.isCallExpression(node)) {
        const expression = node.expression

        // Check for React.memo
        if (ts.isPropertyAccessExpression(expression)) {
          if (
            ts.isIdentifier(expression.expression) &&
            expression.expression.text === 'React' &&
            ts.isIdentifier(expression.name) &&
            expression.name.text === 'memo'
          ) {
            isMemoized = true
          }
        }

        // Check for memo (imported from React)
        if (ts.isIdentifier(expression) && expression.text === 'memo') {
          isMemoized = true
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(component.ast)
    return isMemoized
  }

  /**
   * Check for large lists without virtualization
   */
  private checkLargeListRendering(component: Component): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []

    // Look for .map() calls in JSX
    const mapCalls = this.findMapCalls(component)

    mapCalls.forEach((mapCall) => {
      // Check if the array being mapped is likely large
      // This is a heuristic - we can't know the actual size at static analysis time
      const arrayName = mapCall.arrayName

      // Check if array comes from props or state
      const isFromProps = component.props.some((p) => p.name === arrayName)
      const isFromState = this.isStateVariable(component, arrayName)

      if (isFromProps || isFromState) {
        // Suggest virtualization for arrays from external sources
        issues.push({
          type: 'large-list',
          description: `Component renders list using .map() without virtualization`,
          impact: 'high',
          suggestion:
            `If '${arrayName}' can contain many items (50+), consider using virtualization ` +
            `with libraries like react-window or react-virtual to improve performance. ` +
            `Virtualization only renders visible items, significantly reducing DOM nodes.`,
        })
      }
    })

    return issues
  }

  /**
   * Find .map() calls in component
   */
  private findMapCalls(component: Component): Array<{ arrayName: string; line: number }> {
    const mapCalls: Array<{ arrayName: string; line: number }> = []

    if (!component.ast) return mapCalls

    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression

        // Check for .map() calls
        if (ts.isPropertyAccessExpression(expression)) {
          if (ts.isIdentifier(expression.name) && expression.name.text === 'map') {
            // Get the array name
            let arrayName = 'unknown'
            if (ts.isIdentifier(expression.expression)) {
              arrayName = expression.expression.text
            } else if (ts.isPropertyAccessExpression(expression.expression)) {
              arrayName = expression.expression.getText()
            }

            const line = component.ast!.getLineAndCharacterOfPosition(node.getStart()).line + 1

            mapCalls.push({ arrayName, line })
          }
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(component.ast)
    return mapCalls
  }

  /**
   * Check if variable is from useState
   */
  private isStateVariable(component: Component, variableName: string): boolean {
    // This is a simplified check - would need more sophisticated analysis
    return component.hooks.some((hook) => hook.name === 'useState')
  }

  /**
   * Check for images without lazy loading
   */
  private checkImageOptimization(component: Component): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []

    const checkImages = (element: JSXElement) => {
      if (element.type.toLowerCase() === 'img') {
        // Check for loading="lazy" attribute
        if (!element.props.loading || element.props.loading !== 'lazy') {
          issues.push({
            type: 'missing-lazy-load',
            description: `Image at line ${element.line} does not use lazy loading`,
            impact: 'medium',
            suggestion:
              `Add loading="lazy" attribute to <img> elements to defer loading of off-screen images. ` +
              `This improves initial page load performance.`,
          })
        }

        // Check for Next.js Image component usage
        if (component.type === 'client' && !this.usesNextImage(component)) {
          issues.push({
            type: 'missing-lazy-load',
            description: `Component uses <img> instead of optimized Image component`,
            impact: 'medium',
            suggestion:
              `Consider using Next.js Image component for automatic optimization, lazy loading, ` +
              `and responsive images. Import from 'next/image'.`,
          })
        }
      }

      element.children.forEach(checkImages)
    }

    component.jsx.forEach(checkImages)

    return issues
  }

  /**
   * Check if component uses Next.js Image
   */
  private usesNextImage(component: Component): boolean {
    return component.imports.some(
      (imp) => imp.source === 'next/image' && imp.specifiers.includes('Image'),
    )
  }

  /**
   * Check for expensive computations without useMemo
   */
  private checkExpensiveComputations(component: Component): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []

    if (!component.ast) return issues

    // Check if component uses useMemo
    const usesMemo = component.hooks.some((hook) => hook.name === 'useMemo')

    // Look for expensive operations in render
    const expensiveOps = this.findExpensiveOperations(component.ast)

    if (expensiveOps.length > 0 && !usesMemo) {
      issues.push({
        type: 'unnecessary-rerender',
        description: `Component has expensive operations but doesn't use useMemo`,
        impact: 'high',
        suggestion:
          `Wrap expensive computations with useMemo() to avoid recalculating on every render. ` +
          `Found operations: ${expensiveOps.join(', ')}`,
      })
    }

    return issues
  }

  /**
   * Find expensive operations in AST
   */
  private findExpensiveOperations(ast: ts.SourceFile): string[] {
    const operations: string[] = []

    const visit = (node: ts.Node) => {
      // Look for .sort(), .filter(), .reduce() on arrays
      if (ts.isCallExpression(node)) {
        const expression = node.expression

        if (ts.isPropertyAccessExpression(expression)) {
          const methodName = expression.name.text
          if (['sort', 'filter', 'reduce', 'find', 'some', 'every'].includes(methodName)) {
            operations.push(`.${methodName}()`)
          }
        }
      }

      // Look for loops
      if (ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node)) {
        operations.push('loop')
      }

      ts.forEachChild(node, visit)
    }

    visit(ast)
    return [...new Set(operations)] // Remove duplicates
  }

  /**
   * Check for heavy dependencies
   */
  private checkHeavyDependencies(component: Component): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []

    // List of known heavy libraries
    const heavyLibraries = [
      { name: 'moment', alternative: 'date-fns or dayjs', size: '~70KB' },
      { name: 'lodash', alternative: 'lodash-es (tree-shakeable)', size: '~70KB' },
      { name: 'axios', alternative: 'fetch API', size: '~13KB' },
      { name: 'jquery', alternative: 'native DOM APIs', size: '~30KB' },
    ]

    component.imports.forEach((imp) => {
      const heavy = heavyLibraries.find((lib) => imp.source.includes(lib.name))
      if (heavy) {
        issues.push({
          type: 'heavy-dependency',
          description: `Component imports heavy library '${heavy.name}' (${heavy.size})`,
          impact: 'medium',
          suggestion:
            `Consider using lighter alternative: ${heavy.alternative}. ` +
            `This can significantly reduce bundle size.`,
        })
      }
    })

    return issues
  }

  /**
   * Calculate performance score (0-100)
   */
  calculatePerformanceScore(issues: PerformanceIssue[]): number {
    let score = 100

    issues.forEach((issue) => {
      switch (issue.impact) {
        case 'high':
          score -= 20
          break
        case 'medium':
          score -= 10
          break
        case 'low':
          score -= 5
          break
      }
    })

    return Math.max(0, score)
  }

  /**
   * Suggest performance improvements
   */
  suggestImprovements(component: Component): string[] {
    const suggestions: string[] = []

    // Suggest code splitting for large components
    if (component.metrics && component.metrics.lineCount > 300) {
      suggestions.push(
        `Component has ${component.metrics.lineCount} lines. Consider code splitting into smaller components ` +
          `or using React.lazy() for dynamic imports.`,
      )
    }

    // Suggest useCallback for event handlers
    const hasEventHandlers = component.jsx.some(
      (el) => el.props.onClick || el.props.onChange || el.props.onSubmit,
    )
    const usesCallback = component.hooks.some((hook) => hook.name === 'useCallback')

    if (hasEventHandlers && !usesCallback) {
      suggestions.push(
        `Component has event handlers. Consider wrapping them with useCallback() ` +
          `to prevent unnecessary re-renders of child components.`,
      )
    }

    // Suggest debouncing for input handlers
    const hasInputHandlers = component.jsx.some((el) => el.props.onChange || el.props.onInput)
    if (hasInputHandlers) {
      suggestions.push(
        `Consider debouncing input handlers to reduce the number of updates and improve performance.`,
      )
    }

    return suggestions
  }
}
