import {
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

// Import shared hooks (factory functions)
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'
import { createSlugGenerationHook, validateSlugFormat } from '@/utilities/slugGeneration'

// Import shared fields
import { auditFields } from '@/pages/shared/fields/auditFields'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import live preview utilities
import { generateBlogPagesPreviewUrl } from '@/utilities/livePreview'

// Import rich text features
import {
  alignmentFeatures,
  basicTextFeatures,
  enhancedLinkFeature,
  headingFeatures,
  listFeatures,
  structuralFeatures,
} from '@/fields/richTextFeatures'

// Import block configuration
import { getBlocksForCollection } from '@/blocks/config/blockAssignments'

// Get blog-specific blocks
const blogBlocks = getBlocksForCollection('blogs')

export const BlogPages: CollectionConfig = {
  slug: 'blogs',
  dbName: 'blogs', // Explicit database naming
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
    livePreview: {
      url: generateBlogPagesPreviewUrl,
    },
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
          description: 'Main blog content with embedded blocks',
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
              admin: {
                description: 'Blog content with embedded blocks for enhanced formatting',
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  ...rootFeatures,
                  ...structuralFeatures,
                  ...basicTextFeatures,
                  ...alignmentFeatures,
                  ...headingFeatures,
                  ...listFeatures,
                  ...enhancedLinkFeature,
                  BlocksFeature({
                    blocks: blogBlocks.layout,
                  }),
                ],
              }),
              validate: (value: unknown) => {
                if (!value) {
                  return 'Content is required for blog posts'
                }
                return true
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
      dbName: 'tags', // Keep short name
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
