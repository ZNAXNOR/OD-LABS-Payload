import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
      admin: {
        condition: (_, { appearance }) => !appearance || appearance === 'default',
      },
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro, appearance }) =>
          (!appearance || appearance === 'default') && Boolean(enableIntro),
      },
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
      label: 'Intro Content',
    },
    {
      name: 'appearance',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default (Centered)',
          value: 'default',
        },
        {
          label: 'Split (Side by Side)',
          value: 'split',
        },
      ],
    },
    {
      name: 'splitContent',
      type: 'richText',
      label: 'Split Side Content',
      admin: {
        condition: (_, { appearance }) => appearance === 'split',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'enableContactInfo',
      type: 'checkbox',
      label: 'Show Contact Info (Global)',
      defaultValue: true,
      admin: {
        condition: (_, { appearance }) => appearance === 'split',
      },
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
