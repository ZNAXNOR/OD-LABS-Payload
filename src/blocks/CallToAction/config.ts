import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'
import { pdfLink } from '../../fields/pdfLink'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: 'small',
      admin: {
        position: 'sidebar',
      },
    },
    // Common Fields (Used by both variants)
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
      name: 'showBackground',
      type: 'checkbox',
      label: 'Show Background',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'large',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    // Large Variant Specific Fields
    {
      name: 'availabilityText',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'large',
      },
    },
    {
      name: 'enableHelperLink',
      type: 'checkbox',
      label: 'Add Helper Link',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'large',
      },
    },
    pdfLink({
      name: 'helperLink',
      label: 'PDF Link',
      admin: {
        condition: (_, siblingData) =>
          siblingData.variant === 'large' && siblingData.enableHelperLink,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
