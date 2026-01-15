import type { Block } from 'payload'

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: 'Feature Grid Block',
    plural: 'Feature Grid Blocks',
  },
  admin: {
    group: 'Technical',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the feature grid section',
        placeholder: 'Our Features',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text below the heading',
        placeholder: 'Discover what makes us different',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: 3,
      required: true,
      options: [
        { label: '2 Columns', value: 2 },
        { label: '3 Columns', value: 3 },
        { label: '4 Columns', value: 4 },
        { label: '6 Columns', value: 6 },
      ],
      admin: {
        description: 'Number of columns in the grid layout',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      required: true,
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Icons Only', value: 'icons' },
      ],
      admin: {
        description: 'Visual style of the feature grid',
      },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: {
            description: 'Lucide icon name (e.g., Zap, Shield, Rocket)',
            placeholder: 'Zap',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Feature Title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            placeholder: 'Brief description of this feature',
          },
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'url',
              type: 'text',
              admin: {
                placeholder: '/features/feature-name',
              },
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                placeholder: 'Learn more',
              },
            },
          ],
          admin: {
            description: 'Optional link for this feature',
          },
        },
      ],
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
    },
  ],
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
  },
}
