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
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout !== 'capabilities',
    },
  },
  {
    name: 'richText',
    type: 'richText',
    editor: contentEditor,
    label: false,
    admin: {
      description:
        'For Capabilities, use the first heading as the item title, followed by paragraph blocks for its description.',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Text',
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
          label: ({ blockData }: any) =>
            blockData?.layout === 'capabilities' ? 'Capabilities' : 'Columns',
          fields: [
            {
              name: 'columns',
              type: 'array',
              label: ({ blockData }: any) =>
                blockData?.layout === 'capabilities'
                  ? 'Capability items'
                  : 'Columns',
              labels: {
                singular: ({ blockData }: any) =>
                  blockData?.layout === 'capabilities'
                    ? 'Capability item'
                    : 'Column',
                plural: ({ blockData }: any) =>
                  blockData?.layout === 'capabilities'
                    ? 'Capability items'
                    : 'Columns',
              },
              admin: {
                initCollapsed: true,
              },
              fields: columnFields,
            },
          ],
        },
      ],
    },
  ],
}
