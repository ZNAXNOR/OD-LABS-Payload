import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { createArtifactItemFields } from './Artifact/config'
import { link } from '@/fields/link'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'variant',
      type: 'radio',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Services Grid', value: 'servicesGrid' },
        { label: 'Artifact', value: 'artifact' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'servicesGrid',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'servicesGrid',
      },
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'default' || !siblingData.variant,
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
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'default' || !siblingData.variant,
      },
      options: [
        {
          label: 'Post Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'populateByServices',
      type: 'select',
      defaultValue: 'collection',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'servicesGrid',
      },
      options: [
        {
          label: 'Services Page Type',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) =>
          siblingData.populateBy === 'collection' && (siblingData.variant === 'default' || !siblingData.variant),
      },
      defaultValue: 'posts',
      label: 'Collections To Show',
      options: [
        {
          label: 'Posts',
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.populateBy === 'collection' && (siblingData.variant === 'default' || !siblingData.variant),
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) =>
          (siblingData.populateBy === 'collection' && (siblingData.variant === 'default' || !siblingData.variant)) ||
          (siblingData.populateByServices === 'collection' && siblingData.variant === 'servicesGrid'),
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.populateBy === 'selection' && (siblingData.variant === 'default' || !siblingData.variant),
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['posts'],
    },
    {
      name: 'selectedServices',
      type: 'array',
      admin: {
        condition: (_, siblingData) =>
          siblingData.populateByServices === 'selection' && siblingData.variant === 'servicesGrid',
      },
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          filterOptions: {
            pageType: { equals: 'services' },
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'tag',
          type: 'text',
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Dark', value: 'dark' },
          ],
          defaultValue: 'default',
        },
        {
          name: 'size',
          type: 'select',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Wide', value: 'wide' },
          ],
          defaultValue: 'standard',
        },
      ],
    },
    {
      name: 'artifactEyebrow',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'artifact',
      },
      label: 'Eyebrow',
      defaultValue: 'Operational Evidence',
    },
    {
      name: 'artifactHeading',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'artifact',
      },
      label: 'Heading',
      defaultValue: 'Engineering Decisions Backed By Real Artifacts',
    },
    {
      name: 'artifactIntro',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'artifact',
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
      label: 'Intro',
    },
    link({
      appearances: false,
      labelOptions: {
        defaultValue: 'View all technical notes',
        readOnly: true,
      },
      overrides: {
        name: 'artifactLink',
        label: 'View All Link',
        admin: {
          condition: (_, siblingData) => siblingData.variant === 'artifact',
        },
      },
    }),
    {
      name: 'items',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData.variant === 'artifact',
      },
      fields: createArtifactItemFields(),
    },
  ],
  labels: {
    plural: 'Archives',
    singular: 'Archive',
  },
}
