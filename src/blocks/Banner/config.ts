import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'blockVariant',
      type: 'radio',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Icon Block', value: 'iconBlock' },
      ],
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.blockVariant === 'standard',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      required: true,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'iconBlock' ||
          (siblingData?.blockVariant === 'standard' && siblingData?.style !== 'warning'),
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: "When I'm NOT a good fit",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'standard' && siblingData?.style === 'warning',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'standard' && siblingData?.style === 'warning',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'standard' && siblingData?.style === 'warning',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'BannerBlock',
}
