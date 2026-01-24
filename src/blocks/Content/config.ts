import { link } from '@/fields/link'
import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import {
  structuralFeatures,
  basicTextFeatures,
  alignmentFeatures,
  headingFeatures,
  listFeatures,
  enhancedLinkFeature,
} from '@/fields/richTextFeatures'

// Import rich text features

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Content Block',
    plural: 'Content Blocks',
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      fields: [
        {
          name: 'width',
          type: 'select',
          options: [
            {
              label: 'One Third',
              value: 'oneThird',
            },
            {
              label: 'Half',
              value: 'half',
            },
            {
              label: 'Two Thirds',
              value: 'twoThirds',
            },
            {
              label: 'Full',
              value: 'full',
            },
            {
              label: 'Auto',
              value: 'auto',
            },
          ],
          defaultValue: 'full',
          required: true,
          admin: {
            description: 'Column width',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          admin: {
            description: 'Column content with enhanced formatting options',
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }: { rootFeatures: any[] }) => [
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              ...rootFeatures,
              ...structuralFeatures,
              ...basicTextFeatures,
              ...alignmentFeatures,
              ...headingFeatures,
              ...listFeatures,
              ...enhancedLinkFeature,
            ],
          }),
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Enable Link',
          admin: {
            description: 'Make this column clickable',
          },
        },
        link({
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.enableLink === true,
            },
          },
        }),
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'White', value: 'white' },
            { label: 'Zinc 50', value: 'zinc-50' },
            { label: 'Zinc 100', value: 'zinc-100' },
            { label: 'Brand Primary', value: 'brand-primary' },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Background color for this column',
          },
        },
        {
          name: 'padding',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Padding inside the column',
          },
        },
      ],
      admin: {
        description: 'Add columns to create flexible layouts',
      },
    },
    {
      name: 'gap',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: 'medium',
      required: true,
      admin: {
        description: 'Space between columns',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
      defaultValue: 'top',
      required: true,
      admin: {
        description: 'Vertical alignment of columns',
      },
    },
  ],
}
