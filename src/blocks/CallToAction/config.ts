import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'
import { textStateConfig } from '@/fields/textStateConfig'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      hasMany: true,
      admin: {
        description:
          'Eyebrow tags. The block position prefix (e.g. "02 —") is automatically prepended to the first tag. Multiple tags are separated by "•".',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            TextStateFeature({ state: textStateConfig }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        description: 'CTA heading and supporting copy. Use a heading block followed by a paragraph.',
      },
    },
    linkGroup({
      appearances: ['default', 'outline', 'underline'],
      overrides: {
        maxRows: 2,
        admin: {
          description: 'Add the primary action and optional secondary links. Use Fill for the primary action and Underline for secondary links.',
        },
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
