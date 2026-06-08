import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { createComparisonColumn } from './fields/ComparisonColumn'

export const ComparisonBlock: Block = {
  slug: 'comparison',

  interfaceName: 'ComparisonBlock',

  labels: {
    singular: 'Comparison',
    plural: 'Comparisons',
  },

  fields: [
    {
      type: 'row',

      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'splitPanel',

          options: [
            {
              label: 'Split Panel',
              value: 'splitPanel',
            },
            {
              label: 'Cards',
              value: 'cards',
            },
          ],

          admin: {
            width: '50%',
          },
        },

      {
        name: 'positiveSide',
        type: 'radio',
        defaultValue: 'right',
        options: [
          {
            label: 'Left Positive',
            value: 'left',
          },
          {
            label: 'Right Positive',
            value: 'right',
          },
        ],
        admin: {
          width: '50%',
          layout: 'horizontal',
        },
      },

      {
        name: 'itemStyle',
        type: 'select',
        defaultValue: 'icon',
        options: [
          {
            label: 'Icons',
            value: 'icon',
          },
          {
            label: 'Bullet Points',
            value: 'bulletPoints',
          },
        ],
        admin: {
          width: '50%',
        },
      },
    ],
    },

    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'cards',
      },
    },

    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',

      tabs: [
        {
          label: 'Left Content',

          fields: [createComparisonColumn('left', 'Left Column')],
        },

        {
          label: 'Right Content',

          fields: [createComparisonColumn('right', 'Right Column')],
        },
      ],
    },

    {
      name: 'note',

      type: 'richText',

      admin: {
        condition: (_, siblingData) => siblingData.variant === 'splitPanel',
      },

      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({
            enabledHeadingSizes: ['h4'],
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}
