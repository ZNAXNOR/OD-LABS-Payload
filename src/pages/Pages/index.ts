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
import { createSlugGenerationHook } from '@/utilities/slugGeneration'

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
      createSlugGenerationHook('pages', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
        reservedSlugs: ['home', 'index'],
      }),
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
        description: 'Select a parent page to create a hierarchical structure',
      },
      validate: (value: any, { data, siblingData }: any) => {
        // Prevent self-reference
        if (value && (value === data?.id || value === siblingData?.id)) {
          return 'A page cannot be its own parent'
        }
        return true
      },
      filterOptions: ({ id, data }) => {
        const filters: any = {}

        // Exclude self to prevent circular references
        if (id) {
          filters.id = { not_equals: id }
        }

        // Only show published pages as potential parents (optional)
        // filters._status = { equals: 'published' }

        return filters
      },
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      label: 'Breadcrumbs',
      admin: {
        readOnly: true,
        description: 'Automatically generated breadcrumb trail based on page hierarchy',
        components: {
          Cell: '/src/components/BreadcrumbCell',
        },
      },
      fields: [
        {
          name: 'doc',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            readOnly: true,
          },
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
