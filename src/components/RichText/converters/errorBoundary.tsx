import React from 'react'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters?: Record<string, any>) => void
  }
}

// ============================================================================
// ERROR BOUNDARY TYPES
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
  blockType?: string
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface ErrorFallbackProps {
  error: Error
  errorInfo?: React.ErrorInfo
  retry: () => void
  blockType?: string
  canRetry: boolean
  retryCount: number
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

/**
 * Enhanced error boundary for block rendering with retry functionality
 */
export class BlockErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    })

    // Log error for debugging
    console.error('[BlockErrorBoundary] Block rendering error:', {
      error,
      errorInfo,
      blockType: this.props.blockType,
      retryCount: this.state.retryCount,
    })

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report to error tracking service
    this.reportError(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // Reset error state when props change (if enabled)
    if (hasError && resetOnPropsChange && this.hasPropsChanged(prevProps)) {
      this.resetErrorBoundary()
    }

    // Reset error state when reset keys change
    if (hasError && resetKeys && this.hasResetKeysChanged(prevProps.resetKeys, resetKeys)) {
      this.resetErrorBoundary()
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  private hasPropsChanged(prevProps: ErrorBoundaryProps): boolean {
    // Simple shallow comparison of props
    const currentProps = { ...this.props }
    delete currentProps.children
    delete currentProps.fallback
    delete currentProps.onError

    const previousProps = { ...prevProps }
    delete previousProps.children
    delete previousProps.fallback
    delete previousProps.onError

    return JSON.stringify(currentProps) !== JSON.stringify(previousProps)
  }

  private hasResetKeysChanged(
    prevResetKeys?: Array<string | number>,
    currentResetKeys?: Array<string | number>,
  ): boolean {
    if (!prevResetKeys && !currentResetKeys) return false
    if (!prevResetKeys || !currentResetKeys) return true
    if (prevResetKeys.length !== currentResetKeys.length) return true

    return prevResetKeys.some((key, index) => key !== currentResetKeys[index])
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Report to error tracking service (e.g., Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `Block Error: ${error.message}`,
        fatal: false,
        custom_map: {
          blockType: this.props.blockType,
          componentStack: errorInfo.componentStack,
        },
      })
    }

    // You can also integrate with other error reporting services here
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    })
  }

  private retry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      })

      // Add a small delay before retry to prevent immediate re-error
      this.resetTimeoutId = window.setTimeout(() => {
        this.forceUpdate()
      }, 100)
    }
  }

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state
    const { children, fallback: Fallback = DefaultErrorFallback, maxRetries = 3 } = this.props

    if (hasError && error) {
      const canRetry = retryCount < maxRetries

      return (
        <Fallback
          error={error}
          errorInfo={errorInfo || undefined}
          retry={this.retry}
          blockType={this.props.blockType}
          canRetry={canRetry}
          retryCount={retryCount}
        />
      )
    }

    return children
  }
}

// ============================================================================
// ERROR FALLBACK COMPONENTS
// ============================================================================

/**
 * Default error fallback component
 */
export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  retry,
  blockType,
  canRetry,
  retryCount,
}) => (
  <div className="p-4 border border-red-200 bg-red-50 rounded-md mb-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800">Block Rendering Error</h3>
        {blockType && <p className="mt-1 text-sm text-red-600">Block type: {blockType}</p>}
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
        {retryCount > 0 && <p className="mt-1 text-xs text-red-500">Retry attempt: {retryCount}</p>}
        {canRetry && (
          <div className="mt-3">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)

/**
 * Minimal error fallback component
 */
export const MinimalErrorFallback: React.FC<ErrorFallbackProps> = ({ error, blockType }) => (
  <div className="p-2 border border-red-200 bg-red-50 rounded text-sm text-red-600 mb-2">
    {blockType ? `${blockType} block error: ${error.message}` : `Block error: ${error.message}`}
  </div>
)

/**
 * Development error fallback with detailed information
 */
export const DevelopmentErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  retry,
  blockType,
  canRetry,
  retryCount,
}) => (
  <div className="p-4 border border-red-300 bg-red-50 rounded-md mb-4">
    <div className="mb-3">
      <h3 className="text-lg font-medium text-red-800">Block Rendering Error</h3>
      {blockType && (
        <p className="text-sm text-red-600 mt-1">
          Block type: <code>{blockType}</code>
        </p>
      )}
      {retryCount > 0 && <p className="text-xs text-red-500 mt-1">Retry attempt: {retryCount}</p>}
    </div>

    <div className="mb-3">
      <h4 className="text-sm font-medium text-red-800 mb-1">Error Message:</h4>
      <p className="text-sm text-red-600 font-mono bg-red-100 p-2 rounded">{error.message}</p>
    </div>

    {error.stack && (
      <details className="mb-3">
        <summary className="text-sm font-medium text-red-800 cursor-pointer hover:text-red-900">
          Stack Trace
        </summary>
        <pre className="text-xs text-red-600 bg-red-100 p-2 rounded mt-1 overflow-auto max-h-40">
          {error.stack}
        </pre>
      </details>
    )}

    {errorInfo?.componentStack && (
      <details className="mb-3">
        <summary className="text-sm font-medium text-red-800 cursor-pointer hover:text-red-900">
          Component Stack
        </summary>
        <pre className="text-xs text-red-600 bg-red-100 p-2 rounded mt-1 overflow-auto max-h-40">
          {errorInfo.componentStack}
        </pre>
      </details>
    )}

    {canRetry && (
      <button
        type="button"
        onClick={retry}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Retry Rendering
      </button>
    )}
  </div>
)

// ============================================================================
// ERROR BOUNDARY HOOKS
// ============================================================================

/**
 * Hook to create an error boundary wrapper for functional components
 */
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

// ============================================================================
// HIGHER-ORDER COMPONENTS
// ============================================================================

/**
 * HOC to wrap components with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <BlockErrorBoundary {...errorBoundaryProps}>
      <Component {...(props as any)} ref={ref} />
    </BlockErrorBoundary>
  ))

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Creates an error boundary wrapper for block components
 */
export const createBlockErrorBoundary = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options?: {
    fallback?: React.ComponentType<ErrorFallbackProps>
    blockType?: string
    maxRetries?: number
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  },
) => {
  const { fallback, blockType, maxRetries, onError } = options || {}

  return React.forwardRef<any, T>((props, ref) => (
    <BlockErrorBoundary
      fallback={fallback}
      blockType={blockType}
      maxRetries={maxRetries}
      onError={onError}
      resetOnPropsChange={true}
    >
      <Component {...(props as any)} ref={ref} />
    </BlockErrorBoundary>
  ))
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets appropriate error fallback based on environment
 */
export const getErrorFallback = (
  environment: 'development' | 'production' = process.env.NODE_ENV as any,
): React.ComponentType<ErrorFallbackProps> => {
  switch (environment) {
    case 'development':
      return DevelopmentErrorFallback
    case 'production':
    default:
      return DefaultErrorFallback
  }
}

/**
 * Creates a context-aware error boundary
 */
export const createContextAwareErrorBoundary = (context: React.Context<any>) => {
  return ({ children, ...props }: ErrorBoundaryProps) => {
    const contextValue = React.useContext(context)

    return (
      <BlockErrorBoundary
        {...props}
        onError={(error, errorInfo) => {
          // Include context information in error reporting
          console.error('[BlockErrorBoundary] Context-aware error:', {
            error,
            errorInfo,
            context: contextValue,
          })

          if (props.onError) {
            props.onError(error, errorInfo)
          }
        }}
      >
        {children}
      </BlockErrorBoundary>
    )
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default BlockErrorBoundary

// Type exports
export type { ErrorBoundaryProps, ErrorBoundaryState, ErrorFallbackProps }
