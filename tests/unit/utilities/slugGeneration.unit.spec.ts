import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateSlugFromText,
  isSlugUnique,
  generateUniqueSlug,
  validateSlugFormat,
  createSlugGenerationHook,
  sanitizeSlugInput,
  getSlugSuggestions,
} from '@/utilities/slugGeneration'

/**
 * Unit tests for slug generation utilities
 *
 * These tests verify format validation, uniqueness checking, and edge cases
 * for slug generation functionality.
 *
 * **Validates: Requirements 8.1**
 */
describe('Slug Generation Utilities', () => {
  // Mock logger
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateSlugFromText', () => {
    it('should generate basic slug from text', () => {
      const slug = generateSlugFromText('Hello World')
      expect(slug).toBe('hello-world')
    })

    it('should handle special characters', () => {
      const slug = generateSlugFromText('Hello, World! How are you?')
      expect(slug).toBe('hello-world-how-are-you')
    })

    it('should handle accented characters', () => {
      const slug = generateSlugFromText('Café Résumé Naïve')
      expect(slug).toBe('cafe-resume-naive')
    })

    it('should replace multiple spaces with single hyphen', () => {
      const slug = generateSlugFromText('Hello    World')
      expect(slug).toBe('hello-world')
    })

    it('should remove leading and trailing hyphens', () => {
      const slug = generateSlugFromText('  Hello World  ')
      expect(slug).toBe('hello-world')
    })

    it('should replace consecutive hyphens with single hyphen', () => {
      const slug = generateSlugFromText('Hello---World')
      expect(slug).toBe('hello-world')
    })

    it('should handle numbers', () => {
      const slug = generateSlugFromText('Article 123')
      expect(slug).toBe('article-123')
    })

    it('should truncate to max length', () => {
      const longText = 'a'.repeat(150)
      const slug = generateSlugFromText(longText, { maxLength: 50 })
      expect(slug.length).toBeLessThanOrEqual(50)
    })

    it('should not end with hyphen after truncation', () => {
      const slug = generateSlugFromText('Hello World Test', { maxLength: 11 })
      expect(slug).not.toMatch(/-$/)
    })

    it('should throw error for empty text', () => {
      expect(() => generateSlugFromText('')).toThrow('Text is required')
    })

    it('should throw error for non-string input', () => {
      expect(() => generateSlugFromText(null as any)).toThrow('Text is required')
      expect(() => generateSlugFromText(undefined as any)).toThrow('Text is required')
      expect(() => generateSlugFromText(123 as any)).toThrow('Text is required')
    })

    it('should throw error for reserved slugs', () => {
      expect(() => generateSlugFromText('admin')).toThrow('reserved')
      expect(() => generateSlugFromText('api')).toThrow('reserved')
      expect(() => generateSlugFromText('login')).toThrow('reserved')
    })

    it('should throw error for custom reserved slugs', () => {
      expect(() =>
        generateSlugFromText('custom', { reservedSlugs: ['custom', 'special'] }),
      ).toThrow('reserved')
    })

    it('should apply custom transform function', () => {
      const transform = (text: string) => text.toUpperCase().replace(/\s+/g, '_')
      const slug = generateSlugFromText('Hello World', { transform })
      expect(slug).toBe('HELLO_WORLD')
    })

    it('should throw error when generated slug is empty', () => {
      expect(() => generateSlugFromText('!!!')).toThrow('Generated slug is empty')
    })

    it('should handle underscores', () => {
      const slug = generateSlugFromText('hello_world')
      expect(slug).toBe('hello-world')
    })

    it('should handle mixed case', () => {
      const slug = generateSlugFromText('HeLLo WoRLd')
      expect(slug).toBe('hello-world')
    })
  })

  describe('validateSlugFormat', () => {
    it('should validate correct slug format', () => {
      const result = validateSlugFormat('hello-world')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate slug with numbers', () => {
      const result = validateSlugFormat('article-123')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty slug', () => {
      const result = validateSlugFormat('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug is required')
    })

    it('should reject non-string slug', () => {
      const result = validateSlugFormat(123 as any)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug must be a string')
    })

    it('should reject slug with uppercase letters', () => {
      const result = validateSlugFormat('Hello-World')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Slug can only contain lowercase letters, numbers, and hyphens',
      )
    })

    it('should reject slug with spaces', () => {
      const result = validateSlugFormat('hello world')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Slug can only contain lowercase letters, numbers, and hyphens',
      )
    })

    it('should reject slug with special characters', () => {
      const result = validateSlugFormat('hello@world')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Slug can only contain lowercase letters, numbers, and hyphens',
      )
    })

    it('should reject slug starting with hyphen', () => {
      const result = validateSlugFormat('-hello')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug cannot start or end with a hyphen')
    })

    it('should reject slug ending with hyphen', () => {
      const result = validateSlugFormat('hello-')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug cannot start or end with a hyphen')
    })

    it('should reject slug with consecutive hyphens', () => {
      const result = validateSlugFormat('hello--world')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug cannot contain consecutive hyphens')
    })

    it('should reject slug longer than 100 characters', () => {
      const longSlug = 'a'.repeat(101)
      const result = validateSlugFormat(longSlug)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug must be no more than 100 characters long')
    })

    it('should reject reserved slugs', () => {
      const result = validateSlugFormat('admin')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Slug "admin" is reserved and cannot be used')
    })

    it('should accept slug at exactly 100 characters', () => {
      const slug = 'a'.repeat(100)
      const result = validateSlugFormat(slug)
      expect(result.isValid).toBe(true)
    })

    it('should return multiple errors for multiple issues', () => {
      const result = validateSlugFormat('Hello--World-')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('isSlugUnique', () => {
    it('should return true when slug is unique', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const result = await isSlugUnique('unique-slug', 'posts', req as any)

      expect(result).toBe(true)
      expect(mockPayload.count).toHaveBeenCalledWith({
        collection: 'posts',
        where: { slug: { equals: 'unique-slug' } },
        req,
      })
    })

    it('should return false when slug exists', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 1 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const result = await isSlugUnique('existing-slug', 'posts', req as any)

      expect(result).toBe(false)
    })

    it('should exclude current document when updating', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      await isSlugUnique('slug', 'posts', req as any, 'doc-123')

      expect(mockPayload.count).toHaveBeenCalledWith({
        collection: 'posts',
        where: {
          slug: { equals: 'slug' },
          id: { not_equals: 'doc-123' },
        },
        req,
      })
    })

    it('should return false on error', async () => {
      const mockPayload = {
        count: vi.fn().mockRejectedValue(new Error('Database error')),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const result = await isSlugUnique('slug', 'posts', req as any)

      expect(result).toBe(false)
      expect(mockLogger.error).toHaveBeenCalled()
    })

    it('should handle numeric IDs', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      await isSlugUnique('slug', 'posts', req as any, 123)

      expect(mockPayload.count).toHaveBeenCalledWith({
        collection: 'posts',
        where: {
          slug: { equals: 'slug' },
          id: { not_equals: 123 },
        },
        req,
      })
    })
  })

  describe('generateUniqueSlug', () => {
    it('should return base slug when unique', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const slug = await generateUniqueSlug('test-post', 'posts', req as any)

      expect(slug).toBe('test-post')
    })

    it('should append number when base slug exists', async () => {
      const mockPayload = {
        count: vi
          .fn()
          .mockResolvedValueOnce({ totalDocs: 1 }) // base slug exists
          .mockResolvedValueOnce({ totalDocs: 0 }), // test-post-1 is unique
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const slug = await generateUniqueSlug('test-post', 'posts', req as any)

      expect(slug).toBe('test-post-1')
    })

    it('should try multiple numbers until unique', async () => {
      const mockPayload = {
        count: vi
          .fn()
          .mockResolvedValueOnce({ totalDocs: 1 }) // base
          .mockResolvedValueOnce({ totalDocs: 1 }) // -1
          .mockResolvedValueOnce({ totalDocs: 1 }) // -2
          .mockResolvedValueOnce({ totalDocs: 0 }), // -3 is unique
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const slug = await generateUniqueSlug('test-post', 'posts', req as any)

      expect(slug).toBe('test-post-3')
    })

    it('should use timestamp when max retries exceeded', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 1 }), // Always exists
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      const slug = await generateUniqueSlug('test-post', 'posts', req as any, undefined, 3)

      expect(slug).toMatch(/^test-post-[a-z0-9]+$/)
      expect(slug).not.toBe('test-post')
      expect(mockLogger.warn).toHaveBeenCalled()
    })

    it('should exclude current document when updating', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      await generateUniqueSlug('test-post', 'posts', req as any, 'doc-123')

      expect(mockPayload.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { not_equals: 'doc-123' },
          }),
        }),
      )
    })

    it('should log info when generating numbered slug', async () => {
      const mockPayload = {
        count: vi
          .fn()
          .mockResolvedValueOnce({ totalDocs: 1 })
          .mockResolvedValueOnce({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const req = { payload: mockPayload }

      await generateUniqueSlug('test-post', 'posts', req as any)

      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Generated unique slug'))
    })
  })

  describe('sanitizeSlugInput', () => {
    it('should sanitize basic input', () => {
      const result = sanitizeSlugInput('  Hello World  ')
      expect(result).toBe('hello world')
    })

    it('should remove HTML tags', () => {
      const result = sanitizeSlugInput('<p>Hello <strong>World</strong></p>')
      expect(result).toBe('hello world')
    })

    it('should remove extra whitespace', () => {
      const result = sanitizeSlugInput('Hello    World')
      expect(result).toBe('hello world')
    })

    it('should handle empty string', () => {
      const result = sanitizeSlugInput('')
      expect(result).toBe('')
    })

    it('should handle null input', () => {
      const result = sanitizeSlugInput(null as any)
      expect(result).toBe('')
    })

    it('should handle undefined input', () => {
      const result = sanitizeSlugInput(undefined as any)
      expect(result).toBe('')
    })

    it('should handle non-string input', () => {
      const result = sanitizeSlugInput(123 as any)
      expect(result).toBe('')
    })

    it('should preserve special characters', () => {
      const result = sanitizeSlugInput('Hello & World!')
      expect(result).toBe('hello & world!')
    })
  })

  describe('getSlugSuggestions', () => {
    it('should generate multiple suggestions', () => {
      const suggestions = getSlugSuggestions('Hello World Test')
      expect(suggestions.length).toBeGreaterThan(1)
      expect(suggestions.length).toBeLessThanOrEqual(5)
    })

    it('should include base slug as first suggestion', () => {
      const suggestions = getSlugSuggestions('Hello World')
      expect(suggestions[0]).toBe('hello-world')
    })

    it('should generate first word suggestion', () => {
      const suggestions = getSlugSuggestions('Hello World Test')
      expect(suggestions).toContain('hello')
    })

    it('should generate last word suggestion', () => {
      const suggestions = getSlugSuggestions('Hello World Test')
      expect(suggestions).toContain('test')
    })

    it('should generate first two words suggestion', () => {
      const suggestions = getSlugSuggestions('Hello World Test')
      expect(suggestions).toContain('hello-world')
    })

    it('should generate acronym for multi-word titles', () => {
      const suggestions = getSlugSuggestions('Hello World Test')
      expect(suggestions).toContain('hwt')
    })

    it('should return empty array for empty input', () => {
      const suggestions = getSlugSuggestions('')
      expect(suggestions).toEqual([])
    })

    it('should limit suggestions to requested count', () => {
      const suggestions = getSlugSuggestions('Hello World Test', 3)
      expect(suggestions.length).toBeLessThanOrEqual(3)
    })

    it('should remove duplicates', () => {
      const suggestions = getSlugSuggestions('Test Test')
      const uniqueSuggestions = new Set(suggestions)
      expect(suggestions.length).toBe(uniqueSuggestions.size)
    })

    it('should handle single word', () => {
      const suggestions = getSlugSuggestions('Hello')
      expect(suggestions).toContain('hello')
    })
  })

  describe('createSlugGenerationHook', () => {
    it('should generate slug on create when not provided', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts')
      const data = { title: 'Hello World' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'create',
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug).toBe('hello-world')
    })

    it('should not generate slug when already provided', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts')
      const data = { title: 'Hello World', slug: 'custom-slug' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'create',
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug).toBe('custom-slug')
    })

    it('should not generate slug on update by default', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts')
      const data = { title: 'Updated Title' }
      const originalDoc = { title: 'Old Title', slug: 'old-slug' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'update',
        originalDoc,
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug).toBeUndefined()
    })

    it('should generate slug on update when updateOnChange is true', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts', { updateOnChange: true })
      const data = { title: 'Updated Title' }
      const originalDoc = { title: 'Old Title', slug: 'old-slug' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'update',
        originalDoc,
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug).toBe('updated-title')
    })

    it('should use custom source field', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts', { sourceField: 'name' })
      const data = { name: 'Custom Name' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'create',
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug).toBe('custom-name')
    })

    it('should validate manually provided slug', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts')
      const data = { title: 'Test', slug: 'Invalid Slug!' }
      const req = { payload: mockPayload }

      await expect(
        hook({
          data,
          operation: 'create',
          req: req as any,
          collection: undefined as any,
          context: {},
        }),
      ).rejects.toThrow('Invalid slug format')
    })

    it('should check uniqueness for manually provided slug', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 1 }), // Slug exists
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts')
      const data = { title: 'Test', slug: 'existing-slug' }
      const req = { payload: mockPayload }

      await expect(
        hook({
          data,
          operation: 'create',
          req: req as any,
          collection: undefined as any,
          context: {},
        }),
      ).rejects.toThrow('already in use')
    })

    it('should skip uniqueness check when enforceUniqueness is false', async () => {
      const mockPayload = {
        count: vi.fn(),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts', { enforceUniqueness: false })
      const data = { title: 'Hello World' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'create',
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug).toBe('hello-world')
      expect(mockPayload.count).not.toHaveBeenCalled()
    })

    it('should apply custom max length', async () => {
      const mockPayload = {
        count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts', { maxLength: 10 })
      const data = { title: 'This is a very long title' }
      const req = { payload: mockPayload }

      const result = await hook({
        data,
        operation: 'create',
        req: req as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.slug.length).toBeLessThanOrEqual(10)
    })

    it('should log error and rethrow on failure', async () => {
      const mockPayload = {
        count: vi.fn().mockRejectedValue(new Error('Database error')),
        logger: mockLogger,
      }

      const hook = createSlugGenerationHook('posts')
      const data = { title: 'Test' }
      const req = { payload: mockPayload }

      await expect(
        hook({
          data,
          operation: 'create',
          req: req as any,
          collection: undefined as any,
          context: {},
        }),
      ).rejects.toThrow()

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Slug generation error'),
      )
    })
  })
})
