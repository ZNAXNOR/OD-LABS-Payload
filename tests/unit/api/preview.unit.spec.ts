/**
 * @file Preview API Routes Tests
 * @description Unit tests for preview entry and exit API routes
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/headers', () => ({
  draftMode: vi.fn(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
  })),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock payload
const mockPayload = {
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  config: {
    collections: [{ slug: 'pages' }, { slug: 'blogs' }, { slug: 'services' }],
  },
  verifyToken: vi.fn(),
  findByID: vi.fn(),
}

vi.mock('payload', () => ({
  getPayload: vi.fn(() => Promise.resolve(mockPayload)),
}))

vi.mock('@payload-config', () => ({
  default: {
    collections: [{ slug: 'pages' }, { slug: 'blogs' }, { slug: 'services' }],
    serverURL: 'https://example.com',
  },
}))

// Mock live preview utilities
vi.mock('@/utilities/livePreview', () => ({
  generateAuthenticatedPreviewUrl: vi.fn((baseUrl, token, locale) => {
    const url = new URL(baseUrl)
    url.searchParams.set('draft', 'true')
    if (token) url.searchParams.set('token', token)
    if (locale) url.searchParams.set('locale', locale)
    return url.toString()
  }),
  getPreviewUrlGenerator: vi.fn((collection) => {
    const generators = {
      pages: (doc: any) => `https://example.com/${doc.slug || ''}`,
      blogs: (doc: any) => `https://example.com/blogs/${doc.slug || ''}`,
      services: (doc: any) => `https://example.com/services/${doc.slug || ''}`,
    }
    return generators[collection as keyof typeof generators]
  }),
}))

describe('Preview API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://example.com'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Preview Entry Route (/api/preview/enter)', () => {
    let POST: (request: Request) => Promise<Response>
    let GET: (request: Request) => Promise<Response>

    beforeEach(async () => {
      // Import the route handlers
      const module = await import('../../../src/app/(frontend)/api/preview/enter/route')
      POST = module.POST
      GET = module.GET
    })

    describe('POST handler', () => {
      it('should successfully enter preview mode with valid data', async () => {
        // Mock successful authentication and document access
        mockPayload.verifyToken.mockResolvedValue({ id: 'user123' })
        mockPayload.findByID.mockResolvedValue({ id: 'doc123', slug: 'test-page' })

        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'pages',
            id: 'doc123',
            token: 'valid-token',
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.previewUrl).toContain('draft=true')
        expect(data.previewUrl).toContain('token=valid-token')
        expect(mockPayload.logger.info).toHaveBeenCalledWith(
          expect.stringContaining('Preview mode enabled'),
        )
      })

      it('should reject request with missing required fields', async () => {
        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'pages',
            // Missing id and token
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toContain('Missing required fields')
      })

      it('should reject request with invalid JSON', async () => {
        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid-json',
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toContain('Invalid JSON')
      })

      it('should reject request with non-existent collection', async () => {
        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'non-existent',
            id: 'doc123',
            token: 'valid-token',
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.success).toBe(false)
        expect(data.error).toContain("Collection 'non-existent' not found")
      })

      it('should reject request with invalid token', async () => {
        mockPayload.verifyToken.mockResolvedValue(null)

        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'pages',
            id: 'doc123',
            token: 'invalid-token',
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.success).toBe(false)
        expect(data.error).toContain('Invalid or expired authentication token')
      })

      it('should reject request when document access is denied', async () => {
        mockPayload.verifyToken.mockResolvedValue({ id: 'user123' })
        mockPayload.findByID.mockResolvedValue(null) // Access denied

        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'pages',
            id: 'doc123',
            token: 'valid-token',
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.success).toBe(false)
        expect(data.error).toContain('Document not found or access denied')
      })

      it('should handle locale parameter correctly', async () => {
        mockPayload.verifyToken.mockResolvedValue({ id: 'user123' })
        mockPayload.findByID.mockResolvedValue({ id: 'doc123', slug: 'test-page' })

        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'pages',
            id: 'doc123',
            token: 'valid-token',
            locale: 'es',
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.previewUrl).toContain('locale=es')
      })

      it('should set secure preview cookie', async () => {
        mockPayload.verifyToken.mockResolvedValue({ id: 'user123' })
        mockPayload.findByID.mockResolvedValue({ id: 'doc123', slug: 'test-page' })

        const request = new Request('http://localhost/api/preview/enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: 'pages',
            id: 'doc123',
            token: 'valid-token',
          }),
        })

        const response = await POST(request)
        const setCookieHeader = response.headers.get('Set-Cookie')

        expect(setCookieHeader).toContain('__payload_preview_token=valid-token')
        expect(setCookieHeader).toContain('HttpOnly')
        expect(setCookieHeader).toContain('Secure')
        expect(setCookieHeader).toContain('SameSite=Strict')
      })
    })

    describe('GET handler', () => {
      it('should process GET request with query parameters', async () => {
        mockPayload.verifyToken.mockResolvedValue({ id: 'user123' })
        mockPayload.findByID.mockResolvedValue({ id: 'doc123', slug: 'test-page' })

        const request = new Request(
          'http://localhost/api/preview/enter?collection=pages&id=doc123&token=valid-token',
        )

        // Mock redirect to prevent actual redirection in tests
        const { redirect } = await import('next/navigation')
        vi.mocked(redirect).mockImplementation((url: string) => {
          throw new Error(`REDIRECT: ${url}`) // This is expected behavior for redirect
        })

        try {
          await GET(request)
        } catch (error) {
          expect(error.message).toContain('REDIRECT')
          expect(redirect).toHaveBeenCalledWith(expect.stringContaining('draft=true'))
          return
        }

        // If we get here, the redirect didn't throw as expected
        expect(redirect).toHaveBeenCalledWith(expect.stringContaining('draft=true'))
      })

      it('should return error for missing query parameters', async () => {
        const request = new Request('http://localhost/api/preview/enter?collection=pages')

        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toContain('Missing required query parameters')
      })
    })
  })

  describe('Preview Exit Route (/api/preview/exit)', () => {
    let POST: (request: Request) => Promise<Response>
    let GET: (request: Request) => Promise<Response>

    beforeEach(async () => {
      // Import the route handlers
      const module = await import('../../../src/app/(frontend)/api/preview/exit/route')
      POST = module.POST
      GET = module.GET
    })

    describe('POST handler', () => {
      it('should successfully exit preview mode', async () => {
        const request = new Request('http://localhost/api/preview/exit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            redirectUrl: '/custom-redirect',
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.redirectUrl).toBe('/custom-redirect')
        expect(mockPayload.logger.info).toHaveBeenCalledWith(
          expect.stringContaining('Preview mode disabled'),
        )
      })

      it('should use default redirect URL when not provided', async () => {
        const request = new Request('http://localhost/api/preview/exit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.redirectUrl).toBe('/')
      })

      it('should handle invalid JSON gracefully', async () => {
        const request = new Request('http://localhost/api/preview/exit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid-json',
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.redirectUrl).toBe('/') // Default fallback
      })

      it('should clear preview authentication cookie', async () => {
        const request = new Request('http://localhost/api/preview/exit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })

        const response = await POST(request)
        const setCookieHeader = response.headers.get('Set-Cookie')

        expect(setCookieHeader).toContain('__payload_preview_token=;')
        expect(setCookieHeader).toContain('Max-Age=0')
        expect(setCookieHeader).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT')
      })
    })

    describe('GET handler', () => {
      it('should redirect to specified URL', async () => {
        const request = new Request('http://localhost/api/preview/exit?redirect=/custom-page')

        const response = await GET(request)

        expect(response.status).toBe(302)
        expect(response.headers.get('Location')).toBe('/custom-page')
      })

      it('should redirect to home when no redirect parameter', async () => {
        const request = new Request('http://localhost/api/preview/exit')

        const response = await GET(request)

        expect(response.status).toBe(302)
        expect(response.headers.get('Location')).toBe('/')
      })

      it('should clear preview cookie on redirect', async () => {
        const request = new Request('http://localhost/api/preview/exit')

        const response = await GET(request)
        const setCookieHeader = response.headers.get('Set-Cookie')

        expect(setCookieHeader).toContain('__payload_preview_token=;')
        expect(setCookieHeader).toContain('Max-Age=0')
      })
    })
  })
})
