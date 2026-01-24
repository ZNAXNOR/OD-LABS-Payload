import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import {
  structuralFeatures,
  basicTextFeatures,
  alignmentFeatures,
  headingFeatures,
  listFeatures,
  enhancedLinkFeature,
} from '@/fields/richTextFeatures'

// Import rich text features

export const ArchiveBlock: Block = {
  slug: 'archive',
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
      editor: lexicalEditor({
        features: ({ rootFeatures }: { rootFeatures: any[] }) => [
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          ...rootFeatures,
          ...structuralFeatures,
          ...basicTextFeatures,
          ...alignmentFeatures,
          ...headingFeatures,
          ...listFeatures,
          ...enhancedLinkFeature,
        ],
      }),
    },
    {
      name: 'populateBy',
      type: 'select',
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
