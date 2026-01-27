'use client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import { useCallback, useState } from 'react'

interface ErrorDisplayProps {
  className?: string
  showStackTrace?: boolean
  showDebugInfo?: boolean
  maxErrors?: number
}

interface ErrorEntry {
  timestamp: Date
  message: string
  type: 'error' | 'warning' | 'info'
  context?: Record<string, any>
}

export function ErrorDisplay({
  className,
  showStackTrace = false,
  showDebugInfo = false,
  maxErrors = 5,
}: ErrorDisplayProps) {
  const { state, metrics } = useLivePreview()
  const [errorHistory, setErrorHistory] = useState<ErrorEntry[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  // Add error to history
  const addError = useCallback(
    (
      message: string,
      type: 'error' | 'warning' | 'info' = 'error',
      context?: Record<string, any>,
    ) => {
      const newError: ErrorEntry = {
        timestamp: new Date(),
        message,
        type,
        context,
      }

      setErrorHistory((prev) => {
        const updated = [newError, ...prev]
        return updated.slice(0, maxErrors)
      })
    },
    [maxErrors],
  )

  // Clear error history
  const clearErrors = useCallback(() => {
    setErrorHistory([])
  }, [])

  // Format timestamp
  const formatTimestamp = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  }, [])

  // Get error type styling
  const getErrorTypeStyle = useCallback((type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: '✕',
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: '⚠',
        }
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: 'ℹ',
        }
    }
  }, [])

  // Get debug information
  const getDebugInfo = useCallback(() => {
    return {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      timestamp: new Date().toISOString(),
      sessionId: state.currentSession?.id || 'N/A',
      collection: state.currentSession?.collection || 'N/A',
      documentId: state.currentSession?.documentId || 'N/A',
      isEnabled: state.isEnabled,
      isLoading: state.isLoading,
      isRealTimeConnected: state.isRealTimeConnected,
      concurrentEditingDetected: state.concurrentEditingDetected,
      metrics: {
        updateCount: metrics.updateCount,
        errorCount: metrics.errorCount,
        retryCount: metrics.retryCount,
        averageUpdateTime: metrics.averageUpdateTime,
        realTimeEventCount: metrics.realTimeEventCount,
      },
    }
  }, [state, metrics])

  // Copy debug info to clipboard
  const copyDebugInfo = useCallback(async () => {
    try {
      const debugInfo = getDebugInfo()
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
      addError('Debug information copied to clipboard', 'info')
    } catch (error) {
      addError('Failed to copy debug information', 'error')
    }
  }, [getDebugInfo, addError])

  // Current error from state
  const currentError = state.error

  // Show component if there are errors or debug info is requested
  const shouldShow = currentError || errorHistory.length > 0 || showDebugInfo

  if (!shouldShow) return null

  return (
    <div className={cn('space-y-2', className)}>
      {/* Current Error */}
      {currentError && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-sm">✕</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-red-800 mb-1">Current Error</div>
                <div className="text-xs text-red-700 break-words">{currentError}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Concurrent Editing Warning */}
      {state.concurrentEditingDetected && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-sm">⚠</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-yellow-800 mb-1">Concurrent Editing</div>
                <div className="text-xs text-yellow-700">
                  Multiple editors detected. Changes may conflict.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error History */}
      {errorHistory.length > 0 && (
        <Card className="bg-white/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-gray-800">
                Error History ({errorHistory.length})
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0 text-gray-600 hover:text-gray-800"
                >
                  {isExpanded ? '−' : '+'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearErrors}
                  className="h-6 px-2 text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent className="pt-0 space-y-2">
              {errorHistory.map((error, index) => {
                const style = getErrorTypeStyle(error.type)
                return (
                  <div
                    key={index}
                    className={cn('p-2 rounded border', style.bgColor, style.borderColor)}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn('text-sm', style.iconColor)}>{style.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-xs font-medium', style.textColor)}>
                            {error.type.charAt(0).toUpperCase() + error.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {formatTimestamp(error.timestamp)}
                          </span>
                        </div>
                        <div className={cn('text-xs break-words', style.textColor)}>
                          {error.message}
                        </div>
                        {error.context && showStackTrace && (
                          <details className="mt-1">
                            <summary className={cn('text-xs cursor-pointer', style.textColor)}>
                              Context
                            </summary>
                            <pre
                              className={cn(
                                'text-xs mt-1 p-1 bg-white/50 rounded overflow-x-auto',
                                style.textColor,
                              )}
                            >
                              {JSON.stringify(error.context, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          )}
        </Card>
      )}

      {/* Debug Information */}
      {showDebugInfo && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-gray-800">Debug Information</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyDebugInfo}
                className="h-6 px-2 text-xs text-gray-600 hover:text-gray-800"
              >
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">Session ID:</span>
                  <div className="font-mono text-gray-800 break-all">
                    {state.currentSession?.id || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Collection:</span>
                  <div className="font-mono text-gray-800">
                    {state.currentSession?.collection || 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-gray-600">Document ID:</span>
                <div className="font-mono text-gray-800 break-all">
                  {state.currentSession?.documentId || 'N/A'}
                </div>
              </div>

              <div>
                <span className="text-gray-600">Current URL:</span>
                <div className="font-mono text-gray-800 break-all">
                  {typeof window !== 'undefined' ? window.location.href : 'N/A'}
                </div>
              </div>

              <details>
                <summary className="text-gray-600 cursor-pointer">Full Debug Data</summary>
                <pre className="text-xs mt-1 p-2 bg-white rounded border overflow-x-auto">
                  {JSON.stringify(getDebugInfo(), null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
