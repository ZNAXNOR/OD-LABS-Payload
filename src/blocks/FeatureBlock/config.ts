import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const FeatureBlock: Block = {
  slug: 'featureBlock',

  interfaceName: 'FeatureBlock',

  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Stacked List',
          value: 'stackedList',
        },
      ],
    },

    {
      name: 'eyebrow',
      type: 'text',
    },

    {
      name: 'heading',
      type: 'text',
      required: true,
    },

    {
      name: 'subheading',
      type: 'textarea',
    },

    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns',
          value: '3',
        },
        {
          label: '4 Columns',
          value: '4',
        },
      ],
    },

    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,

      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,

          options: [
            {
              label: 'Rocket',
              value: 'Rocket',
            },
            {
              label: 'Settings',
              value: 'Settings',
            },
            {
              label: 'Check',
              value: 'Check',
            },
            {
              label: 'Users',
              value: 'Users',
            },
            {
              label: 'Zap',
              value: 'Zap',
            },
            {
              label: 'Shield',
              value: 'Shield',
            },
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
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              UnorderedListFeature(),
              OrderedListFeature(),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],

  labels: {
    plural: 'Feature Blocks',
    singular: 'Feature Block',
  },
}
