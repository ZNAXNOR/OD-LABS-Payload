'use client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import { useCallback, useState } from 'react'

interface DeveloperPanelProps {
  className?: string
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export function DeveloperPanel({ className, isOpen = false, onToggle }: DeveloperPanelProps) {
  const { state, metrics, refresh, updateConfiguration, configuration } = useLivePreview()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Manual refresh with timing
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true)
    const startTime = performance.now()

    try {
      await refresh()
      const duration = performance.now() - startTime
      console.log(`[LivePreview] Manual refresh completed in ${duration.toFixed(2)}ms`)
    } catch (error) {
      console.error('[LivePreview] Manual refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refresh])

  // Toggle real-time updates
  const toggleRealTimeUpdates = useCallback(() => {
    updateConfiguration({
      enabled: !configuration.enabled,
    })
  }, [configuration.enabled, updateConfiguration])

  // Adjust debounce timing
  const adjustDebounce = useCallback(
    (delta: number) => {
      const newDebounce = Math.max(100, Math.min(2000, configuration.debounceMs + delta))
      updateConfiguration({
        debounceMs: newDebounce,
      })
    },
    [configuration.debounceMs, updateConfiguration],
  )

  // Copy session info
  const copySessionInfo = useCallback(async () => {
    if (!state.currentSession) return

    const sessionInfo = {
      id: state.currentSession.id,
      collection: state.currentSession.collection,
      documentId: state.currentSession.documentId,
      locale: state.currentSession.locale,
      expiresAt: state.currentSession.expiresAt,
      createdAt: state.currentSession.createdAt,
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(sessionInfo, null, 2))
      console.log('[LivePreview] Session info copied to clipboard')
    } catch (error) {
      console.error('[LivePreview] Failed to copy session info:', error)
    }
  }, [state.currentSession])

  // Format timestamp
  const formatTimestamp = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  }, [])

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle?.(true)}
        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
        title="Open Developer Panel"
      >
        Dev
      </Button>
    )
  }

  return (
    <Card className={cn('bg-gray-50 border-gray-300', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-gray-800">Developer Panel</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle?.(false)}
            className="h-6 w-6 p-0 text-gray-600 hover:text-gray-800"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Quick Actions */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Quick Actions</div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="h-7 px-2 text-xs"
            >
              {isRefreshing ? 'Refreshing...' : 'Manual Refresh'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRealTimeUpdates}
              className={cn(
                'h-7 px-2 text-xs',
                configuration.enabled
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300',
              )}
            >
              RT: {configuration.enabled ? 'ON' : 'OFF'}
            </Button>
            {state.currentSession && (
              <Button
                variant="outline"
                size="sm"
                onClick={copySessionInfo}
                className="h-7 px-2 text-xs"
              >
                Copy Session
              </Button>
            )}
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Configuration</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Debounce:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustDebounce(-100)}
                  className="h-5 w-5 p-0 text-xs"
                  disabled={configuration.debounceMs <= 100}
                >
                  −
                </Button>
                <span className="font-mono text-gray-800 min-w-[3rem] text-center">
                  {configuration.debounceMs}ms
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustDebounce(100)}
                  className="h-5 w-5 p-0 text-xs"
                  disabled={configuration.debounceMs >= 2000}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Max Retries:</span>
              <span className="font-mono text-gray-800">{configuration.maxRetries}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Retry Delay:</span>
              <span className="font-mono text-gray-800">{configuration.retryDelayMs}ms</span>
            </div>
          </div>
        </div>

        {/* Session Details */}
        {state.currentSession && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">Session Details</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-800 text-right break-all max-w-[60%]">
                  {state.currentSession.id.slice(-8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User:</span>
                <span className="font-mono text-gray-800">
                  {state.currentSession.userId.slice(-8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-mono text-gray-800">
                  {formatTimestamp(state.currentSession.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-mono text-gray-800">
                  {formatTimestamp(state.currentSession.expiresAt)}
                </span>
              </div>
              {state.currentSession.locale && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Locale:</span>
                  <span className="font-mono text-gray-800">{state.currentSession.locale}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Performance Summary</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Updates:</span>
                <span className="font-mono text-gray-800">{metrics.updateCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Errors:</span>
                <span
                  className={cn(
                    'font-mono',
                    metrics.errorCount > 0 ? 'text-red-800' : 'text-gray-800',
                  )}
                >
                  {metrics.errorCount}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Retries:</span>
                <span
                  className={cn(
                    'font-mono',
                    metrics.retryCount > 0 ? 'text-yellow-800' : 'text-gray-800',
                  )}
                >
                  {metrics.retryCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RT Events:</span>
                <span className="font-mono text-gray-800">{metrics.realTimeEventCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Logging */}
        <div className="text-xs text-gray-500 italic">Check browser console for detailed logs</div>
      </CardContent>
    </Card>
  )
}
