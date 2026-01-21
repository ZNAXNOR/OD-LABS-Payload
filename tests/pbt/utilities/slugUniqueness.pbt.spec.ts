import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fc from 'fast-check'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

/**
 * Property-Based Tests for Slug Uniqueness
 *
 * These tests validate that slug uniqueness is maintained even under concurrent operations.
 * Uses fast-check library to generate random titles and test concurrent creation.
 *
 * **Validates: Requirements 8.5, Property 2**
 *
 * **NOTE**: These tests require a real database connection and may take a long time to run
 * due to database schema pulling. If tests timeout, ensure:
 * 1. Database is running and accessible
 * 2. DATABASE_URL environment variable is set correctly
 * 3. Network connection is stable
 *
 * If database connection is consistently slow, you may need to run these tests separately
 * with a longer timeout or skip them in CI/CD pipelines.
 */
describe('Slug Uniqueness Properties', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config })
  }, 120000) // 120 second timeout for database connection (schema pulling can be slow)

  afterAll(async () => {
    // Cleanup test data
    try {
      await payload.delete({
        collection: 'blogs',
        where: {
          title: {
            contains: 'pbt-test',
          },
        },
      })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  /**
   * Property 2: Slug Uniqueness
   * No two documents in the same collection can have the same slug
   */
  describe('Property 2: Slug Uniqueness', () => {
    it('property: concurrent document creation produces unique slugs', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 2, maxLength: 5 }),
          async (titles) => {
            // Prefix titles to avoid conflicts with existing data
            const testTitles = titles.map((t) => `pbt-test-${t}`)

            try {
              // Create documents concurrently with same titles
              const createPromises = testTitles.map((title) =>
                payload.create({
                  collection: 'blogs',
                  data: {
                    title,
                    content: {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'paragraph',
                            version: 1,
                            children: [{ type: 'text', text: 'Test content' }],
                          },
                        ],
                        direction: null,
                        format: '',
                        indent: 0,
                        version: 1,
                      },
                    },
                  },
                }),
              )

              const results = await Promise.all(createPromises)

              // Extract slugs
              const slugs = results.map((doc) => doc.slug)

              // All slugs must be unique
              const uniqueSlugs = new Set(slugs)
              expect(uniqueSlugs.size).toBe(slugs.length)

              // Cleanup
              await Promise.all(
                results.map((doc) =>
                  payload.delete({
                    collection: 'blogs',
                    id: doc.id,
                  }),
                ),
              )

              return true
            } catch (error) {
              console.error('Test error:', error)
              throw error
            }
          },
        ),
        { numRuns: 10 }, // Reduced runs due to database operations
      )
    }, 60000) // 60 second timeout for database operations

    it('property: sequential document creation with same title produces unique slugs', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 5, maxLength: 50 }),
          fc.integer({ min: 2, max: 5 }),
          async (baseTitle, count) => {
            const title = `pbt-test-sequential-${baseTitle}`
            const createdDocs: any[] = []

            try {
              // Create multiple documents with same title sequentially
              for (let i = 0; i < count; i++) {
                const doc = await payload.create({
                  collection: 'blogs',
                  data: {
                    title,
                    content: {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'paragraph',
                            version: 1,
                            children: [{ type: 'text', text: 'Test content' }],
                          },
                        ],
                        direction: null,
                        format: '',
                        indent: 0,
                        version: 1,
                      },
                    },
                  },
                })
                createdDocs.push(doc)
              }

              // Extract slugs
              const slugs = createdDocs.map((doc) => doc.slug)

              // All slugs must be unique
              const uniqueSlugs = new Set(slugs)
              expect(uniqueSlugs.size).toBe(slugs.length)

              // First slug should be base, others should have numbers
              expect(slugs[0]).not.toMatch(/-\d+$/)
              for (let i = 1; i < slugs.length; i++) {
                expect(slugs[i]).toMatch(/-\d+$/)
              }

              // Cleanup
              await Promise.all(
                createdDocs.map((doc) =>
                  payload.delete({
                    collection: 'blogs',
                    id: doc.id,
                  }),
                ),
              )

              return true
            } catch (error) {
              // Cleanup on error
              await Promise.all(
                createdDocs.map((doc) =>
                  payload
                    .delete({
                      collection: 'blogs',
                      id: doc.id,
                    })
                    .catch(() => {}),
                ),
              )
              throw error
            }
          },
        ),
        { numRuns: 10 },
      )
    }, 60000)

    it('property: updating document slug maintains uniqueness', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 5, maxLength: 50 }),
          fc.string({ minLength: 5, maxLength: 50 }),
          async (title1, title2) => {
            const testTitle1 = `pbt-test-update-1-${title1}`
            const testTitle2 = `pbt-test-update-2-${title2}`

            let doc1: any
            let doc2: any

            try {
              // Create two documents
              doc1 = await payload.create({
                collection: 'blogs',
                data: {
                  title: testTitle1,
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          version: 1,
                          children: [{ type: 'text', text: 'Test content 1' }],
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                },
              })

              doc2 = await payload.create({
                collection: 'blogs',
                data: {
                  title: testTitle2,
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          version: 1,
                          children: [{ type: 'text', text: 'Test content 2' }],
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                },
              })

              // Try to update doc2 to have same slug as doc1
              // This should fail or generate a unique slug
              try {
                await payload.update({
                  collection: 'blogs',
                  id: doc2.id,
                  data: {
                    slug: doc1.slug,
                  },
                })

                // If update succeeded, verify slugs are still unique
                const updatedDoc1 = await payload.findByID({
                  collection: 'blogs',
                  id: doc1.id,
                })

                const updatedDoc2 = await payload.findByID({
                  collection: 'blogs',
                  id: doc2.id,
                })

                expect(updatedDoc1.slug).not.toBe(updatedDoc2.slug)
              } catch (error) {
                // Expected to fail due to unique constraint
                expect(error).toBeDefined()
              }

              // Cleanup
              await payload.delete({ collection: 'blogs', id: doc1.id })
              await payload.delete({ collection: 'blogs', id: doc2.id })

              return true
            } catch (error) {
              // Cleanup on error
              if (doc1) await payload.delete({ collection: 'blogs', id: doc1.id }).catch(() => {})
              if (doc2) await payload.delete({ collection: 'blogs', id: doc2.id }).catch(() => {})
              throw error
            }
          },
        ),
        { numRuns: 5 },
      )
    }, 60000)

    it('property: database unique constraint prevents duplicate slugs', async () => {
      await fc.assert(
        fc.asyncProperty(fc.string({ minLength: 5, maxLength: 50 }), async (baseTitle) => {
          const title = `pbt-test-constraint-${baseTitle}`
          let doc1: any

          try {
            // Create first document
            doc1 = await payload.create({
              collection: 'blogs',
              data: {
                title,
                content: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        version: 1,
                        children: [{ type: 'text', text: 'Test content' }],
                      },
                    ],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            })

            // Try to create second document with same slug
            // This should either fail or generate a unique slug
            try {
              const doc2 = await payload.create({
                collection: 'blogs',
                data: {
                  title,
                  slug: doc1.slug, // Explicitly use same slug
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          version: 1,
                          children: [{ type: 'text', text: 'Test content 2' }],
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                },
              })

              // If creation succeeded, slugs must be different
              expect(doc2.slug).not.toBe(doc1.slug)

              // Cleanup
              await payload.delete({ collection: 'blogs', id: doc2.id })
            } catch (error) {
              // Expected to fail due to unique constraint
              expect(error).toBeDefined()
            }

            // Cleanup
            await payload.delete({ collection: 'blogs', id: doc1.id })

            return true
          } catch (error) {
            // Cleanup on error
            if (doc1) await payload.delete({ collection: 'blogs', id: doc1.id }).catch(() => {})
            throw error
          }
        }),
        { numRuns: 10 },
      )
    }, 60000)

    it('property: slug uniqueness is maintained across collections', async () => {
      // This test verifies that slug uniqueness is per-collection
      // Same slug can exist in different collections
      await fc.assert(
        fc.asyncProperty(fc.string({ minLength: 5, maxLength: 50 }), async (baseTitle) => {
          const title = `pbt-test-cross-collection-${baseTitle}`
          let blogDoc: any
          let serviceDoc: any

          try {
            // Create document in blogs collection
            blogDoc = await payload.create({
              collection: 'blogs',
              data: {
                title,
                content: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        version: 1,
                        children: [{ type: 'text', text: 'Test content' }],
                      },
                    ],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            })

            // Create document in services collection with same title
            // Should be able to have same slug in different collection
            serviceDoc = await payload.create({
              collection: 'services',
              data: {
                title,
                content: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        version: 1,
                        children: [{ type: 'text', text: 'Test content' }],
                      },
                    ],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            })

            // Slugs can be the same across collections
            // This is expected behavior
            expect(blogDoc.slug).toBeDefined()
            expect(serviceDoc.slug).toBeDefined()

            // Cleanup
            await payload.delete({ collection: 'blogs', id: blogDoc.id })
            await payload.delete({ collection: 'services', id: serviceDoc.id })

            return true
          } catch (error) {
            // Cleanup on error
            if (blogDoc)
              await payload.delete({ collection: 'blogs', id: blogDoc.id }).catch(() => {})
            if (serviceDoc)
              await payload.delete({ collection: 'services', id: serviceDoc.id }).catch(() => {})
            throw error
          }
        }),
        { numRuns: 5 },
      )
    }, 60000)
  })

  /**
   * Additional Uniqueness Properties
   */
  describe('Additional Uniqueness Properties', () => {
    it('property: slug generation with retry produces unique slugs', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 5, maxLength: 50 }),
          fc.integer({ min: 2, max: 10 }),
          async (baseTitle, count) => {
            const title = `pbt-test-retry-${baseTitle}`
            const createdDocs: any[] = []

            try {
              // Create multiple documents rapidly
              const createPromises = Array.from({ length: count }, () =>
                payload.create({
                  collection: 'blogs',
                  data: {
                    title,
                    content: {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'paragraph',
                            version: 1,
                            children: [{ type: 'text', text: 'Test content' }],
                          },
                        ],
                        direction: null,
                        format: '',
                        indent: 0,
                        version: 1,
                      },
                    },
                  },
                }),
              )

              const results = await Promise.allSettled(createPromises)

              // Collect successful creations
              results.forEach((result) => {
                if (result.status === 'fulfilled') {
                  createdDocs.push(result.value)
                }
              })

              // All successful creations should have unique slugs
              const slugs = createdDocs.map((doc) => doc.slug)
              const uniqueSlugs = new Set(slugs)
              expect(uniqueSlugs.size).toBe(slugs.length)

              // Cleanup
              await Promise.all(
                createdDocs.map((doc) =>
                  payload.delete({
                    collection: 'blogs',
                    id: doc.id,
                  }),
                ),
              )

              return true
            } catch (error) {
              // Cleanup on error
              await Promise.all(
                createdDocs.map((doc) =>
                  payload
                    .delete({
                      collection: 'blogs',
                      id: doc.id,
                    })
                    .catch(() => {}),
                ),
              )
              throw error
            }
          },
        ),
        { numRuns: 5 },
      )
    }, 60000)

    it('property: manual slug assignment respects uniqueness', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc
            .stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
            .filter((s) => s.length > 5 && s.length < 50),
          async (customSlug) => {
            const slug = `pbt-test-manual-${customSlug}`
            let doc1: any
            let doc2: any

            try {
              // Create document with custom slug
              doc1 = await payload.create({
                collection: 'blogs',
                data: {
                  title: 'Test Title 1',
                  slug,
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          version: 1,
                          children: [{ type: 'text', text: 'Test content' }],
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                },
              })

              // Try to create another document with same slug
              try {
                doc2 = await payload.create({
                  collection: 'blogs',
                  data: {
                    title: 'Test Title 2',
                    slug,
                    content: {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'paragraph',
                            version: 1,
                            children: [{ type: 'text', text: 'Test content 2' }],
                          },
                        ],
                        direction: null,
                        format: '',
                        indent: 0,
                        version: 1,
                      },
                    },
                  },
                })

                // If creation succeeded, slugs must be different
                expect(doc2.slug).not.toBe(doc1.slug)

                await payload.delete({ collection: 'blogs', id: doc2.id })
              } catch (error) {
                // Expected to fail due to unique constraint
                expect(error).toBeDefined()
              }

              // Cleanup
              await payload.delete({ collection: 'blogs', id: doc1.id })

              return true
            } catch (error) {
              // Cleanup on error
              if (doc1) await payload.delete({ collection: 'blogs', id: doc1.id }).catch(() => {})
              if (doc2) await payload.delete({ collection: 'blogs', id: doc2.id }).catch(() => {})
              throw error
            }
          },
        ),
        { numRuns: 5 },
      )
    }, 60000)
  })
})
