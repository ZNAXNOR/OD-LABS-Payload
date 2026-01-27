/**
 * @file Live Preview URL Generation Tests
 * @description Unit tests for live preview URL generation utilities
 */

import {
  generateAuthenticatedPreviewUrl,
  generateBlogPagesPreviewUrl,
  generateContactPagesPreviewUrl,
  generateLegalPagesPreviewUrl,
  generatePagesPreviewUrl,
  generateServicesPagesPreviewUrl,
  getPreviewUrlGenerator,
  validatePreviewUrl,
} from '@/utilities/livePreview'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Live Preview URL Generation', () => {
  const originalEnv = process.env.PAYLOAD_PUBLIC_SERVER_URL

  beforeEach(() => {
    process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://example.com'
  })

  afterEach(() => {
    process.env.PAYLOAD_PUBLIC_SERVER_URL = originalEnv
  })

  describe('generatePagesPreviewUrl', () => {
    it('should generate URL for home page with empty slug', () => {
      const doc = { slug: '' }
      const result = generatePagesPreviewUrl(doc)
      expect(result).toBe('https://example.com')
    })

    it('should generate URL for home page with "home" slug', () => {
      const doc = { slug: 'home' }
      const result = generatePagesPreviewUrl(doc)
      expect(result).toBe('https://example.com')
    })

    it('should generate URL for regular page', () => {
      const doc = { slug: 'about' }
      const result = generatePagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/about')
    })

    it('should generate URL with locale', () => {
      const doc = { slug: 'about' }
      const result = generatePagesPreviewUrl(doc, 'es')
      expect(result).toBe('https://example.com/es/about')
    })
  })

  describe('generateBlogPagesPreviewUrl', () => {
    it('should generate URL for blog index with empty slug', () => {
      const doc = { slug: '' }
      const result = generateBlogPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/blogs')
    })

    it('should generate URL for blog post', () => {
      const doc = { slug: 'my-first-post' }
      const result = generateBlogPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/blogs/my-first-post')
    })

    it('should generate URL with locale', () => {
      const doc = { slug: 'my-first-post' }
      const result = generateBlogPagesPreviewUrl(doc, 'fr')
      expect(result).toBe('https://example.com/fr/blogs/my-first-post')
    })
  })

  describe('generateServicesPagesPreviewUrl', () => {
    it('should generate URL for services index', () => {
      const doc = { slug: '' }
      const result = generateServicesPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/services')
    })

    it('should generate URL for service page', () => {
      const doc = { slug: 'web-development' }
      const result = generateServicesPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/services/web-development')
    })
  })

  describe('generateLegalPagesPreviewUrl', () => {
    it('should generate URL for legal index', () => {
      const doc = { slug: '' }
      const result = generateLegalPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/legal')
    })

    it('should generate URL for legal page', () => {
      const doc = { slug: 'privacy-policy' }
      const result = generateLegalPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/legal/privacy-policy')
    })
  })

  describe('generateContactPagesPreviewUrl', () => {
    it('should generate URL for contacts index', () => {
      const doc = { slug: '' }
      const result = generateContactPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/contacts')
    })

    it('should generate URL for contact page', () => {
      const doc = { slug: 'support' }
      const result = generateContactPagesPreviewUrl(doc)
      expect(result).toBe('https://example.com/contacts/support')
    })
  })

  describe('getPreviewUrlGenerator', () => {
    it('should return correct generator for pages collection', () => {
      const generator = getPreviewUrlGenerator('pages')
      expect(generator).toBe(generatePagesPreviewUrl)
    })

    it('should return correct generator for blogs collection', () => {
      const generator = getPreviewUrlGenerator('blogs')
      expect(generator).toBe(generateBlogPagesPreviewUrl)
    })

    it('should return correct generator for services collection', () => {
      const generator = getPreviewUrlGenerator('services')
      expect(generator).toBe(generateServicesPagesPreviewUrl)
    })

    it('should return correct generator for legal collection', () => {
      const generator = getPreviewUrlGenerator('legal')
      expect(generator).toBe(generateLegalPagesPreviewUrl)
    })

    it('should return correct generator for contacts collection', () => {
      const generator = getPreviewUrlGenerator('contacts')
      expect(generator).toBe(generateContactPagesPreviewUrl)
    })
  })

  describe('validatePreviewUrl', () => {
    it('should validate correct URLs', () => {
      expect(validatePreviewUrl('https://example.com')).toBe(true)
      expect(validatePreviewUrl('http://localhost:3000/page')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validatePreviewUrl('not-a-url')).toBe(false)
      expect(validatePreviewUrl('')).toBe(false)
    })
  })

  describe('generateAuthenticatedPreviewUrl', () => {
    it('should add draft parameter', () => {
      const result = generateAuthenticatedPreviewUrl('https://example.com/page')
      expect(result).toBe('https://example.com/page?draft=true')
    })

    it('should add token parameter', () => {
      const result = generateAuthenticatedPreviewUrl('https://example.com/page', 'abc123')
      expect(result).toBe('https://example.com/page?draft=true&token=abc123')
    })

    it('should add locale parameter', () => {
      const result = generateAuthenticatedPreviewUrl('https://example.com/page', 'abc123', 'es')
      expect(result).toBe('https://example.com/page?draft=true&token=abc123&locale=es')
    })

    it('should handle existing query parameters', () => {
      const result = generateAuthenticatedPreviewUrl(
        'https://example.com/page?existing=param',
        'token123',
      )
      expect(result).toBe('https://example.com/page?existing=param&draft=true&token=token123')
    })
  })

  describe('fallback to localhost when no server URL', () => {
    beforeEach(() => {
      delete process.env.PAYLOAD_PUBLIC_SERVER_URL
    })

    it('should use localhost as fallback', () => {
      const doc = { slug: 'test' }
      const result = generatePagesPreviewUrl(doc)
      expect(result).toBe('http://localhost:3000/test')
    })
  })
})
