import { describe, it, expect, vi } from 'vitest'
import * as fc from 'fast-check'
import {
  createCircularReferenceValidator,
  buildParentChain,
  isAncestor,
} from '@/pages/shared/validation/circularReference'

/**
 * Property-Based Tests for Circular Reference Detection
 *
 * These tests validate that circular reference detection works correctly
 * across various hierarchy structures.
 *
 * **Validates: Requirements 8.5, Property 4**
 */
describe('Circular Reference Detection Properties', () => {
  /**
   * Property 4: Circular Reference Prevention
   * No page can be its own ancestor in the parent hierarchy
   */
  describe('Property 4: Circular Reference Prevention', () => {
    it('property: direct self-reference is always detected', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (docId) => {
          const validator = createCircularReferenceValidator('pages')

          const mockReq = {
            payload: {
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          const data = { id: docId }

          // Self-reference should be rejected
          const result = await validator(docId, { data, req: mockReq } as any)

          expect(result).toBe('A page cannot be its own parent')

          return true
        }),
        { numRuns: 100 },
      )
    })

    it('property: direct cycle (A → B → A) is always detected', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), fc.uuid(), async (idA, idB) => {
          // Ensure IDs are different
          if (idA === idB) return true

          const validator = createCircularReferenceValidator('pages')

          // Mock payload that returns B with parent A
          const mockReq = {
            payload: {
              findByID: vi.fn().mockResolvedValue({
                id: idB,
                parent: idA,
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Try to set A's parent to B (which would create A → B → A)
          const data = { id: idA }
          const result = await validator(idB, { data, req: mockReq } as any)

          // Should detect the cycle
          expect(typeof result).toBe('string')
          expect(result).toContain('Circular')

          return true
        }),
        { numRuns: 100 },
      )
    })

    it('property: indirect cycle (A → B → C → A) is always detected', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), fc.uuid(), fc.uuid(), async (idA, idB, idC) => {
          // Ensure IDs are different
          if (idA === idB || idB === idC || idA === idC) return true

          const validator = createCircularReferenceValidator('pages')

          // Mock payload that returns:
          // B has parent C
          // C has parent A
          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                if (id === idB) return { id: idB, parent: idC }
                if (id === idC) return { id: idC, parent: idA }
                return { id, parent: null }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Try to set A's parent to B (which would create A → B → C → A)
          const data = { id: idA }
          const result = await validator(idB, { data, req: mockReq } as any)

          // Should detect the cycle
          expect(typeof result).toBe('string')
          expect(result).toContain('Circular')

          return true
        }),
        { numRuns: 100 },
      )
    })

    it('property: valid linear hierarchy is always accepted', async () => {
      await fc.assert(
        fc.asyncProperty(fc.array(fc.uuid(), { minLength: 2, maxLength: 10 }), async (ids) => {
          // Ensure all IDs are unique
          const uniqueIds = Array.from(new Set(ids))
          if (uniqueIds.length < 2) return true

          const validator = createCircularReferenceValidator('pages')

          // Create a linear hierarchy: ids[0] → ids[1] → ids[2] → ...
          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                const index = uniqueIds.indexOf(id)
                if (index === -1 || index === uniqueIds.length - 1) {
                  return { id, parent: null }
                }
                return { id, parent: uniqueIds[index + 1] }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Try to set first node's parent to second node (valid)
          const data = { id: uniqueIds[0] }
          const result = await validator(uniqueIds[1], { data, req: mockReq } as any)

          // Should be accepted (true means valid)
          expect(result).toBe(true)

          return true
        }),
        { numRuns: 50 },
      )
    })

    it('property: max depth limit prevents excessive traversal', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 10 }), async (maxDepth) => {
          const validator = createCircularReferenceValidator('pages', maxDepth)

          // Create a chain longer than maxDepth
          const ids = Array.from({ length: maxDepth + 5 }, (_, i) => `id-${i}`)

          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                const index = ids.indexOf(id)
                if (index === -1 || index === ids.length - 1) {
                  return { id, parent: null }
                }
                return { id, parent: ids[index + 1] }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Try to set first node's parent to second node
          const data = { id: ids[0] }
          const result = await validator(ids[1], { data, req: mockReq } as any)

          // Should reject due to max depth
          expect(typeof result).toBe('string')
          expect(result).toContain('too deep')

          return true
        }),
        { numRuns: 20 },
      )
    })

    it('property: null or undefined parent is always accepted', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.constantFrom(null, undefined),
          async (docId, parentValue) => {
            const validator = createCircularReferenceValidator('pages')

            const mockReq = {
              payload: {
                logger: {
                  error: vi.fn(),
                },
              },
              context: {},
            }

            const data = { id: docId }

            // Null/undefined parent should be accepted
            const result = await validator(parentValue, { data, req: mockReq } as any)

            expect(result).toBe(true)

            return true
          },
        ),
        { numRuns: 50 },
      )
    })

    it('property: document without ID can set any parent', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (parentId) => {
          const validator = createCircularReferenceValidator('pages')

          const mockReq = {
            payload: {
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Data without ID (new document)
          const data = {}

          // Should be accepted (no ID means no cycle possible)
          const result = await validator(parentId, { data, req: mockReq } as any)

          expect(result).toBe(true)

          return true
        }),
        { numRuns: 50 },
      )
    })
  })

  /**
   * buildParentChain Function Properties
   */
  describe('buildParentChain Properties', () => {
    it('property: parent chain never contains duplicates', async () => {
      await fc.assert(
        fc.asyncProperty(fc.array(fc.uuid(), { minLength: 2, maxLength: 10 }), async (ids) => {
          // Ensure all IDs are unique
          const uniqueIds = Array.from(new Set(ids))
          if (uniqueIds.length < 2) return true

          // Create a linear hierarchy
          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                const index = uniqueIds.indexOf(id)
                if (index === -1 || index === uniqueIds.length - 1) {
                  return { id, parent: null }
                }
                return { id, parent: uniqueIds[index + 1] }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          const chain = await buildParentChain(uniqueIds[0], 'pages', mockReq)

          // Chain should not contain duplicates
          const uniqueChain = new Set(chain)
          expect(uniqueChain.size).toBe(chain.length)

          return true
        }),
        { numRuns: 50 },
      )
    })

    it('property: parent chain length never exceeds maxDepth', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 20 }), async (maxDepth) => {
          // Create a chain longer than maxDepth
          const ids = Array.from({ length: maxDepth + 10 }, (_, i) => `id-${i}`)

          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                const index = ids.indexOf(id)
                if (index === -1 || index === ids.length - 1) {
                  return { id, parent: null }
                }
                return { id, parent: ids[index + 1] }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          const chain = await buildParentChain(ids[0], 'pages', mockReq, maxDepth)

          // Chain length should not exceed maxDepth
          expect(chain.length).toBeLessThanOrEqual(maxDepth)

          return true
        }),
        { numRuns: 50 },
      )
    })

    it('property: parent chain is ordered from root to leaf', async () => {
      await fc.assert(
        fc.asyncProperty(fc.array(fc.uuid(), { minLength: 3, maxLength: 10 }), async (ids) => {
          // Ensure all IDs are unique
          const uniqueIds = Array.from(new Set(ids))
          if (uniqueIds.length < 3) return true

          // Create a linear hierarchy: ids[0] → ids[1] → ids[2] → ...
          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                const index = uniqueIds.indexOf(id)
                if (index === -1 || index === uniqueIds.length - 1) {
                  return { id, parent: null }
                }
                return { id, parent: uniqueIds[index + 1] }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          const chain = await buildParentChain(uniqueIds[0], 'pages', mockReq)

          // Chain should be in order from root to leaf
          // First element should be the furthest ancestor
          // Last element should be the immediate parent
          if (chain.length > 0) {
            expect(chain[chain.length - 1]).toBe(uniqueIds[1])
          }

          return true
        }),
        { numRuns: 50 },
      )
    })

    it('property: caching prevents redundant queries', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), fc.uuid(), async (id1, id2) => {
          if (id1 === id2) return true

          const findByIDMock = vi.fn().mockImplementation(async ({ id }: any) => {
            if (id === id1) return { id: id1, parent: id2 }
            if (id === id2) return { id: id2, parent: null }
            return { id, parent: null }
          })

          const mockReq = {
            payload: {
              findByID: findByIDMock,
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Build chain twice
          await buildParentChain(id1, 'pages', mockReq)
          await buildParentChain(id1, 'pages', mockReq)

          // Second call should use cache, so findByID should only be called twice
          // (once for id1, once for id2) not four times
          expect(findByIDMock).toHaveBeenCalledTimes(2)

          return true
        }),
        { numRuns: 50 },
      )
    })
  })

  /**
   * isAncestor Function Properties
   */
  describe('isAncestor Properties', () => {
    it('property: isAncestor is transitive', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), fc.uuid(), fc.uuid(), async (idA, idB, idC) => {
          // Ensure IDs are different
          if (idA === idB || idB === idC || idA === idC) return true

          // Create hierarchy: A → B → C
          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                if (id === idC) return { id: idC, parent: idB }
                if (id === idB) return { id: idB, parent: idA }
                return { id, parent: null }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // If A is ancestor of B, and B is ancestor of C, then A is ancestor of C
          const aAncestorOfB = await isAncestor(idA, idB, 'pages', mockReq)
          const bAncestorOfC = await isAncestor(idB, idC, 'pages', mockReq)
          const aAncestorOfC = await isAncestor(idA, idC, 'pages', mockReq)

          if (aAncestorOfB && bAncestorOfC) {
            expect(aAncestorOfC).toBe(true)
          }

          return true
        }),
        { numRuns: 50 },
      )
    })

    it('property: isAncestor is not reflexive (node is not its own ancestor)', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (docId) => {
          const mockReq = {
            payload: {
              findByID: vi.fn().mockResolvedValue({
                id: docId,
                parent: null,
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // A node should not be its own ancestor
          const result = await isAncestor(docId, docId, 'pages', mockReq)

          expect(result).toBe(false)

          return true
        }),
        { numRuns: 50 },
      )
    })

    it('property: isAncestor caching works correctly', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), fc.uuid(), async (ancestorId, descendantId) => {
          if (ancestorId === descendantId) return true

          const mockReq = {
            payload: {
              findByID: vi.fn().mockImplementation(async ({ id }: any) => {
                if (id === descendantId) return { id: descendantId, parent: ancestorId }
                return { id, parent: null }
              }),
              logger: {
                error: vi.fn(),
              },
            },
            context: {},
          }

          // Call twice
          const result1 = await isAncestor(ancestorId, descendantId, 'pages', mockReq)
          const result2 = await isAncestor(ancestorId, descendantId, 'pages', mockReq)

          // Results should be the same
          expect(result1).toBe(result2)

          // Cache key should exist
          const cacheKey = `isAncestor_pages_${ancestorId}_${descendantId}`
          expect(mockReq.context[cacheKey]).toBeDefined()

          return true
        }),
        { numRuns: 50 },
      )
    })
  })
})
