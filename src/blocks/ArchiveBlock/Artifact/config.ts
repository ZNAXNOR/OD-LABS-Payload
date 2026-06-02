import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { createArtifactField } from '@/artifacts'

export const createArtifactItemFields = (): Field[] => [
  {
    name: 'archive',
    type: 'relationship',
    relationTo: 'posts',
    required: true,
    admin: {
      description: 'The narrative anchor — the long-form trust destination',
    },
  },
  {
    name: 'tag',
    type: 'text',
    admin: {
      description: 'Lightweight categorization (e.g. Architecture, Decision Records)',
    },
  },
  {
    name: 'content',
    type: 'richText',
    editor: lexicalEditor({
      features: () => [
        BoldFeature(),
        ItalicFeature(),
        UnorderedListFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
    admin: {
      description: 'Trust framing — explains why the artifact matters',
    },
  },
  createArtifactField({
    allowedArtifacts: ['ad', 'codeSnippet', 'processFlow', 'stackList'],
  }),
]
