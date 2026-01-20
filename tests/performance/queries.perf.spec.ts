import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

/**
 * Performance benchmarks for database query operations
 *
 * Target metrics (from design document):
 * - Find by slug: < 10ms (indexed)
 * - Count query: < 20ms
 * - Create document: < 100ms
 * - Update document: < 80ms
 *
 * Note: These tests require a running database connection.
 * Run with: npx vitest run tests/performance/queries.perf.spec.ts
 */

describe('Database Query Performance Benchmarks', () => {
  let payload: Payload
  const testDocIds: string[] = []

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create test documents for query benchmarks
    console.log('Setting up test data for performance benchmarks...')

    // Create 10 test blog posts with indexed fields
    for (let i = 0; i < 10; i++) {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: `Performance Test Blog ${i}`,
          slug: `perf-test-blog-${i}`,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: `This is test content for performance benchmark ${i}`,
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr' as const,
                  format: '',
                  indent: 0,
                  version: 1,
                },
              ],
              direction: 'ltr' as const,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          _status: i % 2 === 0 ? 'published' : 'draft',
        },
      })
      testDocIds.push(String(blog.id))
    }

    console.log(`Created ${testDocIds.length} test documents`)
  }, 60000) // 60 second timeout for setup

  afterAll(async () => {
    // Cleanup test documents
    console.log('Cleaning up test data...')
    for (const id of testDocIds) {
      try {
        await payload.delete({
          collection: 'blogs',
          id,
        })
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  }, 30000)

  describe('15.2 Find by Slug Performance (Indexed)', () => {
    it('should find document by slug in < 10ms', async () => {
      const startTime = performance.now()

      const result = await payload.find({
        collection: 'blogs',
        where: {
          slug: { equals: 'perf-test-blog-0' },
        },
        limit: 1,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(result.docs.length).toBe(1)
      expect(result.docs[0]?.slug).toBe('perf-test-blog-0')
      expect(executionTime).toBeLessThan(10)
      console.log(`Find by slug execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should handle 10 consecutive slug lookups in < 100ms', async () => {
      const iterations = 10

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        await payload.find({
          collection: 'blogs',
          where: {
            slug: { equals: `perf-test-blog-${i % 10}` },
          },
          limit: 1,
        })
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(100)
      expect(avgTime).toBeLessThan(10)
      console.log(
        `Slug lookup bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
    })
  })

  describe('15.2 Count Query Performance', () => {
    it('should execute count query in < 20ms', async () => {
      const startTime = performance.now()

      const result = await payload.count({
        collection: 'blogs',
        where: {
          _status: { equals: 'published' },
        },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(result.totalDocs).toBeGreaterThanOrEqual(0)
      expect(executionTime).toBeLessThan(20)
      console.log(`Count query execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute count query with multiple conditions in < 20ms', async () => {
      const startTime = performance.now()

      const result = await payload.count({
        collection: 'blogs',
        where: {
          and: [{ _status: { equals: 'published' } }, { slug: { contains: 'perf-test' } }],
        },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(result.totalDocs).toBeGreaterThanOrEqual(0)
      expect(executionTime).toBeLessThan(20)
      console.log(`Count query (complex) execution time: ${executionTime.toFixed(3)}ms`)
    })
  })

  describe('15.2 Create Document Performance', () => {
    it('should create document in < 100ms', async () => {
      const startTime = performance.now()

      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Performance Test Create',
          slug: `perf-test-create-${Date.now()}`,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Test content for create performance',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr' as const,
                  format: '',
                  indent: 0,
                  version: 1,
                },
              ],
              direction: 'ltr' as const,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          _status: 'draft',
        },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(blog.id).toBeDefined()
      expect(executionTime).toBeLessThan(100)
      console.log(`Create document execution time: ${executionTime.toFixed(3)}ms`)

      // Cleanup
      await payload.delete({ collection: 'blogs', id: blog.id })
    })

    it('should create 5 documents in < 500ms', async () => {
      const iterations = 5
      const createdIds: number[] = []

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        const blog = await payload.create({
          collection: 'blogs',
          data: {
            title: `Bulk Create Test ${i}`,
            slug: `bulk-create-${Date.now()}-${i}`,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: `Test content ${i}`,
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr' as const,
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr' as const,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            _status: 'draft',
          },
        })
        createdIds.push(blog.id)
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(500)
      expect(avgTime).toBeLessThan(100)
      console.log(
        `Create bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )

      // Cleanup
      for (const id of createdIds) {
        await payload.delete({ collection: 'blogs', id })
      }
    })
  })

  describe('15.2 Update Document Performance', () => {
    it('should update document in < 80ms', async () => {
      // Use first test document
      const docId = testDocIds[0]
      if (!docId) {
        throw new Error('No test document available for update test')
      }

      const startTime = performance.now()

      const updated = await payload.update({
        collection: 'blogs',
        id: docId,
        data: {
          title: 'Updated Performance Test',
        },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(updated.id).toBe(docId)
      expect(updated.title).toBe('Updated Performance Test')
      expect(executionTime).toBeLessThan(80)
      console.log(`Update document execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should update 5 documents in < 400ms', async () => {
      const iterations = 5
      const docsToUpdate = testDocIds.slice(0, iterations)

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        const docId = docsToUpdate[i]
        if (!docId) {
          throw new Error(`No test document available at index ${i} for bulk update test`)
        }
        await payload.update({
          collection: 'blogs',
          id: docId,
          data: {
            title: `Bulk Update Test ${i}`,
          },
        })
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(400)
      expect(avgTime).toBeLessThan(80)
      console.log(
        `Update bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
    })
  })

  describe('15.2 Filtered Query Performance', () => {
    it('should execute filtered query with indexed field in < 20ms', async () => {
      const startTime = performance.now()

      const result = await payload.find({
        collection: 'blogs',
        where: {
          _status: { equals: 'published' },
        },
        limit: 10,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(result.docs).toBeDefined()
      expect(executionTime).toBeLessThan(20)
      console.log(`Filtered query (indexed) execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should execute sorted query with indexed field in < 30ms', async () => {
      const startTime = performance.now()

      const result = await payload.find({
        collection: 'blogs',
        where: {
          slug: { contains: 'perf-test' },
        },
        sort: '-createdAt',
        limit: 10,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(result.docs).toBeDefined()
      expect(executionTime).toBeLessThan(30)
      console.log(`Sorted query execution time: ${executionTime.toFixed(3)}ms`)
    })
  })

  describe('15.2 Pagination Performance', () => {
    it('should execute paginated query in < 30ms', async () => {
      const startTime = performance.now()

      const result = await payload.find({
        collection: 'blogs',
        page: 1,
        limit: 5,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(result.docs).toBeDefined()
      expect(result.page).toBe(1)
      expect(executionTime).toBeLessThan(30)
      console.log(`Paginated query execution time: ${executionTime.toFixed(3)}ms`)
    })
  })

  describe('15.2 FindByID Performance', () => {
    it('should find document by ID in < 10ms', async () => {
      const docId = testDocIds[0]
      if (!docId) {
        throw new Error('No test document available for findByID test')
      }

      const startTime = performance.now()

      const doc = await payload.findByID({
        collection: 'blogs',
        id: docId,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(doc.id).toBe(docId)
      expect(executionTime).toBeLessThan(10)
      console.log(`FindByID execution time: ${executionTime.toFixed(3)}ms`)
    })

    it('should handle 10 consecutive findByID operations in < 100ms', async () => {
      const iterations = 10

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        const docId = testDocIds[i % testDocIds.length]
        if (!docId) {
          throw new Error(
            `No test document available at index ${i % testDocIds.length} for bulk findByID test`,
          )
        }
        await payload.findByID({
          collection: 'blogs',
          id: docId,
        })
      }
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      expect(totalTime).toBeLessThan(100)
      expect(avgTime).toBeLessThan(10)
      console.log(
        `FindByID bulk (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
    })
  })
})
