import type { Block } from 'payload'

export const SocialProofBlock: Block = {
  slug: 'socialProof',
  interfaceName: 'SocialProofBlock',
  labels: {
    singular: 'Social Proof Block',
    plural: 'Social Proof Blocks',
  },
  admin: {
    group: 'CTA & Conversion',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the social proof section',
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'logos',
      required: true,
      options: [
        {
          label: 'Logos',
          value: 'logos',
        },
        {
          label: 'Stats',
          value: 'stats',
        },
        {
          label: 'Badges',
          value: 'badges',
        },
        {
          label: 'Combined',
          value: 'combined',
        },
      ],
      admin: {
        description: 'Type of social proof to display',
      },
    },
    {
      name: 'logos',
      type: 'array',
      admin: {
        condition: (data) => ['logos', 'combined'].includes(data.type),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Company or client logo',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Company or client name (for alt text)',
          },
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional link to company website',
          },
        },
      ],
      minRows: 1,
      maxRows: 12,
    },
    {
      name: 'stats',
      type: 'array',
      admin: {
        condition: (data) => ['stats', 'combined'].includes(data.type),
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Statistic value (e.g., "10,000+", "99%")',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Label for the statistic',
          },
        },
      ],
      minRows: 1,
      maxRows: 6,
    },
    {
      name: 'badges',
      type: 'array',
      admin: {
        condition: (data) => ['badges', 'combined'].includes(data.type),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Badge or certification image',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Badge title or certification name',
          },
        },
      ],
      minRows: 1,
      maxRows: 8,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'row',
      options: [
        {
          label: 'Row',
          value: 'row',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
      ],
      admin: {
        description: 'Layout style for the items',
      },
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Apply grayscale filter to logos (hover to show color)',
        condition: (data) => ['logos', 'combined'].includes(data.type),
      },
    },
  ],
  labels: {
    plural: 'Social Proof Blocks',
    singular: 'Social Proof Block',
  },
}
