'use client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { DeveloperPanel } from './DeveloperPanel'
import { ErrorDisplay } from './ErrorDisplay'
import { PerformanceMetrics } from './PerformanceMetrics'

interface PreviewModeIndicatorProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showMetrics?: boolean
  showErrors?: boolean
  showDebugInfo?: boolean
  compact?: boolean
  enablePerformanceCharts?: boolean
  enableDeveloperMode?: boolean
}

export function PreviewModeIndicator({
  className,
  position = 'bottom-right',
  showMetrics = true,
  showErrors = true,
  showDebugInfo = false,
  compact = false,
  enablePerformanceCharts = false,
  enableDeveloperMode = false,
}: PreviewModeIndicatorProps) {
  const router = useRouter()
  const { state, metrics } = useLivePreview()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [isDeveloperPanelOpen, setIsDeveloperPanelOpen] = useState(false)

  // Show indicator when preview mode is active
  useEffect(() => {
    setIsVisible(state.isEnabled)
  }, [state.isEnabled])

  // Exit preview mode
  const exitPreview = useCallback(async () => {
    try {
      // Call the exit preview API
      const response = await fetch('/api/preview/exit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to the specified URL or refresh current page
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
        } else {
          router.refresh()
        }
      } else {
        console.error('Failed to exit preview mode')
      }
    } catch (error) {
      console.error('Error exiting preview mode:', error)
    }
  }, [router])

  // Format time display
  const formatTime = useCallback((date: Date | null) => {
    if (!date) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  }, [])

  // Get position classes
  const getPositionClasses = useCallback(() => {
    const baseClasses = 'fixed z-50'
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`
      case 'top-right':
        return `${baseClasses} top-4 right-4`
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`
      case 'bottom-right':
      default:
        return `${baseClasses} bottom-4 right-4`
    }
  }, [position])

  // Get responsive classes
  const getResponsiveClasses = useCallback(() => {
    return cn(
      'transition-all duration-200 ease-in-out',
      // Mobile (default)
      'w-72 max-w-[calc(100vw-2rem)]',
      // Tablet
      'sm:w-80',
      // Desktop
      'lg:w-96',
      // Compact mode
      compact && !isExpanded && 'w-auto',
    )
  }, [compact, isExpanded])

  // Connection status indicator
  const getConnectionStatus = useCallback(() => {
    if (state.isRealTimeConnected) {
      return { text: 'Connected', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
    if (state.isLoading) {
      return { text: 'Connecting', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    }
    return { text: 'Disconnected', color: 'text-red-600', bgColor: 'bg-red-100' }
  }, [state.isRealTimeConnected, state.isLoading])

  if (!isVisible) return null

  const connectionStatus = getConnectionStatus()

  return (
    <div className={cn(getPositionClasses(), getResponsiveClasses(), className)}>
      <Card className="shadow-lg border-2 border-blue-200 bg-blue-50/95 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-semibold text-blue-900 text-sm">
                {compact && !isExpanded ? 'Preview' : 'Preview Mode'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {enableDeveloperMode && (
                <DeveloperPanel isOpen={isDeveloperPanelOpen} onToggle={setIsDeveloperPanelOpen} />
              )}
              {compact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0 text-blue-700 hover:text-blue-900"
                >
                  {isExpanded ? '−' : '+'}
                </Button>
              )}
            </div>
          </div>

          {/* Expanded content */}
          {(!compact || isExpanded) && (
            <>
              {/* Status and Last Update */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">Status:</span>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      connectionStatus.bgColor,
                      connectionStatus.color,
                    )}
                  >
                    {connectionStatus.text}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">Last Update:</span>
                  <span className="text-blue-900 font-mono">{formatTime(state.lastUpdate)}</span>
                </div>

                {state.currentSession && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-700">Collection:</span>
                    <span className="text-blue-900 font-medium capitalize">
                      {state.currentSession.collection}
                    </span>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              {showMetrics && metrics.updateCount > 0 && (
                <div className="mb-3 p-2 bg-white/50 rounded border">
                  <div className="text-xs font-medium text-blue-800 mb-2">Performance</div>
                  <PerformanceMetrics
                    showDetailed={!compact}
                    showCharts={enablePerformanceCharts}
                  />
                </div>
              )}

              {/* Error Display */}
              {showErrors && (
                <div className="mb-3">
                  <ErrorDisplay
                    showDebugInfo={showDebugInfo}
                    showStackTrace={showDebugInfo}
                    maxErrors={compact ? 3 : 5}
                  />
                </div>
              )}

              {/* Developer Panel */}
              {enableDeveloperMode && isDeveloperPanelOpen && (
                <div className="mb-3">
                  <DeveloperPanel
                    isOpen={isDeveloperPanelOpen}
                    onToggle={setIsDeveloperPanelOpen}
                  />
                </div>
              )}

              {/* Loading Indicator */}
              {state.isLoading && (
                <div className="mb-3 flex items-center gap-2 text-xs text-blue-700">
                  <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                  <span>Updating preview...</span>
                </div>
              )}

              {/* Exit Button */}
              <Button
                onClick={exitPreview}
                variant="outline"
                size="sm"
                className="w-full text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              >
                Exit Preview
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
