import type { Block } from 'payload'

export const FeatureBlock: Block = {
  slug: 'featureBlock',
  interfaceName: 'FeatureBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Rocket', value: 'Rocket' },
            { label: 'Settings', value: 'Settings' },
            { label: 'Check', value: 'Check' },
            { label: 'Users', value: 'Users' },
            { label: 'Zap', value: 'Zap' },
            { label: 'Shield', value: 'Shield' },
          ],
          defaultValue: 'Rocket',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Feature Blocks',
    singular: 'Feature Block',
  },
}
