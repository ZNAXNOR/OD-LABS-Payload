import type { LivePreviewEvent } from '@/utilities/livePreviewEvents'

export interface PreviewSession {
  id: string
  userId: string
  collection: string
  documentId: string
  locale?: string
  token: string
  expiresAt: Date
  createdAt: Date
  lastAccessedAt: Date
}

export interface LivePreviewConfiguration {
  enabled: boolean
  collections: {
    [collectionSlug: string]: {
      enabled: boolean
      urlPattern: string
      customPreviewComponent?: string
    }
  }
  debounceMs: number
  maxRetries: number
  retryDelayMs: number
  sessionTimeoutMs: number
}

export interface PreviewModeState {
  isEnabled: boolean
  isLoading: boolean
  lastUpdate: Date | null
  error: string | null
  isRealTimeConnected: boolean
  concurrentEditingDetected: boolean
  currentSession: PreviewSession | null
}

export interface PerformanceMetrics {
  updateCount: number
  lastUpdateTime: Date | null
  averageUpdateTime: number
  errorCount: number
  retryCount: number
  realTimeEventCount: number
}

export interface LivePreviewContextType {
  // State
  state: PreviewModeState
  metrics: PerformanceMetrics
  configuration: LivePreviewConfiguration

  // Actions
  refresh: () => Promise<void>
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  updateMetrics: (update: Partial<PerformanceMetrics>) => void

  // Session management
  startSession: (session: PreviewSession) => void
  endSession: () => void
  renewSession: () => Promise<PreviewSession>
  isSessionValid: () => boolean
  getTimeUntilExpiry: () => number
  validateSession: () => Promise<boolean>

  // Real-time updates
  handleRealTimeEvent: (event: LivePreviewEvent) => void

  // Configuration
  updateConfiguration: (config: Partial<LivePreviewConfiguration>) => void
}

export interface LivePreviewProviderProps {
  children: React.ReactNode
  serverURL?: string
  enabled?: boolean
  configuration?: Partial<LivePreviewConfiguration>
}
