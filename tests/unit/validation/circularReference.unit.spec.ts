import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createCircularReferenceValidator,
  buildParentChain,
  isAncestor,
} from '@/pages/shared/validation/circularReference'

/**
 * Unit tests for circular reference validator
 *
 * These tests verify that the validator correctly detects direct and indirect
 * circular references, handles max depth limits, and performs efficiently.
 *
 * **Validates: Requirements 8.1**
 */
describe('createCircularReferenceValidator', () => {
  // Mock logger
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }

  // Mock payload
  const createMockPayload = (documents: Record<string, any>) => ({
    findByID: vi.fn(async ({ id }) => {
      if (documents[id]) {
        return documents[id]
      }
      throw new Error(`Document ${id} not found`)
    }),
    logger: mockLogger,
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic validation', () => {
    it('should return true when no parent is set', async () => {
      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload({}),
        context: {},
      }

      const result = await validator(null, {
        data: { id: 'page-1' },
        req: req as any,
      } as any)

      expect(result).toBe(true)
    })

    it('should return true when document has no id', async () => {
      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload({}),
        context: {},
      }

      const result = await validator('parent-1', {
        data: {},
        req: req as any,
      } as any)

      expect(result).toBe(true)
    })

    it('should return true for valid parent relationship', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator('page-1', {
        data: { id: 'page-2' },
        req: req as any,
      } as any)

      expect(result).toBe(true)
    })
  })

  describe('self-reference detection', () => {
    it('should detect direct self-reference', async () => {
      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload({}),
        context: {},
      }

      const result = await validator('page-1', {
        data: { id: 'page-1' },
        req: req as any,
      } as any)

      expect(result).toBe('A page cannot be its own parent')
    })

    it('should detect self-reference with string IDs', async () => {
      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload({}),
        context: {},
      }

      const result = await validator('abc-123', {
        data: { id: 'abc-123' },
        req: req as any,
      } as any)

      expect(result).toBe('A page cannot be its own parent')
    })
  })

  describe('direct cycle detection', () => {
    it('should detect two-node cycle (A → B → A)', async () => {
      const documents = {
        'page-a': { id: 'page-a', parent: 'page-b' },
        'page-b': { id: 'page-b', parent: 'page-a' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator('page-b', {
        data: { id: 'page-a' },
        req: req as any,
      } as any)

      expect(result).toContain('Circular parent reference detected')
    })

    it('should detect three-node cycle (A → B → C → A)', async () => {
      const documents = {
        'page-a': { id: 'page-a', parent: 'page-b' },
        'page-b': { id: 'page-b', parent: 'page-c' },
        'page-c': { id: 'page-c', parent: 'page-a' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator('page-b', {
        data: { id: 'page-a' },
        req: req as any,
      } as any)

      expect(result).toContain('Circular parent reference detected')
    })
  })

  describe('indirect cycle detection', () => {
    it('should detect cycle in deep hierarchy (A → B → C → D → A)', async () => {
      const documents = {
        'page-a': { id: 'page-a', parent: 'page-b' },
        'page-b': { id: 'page-b', parent: 'page-c' },
        'page-c': { id: 'page-c', parent: 'page-d' },
        'page-d': { id: 'page-d', parent: 'page-a' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator('page-b', {
        data: { id: 'page-a' },
        req: req as any,
      } as any)

      expect(result).toContain('Circular parent reference detected')
    })

    it('should detect cycle when setting parent to descendant', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: 'page-2' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      // Try to set page-1's parent to page-3 (its descendant)
      const result = await validator('page-3', {
        data: { id: 'page-1' },
        req: req as any,
      } as any)

      expect(result).toContain('Circular parent reference detected')
    })
  })

  describe('max depth handling', () => {
    it('should return error when max depth is exceeded', async () => {
      // Create a chain longer than max depth
      const documents: Record<string, any> = {}
      const maxDepth = 5

      for (let i = 0; i <= maxDepth + 1; i++) {
        documents[`page-${i}`] = {
          id: `page-${i}`,
          parent: i > 0 ? `page-${i - 1}` : null,
        }
      }

      const validator = createCircularReferenceValidator('pages', maxDepth)
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator(`page-${maxDepth}`, {
        data: { id: `page-${maxDepth + 1}` },
        req: req as any,
      } as any)

      expect(result).toContain('Parent hierarchy too deep')
      expect(result).toContain(`maximum ${maxDepth} levels`)
    })

    it('should allow hierarchy at exactly max depth', async () => {
      const maxDepth = 3
      const documents: Record<string, any> = {}

      for (let i = 0; i <= maxDepth; i++) {
        documents[`page-${i}`] = {
          id: `page-${i}`,
          parent: i > 0 ? `page-${i - 1}` : null,
        }
      }

      const validator = createCircularReferenceValidator('pages', maxDepth)
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator(`page-${maxDepth - 1}`, {
        data: { id: `page-${maxDepth}` },
        req: req as any,
      } as any)

      expect(result).toBe(true)
    })

    it('should use default max depth of 50', async () => {
      const validator = createCircularReferenceValidator('pages')
      const documents: Record<string, any> = {}

      // Create a chain of 51 pages
      for (let i = 0; i <= 51; i++) {
        documents[`page-${i}`] = {
          id: `page-${i}`,
          parent: i > 0 ? `page-${i - 1}` : null,
        }
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator('page-50', {
        data: { id: 'page-51' },
        req: req as any,
      } as any)

      expect(result).toContain('Parent hierarchy too deep')
      expect(result).toContain('maximum 50 levels')
    })
  })

  describe('caching behavior', () => {
    it('should cache parent chain in context', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: 'page-2' },
      }

      const mockPayload = createMockPayload(documents)
      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: mockPayload,
        context: {},
      }

      // First call
      await validator('page-2', {
        data: { id: 'page-3' },
        req: req as any,
      } as any)

      const firstCallCount = mockPayload.findByID.mock.calls.length

      // Second call with same data should use cache
      await validator('page-2', {
        data: { id: 'page-3' },
        req: req as any,
      } as any)

      const secondCallCount = mockPayload.findByID.mock.calls.length

      // Should not make additional calls due to caching
      expect(secondCallCount).toBe(firstCallCount)
      expect(req.context).toHaveProperty('parentChain_pages_page-3')
    })

    it('should create separate cache entries for different documents', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: null },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      await validator('page-1', {
        data: { id: 'page-2' },
        req: req as any,
      } as any)

      await validator('page-1', {
        data: { id: 'page-3' },
        req: req as any,
      } as any)

      expect(req.context).toHaveProperty('parentChain_pages_page-2')
      expect(req.context).toHaveProperty('parentChain_pages_page-3')
    })
  })

  describe('error handling', () => {
    it('should handle missing parent document gracefully', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: 'non-existent' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await validator('page-1', {
        data: { id: 'page-2' },
        req: req as any,
      } as any)

      // Should return true (no cycle detected) when parent not found
      expect(result).toBe(true)
    })

    it('should log error when parent lookup fails', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: 'non-existent' },
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      await validator('page-1', {
        data: { id: 'page-2' },
        req: req as any,
      } as any)

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error building parent chain'),
      )
    })
  })

  describe('buildParentChain utility', () => {
    it('should build correct parent chain', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: 'page-2' },
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const chain = await buildParentChain('page-3', 'pages', req as any)

      expect(chain).toEqual(['page-1', 'page-2'])
    })

    it('should return empty array for root document', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const chain = await buildParentChain('page-1', 'pages', req as any)

      expect(chain).toEqual([])
    })

    it('should cache fetched documents', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
      }

      const mockPayload = createMockPayload(documents)
      const req = {
        payload: mockPayload,
        context: {},
      }

      await buildParentChain('page-2', 'pages', req as any)
      const firstCallCount = mockPayload.findByID.mock.calls.length

      // Second call should use cached documents
      await buildParentChain('page-2', 'pages', req as any)
      const secondCallCount = mockPayload.findByID.mock.calls.length

      expect(secondCallCount).toBe(firstCallCount)
      expect(req.context).toHaveProperty('docCache_pages')
    })

    it('should respect max depth limit', async () => {
      const documents: Record<string, any> = {}
      const maxDepth = 5

      for (let i = 0; i <= maxDepth + 2; i++) {
        documents[`page-${i}`] = {
          id: `page-${i}`,
          parent: i > 0 ? `page-${i - 1}` : null,
        }
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const chain = await buildParentChain(`page-${maxDepth + 2}`, 'pages', req as any, maxDepth)

      expect(chain.length).toBeLessThanOrEqual(maxDepth)
    })
  })

  describe('isAncestor utility', () => {
    it('should return true when first document is ancestor', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: 'page-2' },
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await isAncestor('page-1', 'page-3', 'pages', req as any)

      expect(result).toBe(true)
    })

    it('should return false when first document is not ancestor', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: null },
        'page-3': { id: 'page-3', parent: 'page-2' },
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await isAncestor('page-1', 'page-3', 'pages', req as any)

      expect(result).toBe(false)
    })

    it('should cache result', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      await isAncestor('page-1', 'page-2', 'pages', req as any)

      expect(req.context).toHaveProperty('isAncestor_pages_page-1_page-2')

      // Second call should use cache
      const result = await isAncestor('page-1', 'page-2', 'pages', req as any)

      expect(result).toBe(true)
    })

    it('should return false for sibling documents', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: 'page-1' },
      }

      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const result = await isAncestor('page-2', 'page-3', 'pages', req as any)

      expect(result).toBe(false)
    })
  })

  describe('performance', () => {
    it('should handle large hierarchies efficiently', async () => {
      const documents: Record<string, any> = {}
      const depth = 20

      for (let i = 0; i <= depth; i++) {
        documents[`page-${i}`] = {
          id: `page-${i}`,
          parent: i > 0 ? `page-${i - 1}` : null,
        }
      }

      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: createMockPayload(documents),
        context: {},
      }

      const startTime = Date.now()

      await validator(`page-${depth - 1}`, {
        data: { id: `page-${depth}` },
        req: req as any,
      } as any)

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete in reasonable time (< 100ms)
      expect(duration).toBeLessThan(100)
    })

    it('should reuse cached data across multiple validations', async () => {
      const documents = {
        'page-1': { id: 'page-1', parent: null },
        'page-2': { id: 'page-2', parent: 'page-1' },
        'page-3': { id: 'page-3', parent: 'page-2' },
        'page-4': { id: 'page-4', parent: 'page-3' },
      }

      const mockPayload = createMockPayload(documents)
      const validator = createCircularReferenceValidator('pages')
      const req = {
        payload: mockPayload,
        context: {},
      }

      // First validation
      await validator('page-2', {
        data: { id: 'page-3' },
        req: req as any,
      } as any)

      const callsAfterFirst = mockPayload.findByID.mock.calls.length

      // Second validation should reuse cached data
      await validator('page-3', {
        data: { id: 'page-4' },
        req: req as any,
      } as any)

      const callsAfterSecond = mockPayload.findByID.mock.calls.length

      // Should make fewer calls due to caching
      expect(callsAfterSecond).toBeLessThan(callsAfterFirst * 2)
    })
  })
})
