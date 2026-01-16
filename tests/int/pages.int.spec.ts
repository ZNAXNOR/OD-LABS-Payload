import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let testUserId: number
let createdPageIds: number[] = []

describe('Pages Collection Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a test user for authentication
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: `test-pages-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
        roles: ['user'],
      },
    })
    testUserId = testUser.id
  }, 30000)

  afterAll(async () => {
    // Clean up created pages
    for (const id of createdPageIds) {
      try {
        await payload.delete({
          collection: 'pages',
          id,
        })
      } catch (error) {
        // Ignore errors during cleanup
      }
    }

    // Clean up test user
    if (testUserId) {
      try {
        await payload.delete({
          collection: 'users',
          id: testUserId,
        })
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  })

  describe('CRUD Operations', () => {
    it('should create a page with required fields', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Test Page',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page.id)

      expect(page).toBeDefined()
      expect(page.title).toBe('Test Page')
      expect(page.slug).toBeDefined()
      expect(page.createdAt).toBeDefined()
      expect(page.updatedAt).toBeDefined()
    })

    it('should read a page by ID', async () => {
      const created = await payload.create({
        collection: 'pages',
        data: {
          title: 'Read Test Page',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(created.id)

      const page = await payload.findByID({
        collection: 'pages',
        id: created.id,
      })

      expect(page).toBeDefined()
      expect(page.id).toBe(created.id)
      expect(page.title).toBe('Read Test Page')
    })

    it('should update a page', async () => {
      const created = await payload.create({
        collection: 'pages',
        data: {
          title: 'Original Title',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(created.id)

      const updated = await payload.update({
        collection: 'pages',
        id: created.id,
        data: {
          title: 'Updated Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.title).toBe('Updated Title')
      expect(updated.updatedAt).not.toBe(created.updatedAt)
    })

    it('should delete a page', async () => {
      const created = await payload.create({
        collection: 'pages',
        data: {
          title: 'Delete Test Page',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      await payload.delete({
        collection: 'pages',
        id: created.id,
      })

      // Verify deletion
      try {
        await payload.findByID({
          collection: 'pages',
          id: created.id,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Slug Generation Hook', () => {
    it('should auto-generate slug from title', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Auto Generated Slug',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page.id)

      expect(page.slug).toBe('auto-generated-slug')
    })

    it('should handle special characters in slug generation', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Test Page with Special @#$ Characters!',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page.id)

      expect(page.slug).toMatch(/^test-page-with-special-characters/)
    })

    it('should ensure slug uniqueness', async () => {
      const page1 = await payload.create({
        collection: 'pages',
        data: {
          title: 'Duplicate Title',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page1.id)

      const page2 = await payload.create({
        collection: 'pages',
        data: {
          title: 'Duplicate Title',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page2.id)

      expect(page1.slug).not.toBe(page2.slug)
      expect(page2.slug).toMatch(/^duplicate-title-\d+/)
    })
  })

  describe('Audit Trail Hook', () => {
    it('should set createdBy on create', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Audit Test Page',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page.id)

      expect(page.createdBy).toBe(testUserId)
    })

    it('should set updatedBy on update', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Update Audit Test',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page.id)

      const updated = await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          title: 'Updated Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.updatedBy).toBe(testUserId)
    })
  })

  describe('Circular Reference Validation', () => {
    it('should prevent self-reference', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Self Reference Test',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(page.id)

      try {
        await payload.update({
          collection: 'pages',
          id: page.id,
          data: {
            parent: page.id,
          },
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('own parent')
      }
    })

    it('should prevent circular references', async () => {
      const pageA = await payload.create({
        collection: 'pages',
        data: {
          title: 'Page A',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(pageA.id)

      const pageB = await payload.create({
        collection: 'pages',
        data: {
          title: 'Page B',
          parent: pageA.id,
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(pageB.id)

      try {
        await payload.update({
          collection: 'pages',
          id: pageA.id,
          data: {
            parent: pageB.id,
          },
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('Circular')
      }
    })
  })

  describe('Validation', () => {
    it('should require title field', async () => {
      try {
        await payload.create({
          collection: 'pages',
          data: {
            layout: [],
          } as any,
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('title')
      }
    })

    it('should enforce title maxLength', async () => {
      const longTitle = 'a'.repeat(201)

      try {
        await payload.create({
          collection: 'pages',
          data: {
            title: longTitle,
            layout: [],
          },
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('200')
      }
    })

    it('should enforce slug maxLength', async () => {
      const longSlug = 'a'.repeat(101)

      try {
        await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page',
            slug: longSlug,
            layout: [],
          },
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('100')
      }
    })
  })

  describe('Breadcrumb Generation', () => {
    it('should generate breadcrumbs for nested pages', async () => {
      const parent = await payload.create({
        collection: 'pages',
        data: {
          title: 'Parent Page',
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(parent.id)

      const child = await payload.create({
        collection: 'pages',
        data: {
          title: 'Child Page',
          parent: parent.id,
          layout: [],
        },
        user: { id: testUserId } as any,
      })

      createdPageIds.push(child.id)

      expect(child.breadcrumbs).toBeDefined()
      expect(Array.isArray(child.breadcrumbs)).toBe(true)
      expect(child.breadcrumbs?.length).toBeGreaterThan(0)
    })
  })

  describe('Versioning and Drafts', () => {
    it('should create a draft page', async () => {
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Draft Page',
          layout: [],
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdPageIds.push(page.id)

      expect(page._status).toBe('draft')
    })

    it('should publish a draft page', async () => {
      const draft = await payload.create({
        collection: 'pages',
        data: {
          title: 'Draft to Publish',
          layout: [],
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdPageIds.push(draft.id)

      const published = await payload.update({
        collection: 'pages',
        id: draft.id,
        data: {
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      expect(published._status).toBe('published')
    })
  })
})
