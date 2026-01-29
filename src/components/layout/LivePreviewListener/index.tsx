'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { LivePreviewEventHandler, type LivePreviewEvent } from '@/utilities/livePreviewEvents'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface LivePreviewListenerProps {
  serverURL?: string
  debounceMs?: number
  maxRetries?: number
  retryDelayMs?: number
  enableRealTimeUpdates?: boolean
  enableWebSocket?: boolean
  enablePolling?: boolean
  pollInterval?: number
  onUpdate?: (data: any) => void
  onError?: (error: Error) => void
  onRealTimeEvent?: (event: LivePreviewEvent) => void
}

interface PerformanceMetrics {
  updateCount: number
  lastUpdateTime: Date | null
  averageUpdateTime: number
  errorCount: number
  retryCount: number
  realTimeEventCount: number
}

export function LivePreviewListener({
  serverURL,
  debounceMs = 300,
  maxRetries = 3,
  retryDelayMs = 1000,
  enableRealTimeUpdates = true,
  enableWebSocket = true,
  enablePolling = true,
  pollInterval = 2000,
  onUpdate,
  onError,
  onRealTimeEvent,
}: LivePreviewListenerProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false)
  const [concurrentEditingDetected, setConcurrentEditingDetected] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    updateCount: 0,
    lastUpdateTime: null,
    averageUpdateTime: 0,
    errorCount: 0,
    retryCount: 0,
    realTimeEventCount: 0,
  })

  // Refs for debouncing and retry logic
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const updateTimesRef = useRef<number[]>([])
  const eventHandlerRef = useRef<LivePreviewEventHandler | null>(null)

  // Enhanced refresh function with error handling and performance monitoring
  const enhancedRefresh = useCallback(
    async (context?: { isRealTimeUpdate?: boolean; event?: LivePreviewEvent }) => {
      const startTime = performance.now()

      try {
        setIsLoading(true)
        setError(null)

        // Call the original router refresh
        await router.refresh()

        // Record successful update
        const updateTime = performance.now() - startTime
        updateTimesRef.current.push(updateTime)

        // Keep only last 10 update times for average calculation
        if (updateTimesRef.current.length > 10) {
          updateTimesRef.current.shift()
        }

        const averageTime =
          updateTimesRef.current.reduce((a, b) => a + b, 0) / updateTimesRef.current.length

        setMetrics((prev) => ({
          ...prev,
          updateCount: prev.updateCount + 1,
          lastUpdateTime: new Date(),
          averageUpdateTime: averageTime,
          realTimeEventCount: context?.isRealTimeUpdate
            ? prev.realTimeEventCount + 1
            : prev.realTimeEventCount,
        }))

        // Reset retry count on success
        retryCountRef.current = 0

        // Call success callback if provided
        if (onUpdate) {
          onUpdate({
            updateTime,
            averageTime,
            isRealTimeUpdate: context?.isRealTimeUpdate,
            event: context?.event,
          })
        }

        // Log performance metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[LivePreview] Update completed', {
            updateTime: `${updateTime.toFixed(2)}ms`,
            averageTime: `${averageTime.toFixed(2)}ms`,
            totalUpdates: metrics.updateCount + 1,
            isRealTime: context?.isRealTimeUpdate,
            eventType: context?.event?.type,
          })
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown refresh error')

        setMetrics((prev) => ({
          ...prev,
          errorCount: prev.errorCount + 1,
        }))

        // Implement retry logic with exponential backoff
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++
          const delay = retryDelayMs * Math.pow(2, retryCountRef.current - 1)

          setMetrics((prev) => ({
            ...prev,
            retryCount: prev.retryCount + 1,
          }))

          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[LivePreview] Retry ${retryCountRef.current}/${maxRetries} in ${delay}ms`,
              error,
            )
          }

          setTimeout(() => {
            enhancedRefresh(context)
          }, delay)
        } else {
          // Max retries reached, set error state
          setError(error.message)
          retryCountRef.current = 0

          if (process.env.NODE_ENV === 'development') {
            console.error('[LivePreview] Max retries reached', error)
          }

          // Call error callback if provided
          if (onError) {
            onError(error)
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [router, maxRetries, retryDelayMs, onUpdate, onError, metrics.updateCount],
  )

  // Debounced refresh function
  const debouncedRefresh = useCallback(
    (_data?: any) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        enhancedRefresh({ isRealTimeUpdate: false })
      }, debounceMs)
    },
    [enhancedRefresh, debounceMs],
  )

  // Initialize real-time event handling
  useEffect(() => {
    if (!enableRealTimeUpdates) return

    const eventHandler = new LivePreviewEventHandler({
      serverURL: serverURL || getClientSideURL(),
      enableWebSocket,
      enablePolling,
      pollInterval,
      onUpdate: (event) => {
        // Handle real-time updates
        enhancedRefresh({ isRealTimeUpdate: true, event })

        // Check for concurrent editing
        const concurrentState = eventHandler.getConcurrentState()
        setConcurrentEditingDetected(concurrentState.conflictDetected)

        // Call custom event handler if provided
        if (onRealTimeEvent) {
          onRealTimeEvent(event)
        }
      },
      onConnect: () => {
        setIsRealTimeConnected(true)
        setError(null)
      },
      onDisconnect: () => {
        setIsRealTimeConnected(false)
      },
      onError: (err) => {
        setError(err.message)
        setIsRealTimeConnected(false)

        if (onError) {
          onError(err)
        }
      },
    })

    eventHandlerRef.current = eventHandler
    eventHandler.start()

    return () => {
      eventHandler.stop()
      eventHandlerRef.current = null
    }
  }, [
    enableRealTimeUpdates,
    enableWebSocket,
    enablePolling,
    pollInterval,
    serverURL,
    enhancedRefresh,
    onRealTimeEvent,
    onError,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <PayloadLivePreview refresh={debouncedRefresh} serverURL={serverURL || getClientSideURL()} />

      {/* Development-only performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            display: metrics.updateCount > 0 || isRealTimeConnected ? 'block' : 'none',
          }}
        >
          <div>Updates: {metrics.updateCount}</div>
          <div>Avg: {metrics.averageUpdateTime.toFixed(1)}ms</div>
          {enableRealTimeUpdates && (
            <div style={{ color: isRealTimeConnected ? '#4caf50' : '#ff9800' }}>
              RT: {isRealTimeConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
          {concurrentEditingDetected && (
            <div style={{ color: '#ff9800' }}>Concurrent Edit Detected</div>
          )}
          {metrics.realTimeEventCount > 0 && <div>RT Events: {metrics.realTimeEventCount}</div>}
          {metrics.errorCount > 0 && (
            <div style={{ color: '#ff6b6b' }}>Errors: {metrics.errorCount}</div>
          )}
          {metrics.retryCount > 0 && (
            <div style={{ color: '#ffa726' }}>Retries: {metrics.retryCount}</div>
          )}
          {isLoading && <div style={{ color: '#4fc3f7' }}>Updating...</div>}
          {error && <div style={{ color: '#ff6b6b' }}>Error: {error}</div>}
        </div>
      )}
    </>
  )
}
