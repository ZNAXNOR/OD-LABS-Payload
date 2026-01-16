import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let testUserId: number
let createdDocIds: (string | number)[] = []

describe('Access Control Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a test user for authentication
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: `test-access-${Date.now()}@example.com`,
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        roles: ['user'],
      },
      draft: false,
    })
    testUserId = testUser.id
  }, 30000)

  afterAll(async () => {
    // Clean up created documents
    const collections = ['pages', 'blogs', 'services', 'contacts', 'legal']
    for (const collection of collections) {
      for (const id of createdDocIds) {
        try {
          await payload.delete({
            collection: collection as any,
            id,
          })
        } catch (error) {
          // Ignore errors during cleanup
        }
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

  describe('Audit Fields Access Control', () => {
    describe('createdBy Field', () => {
      it('should not allow creating with createdBy field via API', async () => {
        // Create another user to try to set as createdBy
        const anotherUser = await payload.create({
          collection: 'users',
          data: {
            email: `another-${Date.now()}@example.com`,
            password: 'test123',
            firstName: 'Another',
            lastName: 'User',
            roles: ['user'],
          },
          draft: false,
        })

        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page with Manual createdBy',
            layout: [],
            createdBy: anotherUser.id, // Try to manually set createdBy
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        // createdBy should be set to the authenticated user, not the manually provided value
        expect(page.createdBy).toBe(testUserId)
        expect(page.createdBy).not.toBe(anotherUser.id)

        // Clean up
        await payload.delete({
          collection: 'users',
          id: anotherUser.id,
        })
      })

      it('should not allow updating createdBy field via API', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page for createdBy Update',
            layout: [],
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        const originalCreatedBy = page.createdBy

        // Create another user to try to set as createdBy
        const anotherUser = await payload.create({
          collection: 'users',
          data: {
            email: `another-update-${Date.now()}@example.com`,
            password: 'test123',
            firstName: 'Another',
            lastName: 'User',
            roles: ['user'],
          },
          draft: false,
        })

        const updated = await payload.update({
          collection: 'pages',
          id: page.id,
          data: {
            createdBy: anotherUser.id, // Try to change createdBy
          },
          user: { id: testUserId } as any,
        })

        // createdBy should remain unchanged
        expect(updated.createdBy).toBe(originalCreatedBy)
        expect(updated.createdBy).not.toBe(anotherUser.id)

        // Clean up
        await payload.delete({
          collection: 'users',
          id: anotherUser.id,
        })
      })

      it('should only be readable by authenticated users', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page for createdBy Read',
            layout: [],
            _status: 'published',
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        // Read as authenticated user
        const authenticatedRead = await payload.findByID({
          collection: 'pages',
          id: page.id,
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        expect(authenticatedRead.createdBy).toBeDefined()

        // Read without authentication (public access)
        const publicRead = await payload.findByID({
          collection: 'pages',
          id: page.id,
          overrideAccess: false,
        })

        // createdBy should not be visible to unauthenticated users
        expect(publicRead.createdBy).toBeUndefined()
      })
    })

    describe('updatedBy Field', () => {
      it('should not allow creating with updatedBy field via API', async () => {
        // Create another user to try to set as updatedBy
        const anotherUser = await payload.create({
          collection: 'users',
          data: {
            email: `another-updatedby-${Date.now()}@example.com`,
            password: 'test123',
            firstName: 'Another',
            lastName: 'User',
            roles: ['user'],
          },
          draft: false,
        })

        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page with Manual updatedBy',
            layout: [],
            updatedBy: anotherUser.id, // Try to manually set updatedBy
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        // updatedBy should not be set on create
        expect(page.updatedBy).toBeUndefined()

        // Clean up
        await payload.delete({
          collection: 'users',
          id: anotherUser.id,
        })
      })

      it('should not allow updating updatedBy field via API', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page for updatedBy Update',
            layout: [],
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        // Create another user to try to set as updatedBy
        const anotherUser = await payload.create({
          collection: 'users',
          data: {
            email: `another-updatedby-update-${Date.now()}@example.com`,
            password: 'test123',
            firstName: 'Another',
            lastName: 'User',
            roles: ['user'],
          },
          draft: false,
        })

        const updated = await payload.update({
          collection: 'pages',
          id: page.id,
          data: {
            title: 'Updated Title',
            updatedBy: anotherUser.id, // Try to manually set updatedBy
          },
          user: { id: testUserId } as any,
        })

        // updatedBy should be set to the authenticated user, not the manually provided value
        expect(updated.updatedBy).toBe(testUserId)
        expect(updated.updatedBy).not.toBe(anotherUser.id)

        // Clean up
        await payload.delete({
          collection: 'users',
          id: anotherUser.id,
        })
      })

      it('should only be readable by authenticated users', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Test Page for updatedBy Read',
            layout: [],
            _status: 'published',
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        // Update the page
        const updated = await payload.update({
          collection: 'pages',
          id: page.id,
          data: {
            title: 'Updated Title',
          },
          user: { id: testUserId } as any,
        })

        // Read as authenticated user
        const authenticatedRead = await payload.findByID({
          collection: 'pages',
          id: updated.id,
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        expect(authenticatedRead.updatedBy).toBeDefined()

        // Read without authentication (public access)
        const publicRead = await payload.findByID({
          collection: 'pages',
          id: updated.id,
          overrideAccess: false,
        })

        // updatedBy should not be visible to unauthenticated users
        expect(publicRead.updatedBy).toBeUndefined()
      })
    })
  })

  describe('Collection-Level Access Control', () => {
    describe('Create Access', () => {
      it('should allow authenticated users to create documents', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Authenticated Create Test',
            layout: [],
          },
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        createdDocIds.push(page.id)

        expect(page).toBeDefined()
        expect(page.title).toBe('Authenticated Create Test')
      })

      it('should deny unauthenticated users from creating documents', async () => {
        try {
          await payload.create({
            collection: 'pages',
            data: {
              title: 'Unauthenticated Create Test',
              layout: [],
            },
            overrideAccess: false,
          })
          // Should not reach here
          expect(true).toBe(false)
        } catch (error: any) {
          expect(error).toBeDefined()
        }
      })
    })

    describe('Read Access', () => {
      it('should allow authenticated users to read all documents', async () => {
        const draftPage = await payload.create({
          collection: 'pages',
          data: {
            title: 'Draft Page for Read Test',
            layout: [],
            _status: 'draft',
          },
          user: { id: testUserId } as any,
          draft: true,
        })

        createdDocIds.push(draftPage.id)

        const result = await payload.findByID({
          collection: 'pages',
          id: draftPage.id,
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        expect(result).toBeDefined()
        expect(result._status).toBe('draft')
      })

      it('should only allow unauthenticated users to read published documents', async () => {
        const publishedPage = await payload.create({
          collection: 'pages',
          data: {
            title: 'Published Page for Public Read',
            layout: [],
            _status: 'published',
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(publishedPage.id)

        const draftPage = await payload.create({
          collection: 'pages',
          data: {
            title: 'Draft Page for Public Read',
            layout: [],
            _status: 'draft',
          },
          user: { id: testUserId } as any,
          draft: true,
        })

        createdDocIds.push(draftPage.id)

        // Public should be able to read published page
        const publishedResult = await payload.findByID({
          collection: 'pages',
          id: publishedPage.id,
          overrideAccess: false,
        })

        expect(publishedResult).toBeDefined()
        expect(publishedResult._status).toBe('published')

        // Public should not be able to read draft page
        try {
          await payload.findByID({
            collection: 'pages',
            id: draftPage.id,
            overrideAccess: false,
          })
          // Should not reach here
          expect(true).toBe(false)
        } catch (error: any) {
          expect(error).toBeDefined()
        }
      })
    })

    describe('Update Access', () => {
      it('should allow authenticated users to update documents', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Original Title',
            layout: [],
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        const updated = await payload.update({
          collection: 'pages',
          id: page.id,
          data: {
            title: 'Updated Title',
          },
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        expect(updated.title).toBe('Updated Title')
      })

      it('should deny unauthenticated users from updating documents', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Page for Unauthenticated Update',
            layout: [],
            _status: 'published',
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        try {
          await payload.update({
            collection: 'pages',
            id: page.id,
            data: {
              title: 'Attempted Update',
            },
            overrideAccess: false,
          })
          // Should not reach here
          expect(true).toBe(false)
        } catch (error: any) {
          expect(error).toBeDefined()
        }
      })
    })

    describe('Delete Access', () => {
      it('should allow authenticated users to delete documents', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Page for Delete Test',
            layout: [],
          },
          user: { id: testUserId } as any,
        })

        await payload.delete({
          collection: 'pages',
          id: page.id,
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        // Verify deletion
        try {
          await payload.findByID({
            collection: 'pages',
            id: page.id,
          })
          // Should not reach here
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeDefined()
        }
      })

      it('should deny unauthenticated users from deleting documents', async () => {
        const page = await payload.create({
          collection: 'pages',
          data: {
            title: 'Page for Unauthenticated Delete',
            layout: [],
            _status: 'published',
          },
          user: { id: testUserId } as any,
        })

        createdDocIds.push(page.id)

        try {
          await payload.delete({
            collection: 'pages',
            id: page.id,
            overrideAccess: false,
          })
          // Should not reach here
          expect(true).toBe(false)
        } catch (error: any) {
          expect(error).toBeDefined()
        }
      })
    })
  })

  describe('Access Control Across Collections', () => {
    it('should enforce access control consistently across all page collections', async () => {
      const collections = ['pages', 'blogs', 'services', 'contacts', 'legal']

      for (const collection of collections) {
        // Test create access
        const doc = await payload.create({
          collection: collection as any,
          data: {
            title: `Test ${collection}`,
            ...(collection === 'blogs' || collection === 'services' || collection === 'legal'
              ? {
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          version: 1,
                          children: [{ type: 'text', text: 'Content' }],
                          direction: null,
                          format: '',
                          indent: 0,
                        },
                      ],
                    },
                  },
                }
              : {}),
            ...(collection === 'pages' ? { layout: [] } : {}),
            ...(collection === 'contacts' ? { purpose: 'general' } : {}),
            _status: 'published',
          },
          user: { id: testUserId } as any,
          overrideAccess: false,
        })

        createdDocIds.push(doc.id)

        expect(doc).toBeDefined()
        expect(doc.createdBy).toBe(testUserId)

        // Test read access (public should be able to read published)
        const publicRead = await payload.findByID({
          collection: collection as any,
          id: doc.id,
          overrideAccess: false,
        })

        expect(publicRead).toBeDefined()
        expect(publicRead._status).toBe('published')
      }
    })
  })
})
