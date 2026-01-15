import type { CollectionConfig } from 'payload'

// Import hooks
import { revalidateBlog } from './hooks/revalidateBlog'
import { generateSlug } from './hooks/generateSlug'
import { auditTrail } from './hooks/auditTrail'

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
  hooks: {
    beforeValidate: [generateSlug],
    beforeChange: [auditTrail],
    afterChange: [revalidateBlog],
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
            },
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description: 'Brief description of the blog post for previews and SEO',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
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
                    path: '/components/LegacyBlockWarning',
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
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title)',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
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
    // Audit trail fields (hidden from admin)
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
    },
  ],
}
