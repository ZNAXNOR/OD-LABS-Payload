/**
 * @file Preview Session Manager Tests
 * @description Unit tests for the PreviewSessionManager utility
 */

import type { PreviewSession } from '@/providers/LivePreview/types'
import { PreviewSessionManager, createPreviewSession } from '@/utilities/previewSessionManager'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

describe('PreviewSessionManager', () => {
  let sessionManager: PreviewSessionManager
  let mockSession: PreviewSession

  beforeEach(() => {
    sessionManager = new PreviewSessionManager({
      sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
      renewalThresholdMs: 5 * 60 * 1000, // 5 minutes
      maxRetries: 3,
    })

    mockSession = {
      id: 'test-session-123',
      userId: 'user-456',
      collection: 'pages',
      documentId: 'doc-789',
      token: 'test-token-abc',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    }

    vi.clearAllMocks()
  })

  afterEach(() => {
    sessionManager.endSession()
    vi.restoreAllMocks()
  })

  describe('Session Lifecycle', () => {
    it('should start a session correctly', () => {
      sessionManager.startSession(mockSession)

      expect(sessionManager.getCurrentSession()).toEqual(mockSession)
      expect(sessionManager.isSessionValid()).toBe(true)
    })

    it('should end a session correctly', () => {
      sessionManager.startSession(mockSession)
      sessionManager.endSession()

      expect(sessionManager.getCurrentSession()).toBeNull()
      expect(sessionManager.isSessionValid()).toBe(false)
    })

    it('should detect expired sessions', () => {
      const expiredSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000), // 1 second ago
      }

      sessionManager.startSession(expiredSession)

      expect(sessionManager.isSessionValid()).toBe(false)
    })
  })

  describe('Session Renewal', () => {
    it('should detect when renewal is needed', () => {
      const soonToExpireSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() + 4 * 60 * 1000), // 4 minutes from now (less than 5 minute threshold)
      }

      sessionManager.startSession(soonToExpireSession)

      expect(sessionManager.needsRenewal()).toBe(true)
    })

    it('should not need renewal for fresh sessions', () => {
      sessionManager.startSession(mockSession)

      expect(sessionManager.needsRenewal()).toBe(false)
    })

    it('should renew session successfully', async () => {
      const mockFetch = vi.mocked(fetch)
      const renewedSession = {
        ...mockSession,
        token: 'new-token-xyz',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: renewedSession }),
      } as Response)

      sessionManager.startSession(mockSession)
      const result = await sessionManager.renewSession()

      expect(result.token).toBe('new-token-xyz')
      expect(mockFetch).toHaveBeenCalledWith('/api/preview/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: mockSession.id,
          token: mockSession.token,
        }),
      })
    })

    it('should handle renewal failure', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Renewal failed' }),
      } as Response)

      sessionManager.startSession(mockSession)

      await expect(sessionManager.renewSession()).rejects.toThrow('Renewal failed')
    })
  })

  describe('Session Validation', () => {
    it('should validate session with server', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, sessionValid: true }),
      } as Response)

      sessionManager.startSession(mockSession)
      const isValid = await sessionManager.validateSession()

      expect(isValid).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/preview/renew?sessionId=${mockSession.id}&token=${mockSession.token}`,
        { method: 'GET' },
      )
    })

    it('should handle validation failure', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response)

      sessionManager.startSession(mockSession)
      const isValid = await sessionManager.validateSession()

      expect(isValid).toBe(false)
    })
  })

  describe('Time Calculations', () => {
    it('should calculate time until expiry correctly', () => {
      sessionManager.startSession(mockSession)
      const timeUntilExpiry = sessionManager.getTimeUntilExpiry()

      // Should be approximately 30 minutes (allowing for small timing differences)
      expect(timeUntilExpiry).toBeGreaterThan(29 * 60 * 1000)
      expect(timeUntilExpiry).toBeLessThanOrEqual(30 * 60 * 1000)
    })

    it('should calculate time until renewal correctly', () => {
      sessionManager.startSession(mockSession)
      const timeUntilRenewal = sessionManager.getTimeUntilRenewal()

      // Should be approximately 25 minutes (30 - 5 minute threshold)
      expect(timeUntilRenewal).toBeGreaterThan(24 * 60 * 1000)
      expect(timeUntilRenewal).toBeLessThanOrEqual(25 * 60 * 1000)
    })
  })
})

describe('Session Utilities', () => {
  it('should create preview session correctly', () => {
    const sessionData = {
      collection: 'pages',
      documentId: 'doc-123',
      userId: 'user-456',
      token: 'token-789',
      locale: 'en',
      expiresIn: 3600,
    }

    const session = createPreviewSession(sessionData)

    expect(session.collection).toBe('pages')
    expect(session.documentId).toBe('doc-123')
    expect(session.userId).toBe('user-456')
    expect(session.token).toBe('token-789')
    expect(session.locale).toBe('en')
    expect(session.id).toMatch(/^preview_\d+_[a-z0-9]+$/)
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })
})
