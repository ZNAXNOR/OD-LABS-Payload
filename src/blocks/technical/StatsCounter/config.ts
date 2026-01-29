import type { Block } from 'payload'

export const StatsCounterBlock: Block = {
  slug: 'statsCounter',
  dbName: 'stats_counter', // Root level optimization
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
      maxLength: 120,
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
      dbName: 'stats', // Keep short names as-is
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          validate: (value: any) => {
            if (value === null || value === undefined) {
              return 'Stat value is required'
            }
            if (value < 0) {
              return 'Stat value cannot be negative'
            }
            return true
          },
          admin: {
            description: 'The numeric value to display',
            placeholder: '100',
          },
        },
        {
          name: 'prefix',
          type: 'text',
          maxLength: 10,
          admin: {
            description: 'Optional prefix (e.g., $, +)',
            placeholder: '$',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          maxLength: 10,
          admin: {
            description: 'Optional suffix (e.g., +, %, K, M)',
            placeholder: '+',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          maxLength: 80,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Stat label is required'
            }
            return true
          },
          admin: {
            description: 'Label describing the stat',
            placeholder: 'Happy Clients',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 150,
          admin: {
            description: 'Optional additional description',
            placeholder: 'And counting...',
          },
        },
        {
          name: 'icon',
          type: 'text',
          maxLength: 50,
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
      admin: {
        components: {
          RowLabel: '@/blocks/technical/StatsCounter/RowLabel#StatRowLabel',
        },
      },
    },
  ],
}
