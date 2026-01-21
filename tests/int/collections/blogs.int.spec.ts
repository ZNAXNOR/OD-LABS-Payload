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
let createdBlogIds: number[] = []

describe('Blogs Collection Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a test user for authentication
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: `test-blogs-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
        roles: ['user'],
      },
      draft: false,
    })
    testUserId = testUser.id
  }, 30000)

  afterAll(async () => {
    // Clean up created blogs
    for (const id of createdBlogIds) {
      try {
        await payload.delete({
          collection: 'blogs',
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
    it('should create a blog post with required fields', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Test Blog Post',
          content: createLexicalContent('Test content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      expect(blog).toBeDefined()
      expect(blog.title).toBe('Test Blog Post')
      expect(blog.slug).toBeDefined()
      expect(blog.content).toBeDefined()
      expect(blog.createdAt).toBeDefined()
      expect(blog.updatedAt).toBeDefined()
    })

    it('should read a blog post by ID', async () => {
      const created = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Read Test Blog',
          content: createLexicalContent('Test content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(created.id)

      const blog = await payload.findByID({
        collection: 'blogs',
        id: created.id,
      })

      expect(blog).toBeDefined()
      expect(blog.id).toBe(created.id)
      expect(blog.title).toBe('Read Test Blog')
    })

    it('should update a blog post', async () => {
      const created = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Original Blog Title',
          content: createLexicalContent('Original content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(created.id)

      const updated = await payload.update({
        collection: 'blogs',
        id: created.id,
        data: {
          title: 'Updated Blog Title',
        },
        user: { id: testUserId } as any,
      })

      expect(updated.title).toBe('Updated Blog Title')
      expect(updated.updatedAt).not.toBe(created.updatedAt)
    })

    it('should delete a blog post', async () => {
      const created = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Delete Test Blog',
          content: createLexicalContent('Test content'),
        },
        user: { id: testUserId } as any,
      })

      await payload.delete({
        collection: 'blogs',
        id: created.id,
      })

      // Verify deletion
      try {
        await payload.findByID({
          collection: 'blogs',
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
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'My Amazing Blog Post',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      expect(blog.slug).toBe('my-amazing-blog-post')
    })

    it('should handle special characters in slug', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Blog with Special @#$ Characters!',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      expect(blog.slug).toMatch(/^blog-with-special-characters/)
    })

    it('should ensure slug uniqueness', async () => {
      const blog1 = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Duplicate Blog Title',
          content: createLexicalContent('Content 1'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog1.id)

      const blog2 = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Duplicate Blog Title',
          content: createLexicalContent('Content 2'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog2.id)

      expect(blog1.slug).not.toBe(blog2.slug)
      expect(blog2.slug).toMatch(/^duplicate-blog-title-\d+/)
    })
  })

  describe('Audit Trail Hook', () => {
    it('should set createdBy on create', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Audit Test Blog',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      expect(blog.createdBy).toBe(testUserId)
    })

    it('should set updatedBy on update', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Update Audit Test Blog',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      const updated = await payload.update({
        collection: 'blogs',
        id: blog.id,
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
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Auto Author Blog',
          content: createLexicalContent('Content'),
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      expect(blog.author).toBe(testUserId)
    })

    it('should not override manually set author', async () => {
      // Create another user
      const anotherUser = await payload.create({
        collection: 'users',
        data: {
          email: `another-blog-${Date.now()}@example.com`,
          firstName: 'Another',
          lastName: 'User',
          password: 'test123',
          roles: ['user'],
        },
        draft: false,
      })

      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Manual Author Blog',
          content: createLexicalContent('Content'),
          author: anotherUser.id,
        },
        user: { id: testUserId } as any,
      })

      createdBlogIds.push(blog.id)

      expect(blog.author).toBe(anotherUser.id)

      // Clean up
      await payload.delete({
        collection: 'users',
        id: anotherUser.id,
      })
    })
  })

  describe('Published Date Auto-Setting', () => {
    it('should auto-set publishedDate on first publish', async () => {
      // Create a draft blog
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Draft Blog for Publishing',
          content: createLexicalContent('Content'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdBlogIds.push(blog.id)

      expect(blog.publishedDate).toBeUndefined()

      // Publish the blog
      const published = await payload.update({
        collection: 'blogs',
        id: blog.id,
        data: {
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      expect(published.publishedDate).toBeDefined()
      expect(published.publishedDate).toBeInstanceOf(Date)
    })

    it('should not override manually set publishedDate', async () => {
      const customDate = '2024-01-01T00:00:00.000Z'

      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Custom Date Blog',
          content: createLexicalContent('Content'),
          _status: 'draft',
          publishedDate: customDate,
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdBlogIds.push(blog.id)

      // Publish the blog
      const published = await payload.update({
        collection: 'blogs',
        id: blog.id,
        data: {
          _status: 'published',
        },
        user: { id: testUserId } as any,
      })

      expect(published.publishedDate).toEqual(customDate)
    })
  })

  describe('Validation', () => {
    it('should require title field', async () => {
      try {
        await payload.create({
          collection: 'blogs',
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
          collection: 'blogs',
          data: {
            title: 'No Content Blog',
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
          collection: 'blogs',
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

    it('should enforce excerpt maxLength', async () => {
      const longExcerpt = 'a'.repeat(301)

      try {
        await payload.create({
          collection: 'blogs',
          data: {
            title: 'Test Blog',
            excerpt: longExcerpt,
            content: createLexicalContent('Content'),
          },
          user: { id: testUserId } as any,
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('300')
      }
    })
  })

  describe('Versioning and Drafts', () => {
    it('should create a draft blog post', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Draft Blog Post',
          content: createLexicalContent('Draft content'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdBlogIds.push(blog.id)

      expect(blog._status).toBe('draft')
    })

    it('should publish a draft blog post', async () => {
      const draft = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Draft to Publish Blog',
          content: createLexicalContent('Content'),
          _status: 'draft',
        },
        user: { id: testUserId } as any,
        draft: true,
      })

      createdBlogIds.push(draft.id)

      const published = await payload.update({
        collection: 'blogs',
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
