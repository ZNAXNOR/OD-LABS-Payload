import type { CollectionConfig } from 'payload'

// Import shared hooks (factory functions)
import { createSlugGenerationHook, validateSlugFormat } from '@/utilities/slugGeneration'
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'

// Import shared fields
import { auditFields } from '@/pages/shared/fields/auditFields'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import block configuration
import { getBlocksForCollection } from '@/blocks/config/blockAssignments'

// Get blog-specific blocks
const blogBlocks = getBlocksForCollection('blogs')

export const BlogPages: CollectionConfig = {
  slug: 'blogs',
  typescript: {
    interface: 'BlogPage',
  },
  labels: {
    singular: 'Blog Page',
    plural: 'Blog Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Pages',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
  timestamps: true, // Enable Payload's built-in timestamp management
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('blogs', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [
      // Use factory function for standard revalidation
      createRevalidateHook('blogs'),
      // Additional revalidation for homepage (may display recent blog posts)
      async ({ doc, previousDoc, req: { payload, context } }) => {
        if (context.disableRevalidate) return doc

        try {
          const { revalidatePath } = await import('next/cache')

          // Revalidate homepage when blog is published/unpublished
          if (
            doc._status === 'published' ||
            (previousDoc?._status === 'published' && doc._status !== 'published')
          ) {
            revalidatePath('/')
            payload.logger.info('Revalidated homepage for blog changes')
          }
        } catch (error) {
          payload.logger.error(`Homepage revalidation failed: ${error}`)
        }

        return doc
      },
    ],
  },
  fields: [
    // Tab structure - must come BEFORE sidebar fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Main blog content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              minLength: 1,
              maxLength: 200,
              admin: {
                description: 'The main title of the blog post (1-200 characters)',
              },
              validate: (value: unknown) => {
                if (!value || typeof value !== 'string') {
                  return 'Title is required'
                }
                if (value.trim().length === 0) {
                  return 'Title cannot be empty or only whitespace'
                }
                if (value.length > 200) {
                  return 'Title must be 200 characters or less'
                }
                return true
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description:
                  'Brief description of the blog post for previews and SEO (max 300 characters)',
              },
              validate: (value: unknown) => {
                if (value && typeof value === 'string' && value.length > 300) {
                  return 'Excerpt must be 300 characters or less'
                }
                return true
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              validate: (value: unknown) => {
                if (!value) {
                  return 'Content is required for blog posts'
                }
                return true
              },
            },
          ],
        },
        {
          label: 'Layout',
          description: 'Add content blocks to build your blog post layout',
          fields: [
            {
              name: 'legacyBlockWarning',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: '@/components/LegacyBlockWarning',
                    clientProps: {
                      collectionType: 'blogs',
                    },
                  },
                },
              },
            },
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Section',
              blocks: blogBlocks.hero ? [...blogBlocks.hero] : [],
              maxRows: 1,
              admin: {
                description: 'Optional hero section for the blog post (maximum 1)',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Content Blocks',
              blocks: [...blogBlocks.layout],
              admin: {
                description: 'Build your blog post layout with content blocks',
              },
            },
          ],
        },
        // SEO tab is automatically added by the SEO plugin with tabbedUI: true
      ],
    },
    // Sidebar fields - must come AFTER tabs
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      maxLength: 100,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title, max 100 characters)',
      },
      validate: (value: unknown) => {
        if (!value) return true // Let required handle empty values

        if (typeof value !== 'string') {
          return 'Slug must be a string'
        }

        if (value.length > 100) {
          return 'Slug must be 100 characters or less'
        }

        const validation = validateSlugFormat(value)
        if (!validation.isValid) {
          return validation.errors.join(', ')
        }

        return true
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      index: true, // Index for sorting by date
      admin: {
        position: 'sidebar',
        description: 'Date this blog post was first published (auto-set on publish)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData, operation, req }) => {
            // Auto-set on first publish
            if (operation === 'update' && siblingData._status === 'published' && !value) {
              const now = new Date()
              req.payload.logger.info(`Auto-set published date: ${now.toISOString()}`)
              return now
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      index: true, // Index for filtering by author
      admin: {
        position: 'sidebar',
        description: 'Author of this blog post (defaults to current user)',
      },
      hooks: {
        beforeChange: [
          ({ value, req, operation }) => {
            // Auto-populate on create if not provided
            if (operation === 'create' && !value && req.user) {
              req.payload.logger.info(`Auto-populated author: ${req.user.id}`)
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    // Spread shared audit trail fields (createdBy, updatedBy)
    // Note: createdAt and updatedAt are automatically managed by Payload via timestamps: true
    ...auditFields,
  ],
}
