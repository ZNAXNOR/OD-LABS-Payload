'use client'

import { cn } from '@/utilities/ui'
import { useCallback, useState } from 'react'

interface ErrorDisplayProps {
  error: string | null
  onDismiss?: () => void
  onRetry?: () => void
  className?: string
  showDetails?: boolean
}

interface ErrorDetails {
  timestamp: Date
  userAgent: string
  url: string
  stack?: string
}

export function ErrorDisplay({
  error,
  onDismiss,
  onRetry,
  className,
  showDetails = false,
}: ErrorDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [errorDetails] = useState<ErrorDetails>(() => ({
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  }))

  const handleCopyError = useCallback(() => {
    const errorInfo = {
      error,
      ...errorDetails,
      expanded: isExpanded,
    }

    navigator.clipboard
      .writeText(JSON.stringify(errorInfo, null, 2))
      .then(() => {
        // Could show a toast notification here
        console.log('Error details copied to clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy error details:', err)
      })
  }, [error, errorDetails, isExpanded])

  if (!error) return null

  return (
    <div
      className={cn(
        'error-display',
        'bg-red-900/20 border border-red-500/30 rounded-md p-3 text-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1">
          <span className="text-red-400 mt-0.5">⚠</span>
          <div className="flex-1">
            <div className="text-red-200 font-medium">Preview Error</div>
            <div className="text-red-300 mt-1">{error}</div>

            {showDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-400 hover:text-red-300 text-xs mt-2 underline"
              >
                {isExpanded ? 'Hide Details' : 'Show Details'}
              </button>
            )}

            {isExpanded && (
              <div className="mt-3 p-2 bg-red-950/30 rounded text-xs font-mono">
                <div>
                  <strong>Time:</strong> {errorDetails.timestamp.toISOString()}
                </div>
                <div>
                  <strong>URL:</strong> {errorDetails.url}
                </div>
                <div>
                  <strong>User Agent:</strong> {errorDetails.userAgent}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {showDetails && (
            <button
              onClick={handleCopyError}
              className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-500/30 rounded"
              title="Copy error details"
            >
              Copy
            </button>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-500/30 rounded"
            >
              Retry
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-300 text-xs"
              title="Dismiss error"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
