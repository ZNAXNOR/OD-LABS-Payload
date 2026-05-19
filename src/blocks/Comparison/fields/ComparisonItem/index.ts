import type { Field } from 'payload'

import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const comparisonItemFields: Field[] = [
  {
    name: 'icon',

    type: 'select',

    required: true,

    options: [
      {
        label: 'Architecture',
        value: 'architecture',
      },
      {
        label: 'Foundation',
        value: 'foundation',
      },
      {
        label: 'Communication',
        value: 'communication',
      },
      {
        label: 'Speed',
        value: 'speed',
      },
      {
        label: 'Groups',
        value: 'groups',
      },
      {
        label: 'Experiment',
        value: 'experiment',
      },
    ],

    defaultValue: 'architecture',
  },

  {
    name: 'title',
    type: 'text',
    required: true,
  },

  {
    name: 'description',
    type: 'richText',
    admin: {
      condition: (_, __, { blockData }) => {
        return blockData?.variant === 'splitPanel'
      },
    },
    editor: lexicalEditor({
      features: () => [
        BoldFeature(),
        ItalicFeature(),
        UnorderedListFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
  },
]
