import type { CollectionConfig } from 'payload'

// Import blocks
import { Hero } from '@/blocks/Hero'
import { Content } from '@/blocks/Content'
import { CallToAction } from '@/blocks/CallToAction'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Archive } from '@/blocks/Archive'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'

// Import hooks
import { revalidatePage } from './hooks/revalidatePage'
import { populateBreadcrumbs } from './hooks/populateBreadcrumbs'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const Pages: CollectionConfig = {
  slug: 'pages',
  typescript: {
    interface: 'Page',
  },
  labels: {
    singular: 'Page',
    plural: 'Pages',
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
    maxPerDoc: 100,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Auto-generate slug from title if not provided
        if (operation === 'create' && data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        }
        return data
      },
    ],
    beforeChange: [populateBreadcrumbs],
    afterChange: [revalidatePage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        // Exclude self to prevent circular references
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'doc',
          type: 'relationship',
          relationTo: 'pages',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, Content, CallToAction, MediaBlock, Archive, Banner, Code],
    },
  ],
}
