import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

// Helper for creating valid Lexical content
const createLexicalContent = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text }],
        direction: null,
        format: '' as const,
        indent: 0,
      },
    ],
    direction: null,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

let payload: Payload
let testUserId: number
let createdServiceIds: number[] = []

describe('Services Collection Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a test user for authentication
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: `test-services-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
        roles: ['user'],
      },
    })
    testUserId = testUser.id
  }, 30000)

  afterAll(async () => {
    // Clean up created services
    for (const id of createdServiceIds) {
      try {
        await payload.delete({
          collection: 'services',
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
    it('should create a service with required fields', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Test Service',
          content: createLexicalContent('Service description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service).toBeDefined()
      expect(service.title).toBe('Test Service')
      expect(service.slug).toBeDefined()
      expect(service.content).toBeDefined()
      expect(service.createdAt).toBeDefined()
      expect(service.updatedAt).toBeDefined()
    })

    it('should read a service by ID', async () => {
      const created = await payload.create({
        collection: 'services',
        data: {
          title: 'Read Test Service',
          content: createLexicalContent('Service description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(created.id)

      const service = await payload.findByID({
        collection: 'services',
        id: created.id,
      })

      expect(service).toBeDefined()
      expect(service.id).toBe(created.id)
      expect(service.title).toBe('Read Test Service')
    })

    it('should update a service', async () => {
      const created = await payload.create({
        collection: 'services',
        data: {
          title: 'Original Service Title',
          content: createLexicalContent('Original description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(created.id)

      const updated = await payload.update({
        collection: 'services',
        id: created.id,
        data: {
          title: 'Updated Service Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.title).toBe('Updated Service Title')
      expect(updated.updatedAt).not.toBe(created.updatedAt)
    })

    it('should delete a service', async () => {
      const created = await payload.create({
        collection: 'services',
        data: {
          title: 'Delete Test Service',
          content: createLexicalContent('Service description'),
        },
        user: { id: testUserId } as any,
      })

      await payload.delete({
        collection: 'services',
        id: created.id,
      })

      // Verify deletion
      try {
        await payload.findByID({
          collection: 'services',
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
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Web Development Service',
          content: createLexicalContent('Description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.slug).toBe('web-development-service')
    })

    it('should handle special characters in slug', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Service with Special @#$ Characters!',
          content: createLexicalContent('Description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.slug).toMatch(/^service-with-special-characters/)
    })

    it('should ensure slug uniqueness', async () => {
      const service1 = await payload.create({
        collection: 'services',
        data: {
          title: 'Duplicate Service Title',
          content: createLexicalContent('Description 1'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service1.id)

      const service2 = await payload.create({
        collection: 'services',
        data: {
          title: 'Duplicate Service Title',
          content: createLexicalContent('Description 2'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service2.id)

      expect(service1.slug).not.toBe(service2.slug)
      expect(service2.slug).toMatch(/^duplicate-service-title-\d+/)
    })
  })

  describe('Audit Trail Hook', () => {
    it('should set createdBy on create', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Audit Test Service',
          content: createLexicalContent('Description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.createdBy).toBe(testUserId)
    })

    it('should set updatedBy on update', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Update Audit Test Service',
          content: createLexicalContent('Description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      const updated = await payload.update({
        collection: 'services',
        id: service.id,
        data: {
          title: 'Updated Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.updatedBy).toBe(testUserId)
    })
  })

  describe('Author Auto-Population', () => {
    it('should auto-populate author on create', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Auto Author Service',
          content: createLexicalContent('Description'),
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.author).toBe(testUserId)
    })

    it('should not override manually set author', async () => {
      // Create another user
      const anotherUser = await payload.create({
        collection: 'users',
        data: {
          email: `another-service-${Date.now()}@example.com`,
          firstName: 'Another',
          lastName: 'User',
          password: 'test123',
          roles: ['user'],
        },
      })

      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Manual Author Service',
          content: createLexicalContent('Description'),
          author: anotherUser.id,
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.author).toBe(anotherUser.id)

      // Clean up
      await payload.delete({
        collection: 'users',
        id: anotherUser.id,
      })
    })
  })

  describe('Featured Service Logic', () => {
    it('should create a featured service', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Featured Service',
          content: createLexicalContent('Featured description'),
          featured: true,
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.featured).toBe(true)
    })

    it('should query featured services', async () => {
      // Create a featured service
      const featured = await payload.create({
        collection: 'services',
        data: {
          title: 'Query Featured Service',
          content: createLexicalContent('Description'),
          featured: true,
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(featured.id)

      // Query for featured services
      const result = await payload.find({
        collection: 'services',
        where: {
          featured: { equals: true },
        },
      })

      expect(result.docs.length).toBeGreaterThan(0)
      expect(result.docs.some((doc) => doc.id === featured.id)).toBe(true)
    })
  })

  describe('Service Type Field', () => {
    it('should set service type', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Web Dev Service',
          content: createLexicalContent('Description'),
          serviceType: 'web-dev',
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      expect(service.serviceType).toBe('web-dev')
    })

    it('should query by service type', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Design Service',
          content: createLexicalContent('Description'),
          serviceType: 'design',
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      createdServiceIds.push(service.id)

      const result = await payload.find({
        collection: 'services',
        where: {
          serviceType: { equals: 'design' },
        },
      })

      expect(result.docs.some((doc) => doc.id === service.id)).toBe(true)
    })
  })

  describe('Validation', () => {
    it('should require title field', async () => {
      try {
        await payload.create({
          collection: 'services',
          data: {
            content: createLexicalContent('Description'),
          } as any,
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('title')
      }
    })

    it('should require content field', async () => {
      try {
        await payload.create({
          collection: 'services',
          data: {
            title: 'No Content Service',
          } as any,
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('content')
      }
    })

    it('should enforce title maxLength', async () => {
      const longTitle = 'a'.repeat(201)

      try {
        await payload.create({
          collection: 'services',
          data: {
            title: longTitle,
            content: createLexicalContent('Description'),
          },
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('200')
      }
    })
  })

  describe('Versioning and Drafts', () => {
    it('should create a draft service', async () => {
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Draft Service',
          content: createLexicalContent('Draft description'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdServiceIds.push(service.id)

      expect(service._status).toBe('draft')
    })

    it('should publish a draft service', async () => {
      const draft = await payload.create({
        collection: 'services',
        data: {
          title: 'Draft to Publish Service',
          content: createLexicalContent('Description'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdServiceIds.push(draft.id)

      const published = await payload.update({
        collection: 'services',
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
