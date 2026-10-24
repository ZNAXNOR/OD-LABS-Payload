import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { testimonialFields } from './Varients/Testimonial/config'

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
        blockData?.layout !== 'capabilities' &&
        blockData?.layout !== 'testimonial',
    },
  },
  {
    name: 'richText',
    type: 'richText',
    editor: contentEditor,
    label: false,
    admin: {
      description: ({ blockData }: any) =>
        blockData?.layout === 'testimonial'
          ? 'Testimonial quote. Use paragraph text for the quote; section heading and description belong in the Text tab.'
          : 'For Capabilities, use the first heading as the item title, followed by paragraph blocks for its description.',
    },
  },
  {
    name: 'clientName',
    type: 'text',
    label: 'Client name',
    required: true,
    admin: {
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
    },
  },
  {
    name: 'clientPosition',
    type: 'text',
    label: 'Position',
    admin: {
      width: '50%',
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
    },
  },
  {
    name: 'clientCompany',
    type: 'text',
    label: 'Company',
    admin: {
      width: '50%',
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
    },
  },
  {
    name: 'clientMedia',
    type: 'upload',
    relationTo: 'media',
    label: 'Client photo',
    required: false,
    admin: {
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
      description: 'Optional. If omitted, the testimonial displays without a photo.',
    },
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout !== 'testimonial',
    },
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData, { blockData }) =>
          blockData?.layout !== 'testimonial' && Boolean(siblingData?.enableLink),
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
        { label: 'Testimonials', value: 'testimonial' },
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
                condition: (_data, _siblingData, { blockData }) =>
                  blockData?.layout !== 'testimonial',
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
          label: 'Content',
          fields: [
            {
              name: 'columns',
              type: 'array',
              label: ({ blockData }: any) =>
                blockData?.layout === 'capabilities' ? 'Capability items' : 'Columns',
              labels: {
                singular: ({ blockData }: any) =>
                  blockData?.layout === 'capabilities' ? 'Capability item' : 'Column',
                plural: ({ blockData }: any) =>
                  blockData?.layout === 'capabilities' ? 'Capability items' : 'Columns',
              },
              admin: {
                condition: (_data, _siblingData, { blockData }) =>
                  blockData?.layout !== 'testimonial',
                initCollapsed: true,
              },
              fields: columnFields,
            },
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              labels: {
                singular: 'Testimonial',
                plural: 'Testimonials',
              },
              admin: {
                condition: (_data, _siblingData, { blockData }) =>
                  blockData?.layout === 'testimonial',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'quote',
                  type: 'richText',
                  label: 'Quote',
                  editor: contentEditor,
                  required: true,
                },
                ...testimonialFields,
              ],
            },
          ],
        },
      ],
    },
  ],
}
