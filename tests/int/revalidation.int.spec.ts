import { describe, it, expect, vi, beforeEach } from 'vitest'
import { revalidatePage } from '../../src/collections/Pages/hooks/revalidatePage'
import { revalidateBlog } from '../../src/collections/Blogs/hooks/revalidateBlog'
import { revalidateService } from '../../src/collections/Services/hooks/revalidateService'

// Mock Next.js cache functions
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}))

describe('Revalidation Hooks Integration', () => {
  const mockPayload = {
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    find: vi.fn(),
  }

  const mockReq = {
    payload: mockPayload,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPayload.find.mockResolvedValue({ docs: [] })
  })

  describe('revalidatePage', () => {
    it('should revalidate published page path', async () => {
      const doc = {
        id: '1',
        slug: 'test-page',
        _status: 'published',
      }

      const result = await revalidatePage({
        doc,
        previousDoc: null,
        req: mockReq,
        context: {},
      } as any)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/test-page')
      expect(mockPayload.logger.info).toHaveBeenCalledWith('Revalidated page path: /test-page')
      expect(result).toBe(doc)
    })

    it('should revalidate home page with root path', async () => {
      const doc = {
        id: '1',
        slug: 'home',
        _status: 'published',
      }

      await revalidatePage({
        doc,
        previousDoc: null,
        req: mockReq,
        context: {},
      } as any)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(mockPayload.logger.info).toHaveBeenCalledWith('Revalidated page path: /')
    })

    it('should skip revalidation when disabled via context', async () => {
      const doc = {
        id: '1',
        slug: 'test-page',
        _status: 'published',
      }

      await revalidatePage({
        doc,
        previousDoc: null,
        req: mockReq,
        context: { disableRevalidate: true },
      } as any)

      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('revalidateBlog', () => {
    it('should revalidate blog path and homepage', async () => {
      const doc = {
        id: '1',
        slug: 'test-blog',
        _status: 'published',
      }

      await revalidateBlog({
        doc,
        previousDoc: null,
        req: mockReq,
        context: {},
      } as any)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/blogs/test-blog')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(mockPayload.logger.info).toHaveBeenCalledWith(
        'Revalidated blog path: /blogs/test-blog',
      )
      expect(mockPayload.logger.info).toHaveBeenCalledWith('Revalidated homepage for blog changes')
    })
  })

  describe('revalidateService', () => {
    it('should revalidate service path and homepage for featured services', async () => {
      const doc = {
        id: '1',
        slug: 'test-service',
        _status: 'published',
        featured: true,
      }

      await revalidateService({
        doc,
        previousDoc: null,
        req: mockReq,
        context: {},
      } as any)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/services/test-service')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(mockPayload.logger.info).toHaveBeenCalledWith(
        'Revalidated service path: /services/test-service',
      )
      expect(mockPayload.logger.info).toHaveBeenCalledWith(
        'Revalidated homepage for featured service changes',
      )
    })

    it('should not revalidate homepage for non-featured services', async () => {
      const doc = {
        id: '1',
        slug: 'test-service',
        _status: 'published',
        featured: false,
      }

      await revalidateService({
        doc,
        previousDoc: null,
        req: mockReq,
        context: {},
      } as any)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/services/test-service')
      expect(mockRevalidatePath).toHaveBeenCalledTimes(1) // Only service path, not homepage
    })
  })

  describe('Error Handling', () => {
    it('should handle revalidation errors gracefully', async () => {
      const doc = {
        id: '1',
        slug: 'test-page',
        _status: 'published',
      }

      mockRevalidatePath.mockImplementation(() => {
        throw new Error('Revalidation failed')
      })

      const result = await revalidatePage({
        doc,
        previousDoc: null,
        req: mockReq,
        context: {},
      } as any)

      expect(mockPayload.logger.error).toHaveBeenCalledWith(
        'Page revalidation failed: Error: Revalidation failed',
      )
      expect(result).toBe(doc)
    })
  })
})
