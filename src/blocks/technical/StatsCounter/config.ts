import type { Block } from 'payload'

export const StatsCounterBlock: Block = {
  slug: 'statsCounter',
  interfaceName: 'StatsCounterBlock',
  labels: {
    singular: 'Stats Counter Block',
    plural: 'Stats Counter Blocks',
  },
  admin: {
    group: 'Technical',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the stats section',
        placeholder: 'Our Impact',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'row',
      required: true,
      options: [
        { label: 'Row', value: 'row' },
        { label: 'Grid', value: 'grid' },
      ],
      admin: {
        description: 'Layout style for the stats',
      },
    },
    {
      name: 'animateOnScroll',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Animate counters when they come into view',
      },
    },
    {
      name: 'duration',
      type: 'number',
      defaultValue: 2000,
      min: 500,
      max: 5000,
      admin: {
        description: 'Animation duration in milliseconds',
      },
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            description: 'The numeric value to display',
            placeholder: '100',
          },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: {
            description: 'Optional prefix (e.g., $, +)',
            placeholder: '$',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Optional suffix (e.g., +, %, K, M)',
            placeholder: '+',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Label describing the stat',
            placeholder: 'Happy Clients',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional additional description',
            placeholder: 'And counting...',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional Lucide icon name',
            placeholder: 'Users',
          },
        },
      ],
      labels: {
        singular: 'Stat',
        plural: 'Stats',
      },
    },
  ],
  labels: {
    singular: 'Stats Counter',
    plural: 'Stats Counters',
  },
}
