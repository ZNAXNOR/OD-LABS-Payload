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
let createdLegalIds: number[] = []

describe('Legal Collection Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a test user for authentication
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: `test-legal-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
        roles: ['user'],
      },
    })
    testUserId = testUser.id
  }, 30000)

  afterAll(async () => {
    // Clean up created legal pages
    for (const id of createdLegalIds) {
      try {
        await payload.delete({
          collection: 'legal',
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
    it('should create a legal page with required fields', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Test Privacy Policy',
          content: createLexicalContent('Privacy policy content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal).toBeDefined()
      expect(legal.title).toBe('Test Privacy Policy')
      expect(legal.slug).toBeDefined()
      expect(legal.content).toBeDefined()
      expect(legal.createdAt).toBeDefined()
      expect(legal.updatedAt).toBeDefined()
    })

    it('should read a legal page by ID', async () => {
      const created = await payload.create({
        collection: 'legal',
        data: {
          title: 'Read Test Legal',
          content: createLexicalContent('Legal content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(created.id)

      const legal = await payload.findByID({
        collection: 'legal',
        id: created.id,
      })

      expect(legal).toBeDefined()
      expect(legal.id).toBe(created.id)
      expect(legal.title).toBe('Read Test Legal')
    })

    it('should update a legal page', async () => {
      const created = await payload.create({
        collection: 'legal',
        data: {
          title: 'Original Legal Title',
          content: createLexicalContent('Original content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(created.id)

      const updated = await payload.update({
        collection: 'legal',
        id: created.id,
        data: {
          title: 'Updated Legal Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.title).toBe('Updated Legal Title')
      expect(updated.updatedAt).not.toBe(created.updatedAt)
    })

    it('should delete a legal page', async () => {
      const created = await payload.create({
        collection: 'legal',
        data: {
          title: 'Delete Test Legal',
          content: createLexicalContent('Legal content'),
        },
        user: { id: testUserId } as any,
      })

      await payload.delete({
        collection: 'legal',
        id: created.id,
      })

      // Verify deletion
      try {
        await payload.findByID({
          collection: 'legal',
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
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Terms of Service',
          content: createLexicalContent('Terms content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal.slug).toBe('terms-of-service')
    })

    it('should handle special characters in slug', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Legal with Special @#$ Characters!',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal.slug).toMatch(/^legal-with-special-characters/)
    })

    it('should ensure slug uniqueness', async () => {
      const legal1 = await payload.create({
        collection: 'legal',
        data: {
          title: 'Duplicate Legal Title',
          content: createLexicalContent('Content 1'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal1.id)

      const legal2 = await payload.create({
        collection: 'legal',
        data: {
          title: 'Duplicate Legal Title',
          content: createLexicalContent('Content 2'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal2.id)

      expect(legal1.slug).not.toBe(legal2.slug)
      expect(legal2.slug).toMatch(/^duplicate-legal-title-\d+/)
    })
  })

  describe('Audit Trail Hook', () => {
    it('should set createdBy on create', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Audit Test Legal',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal.createdBy).toBe(testUserId)
    })

    it('should set updatedBy on update', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Update Audit Test Legal',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      const updated = await payload.update({
        collection: 'legal',
        id: legal.id,
        data: {
          title: 'Updated Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.updatedBy).toBe(testUserId)
    })
  })

  describe('Document Type Field', () => {
    it('should set document type', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Privacy Policy',
          content: createLexicalContent('Privacy content'),
          documentType: 'privacy',
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal.documentType).toBe('privacy')
    })

    it('should query by document type', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Terms Document',
          content: createLexicalContent('Terms content'),
          documentType: 'terms',
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      const result = await payload.find({
        collection: 'legal',
        where: {
          documentType: { equals: 'terms' },
        },
      })

      expect(result.docs.some((doc) => doc.id === legal.id)).toBe(true)
    })
  })

  describe('Effective Date Field', () => {
    it('should set effective date', async () => {
      const effectiveDate = new Date('2024-01-01')

      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Legal with Effective Date',
          content: createLexicalContent('Content'),
          effectiveDate: effectiveDate.toISOString(),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal.effectiveDate).toEqual(effectiveDate.toISOString())
    })
  })

  describe('Last Updated Auto-Setting', () => {
    it('should auto-set lastUpdated on update', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Legal for Update Test',
          content: createLexicalContent('Original content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      expect(legal.lastUpdated).toBeUndefined()

      // Update the legal document
      const updated = await payload.update({
        collection: 'legal',
        id: legal.id,
        data: {
          title: 'Updated Legal Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.lastUpdated).toBeDefined()
      expect(updated.lastUpdated).toBeInstanceOf(Date)
    })

    it('should update lastUpdated on subsequent updates', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Legal for Multiple Updates',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdLegalIds.push(legal.id)

      // First update
      const updated1 = await payload.update({
        collection: 'legal',
        id: legal.id,
        data: {
          title: 'First Update',
        },
        user: { id: testUserId } as any,
      })

      const firstLastUpdated = updated1.lastUpdated

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Second update
      const updated2 = await payload.update({
        collection: 'legal',
        id: legal.id,
        data: {
          title: 'Second Update',
        },
        user: { id: testUserId } as any,
      })

      expect(updated2.lastUpdated).toBeDefined()
      expect(updated2.lastUpdated).not.toEqual(firstLastUpdated)
    })
  })

  describe('Validation', () => {
    it('should require title field', async () => {
      try {
        await payload.create({
          collection: 'legal',
          data: {
            content: createLexicalContent('Content'),
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
          collection: 'legal',
          data: {
            title: 'No Content Legal',
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
          collection: 'legal',
          data: {
            title: longTitle,
            content: createLexicalContent('Content'),
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
    it('should create a draft legal page', async () => {
      const legal = await payload.create({
        collection: 'legal',
        data: {
          title: 'Draft Legal Page',
          content: createLexicalContent('Draft content'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdLegalIds.push(legal.id)

      expect(legal._status).toBe('draft')
    })

    it('should publish a draft legal page', async () => {
      const draft = await payload.create({
        collection: 'legal',
        data: {
          title: 'Draft to Publish Legal',
          content: createLexicalContent('Content'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdLegalIds.push(draft.id)

      const published = await payload.update({
        collection: 'legal',
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
