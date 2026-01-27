/**
 * Live Preview Real-Time Event Handling Utilities
 *
 * This module provides WebSocket/polling-based real-time update handling
 * for PayloadCMS Live Preview functionality.
 */

import React from 'react'

export interface LivePreviewEvent {
  type: 'document-updated' | 'document-deleted' | 'collection-updated' | 'block-updated'
  collection: string
  id: string
  data?: any
  changedFields?: string[]
  blockPath?: string
  timestamp: number
  sessionId?: string
}

export interface LivePreviewEventHandlerOptions {
  serverURL: string
  onUpdate: (event: LivePreviewEvent) => void
  onError?: (error: Error) => void
  onConnect?: () => void
  onDisconnect?: () => void
  pollInterval?: number
  enableWebSocket?: boolean
  enablePolling?: boolean
}

export interface ConcurrentEditingState {
  activeEditors: Set<string>
  lastUpdateBy: string | null
  conflictDetected: boolean
  pendingChanges: Map<string, any>
}

export class LivePreviewEventHandler {
  private options: LivePreviewEventHandlerOptions
  private websocket: WebSocket | null = null
  private pollInterval: NodeJS.Timeout | null = null
  private lastEventTimestamp = 0
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private concurrentState: ConcurrentEditingState = {
    activeEditors: new Set(),
    lastUpdateBy: null,
    conflictDetected: false,
    pendingChanges: new Map(),
  }

  constructor(options: LivePreviewEventHandlerOptions) {
    this.options = {
      pollInterval: 2000,
      enableWebSocket: true,
      enablePolling: true,
      ...options,
    }
  }

  /**
   * Start listening for real-time updates
   */
  public start(): void {
    if (this.options.enableWebSocket) {
      this.initializeWebSocket()
    }

    if (this.options.enablePolling) {
      this.startPolling()
    }
  }

  /**
   * Stop listening for updates
   */
  public stop(): void {
    this.cleanup()
  }

  /**
   * Initialize WebSocket connection
   */
  private initializeWebSocket(): void {
    try {
      const wsUrl = this.options.serverURL.replace(/^https?/, 'ws') + '/api/live-preview/ws'
      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = () => {
        this.isConnected = true
        this.reconnectAttempts = 0

        if (process.env.NODE_ENV === 'development') {
          console.log('[LivePreview] WebSocket connected')
        }

        if (this.options.onConnect) {
          this.options.onConnect()
        }
      }

      this.websocket.onmessage = (event) => {
        try {
          const data: LivePreviewEvent = JSON.parse(event.data)
          this.handleEvent(data)
        } catch (error) {
          console.error('[LivePreview] Failed to parse WebSocket message:', error)
        }
      }

      this.websocket.onclose = () => {
        this.isConnected = false

        if (process.env.NODE_ENV === 'development') {
          console.log('[LivePreview] WebSocket disconnected')
        }

        if (this.options.onDisconnect) {
          this.options.onDisconnect()
        }

        // Attempt to reconnect
        this.attemptReconnect()
      }

      this.websocket.onerror = (error) => {
        console.error('[LivePreview] WebSocket error:', error)

        if (this.options.onError) {
          this.options.onError(new Error('WebSocket connection error'))
        }
      }
    } catch (error) {
      console.error('[LivePreview] Failed to initialize WebSocket:', error)

      if (this.options.onError) {
        this.options.onError(error as Error)
      }
    }
  }

  /**
   * Start polling for updates
   */
  private startPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }

    this.pollInterval = setInterval(async () => {
      try {
        await this.pollForUpdates()
      } catch (error) {
        console.error('[LivePreview] Polling error:', error)

        if (this.options.onError) {
          this.options.onError(error as Error)
        }
      }
    }, this.options.pollInterval)
  }

  /**
   * Poll for updates via HTTP
   */
  private async pollForUpdates(): Promise<void> {
    try {
      const response = await fetch(
        `${this.options.serverURL}/api/live-preview/events?since=${this.lastEventTimestamp}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`)
      }

      const events: LivePreviewEvent[] = await response.json()

      events.forEach((event) => {
        this.handleEvent(event)
      })
    } catch (error) {
      // Silently fail polling errors to avoid spam
      if (process.env.NODE_ENV === 'development') {
        console.warn('[LivePreview] Polling failed:', error)
      }
    }
  }

  /**
   * Handle incoming live preview events
   */
  private handleEvent(event: LivePreviewEvent): void {
    // Update timestamp
    if (event.timestamp > this.lastEventTimestamp) {
      this.lastEventTimestamp = event.timestamp
    }

    // Handle concurrent editing
    this.handleConcurrentEditing(event)

    // Process block-based content changes
    if (event.type === 'block-updated' && event.blockPath) {
      this.handleBlockUpdate(event)
      return
    }

    // Process document-level changes
    this.handleDocumentUpdate(event)

    // Call the update callback
    this.options.onUpdate(event)

    if (process.env.NODE_ENV === 'development') {
      console.log('[LivePreview] Event processed:', {
        type: event.type,
        collection: event.collection,
        id: event.id,
        timestamp: new Date(event.timestamp).toISOString(),
      })
    }
  }

  /**
   * Handle concurrent editing scenarios
   */
  private handleConcurrentEditing(event: LivePreviewEvent): void {
    const { sessionId } = event

    if (sessionId) {
      // Track active editors
      this.concurrentState.activeEditors.add(sessionId)

      // Detect conflicts
      if (
        this.concurrentState.lastUpdateBy &&
        this.concurrentState.lastUpdateBy !== sessionId &&
        this.concurrentState.pendingChanges.has(event.id)
      ) {
        this.concurrentState.conflictDetected = true

        if (process.env.NODE_ENV === 'development') {
          console.warn('[LivePreview] Concurrent editing conflict detected', {
            document: event.id,
            collection: event.collection,
            currentEditor: sessionId,
            previousEditor: this.concurrentState.lastUpdateBy,
          })
        }
      }

      this.concurrentState.lastUpdateBy = sessionId
      this.concurrentState.pendingChanges.set(event.id, event.data)
    }

    // Clean up old pending changes (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    for (const [id, data] of this.concurrentState.pendingChanges.entries()) {
      if (data.timestamp < fiveMinutesAgo) {
        this.concurrentState.pendingChanges.delete(id)
      }
    }
  }

  /**
   * Handle block-specific updates
   */
  private handleBlockUpdate(event: LivePreviewEvent): void {
    if (!event.blockPath) return

    // Parse block path (e.g., "layout.0.content" for first layout block's content)
    const pathParts = event.blockPath.split('.')

    if (process.env.NODE_ENV === 'development') {
      console.log('[LivePreview] Block update:', {
        path: event.blockPath,
        collection: event.collection,
        id: event.id,
        changedFields: event.changedFields,
      })
    }

    // Block updates can be more granular, so we might want to
    // only refresh specific parts of the page
    // For now, we'll trigger a full refresh but with block context
    this.options.onUpdate({
      ...event,
      data: {
        ...event.data,
        blockPath: event.blockPath,
        isBlockUpdate: true,
      },
    })
  }

  /**
   * Handle document-level updates
   */
  private handleDocumentUpdate(event: LivePreviewEvent): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('[LivePreview] Document update:', {
        type: event.type,
        collection: event.collection,
        id: event.id,
        changedFields: event.changedFields,
      })
    }

    // For document updates, we typically want a full refresh
    this.options.onUpdate(event)
  }

  /**
   * Attempt to reconnect WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[LivePreview] Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[LivePreview] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      )
    }

    setTimeout(() => {
      if (this.options.enableWebSocket) {
        this.initializeWebSocket()
      }
    }, delay)
  }

  /**
   * Get concurrent editing state
   */
  public getConcurrentState(): ConcurrentEditingState {
    return { ...this.concurrentState }
  }

  /**
   * Clear conflict state
   */
  public clearConflict(): void {
    this.concurrentState.conflictDetected = false
    this.concurrentState.pendingChanges.clear()
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }

    this.isConnected = false
    this.concurrentState.activeEditors.clear()
    this.concurrentState.pendingChanges.clear()
  }
}

/**
 * Hook for using live preview events in React components
 */
export function useLivePreviewEvents(options: LivePreviewEventHandlerOptions) {
  const handlerRef = React.useRef<LivePreviewEventHandler | null>(null)

  React.useEffect(() => {
    handlerRef.current = new LivePreviewEventHandler(options)
    handlerRef.current.start()

    return () => {
      if (handlerRef.current) {
        handlerRef.current.stop()
      }
    }
  }, [options.serverURL])

  return {
    handler: handlerRef.current,
    getConcurrentState: () => handlerRef.current?.getConcurrentState(),
    clearConflict: () => handlerRef.current?.clearConflict(),
  }
}
