/**
 * Preview Session Management Utilities
 *
 * Provides utilities for managing preview sessions, including session creation,
 * renewal, validation, and cleanup.
 *
 * Requirements: 5.5, 7.3, 7.5
 */

import type { PreviewSession } from '@/providers/LivePreview/types'

export interface SessionManagerOptions {
  sessionTimeoutMs?: number
  renewalThresholdMs?: number
  maxRetries?: number
}

export class PreviewSessionManager {
  private options: Required<SessionManagerOptions>
  private renewalTimer: NodeJS.Timeout | null = null
  private currentSession: PreviewSession | null = null

  constructor(options: SessionManagerOptions = {}) {
    this.options = {
      sessionTimeoutMs: options.sessionTimeoutMs ?? 30 * 60 * 1000, // 30 minutes
      renewalThresholdMs: options.renewalThresholdMs ?? 5 * 60 * 1000, // 5 minutes before expiry
      maxRetries: options.maxRetries ?? 3,
    }
  }

  /**
   * Start managing a preview session
   */
  startSession(session: PreviewSession): void {
    this.currentSession = session
    this.scheduleRenewal()

    if (process.env.NODE_ENV === 'development') {
      console.log('[SessionManager] Session started:', {
        sessionId: session.id,
        collection: session.collection,
        documentId: session.documentId,
        expiresAt: session.expiresAt,
      })
    }
  }

  /**
   * End the current session and cleanup
   */
  endSession(): void {
    if (this.renewalTimer) {
      clearTimeout(this.renewalTimer)
      this.renewalTimer = null
    }

    if (this.currentSession && process.env.NODE_ENV === 'development') {
      console.log('[SessionManager] Session ended:', {
        sessionId: this.currentSession.id,
        duration: Date.now() - this.currentSession.createdAt.getTime(),
      })
    }

    this.currentSession = null
  }

  /**
   * Get the current session
   */
  getCurrentSession(): PreviewSession | null {
    return this.currentSession
  }

  /**
   * Check if the current session is valid and not expired
   */
  isSessionValid(): boolean {
    if (!this.currentSession) {
      return false
    }

    const now = Date.now()
    const expiryTime = this.currentSession.expiresAt.getTime()

    return now < expiryTime
  }

  /**
   * Check if the session needs renewal
   */
  needsRenewal(): boolean {
    if (!this.currentSession) {
      return false
    }

    const now = Date.now()
    const expiryTime = this.currentSession.expiresAt.getTime()
    const renewalTime = expiryTime - this.options.renewalThresholdMs

    return now >= renewalTime
  }

  /**
   * Renew the current session
   */
  async renewSession(): Promise<PreviewSession> {
    if (!this.currentSession) {
      throw new Error('No active session to renew')
    }

    const response = await fetch('/api/preview/renew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: this.currentSession.id,
        token: this.currentSession.token,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to renew session')
    }

    const { session: renewedSession } = await response.json()

    // Update current session with renewed data
    this.currentSession = {
      ...this.currentSession,
      token: renewedSession.token,
      expiresAt: new Date(renewedSession.expiresAt),
      lastAccessedAt: new Date(renewedSession.lastAccessedAt),
    }

    // Schedule next renewal
    this.scheduleRenewal()

    if (process.env.NODE_ENV === 'development') {
      console.log('[SessionManager] Session renewed:', {
        sessionId: this.currentSession.id,
        newExpiresAt: this.currentSession.expiresAt,
      })
    }

    return this.currentSession
  }

  /**
   * Validate session with server
   */
  async validateSession(): Promise<boolean> {
    if (!this.currentSession) {
      return false
    }

    try {
      const response = await fetch(
        `/api/preview/renew?sessionId=${this.currentSession.id}&token=${this.currentSession.token}`,
        {
          method: 'GET',
        },
      )

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return data.success && data.sessionValid
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SessionManager] Session validation failed:', error)
      }
      return false
    }
  }

  /**
   * Get time until session expires
   */
  getTimeUntilExpiry(): number {
    if (!this.currentSession) {
      return 0
    }

    return Math.max(0, this.currentSession.expiresAt.getTime() - Date.now())
  }

  /**
   * Get time until renewal is needed
   */
  getTimeUntilRenewal(): number {
    if (!this.currentSession) {
      return 0
    }

    const renewalTime = this.currentSession.expiresAt.getTime() - this.options.renewalThresholdMs
    return Math.max(0, renewalTime - Date.now())
  }

  /**
   * Schedule automatic session renewal
   */
  private scheduleRenewal(): void {
    if (this.renewalTimer) {
      clearTimeout(this.renewalTimer)
    }

    if (!this.currentSession) {
      return
    }

    const timeUntilRenewal = this.getTimeUntilRenewal()

    if (timeUntilRenewal > 0) {
      this.renewalTimer = setTimeout(async () => {
        try {
          await this.renewSession()
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[SessionManager] Automatic renewal failed:', error)
          }
          // Session will expire naturally, and the provider will handle the error
        }
      }, timeUntilRenewal)

      if (process.env.NODE_ENV === 'development') {
        console.log('[SessionManager] Renewal scheduled in:', {
          timeUntilRenewal: `${Math.round(timeUntilRenewal / 1000)}s`,
          renewalTime: new Date(Date.now() + timeUntilRenewal),
        })
      }
    }
  }
}

/**
 * Utility functions for session management
 */

/**
 * Create a preview session from API response data
 */
export function createPreviewSession(data: {
  collection: string
  documentId: string
  userId: string
  token: string
  locale?: string
  expiresIn?: number
}): PreviewSession {
  const now = new Date()
  const expiresIn = data.expiresIn || 3600 // Default 1 hour
  const expiresAt = new Date(now.getTime() + expiresIn * 1000)

  return {
    id: generateSessionId(),
    userId: data.userId,
    collection: data.collection,
    documentId: data.documentId,
    locale: data.locale,
    token: data.token,
    expiresAt,
    createdAt: now,
    lastAccessedAt: now,
  }
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Parse session data from cookies or storage
 */
export function parseSessionFromCookie(cookieValue: string): PreviewSession | null {
  try {
    const data = JSON.parse(decodeURIComponent(cookieValue))

    return {
      ...data,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(data.createdAt),
      lastAccessedAt: new Date(data.lastAccessedAt),
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SessionManager] Failed to parse session from cookie:', error)
    }
    return null
  }
}

/**
 * Serialize session data for storage
 */
export function serializeSessionForCookie(session: PreviewSession): string {
  return encodeURIComponent(JSON.stringify(session))
}

/**
 * Check if a session is expired
 */
export function isSessionExpired(session: PreviewSession): boolean {
  return Date.now() >= session.expiresAt.getTime()
}

/**
 * Get remaining session time in milliseconds
 */
export function getSessionRemainingTime(session: PreviewSession): number {
  return Math.max(0, session.expiresAt.getTime() - Date.now())
}

/**
 * Format session duration for display
 */
export function formatSessionDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / (1000 * 60))
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}
