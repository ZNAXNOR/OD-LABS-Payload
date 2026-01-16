import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'

/**
 * Unit tests for createRevalidateHook
 *
 * These tests verify that the revalidation hook correctly handles
 * publish/unpublish/slug change scenarios and respects context flags.
 *
 * **Validates: Requirements 8.1**
 */
describe('createRevalidateHook', () => {
  // Mock Next.js cache functions
  const mockRevalidatePath = vi.fn()
  const mockRevalidateTag = vi.fn()

  // Mock logger
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }

  // Mock payload
  const mockPayload = {
    logger: mockLogger,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock the dynamic import of next/cache
    vi.doMock('next/cache', () => ({
      revalidatePath: mockRevalidatePath,
      revalidateTag: mockRevalidateTag,
    }))
  })

  describe('context flags', () => {
    it('should skip revalidation when disableRevalidate is true', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: { disableRevalidate: true },
      }

      const result = await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(result).toBe(doc)
      expect(mockRevalidatePath).not.toHaveBeenCalled()
      expect(mockRevalidateTag).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Revalidation skipped for blogs (disabled via context)',
      )
    })

    it('should proceed with revalidation when disableRevalidate is false', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: { disableRevalidate: false },
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockRevalidatePath).toHaveBeenCalled()
    })

    it('should proceed with revalidation when context is empty', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockRevalidatePath).toHaveBeenCalled()
    })
  })

  describe('draft operations', () => {
    it('should skip revalidation for new draft creation', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'draft-post', _status: 'draft' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      const result = await hook({
        doc,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(result).toBe(doc)
      expect(mockRevalidatePath).not.toHaveBeenCalled()
      expect(mockRevalidateTag).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith('Skipping revalidation for new draft blogs')
    })

    it('should not skip revalidation for published document creation', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'published-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockRevalidatePath).toHaveBeenCalled()
    })
  })

  describe('publish scenarios', () => {
    it('should revalidate path when document is published', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/test-post')
      expect(mockRevalidateTag).toHaveBeenCalledWith('blogs')
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Revalidated blogs page at path: /blogs/test-post',
      )
    })

    it('should revalidate home path for pages collection with home slug', async () => {
      const hook = createRevalidateHook('pages')
      const doc = { id: '1', slug: 'home', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(mockLogger.info).toHaveBeenCalledWith('Revalidated pages page at path: /')
    })

    it('should revalidate regular path for pages collection with non-home slug', async () => {
      const hook = createRevalidateHook('pages')
      const doc = { id: '1', slug: 'about', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/pages/about')
    })
  })

  describe('unpublish scenarios', () => {
    it('should revalidate old path when document is unpublished', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'draft' }
      const previousDoc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/test-post')
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Revalidated unpublished blogs page at path: /blogs/test-post',
      )
    })

    it('should revalidate home path when home page is unpublished', async () => {
      const hook = createRevalidateHook('pages')
      const doc = { id: '1', slug: 'home', _status: 'draft' }
      const previousDoc = { id: '1', slug: 'home', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(mockLogger.info).toHaveBeenCalledWith('Revalidated unpublished pages page at path: /')
    })
  })

  describe('slug change scenarios', () => {
    it('should revalidate both old and new paths when slug changes', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'new-slug', _status: 'published' }
      const previousDoc = { id: '1', slug: 'old-slug', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/old-slug')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/new-slug')
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Revalidated blogs page slug change from /blogs/old-slug to /blogs/new-slug',
      )
    })

    it('should handle slug change from home to another slug', async () => {
      const hook = createRevalidateHook('pages')
      const doc = { id: '1', slug: 'about', _status: 'published' }
      const previousDoc = { id: '1', slug: 'home', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/pages/about')
    })

    it('should handle slug change to home', async () => {
      const hook = createRevalidateHook('pages')
      const doc = { id: '1', slug: 'home', _status: 'published' }
      const previousDoc = { id: '1', slug: 'about', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/pages/about')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
    })

    it('should not revalidate slug change for draft documents', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'new-slug', _status: 'draft' }
      const previousDoc = { id: '1', slug: 'old-slug', _status: 'draft' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).not.toHaveBeenCalled()
      // The hook may or may not log debug message depending on implementation
    })
  })

  describe('optimization checks', () => {
    it('should skip revalidation when nothing relevant changed', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'draft', title: 'Updated Title' }
      const previousDoc = { id: '1', slug: 'test-post', _status: 'draft', title: 'Old Title' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).not.toHaveBeenCalled()
      expect(mockRevalidateTag).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Skipping revalidation for blogs - no relevant changes',
      )
    })

    it('should revalidate when status changes from draft to published', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const previousDoc = { id: '1', slug: 'test-post', _status: 'draft' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/test-post')
      expect(mockRevalidateTag).toHaveBeenCalledWith('blogs')
    })

    it('should revalidate when status changes from published to draft', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'draft' }
      const previousDoc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/test-post')
      expect(mockRevalidateTag).toHaveBeenCalledWith('blogs')
    })
  })

  describe('collection tag revalidation', () => {
    it('should revalidate collection tag when status changes', async () => {
      const hook = createRevalidateHook('services')
      const doc = { id: '1', slug: 'web-design', _status: 'published' }
      const previousDoc = { id: '1', slug: 'web-design', _status: 'draft' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidateTag).toHaveBeenCalledWith('services')
      expect(mockLogger.info).toHaveBeenCalledWith('Revalidated services collection tag')
    })

    it('should revalidate collection tag for published documents', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published', title: 'Updated' }
      const previousDoc = { id: '1', slug: 'test-post', _status: 'published', title: 'Old' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidateTag).toHaveBeenCalledWith('blogs')
    })
  })

  describe('error handling', () => {
    it('should log error when revalidatePath fails', async () => {
      mockRevalidatePath.mockImplementationOnce(() => {
        throw new Error('Revalidation failed')
      })

      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to revalidate path'),
      )
    })

    it('should log error when revalidateTag fails', async () => {
      mockRevalidateTag.mockImplementationOnce(() => {
        throw new Error('Tag revalidation failed')
      })

      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to revalidate collection tag'),
      )
    })

    it('should continue execution after revalidation error', async () => {
      mockRevalidatePath.mockImplementationOnce(() => {
        throw new Error('Revalidation failed')
      })

      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      const result = await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(result).toBe(doc)
    })
  })

  describe('edge cases', () => {
    it('should handle missing previousDoc', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc: undefined,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/test-post')
    })

    it('should handle previousDoc without slug', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'new-slug', _status: 'published' }
      const previousDoc = { id: '1', _status: 'draft' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      await hook({
        doc,
        previousDoc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/new-slug')
    })

    it('should return the same doc object', async () => {
      const hook = createRevalidateHook('blogs')
      const doc = { id: '1', slug: 'test-post', _status: 'published' }
      const req = {
        payload: mockPayload,
        context: {},
      }

      const result = await hook({
        doc,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
        data: {},
        previousDoc: undefined,
      })

      expect(result).toBe(doc)
    })
  })
})
