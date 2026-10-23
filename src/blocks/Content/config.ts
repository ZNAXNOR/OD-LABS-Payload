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

const sizeField: Field = {
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
    condition: (data) => data?.layout !== 'capabilities',
  },
}

const columnFields: Field[] = [
  sizeField,
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

const capabilitiesColumnFields: Field[] = [
  {
    name: 'richText',
    type: 'richText',
    editor: contentEditor,
    label: false,
    admin: {
      description:
        'Use the first heading as the capability title, followed by paragraph blocks for its description.',
    },
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
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => siblingData?.layout === 'default',
      },
      fields: columnFields,
    },
    {
      type: 'tabs',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'capabilities',
      },
      tabs: [
        {
          label: 'Text',
          fields: [
            {
              name: 'richText',
              type: 'richText',
              label: 'Heading and description',
              editor: contentEditor,
              admin: {
                description:
                  'Use a heading block for the main statement and paragraph blocks for supporting text.',
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
          ],
        },
        {
          label: 'Capabilities',
          fields: [
            {
              name: 'columns',
              type: 'array',
              admin: {
                initCollapsed: true,
              },
              fields: capabilitiesColumnFields,
            },
          ],
        },
      ],
    },
  ],
}
