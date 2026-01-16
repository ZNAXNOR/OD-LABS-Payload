import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

/**
 * Load testing for concurrent operations
 *
 * Target metrics (from design document):
 * - 100 concurrent creates: All succeed with unique slugs
 * - No race conditions
 * - Acceptable performance
 * - Transaction rollback rate < 1%
 *
 * Note: These tests require a running database connection.
 * Run with: npx vitest run tests/performance/load.perf.spec.ts
 */

describe('Load Testing - Concurrent Operations', () => {
  let payload: Payload
  const createdDocIds: number[] = []

  beforeAll(async () => {
    payload = await getPayload({ config })
    console.log('Load testing setup complete')
  }, 60000)

  afterAll(async () => {
    // Cleanup all created documents
    console.log(`Cleaning up ${createdDocIds.length} test documents...`)
    for (const id of createdDocIds) {
      try {
        await payload.delete({
          collection: 'blogs',
          id,
        })
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }, 60000)

  describe('15.3 Concurrent Document Creation', () => {
    it('should handle 10 concurrent creates with unique slugs', async () => {
      const concurrentOps = 10
      const baseTitle = `Concurrent Test ${Date.now()}`

      const startTime = performance.now()

      // Create documents concurrently
      const promises = Array.from({ length: concurrentOps }, (_, i) =>
        payload.create({
          collection: 'blogs',
          data: {
            title: baseTitle, // Same title to test slug uniqueness
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: `Concurrent test content ${i}`,
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            _status: 'draft',
          },
        }),
      )

      const results = await Promise.all(promises)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / concurrentOps

      // Collect IDs for cleanup
      results.forEach((doc) => createdDocIds.push(doc.id))

      // Verify all documents were created
      expect(results.length).toBe(concurrentOps)

      // Verify all slugs are unique
      const slugs = results.map((doc) => doc.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(concurrentOps)

      // Verify all documents have IDs
      results.forEach((doc) => {
        expect(doc.id).toBeDefined()
        expect(doc.slug).toBeDefined()
      })

      console.log(
        `Concurrent creates (${concurrentOps} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
      console.log(`All ${concurrentOps} slugs are unique:`, Array.from(uniqueSlugs).slice(0, 5))
    }, 30000)

    it('should handle 50 concurrent creates with unique slugs', async () => {
      const concurrentOps = 50
      const baseTitle = `Load Test ${Date.now()}`

      const startTime = performance.now()

      const promises = Array.from({ length: concurrentOps }, (_, i) =>
        payload.create({
          collection: 'blogs',
          data: {
            title: baseTitle,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: `Load test content ${i}`,
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            _status: 'draft',
          },
        }),
      )

      const results = await Promise.all(promises)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / concurrentOps

      // Collect IDs for cleanup
      results.forEach((doc) => createdDocIds.push(doc.id))

      // Verify all documents were created
      expect(results.length).toBe(concurrentOps)

      // Verify all slugs are unique
      const slugs = results.map((doc) => doc.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(concurrentOps)

      console.log(
        `Concurrent creates (${concurrentOps} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
      console.log(`Slug uniqueness: ${uniqueSlugs.size}/${concurrentOps} unique`)
    }, 60000)

    it('should handle 100 concurrent creates with unique slugs', async () => {
      const concurrentOps = 100
      const baseTitle = `Stress Test ${Date.now()}`

      const startTime = performance.now()

      const promises = Array.from({ length: concurrentOps }, (_, i) =>
        payload.create({
          collection: 'blogs',
          data: {
            title: baseTitle,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: `Stress test content ${i}`,
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            _status: 'draft',
          },
        }),
      )

      const results = await Promise.all(promises)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / concurrentOps

      // Collect IDs for cleanup
      results.forEach((doc) => createdDocIds.push(doc.id))

      // Verify all documents were created
      expect(results.length).toBe(concurrentOps)

      // Verify all slugs are unique (critical test for race conditions)
      const slugs = results.map((doc) => doc.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(concurrentOps)

      // Verify no duplicate slugs
      const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
      expect(duplicates.length).toBe(0)

      console.log(
        `Concurrent creates (${concurrentOps} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
      console.log(`Slug uniqueness: ${uniqueSlugs.size}/${concurrentOps} unique`)
      console.log(`No race conditions detected: ${duplicates.length === 0 ? 'PASS' : 'FAIL'}`)
    }, 120000)
  })

  describe('15.3 Concurrent Updates', () => {
    let testDocId: number

    beforeAll(async () => {
      // Create a test document for concurrent updates
      const doc = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Concurrent Update Test',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  children: [
                    {
                      type: 'text',
                      text: 'Initial content',
                    },
                  ],
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          _status: 'draft',
        },
      })
      testDocId = doc.id
      createdDocIds.push(doc.id)
    })

    it('should handle 20 concurrent updates without data corruption', async () => {
      const concurrentOps = 20

      const startTime = performance.now()

      // Update the same document concurrently
      const promises = Array.from({ length: concurrentOps }, (_, i) =>
        payload.update({
          collection: 'blogs',
          id: testDocId,
          data: {
            title: `Updated Title ${i}`,
          },
        }),
      )

      const results = await Promise.all(promises)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const avgTime = totalTime / concurrentOps

      // Verify all updates succeeded
      expect(results.length).toBe(concurrentOps)

      // Verify the document still exists and is valid
      const finalDoc = await payload.findByID({
        collection: 'blogs',
        id: testDocId,
      })

      expect(finalDoc.id).toBe(testDocId)
      expect(finalDoc.title).toContain('Updated Title')

      console.log(
        `Concurrent updates (${concurrentOps} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
      console.log(`Final document title: ${finalDoc.title}`)
    }, 30000)
  })

  describe('15.3 Mixed Concurrent Operations', () => {
    it('should handle mixed creates, updates, and reads concurrently', async () => {
      const opsPerType = 10
      const baseTitle = `Mixed Ops Test ${Date.now()}`

      // Create a document for updates
      const updateDoc = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Update Target',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  children: [
                    {
                      type: 'text',
                      text: 'Content for updates',
                    },
                  ],
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          _status: 'draft',
        },
      })
      createdDocIds.push(updateDoc.id)

      const startTime = performance.now()

      // Mix of operations
      const createPromises = Array.from({ length: opsPerType }, (_, i) =>
        payload.create({
          collection: 'blogs',
          data: {
            title: `${baseTitle} ${i}`,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: `Content ${i}`,
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            _status: 'draft',
          },
        }),
      )

      const updatePromises = Array.from({ length: opsPerType }, (_, i) =>
        payload.update({
          collection: 'blogs',
          id: updateDoc.id,
          data: {
            title: `Updated ${i}`,
          },
        }),
      )

      const readPromises = Array.from({ length: opsPerType }, () =>
        payload.findByID({
          collection: 'blogs',
          id: updateDoc.id,
        }),
      )

      // Execute all operations concurrently
      const allPromises = [...createPromises, ...updatePromises, ...readPromises]
      const results = await Promise.all(allPromises)

      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / allPromises.length

      // Collect created doc IDs
      results.slice(0, opsPerType).forEach((doc: any) => {
        if (doc.id) createdDocIds.push(doc.id)
      })

      // Verify all operations succeeded
      expect(results.length).toBe(opsPerType * 3)

      console.log(
        `Mixed operations (${allPromises.length} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
      console.log(`Creates: ${opsPerType}, Updates: ${opsPerType}, Reads: ${opsPerType}`)
    }, 60000)
  })

  describe('15.3 Slug Uniqueness Under Load', () => {
    it('should maintain slug uniqueness with rapid sequential creates', async () => {
      const iterations = 20
      const baseTitle = `Sequential Test ${Date.now()}`
      const slugs: string[] = []

      const startTime = performance.now()

      // Create documents rapidly in sequence
      for (let i = 0; i < iterations; i++) {
        const doc = await payload.create({
          collection: 'blogs',
          data: {
            title: baseTitle, // Same title to test uniqueness
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: `Sequential content ${i}`,
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            _status: 'draft',
          },
        })
        if (doc.slug) {
          slugs.push(doc.slug)
        }
        createdDocIds.push(doc.id)
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations

      // Verify all slugs are unique
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(iterations)

      console.log(
        `Sequential creates (${iterations} ops): ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(3)}ms avg`,
      )
      console.log(`Slug uniqueness: ${uniqueSlugs.size}/${iterations} unique`)
    }, 30000)
  })

  describe('15.3 Error Rate Under Load', () => {
    it('should have error rate < 1% under concurrent load', async () => {
      const concurrentOps = 50
      const baseTitle = `Error Rate Test ${Date.now()}`
      let successCount = 0
      let errorCount = 0

      const startTime = performance.now()

      const promises = Array.from({ length: concurrentOps }, async (_, i) => {
        try {
          const doc = await payload.create({
            collection: 'blogs',
            data: {
              title: `${baseTitle} ${i}`,
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      version: 1,
                      children: [
                        {
                          type: 'text',
                          text: `Content ${i}`,
                        },
                      ],
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              _status: 'draft',
            },
          })
          createdDocIds.push(doc.id)
          successCount++
          return { success: true, doc }
        } catch (error) {
          errorCount++
          return { success: false, error }
        }
      })

      await Promise.all(promises)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const errorRate = (errorCount / concurrentOps) * 100

      console.log(`Error rate test (${concurrentOps} ops): ${totalTime.toFixed(2)}ms total`)
      console.log(`Success: ${successCount}, Errors: ${errorCount}`)
      console.log(`Error rate: ${errorRate.toFixed(2)}%`)

      // Verify error rate is less than 1%
      expect(errorRate).toBeLessThan(1)
    }, 60000)
  })
})
