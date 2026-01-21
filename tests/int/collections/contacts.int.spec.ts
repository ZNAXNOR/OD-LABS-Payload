import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let testUserId: number
let createdContactIds: number[] = []

describe('Contacts Collection Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a test user for authentication
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: `test-contacts-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
        roles: ['user'],
      },
    })
    testUserId = testUser.id
  }, 30000)

  afterAll(async () => {
    // Clean up created contacts
    for (const id of createdContactIds) {
      try {
        await payload.delete({
          collection: 'contacts',
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
    it('should create a contact page with required fields', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Test Contact Page',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact).toBeDefined()
      expect(contact.title).toBe('Test Contact Page')
      expect(contact.purpose).toBe('general')
      expect(contact.slug).toBeDefined()
      expect(contact.createdAt).toBeDefined()
      expect(contact.updatedAt).toBeDefined()
    })

    it('should read a contact page by ID', async () => {
      const created = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Read Test Contact',
          purpose: 'technical',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(created.id)

      const contact = await payload.findByID({
        collection: 'contacts',
        id: created.id,
      })

      expect(contact).toBeDefined()
      expect(contact.id).toBe(created.id)
      expect(contact.title).toBe('Read Test Contact')
    })

    it('should update a contact page', async () => {
      const created = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Original Contact Title',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(created.id)

      const updated = await payload.update({
        collection: 'contacts',
        id: created.id,
        data: {
          title: 'Updated Contact Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.title).toBe('Updated Contact Title')
      expect(updated.updatedAt).not.toBe(created.updatedAt)
    })

    it('should delete a contact page', async () => {
      const created = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Delete Test Contact',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      await payload.delete({
        collection: 'contacts',
        id: created.id,
      })

      // Verify deletion
      try {
        await payload.findByID({
          collection: 'contacts',
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
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Contact Us Page',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.slug).toBe('contact-us-page')
    })

    it('should handle special characters in slug', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Contact with Special @#$ Characters!',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.slug).toMatch(/^contact-with-special-characters/)
    })

    it('should ensure slug uniqueness', async () => {
      const contact1 = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Duplicate Contact Title',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact1.id)

      const contact2 = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Duplicate Contact Title',
          purpose: 'technical',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact2.id)

      expect(contact1.slug).not.toBe(contact2.slug)
      expect(contact2.slug).toMatch(/^duplicate-contact-title-\d+/)
    })
  })

  describe('Audit Trail Hook', () => {
    it('should set createdBy on create', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Audit Test Contact',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.createdBy).toBe(testUserId)
    })

    it('should set updatedBy on update', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Update Audit Test Contact',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      const updated = await payload.update({
        collection: 'contacts',
        id: contact.id,
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
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Auto Author Contact',
          purpose: 'general',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.author).toBe(testUserId)
    })

    it('should not override manually set author', async () => {
      // Create another user
      const anotherUser = await payload.create({
        collection: 'users',
        data: {
          email: `another-contact-${Date.now()}@example.com`,
          firstName: 'Another',
          lastName: 'User',
          password: 'test123',
          roles: ['user'],
        },
      })

      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Manual Author Contact',
          purpose: 'general',
          author: anotherUser.id,
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.author).toBe(anotherUser.id)

      // Clean up
      await payload.delete({
        collection: 'users',
        id: anotherUser.id,
      })
    })
  })

  describe('Purpose Field', () => {
    it('should set purpose field', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Technical Support Contact',
          purpose: 'technical',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.purpose).toBe('technical')
    })

    it('should query by purpose', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Sales Contact',
          purpose: 'sales',
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      const result = await payload.find({
        collection: 'contacts',
        where: {
          purpose: { equals: 'sales' },
        },
      })

      expect(result.docs.some((doc) => doc.id === contact.id)).toBe(true)
    })
  })

  describe('Contact Info Display Settings', () => {
    it('should set displayContactInfo flag', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Contact with Info Display',
          purpose: 'general',
          displayContactInfo: true,
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.displayContactInfo).toBe(true)
    })

    it('should set contactInfoSections', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Contact with Sections',
          purpose: 'general',
          displayContactInfo: true,
          contactInfoSections: ['general', 'social'],
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.contactInfoSections).toEqual(['general', 'social'])
    })
  })

  describe('Sidebar Settings', () => {
    it('should enable sidebar', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Contact with Sidebar',
          purpose: 'general',
          sidebar: {
            enableSidebar: true,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: 'Sidebar content' }],
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
            },
          },
        },
        user: { id: testUserId } as any,
      })

      createdContactIds.push(contact.id)

      expect(contact.sidebar?.enableSidebar).toBe(true)
      expect(contact.sidebar?.content).toBeDefined()
    })
  })

  describe('Validation', () => {
    it('should require title field', async () => {
      try {
        await payload.create({
          collection: 'contacts',
          data: {
            purpose: 'general',
          } as any,
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('title')
      }
    })

    it('should require purpose field', async () => {
      try {
        await payload.create({
          collection: 'contacts',
          data: {
            title: 'No Purpose Contact',
          } as any,
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('purpose')
      }
    })

    it('should enforce title maxLength', async () => {
      const longTitle = 'a'.repeat(201)

      try {
        await payload.create({
          collection: 'contacts',
          data: {
            title: longTitle,
            purpose: 'general',
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
    it('should create a draft contact page', async () => {
      const contact = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Draft Contact Page',
          purpose: 'general',
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdContactIds.push(contact.id)

      expect(contact._status).toBe('draft')
    })

    it('should publish a draft contact page', async () => {
      const draft = await payload.create({
        collection: 'contacts',
        data: {
          title: 'Draft to Publish Contact',
          purpose: 'general',
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdContactIds.push(draft.id)

      const published = await payload.update({
        collection: 'contacts',
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
