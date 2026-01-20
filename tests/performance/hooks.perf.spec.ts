import { describe, it, expect, beforeAll } from 'vitest'
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'
import { createSlugGenerationHook } from '@/utilities/slugGeneration'

/**
 * Performance benchmarks for hook execution times
 *
 * Target metrics (from design document):
 * - Slug generation: < 20ms
 * - Audit trail: < 5ms
 * - Revalidation: < 30ms
 */

describe('Hook Performance Benchmarks', () => {
  // Mock Payload request object
  const mockReq = {
    user: { id: 'test-user-123' },
    payload: {
      logger: {
        info: () => {},
        error: () => {},
        debug: () => {},
        warn: () => {},
      },
      count: async () => ({ totalDocs: 0 }),
    },
    context: {},
  }

  describe('15.1 Audit Trail Hook Performance', () => {
    it('should execute audit trail hook in < 5ms for create operation', () => {
      const hook = createAuditTrailHook()
      const data = { title: 'Test Document' }

      const startTime = performance.now()
      const result = hook({
        data,
        req: mockReq as any,
        operation: 'create',
        context: {},
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime

      expect(result.createdBy).toBe('test-user-123')
      expect(executionTime).toBeLessThan(5)
      console.log(`Audit trail (create) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute audit trail hook in < 5ms for update operation', () => {
      const hook = createAuditTrailHook()
      const data = { title: 'Updated Document' }

      const startTime = performance.now()
      const result = hook({
        data,
        req: mockReq as any,
        operation: 'update',
        context: {},
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime

      expect(result.updatedBy).toBe('test-user-123')
      expect(executionTime).toBeLessThan(5)
      console.log(`Audit trail (update) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should handle 1000 consecutive audit trail operations in < 5s', () => {
      const hook = createAuditTrailHook()
      const iterations = 1000

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        hook({
          data: { title: `Document ${i}` },
          req: mockReq as any,
          operation: 'create',
          context: {},
        } as any)
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(5000)
      expect(avgTime).toBeLessThan(5)
      console.log(
        `Audit trail bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
    })
  })

  describe('15.1 Slug Generation Hook Performance', () => {
    it('should execute slug generation in < 20ms for simple title', async () => {
      const hook = createSlugGenerationHook('blogs', {
        enforceUniqueness: false, // Skip DB query for pure generation test
      })

      const data = { title: 'Simple Blog Post Title' }

      const startTime = performance.now()
      const result = await hook({
        data,
        req: mockReq as any,
        operation: 'create',
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime
      const finalData = result || data

      expect(finalData.slug).toBe('simple-blog-post-title')
      expect(executionTime).toBeLessThan(20)
      console.log(`Slug generation (simple) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute slug generation in < 20ms for complex title', async () => {
      const hook = createSlugGenerationHook('blogs', {
        enforceUniqueness: false,
      })

      const data = {
        title: 'Complex Title with Spëcial Çharacters & Symbols!!! 123',
      }

      const startTime = performance.now()
      const result = await hook({
        data,
        req: mockReq as any,
        operation: 'create',
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime
      const finalData = result || data

      expect(finalData.slug).toBe('complex-title-with-special-characters-symbols-123')
      expect(executionTime).toBeLessThan(20)
      console.log(`Slug generation (complex) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute slug generation in < 20ms for long title', async () => {
      const hook = createSlugGenerationHook('blogs', {
        enforceUniqueness: false,
        maxLength: 100,
      })

      const data = {
        title:
          'This is a very long title that exceeds the maximum length and should be truncated to fit within the specified limit while maintaining readability',
      }

      const startTime = performance.now()
      const result = await hook({
        data,
        req: mockReq as any,
        operation: 'create',
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime
      const finalData = result || data

      expect(finalData.slug.length).toBeLessThanOrEqual(100)
      expect(executionTime).toBeLessThan(20)
      console.log(`Slug generation (long) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should handle 100 consecutive slug generations in < 2s', async () => {
      const hook = createSlugGenerationHook('blogs', {
        enforceUniqueness: false,
      })
      const iterations = 100

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        await hook({
          data: { title: `Blog Post Number ${i}` },
          req: mockReq as any,
          operation: 'create',
        } as any)
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(2000)
      expect(avgTime).toBeLessThan(20)
      console.log(
        `Slug generation bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
    })
  })

  describe('15.1 Revalidation Hook Performance', () => {
    it('should execute revalidation hook in < 30ms for draft operation (skip)', async () => {
      const hook = createRevalidateHook('blogs')

      const doc = { id: '123', slug: 'test-post', _status: 'draft' }

      const startTime = performance.now()
      await hook({
        doc,
        previousDoc: null,
        req: {
          payload: mockReq.payload,
          context: {},
        } as any,
        operation: 'create',
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(30)
      console.log(`Revalidation (draft skip) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute revalidation hook in < 30ms when disabled via context', async () => {
      const hook = createRevalidateHook('blogs')

      const doc = { id: '123', slug: 'test-post', _status: 'published' }

      const startTime = performance.now()
      await hook({
        doc,
        previousDoc: null,
        req: {
          payload: mockReq.payload,
          context: { disableRevalidate: true },
        } as any,
        operation: 'create',
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(30)
      console.log(`Revalidation (disabled) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute revalidation hook in < 30ms for no-change scenario', async () => {
      const hook = createRevalidateHook('blogs')

      const doc = { id: '123', slug: 'test-post', _status: 'draft' }
      const previousDoc = { id: '123', slug: 'test-post', _status: 'draft' }

      const startTime = performance.now()
      await hook({
        doc,
        previousDoc,
        req: {
          payload: mockReq.payload,
          context: {},
        } as any,
        operation: 'update',
      } as any)
      const endTime = performance.now()

      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(30)
      console.log(`Revalidation (no change) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should handle 50 consecutive revalidation checks in < 1.5s', async () => {
      const hook = createRevalidateHook('blogs')
      const iterations = 50

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        await hook({
          doc: { id: `${i}`, slug: `post-${i}`, _status: 'draft' },
          previousDoc: null,
          req: {
            payload: mockReq.payload,
            context: {},
          } as any,
          operation: 'create',
        } as any)
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(1500)
      expect(avgTime).toBeLessThan(30)
      console.log(
        `Revalidation bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
    })
  })

  describe('15.1 Combined Hook Performance', () => {
    it('should execute all hooks together in < 50ms', async () => {
      const auditHook = createAuditTrailHook()
      const slugHook = createSlugGenerationHook('blogs', { enforceUniqueness: false })
      const revalidateHook = createRevalidateHook('blogs')

      const data = { title: 'Test Blog Post' }

      const startTime = performance.now()

      // Simulate hook execution order
      auditHook({
        data,
        req: mockReq as any,
        operation: 'create',
        context: {},
      } as any)

      await slugHook({
        data,
        req: mockReq as any,
        operation: 'create',
      } as any)

      await revalidateHook({
        doc: { ...data, id: '123', _status: 'draft' },
        previousDoc: null,
        req: {
          payload: mockReq.payload,
          context: {},
        } as any,
        operation: 'create',
      } as any)

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(50)
      console.log(`Combined hooks execution time: ${executionTime.toFixed(3)}ms`)
    })
  })
})
