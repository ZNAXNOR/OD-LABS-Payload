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
          defaultValue: 'large',
          required: true,
          options: [
            {
              label: 'Large',
              value: 'large',
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
          name: 'heading',
          type: 'text',
          required: true,
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
      name: 'intro',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'cards',
      },
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
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
  ],
}
