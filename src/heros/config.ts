import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'lowImpactVariant',
      type: 'select',
      defaultValue: 'default',
      label: 'Low Impact Variant',
      dbName: 'Hero_LowImpactVariant',
      admin: {
        condition: (_, { type } = {}) => type === 'lowImpact',
      },
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Rating',
          value: 'rating',
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'Rating',
      type: 'group',
      admin: {
        condition: (_, { type, lowImpactVariant } = {}) =>
          type === 'lowImpact' && lowImpactVariant === 'rating',
      },
      fields: [
        {
          name: 'score',
          label: 'Rating Score',
          type: 'number',
          required: true,
          min: 0,
          max: 5,
        },
        {
          name: 'label',
          label: 'Rating Label',
          type: 'text',
        },
        {
          name: 'avatars',
          label: 'Rating Avatars',
          type: 'array',
          maxRows: 4,
          dbName: 'Hero_Rating_Avatars',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
      label: 'Rating',
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
