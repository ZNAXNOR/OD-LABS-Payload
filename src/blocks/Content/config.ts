import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const contentEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      { label: 'Zero', value: 'zero' },
      { label: 'One Third', value: 'oneThird' },
      { label: 'Half', value: 'half' },
      { label: 'Two Thirds', value: 'twoThirds' },
      { label: 'Full', value: 'full' },
    ],
    admin: {
      components: {
        Field: '@/components/SizeSlider',
      },
      custom: {
        showPreview: true,
        min: 'oneThird',
        max: 'full',
      },
    },
  },
  {
    name: 'richText',
    type: 'richText',
    editor: contentEditor,
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
      },
    },
  }),
]

const capabilitiesFields: Field[] = [
  {
    name: 'richText',
    type: 'richText',
    label: 'Heading and description',
    editor: contentEditor,
    admin: {
      description:
        'Use a heading block for the main statement and regular paragraph blocks for the supporting description. Style text using the editor toolbar.',
    },
  },
  {
    name: 'linkGroup',
    type: 'array',
    label: 'Link group',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      link({
        overrides: {
          name: 'link',
          admin: { hideGutter: true },
        },
      }),
    ],
  },
  {
    name: 'items',
    type: 'array',
    label: 'Capabilities',
    minRows: 1,
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'enableLink',
        type: 'checkbox',
        defaultValue: false,
      },
      link({
        overrides: {
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
          },
        },
      }),
    ],
  },
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Capabilities', value: 'capabilities' },
      ],
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Text',
          admin: {
            condition: (_, siblingData) => siblingData?.layout === 'default',
          },
          fields: [
            {
              name: 'columns',
              type: 'array',
              admin: {
                initCollapsed: true,
              },
              fields: columnFields,
            },
          ],
        },
        {
          label: 'Capabilities',
          admin: {
            condition: (_, siblingData) => siblingData?.layout === 'capabilities',
          },
          fields: capabilitiesFields,
        },
      ],
    },
  ],
}
