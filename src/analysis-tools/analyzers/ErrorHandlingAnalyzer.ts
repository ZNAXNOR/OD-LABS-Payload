/**
 * Error Handling Analyzer
 * Analyzes React components for error boundaries and loading states
 * Checks for proper error handling patterns in async components
 */

import * as ts from 'typescript'
import type { Component, JSXElement } from '../types'

export interface ErrorHandlingIssue {
  type: 'missing-error-boundary' | 'missing-loading-state' | 'missing-error-state'
  description: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
  line?: number
}

export class ErrorHandlingAnalyzer {
  /**
   * Check component for error handling issues
   */
  checkErrorHandling(component: Component): ErrorHandlingIssue[] {
    const issues: ErrorHandlingIssue[] = []

    // Check for error boundary usage
    const errorBoundaryIssues = this.checkErrorBoundary(component)
    issues.push(...errorBoundaryIssues)

    // Check for loading states in async components
    const loadingStateIssues = this.checkLoadingStates(component)
    issues.push(...loadingStateIssues)

    // Check for error states in async operations
    const errorStateIssues = this.checkErrorStates(component)
    issues.push(...errorStateIssues)

    return issues
  }

  /**
   * Check if component uses error boundaries
   */
  private checkErrorBoundary(component: Component): ErrorHandlingIssue[] {
    const issues: ErrorHandlingIssue[] = []

    // Check if component is an error boundary itself
    const isErrorBoundary = this.isErrorBoundaryComponent(component)

    if (isErrorBoundary) {
      // Component is an error boundary, no issues
      return issues
    }

    // Check if component can throw errors
    const canThrowErrors = this.canComponentThrowErrors(component)

    if (canThrowErrors) {
      // Check if component is wrapped with error boundary
      // Note: This is difficult to detect statically, so we suggest it
      issues.push({
        type: 'missing-error-boundary',
        description: 'Component may throw errors but is not wrapped with an error boundary',
        severity: 'medium',
        suggestion:
          `Wrap component with an error boundary to gracefully handle runtime errors. ` +
          `Create an ErrorBoundary component with componentDidCatch() or use a library like react-error-boundary.`,
      })
    }

    return issues
  }

  /**
   * Check if component is an error boundary
   */
  private isErrorBoundaryComponent(component: Component): boolean {
    if (!component.ast) return false

    let hasComponentDidCatch = false
    let hasDerivedStateFromError = false

    const visit = (node: ts.Node) => {
      // Look for componentDidCatch method
      if (ts.isMethodDeclaration(node) && node.name) {
        const methodName = node.name.getText()
        if (methodName === 'componentDidCatch') {
          hasComponentDidCatch = true
        }
      }

      // Look for getDerivedStateFromError
      if (ts.isMethodDeclaration(node) && node.name) {
        const methodName = node.name.getText()
        if (methodName === 'getDerivedStateFromError') {
          hasDerivedStateFromError = true
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(component.ast)
    return hasComponentDidCatch || hasDerivedStateFromError
  }

  /**
   * Check if component can throw errors
   */
  private canComponentThrowErrors(component: Component): boolean {
    // Components that use async operations, external data, or complex logic can throw errors

    // Check for async operations
    const hasAsyncOps = this.hasAsyncOperations(component)
    if (hasAsyncOps) return true

    // Check for data fetching
    const hasDataFetching = this.hasDataFetching(component)
    if (hasDataFetching) return true

    // Check for JSON.parse or other error-prone operations
    const hasErrorProneOps = this.hasErrorProneOperations(component)
    if (hasErrorProneOps) return true

    return false
  }

  /**
   * Check for async operations
   */
  private hasAsyncOperations(component: Component): boolean {
    if (!component.ast) return false

    let hasAsync = false

    const visit = (node: ts.Node) => {
      // Check for async functions
      if (
        (ts.isFunctionDeclaration(node) ||
          ts.isArrowFunction(node) ||
          ts.isFunctionExpression(node)) &&
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)
      ) {
        hasAsync = true
      }

      // Check for await expressions
      if (ts.isAwaitExpression(node)) {
        hasAsync = true
      }

      // Check for Promise usage
      if (ts.isNewExpression(node)) {
        const expression = node.expression
        if (ts.isIdentifier(expression) && expression.text === 'Promise') {
          hasAsync = true
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(component.ast)
    return hasAsync
  }

  /**
   * Check for data fetching
   */
  private hasDataFetching(component: Component): boolean {
    // Check for fetch, axios, or other data fetching libraries
    const hasFetchImport = component.imports.some(
      (imp) =>
        imp.source.includes('axios') ||
        imp.source.includes('fetch') ||
        imp.source.includes('swr') ||
        imp.source.includes('react-query') ||
        imp.source.includes('@tanstack/react-query'),
    )

    if (hasFetchImport) return true

    // Check for useEffect with async operations
    const hasUseEffect = component.hooks.some((hook) => hook.name === 'useEffect')
    const hasAsync = this.hasAsyncOperations(component)

    return hasUseEffect && hasAsync
  }

  /**
   * Check for error-prone operations
   */
  private hasErrorProneOperations(component: Component): boolean {
    if (!component.ast) return false

    let hasErrorProneOps = false

    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression

        // Check for JSON.parse
        if (ts.isPropertyAccessExpression(expression)) {
          if (
            ts.isIdentifier(expression.expression) &&
            expression.expression.text === 'JSON' &&
            ts.isIdentifier(expression.name) &&
            expression.name.text === 'parse'
          ) {
            hasErrorProneOps = true
          }
        }

        // Check for parseInt, parseFloat
        if (ts.isIdentifier(expression)) {
          if (expression.text === 'parseInt' || expression.text === 'parseFloat') {
            hasErrorProneOps = true
          }
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(component.ast)
    return hasErrorProneOps
  }

  /**
   * Check for loading states
   */
  private checkLoadingStates(component: Component): ErrorHandlingIssue[] {
    const issues: ErrorHandlingIssue[] = []

    // Check if component has async operations
    const hasAsyncOps = this.hasAsyncOperations(component) || this.hasDataFetching(component)

    if (hasAsyncOps) {
      // Check if component has loading state
      const hasLoadingState = this.hasLoadingState(component)

      if (!hasLoadingState) {
        issues.push({
          type: 'missing-loading-state',
          description: 'Component has async operations but no loading state',
          severity: 'medium',
          suggestion:
            `Add a loading state to show users that data is being fetched. ` +
            `Use useState to track loading status and display a loading indicator (spinner, skeleton, etc.).`,
        })
      }
    }

    return issues
  }

  /**
   * Check if component has loading state
   */
  private hasLoadingState(component: Component): boolean {
    // Check for loading-related state variables
    const hasLoadingState = component.props.some(
      (prop) =>
        prop.name.toLowerCase().includes('loading') ||
        prop.name.toLowerCase().includes('isloading') ||
        prop.name.toLowerCase().includes('pending'),
    )

    if (hasLoadingState) return true

    // Check for loading-related JSX elements
    const hasLoadingUI = this.hasLoadingUI(component.jsx)
    if (hasLoadingUI) return true

    // Check for Suspense usage
    const hasSuspense = component.jsx.some((el) => el.type === 'Suspense')
    if (hasSuspense) return true

    return false
  }

  /**
   * Check if JSX has loading UI
   */
  private hasLoadingUI(elements: JSXElement[]): boolean {
    for (const element of elements) {
      // Check for loading-related class names or text
      const className = element.props.className || element.props.class
      if (typeof className === 'string' && className.toLowerCase().includes('loading')) {
        return true
      }

      // Check for spinner, skeleton, or loading text
      if (
        element.type.toLowerCase().includes('spinner') ||
        element.type.toLowerCase().includes('skeleton') ||
        element.type.toLowerCase().includes('loader')
      ) {
        return true
      }

      // Recursively check children
      if (this.hasLoadingUI(element.children)) {
        return true
      }
    }

    return false
  }

  /**
   * Check for error states
   */
  private checkErrorStates(component: Component): ErrorHandlingIssue[] {
    const issues: ErrorHandlingIssue[] = []

    // Check if component has async operations
    const hasAsyncOps = this.hasAsyncOperations(component) || this.hasDataFetching(component)

    if (hasAsyncOps) {
      // Check if component has error state
      const hasErrorState = this.hasErrorState(component)

      if (!hasErrorState) {
        issues.push({
          type: 'missing-error-state',
          description: 'Component has async operations but no error state',
          severity: 'high',
          suggestion:
            `Add error state handling to gracefully handle failed async operations. ` +
            `Use useState to track errors and display user-friendly error messages with retry options.`,
        })
      }
    }

    return issues
  }

  /**
   * Check if component has error state
   */
  private hasErrorState(component: Component): boolean {
    // Check for error-related state variables
    const hasErrorState = component.props.some(
      (prop) =>
        prop.name.toLowerCase().includes('error') ||
        prop.name.toLowerCase().includes('iserror') ||
        prop.name.toLowerCase().includes('haserror'),
    )

    if (hasErrorState) return true

    // Check for try-catch blocks
    if (component.ast) {
      const hasTryCatch = this.hasTryCatchBlock(component.ast)
      if (hasTryCatch) return true
    }

    // Check for error-related JSX elements
    const hasErrorUI = this.hasErrorUI(component.jsx)
    if (hasErrorUI) return true

    return false
  }

  /**
   * Check for try-catch blocks
   */
  private hasTryCatchBlock(ast: ts.SourceFile): boolean {
    let hasTryCatch = false

    const visit = (node: ts.Node) => {
      if (ts.isTryStatement(node)) {
        hasTryCatch = true
      }
      ts.forEachChild(node, visit)
    }

    visit(ast)
    return hasTryCatch
  }

  /**
   * Check if JSX has error UI
   */
  private hasErrorUI(elements: JSXElement[]): boolean {
    for (const element of elements) {
      // Check for error-related class names or text
      const className = element.props.className || element.props.class
      if (typeof className === 'string' && className.toLowerCase().includes('error')) {
        return true
      }

      // Check for error, alert, or warning components
      if (
        element.type.toLowerCase().includes('error') ||
        element.type.toLowerCase().includes('alert') ||
        element.type.toLowerCase().includes('warning')
      ) {
        return true
      }

      // Recursively check children
      if (this.hasErrorUI(element.children)) {
        return true
      }
    }

    return false
  }

  /**
   * Suggest error handling patterns
   */
  suggestPatterns(component: Component): string[] {
    const suggestions: string[] = []

    // Suggest error boundary pattern
    if (this.canComponentThrowErrors(component)) {
      suggestions.push(
        `Error Boundary Pattern:\n` +
          `class ErrorBoundary extends React.Component {\n` +
          `  state = { hasError: false }\n` +
          `  static getDerivedStateFromError(error) { return { hasError: true } }\n` +
          `  componentDidCatch(error, info) { logError(error, info) }\n` +
          `  render() {\n` +
          `    if (this.state.hasError) return <ErrorFallback />\n` +
          `    return this.props.children\n` +
          `  }\n` +
          `}`,
      )
    }

    // Suggest async error handling pattern
    if (this.hasAsyncOperations(component)) {
      suggestions.push(
        `Async Error Handling Pattern:\n` +
          `const [data, setData] = useState(null)\n` +
          `const [loading, setLoading] = useState(false)\n` +
          `const [error, setError] = useState(null)\n\n` +
          `useEffect(() => {\n` +
          `  setLoading(true)\n` +
          `  fetchData()\n` +
          `    .then(setData)\n` +
          `    .catch(setError)\n` +
          `    .finally(() => setLoading(false))\n` +
          `}, [])`,
      )
    }

    return suggestions
  }

  /**
   * Calculate error handling metrics
   */
  calculateMetrics(component: Component): {
    hasErrorBoundary: boolean
    hasLoadingState: boolean
    hasErrorState: boolean
  } {
    return {
      hasErrorBoundary: this.isErrorBoundaryComponent(component),
      hasLoadingState: this.hasLoadingState(component),
      hasErrorState: this.hasErrorState(component),
    }
  }
}
