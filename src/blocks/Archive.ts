import type { Block } from 'payload'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
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
