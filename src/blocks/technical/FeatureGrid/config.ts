import type { Block } from 'payload'

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  dbName: 'feature_grid', // Root level optimization
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
      maxLength: 120,
      admin: {
        description: 'Optional heading for the feature grid section',
        placeholder: 'Our Features',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text below the heading',
        placeholder: 'Discover what makes us different',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      required: true,
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
        { label: '6 Columns', value: '6' },
      ],
      admin: {
        description:
          'Grid layout: 2 Columns (large features), 3 Columns (balanced), 4 Columns (compact), 6 Columns (dense)',
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
        description:
          'Visual style: Cards (bordered containers), Minimal (clean layout), Icons Only (icon-focused design)',
      },
    },
    {
      name: 'features',
      type: 'array',
      dbName: 'features', // Keep short names as-is
      required: true,
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'text',
          required: true,
          maxLength: 50,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Icon name is required'
            }
            // Basic validation for icon names (alphanumeric and common separators)
            if (!/^[a-zA-Z][a-zA-Z0-9\-_]*$/.test(value.trim())) {
              return 'Icon name should start with a letter and contain only letters, numbers, hyphens, and underscores'
            }
            return true
          },
          admin: {
            description: 'Lucide icon name (e.g., Zap, Shield, Rocket)',
            placeholder: 'Zap',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 80,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Feature title is required'
            }
            return true
          },
          admin: {
            placeholder: 'Feature Title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 200,
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Feature description is required'
            }
            return true
          },
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
              maxLength: 200,
              admin: {
                placeholder: '/features/feature-name',
              },
            },
            {
              name: 'label',
              type: 'text',
              maxLength: 50,
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
      admin: {
        components: {
          RowLabel: '@/blocks/technical/FeatureGrid/RowLabel#FeatureRowLabel',
        },
      },
    },
  ],
}
