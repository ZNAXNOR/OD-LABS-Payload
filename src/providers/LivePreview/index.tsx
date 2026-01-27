'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { LivePreviewEventHandler, type LivePreviewEvent } from '@/utilities/livePreviewEvents'
import { PreviewSessionManager } from '@/utilities/previewSessionManager'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type {
  LivePreviewConfiguration,
  LivePreviewContextType,
  LivePreviewProviderProps,
  PerformanceMetrics,
  PreviewModeState,
  PreviewSession,
} from './types'

// Default configuration
const defaultConfiguration: LivePreviewConfiguration = {
  enabled: true,
  collections: {},
  debounceMs: 300,
  maxRetries: 3,
  retryDelayMs: 1000,
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
}

// Initial state
const initialState: PreviewModeState = {
  isEnabled: false,
  isLoading: false,
  lastUpdate: null,
  error: null,
  isRealTimeConnected: false,
  concurrentEditingDetected: false,
  currentSession: null,
}

const initialMetrics: PerformanceMetrics = {
  updateCount: 0,
  lastUpdateTime: null,
  averageUpdateTime: 0,
  errorCount: 0,
  retryCount: 0,
  realTimeEventCount: 0,
}

// Create context
const LivePreviewContext = createContext<LivePreviewContextType | null>(null)

export function LivePreviewProvider({
  children,
  serverURL,
  enabled = true,
  configuration: configOverrides = {},
}: LivePreviewProviderProps) {
  const router = useRouter()

  // State management
  const [state, setState] = useState<PreviewModeState>(initialState)
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics)
  const [configuration, setConfiguration] = useState<LivePreviewConfiguration>({
    ...defaultConfiguration,
    enabled,
    ...configOverrides,
  })

  // Refs for managing timers and handlers
  const sessionManagerRef = useRef<PreviewSessionManager | null>(null)
  const eventHandlerRef = useRef<LivePreviewEventHandler | null>(null)
  const updateTimesRef = useRef<number[]>([])
  const retryCountRef = useRef(0)

  // Initialize session manager
  useEffect(() => {
    sessionManagerRef.current = new PreviewSessionManager({
      sessionTimeoutMs: configuration.sessionTimeoutMs,
      renewalThresholdMs: 5 * 60 * 1000, // 5 minutes before expiry
      maxRetries: configuration.maxRetries,
    })

    return () => {
      if (sessionManagerRef.current) {
        sessionManagerRef.current.endSession()
      }
    }
  }, [configuration.sessionTimeoutMs, configuration.maxRetries])

  // Session management functions
  const startSession = useCallback((session: PreviewSession) => {
    setState((prev) => ({
      ...prev,
      currentSession: session,
      isEnabled: true,
      error: null,
    }))

    // Start session management
    if (sessionManagerRef.current) {
      sessionManagerRef.current.startSession(session)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[LivePreview] Session started:', {
        sessionId: session.id,
        collection: session.collection,
        documentId: session.documentId,
        expiresAt: session.expiresAt,
      })
    }
  }, [])

  const endSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentSession: null,
      isEnabled: false,
      error: null,
    }))

    // End session management
    if (sessionManagerRef.current) {
      sessionManagerRef.current.endSession()
    }

    // Stop event handler
    if (eventHandlerRef.current) {
      eventHandlerRef.current.stop()
      eventHandlerRef.current = null
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[LivePreview] Session ended')
    }
  }, [])

  const renewSession = useCallback(async () => {
    if (!sessionManagerRef.current) {
      throw new Error('Session manager not initialized')
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const renewedSession = await sessionManagerRef.current.renewSession()

      setState((prev) => ({
        ...prev,
        currentSession: renewedSession,
        isLoading: false,
      }))

      if (process.env.NODE_ENV === 'development') {
        console.log('[LivePreview] Session renewed successfully')
      }

      return renewedSession
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to renew session'
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))

      if (process.env.NODE_ENV === 'development') {
        console.error('[LivePreview] Session renewal failed:', error)
      }

      throw error
    }
  }, [])

  // Additional session utilities
  const isSessionValid = useCallback(() => {
    return sessionManagerRef.current?.isSessionValid() ?? false
  }, [])

  const getTimeUntilExpiry = useCallback(() => {
    return sessionManagerRef.current?.getTimeUntilExpiry() ?? 0
  }, [])

  const validateSession = useCallback(async () => {
    return sessionManagerRef.current?.validateSession() ?? false
  }, [])

  // Enhanced refresh function with error handling and performance monitoring
  const refresh = useCallback(async () => {
    const startTime = performance.now()

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Call the router refresh
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
      }))

      setState((prev) => ({
        ...prev,
        lastUpdate: new Date(),
        isLoading: false,
      }))

      // Reset retry count on success
      retryCountRef.current = 0

      if (process.env.NODE_ENV === 'development') {
        console.log('[LivePreview] Refresh completed', {
          updateTime: `${updateTime.toFixed(2)}ms`,
          averageTime: `${averageTime.toFixed(2)}ms`,
          totalUpdates: metrics.updateCount + 1,
        })
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown refresh error')

      setMetrics((prev) => ({
        ...prev,
        errorCount: prev.errorCount + 1,
      }))

      // Implement retry logic with exponential backoff
      if (retryCountRef.current < configuration.maxRetries) {
        retryCountRef.current++
        const delay = configuration.retryDelayMs * Math.pow(2, retryCountRef.current - 1)

        setMetrics((prev) => ({
          ...prev,
          retryCount: prev.retryCount + 1,
        }))

        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[LivePreview] Retry ${retryCountRef.current}/${configuration.maxRetries} in ${delay}ms`,
            error,
          )
        }

        setTimeout(() => {
          refresh()
        }, delay)
      } else {
        // Max retries reached, set error state
        setState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }))
        retryCountRef.current = 0

        if (process.env.NODE_ENV === 'development') {
          console.error('[LivePreview] Max retries reached', error)
        }
      }
    }
  }, [router, configuration.maxRetries, configuration.retryDelayMs, metrics.updateCount])

  // Handle real-time events
  const handleRealTimeEvent = useCallback(
    (event: LivePreviewEvent) => {
      setMetrics((prev) => ({
        ...prev,
        realTimeEventCount: prev.realTimeEventCount + 1,
      }))

      setState((prev) => ({
        ...prev,
        lastUpdate: new Date(),
      }))

      // Check for concurrent editing
      if (eventHandlerRef.current) {
        const concurrentState = eventHandlerRef.current.getConcurrentState()
        setState((prev) => ({
          ...prev,
          concurrentEditingDetected: concurrentState.conflictDetected,
        }))
      }

      // Trigger refresh for the update
      refresh()

      if (process.env.NODE_ENV === 'development') {
        console.log('[LivePreview] Real-time event processed:', {
          type: event.type,
          collection: event.collection,
          id: event.id,
          timestamp: event.timestamp,
        })
      }
    },
    [refresh],
  )

  // Utility functions
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }))
  }, [])

  const updateMetrics = useCallback((update: Partial<PerformanceMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...update }))
  }, [])

  const updateConfiguration = useCallback((configUpdate: Partial<LivePreviewConfiguration>) => {
    setConfiguration((prev) => ({ ...prev, ...configUpdate }))
  }, [])

  // Initialize real-time event handling when session is active
  useEffect(() => {
    if (!state.isEnabled || !state.currentSession || !configuration.enabled) {
      return
    }

    const eventHandler = new LivePreviewEventHandler({
      serverURL: serverURL || getClientSideURL(),
      enableWebSocket: true,
      enablePolling: true,
      pollInterval: 2000,
      onUpdate: handleRealTimeEvent,
      onConnect: () => {
        setState((prev) => ({ ...prev, isRealTimeConnected: true, error: null }))
      },
      onDisconnect: () => {
        setState((prev) => ({ ...prev, isRealTimeConnected: false }))
      },
      onError: (err) => {
        setState((prev) => ({
          ...prev,
          error: err.message,
          isRealTimeConnected: false,
        }))
      },
    })

    eventHandlerRef.current = eventHandler
    eventHandler.start()

    return () => {
      eventHandler.stop()
      eventHandlerRef.current = null
    }
  }, [state.isEnabled, state.currentSession, configuration.enabled, serverURL, handleRealTimeEvent])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionManagerRef.current) {
        sessionManagerRef.current.endSession()
      }
      if (eventHandlerRef.current) {
        eventHandlerRef.current.stop()
      }
    }
  }, [])

  // Context value
  const contextValue: LivePreviewContextType = {
    state,
    metrics,
    configuration,
    refresh,
    setError,
    setLoading,
    updateMetrics,
    startSession,
    endSession,
    renewSession,
    isSessionValid,
    getTimeUntilExpiry,
    validateSession,
    handleRealTimeEvent,
    updateConfiguration,
  }

  return <LivePreviewContext.Provider value={contextValue}>{children}</LivePreviewContext.Provider>
}

// Hook to use the LivePreview context
export function useLivePreview(): LivePreviewContextType {
  const context = useContext(LivePreviewContext)

  if (!context) {
    throw new Error('useLivePreview must be used within a LivePreviewProvider')
  }

  return context
}

// Export types for external use
export type { LivePreviewConfiguration, LivePreviewContextType, PreviewSession } from './types'
