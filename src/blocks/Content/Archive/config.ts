import { minimalRichText } from '@/fields/richTextFeatures'
import type { Block } from 'payload'

export const ArchiveBlock: Block = {
  slug: 'archive',
  dbName: 'archive_block', // Root level optimization
  interfaceName: 'ArchiveBlock',
  labels: {
    singular: 'Archive Block',
    plural: 'Archive Blocks',
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        description: 'Optional introduction content for the archive',
      },
      editor: minimalRichText,
    },
    {
      name: 'populateBy',
      type: 'select',
      dbName: 'populate_by', // Snake case conversion
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Selection',
          value: 'selection',
        },
      ],
      defaultValue: 'collection',
      required: true,
    },
    {
      name: 'relationTo',
      type: 'select',
      dbName: 'relation_to', // Snake case conversion
      options: [
        {
          label: 'Blogs',
          value: 'blogs',
        },
        {
          label: 'Services',
          value: 'services',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    // Note: Categories field commented out - requires 'categories' collection to be created
    // {
    //   name: 'categories',
    //   type: 'relationship',
    //   relationTo: 'categories',
    //   hasMany: true,
    //   admin: {
    //     condition: (_, siblingData) => siblingData?.populateBy === 'collection',
    //   },
    // },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: ['blogs', 'services'],
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
  ],
}
