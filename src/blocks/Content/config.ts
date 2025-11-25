import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
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
    ],
    admin: {
      width: '50%',
    },
  },
  {
    name: 'alignment',
    label: 'Alignment',
    type: 'select',
    defaultValue: 'left',
    required: true,
    options: [
      {
        label: 'Left',
        value: 'left',
      },
      {
        label: 'Center',
        value: 'center',
      },
      {
        label: 'Right',
        value: 'right',
      },
    ],
    admin: {
      width: '50%',
    },
  },
  {
    name: 'accentLine',
    label: 'Enable Accent Line',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'accentLineAlignment',
    label: 'Accent Line Alignment',
    type: 'radio',
    defaultValue: 'left',
    options: [
      {
        label: 'Left',
        value: 'left',
      },
      {
        label: 'Right',
        value: 'right',
      },
    ],
    admin: {
      condition: (_data, siblingData) => siblingData.accentLine,
      layout: 'horizontal',
    },
  },
  {
    name: 'backgroundColor',
    type: 'radio',
    label: 'Background Color',
    defaultValue: 'none',
    admin: {
      layout: 'horizontal',
    },
    options: [
      {
        label: 'None',
        value: 'none',
      },
      {
        label: 'Red',
        value: 'red',
      },
      {
        label: 'Blue',
        value: 'blue',
      },
      {
        label: 'Orange',
        value: 'orange',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
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
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

const RowFields: Field[] = [
  {
    name: 'paddingTop',
    label: 'Padding Top',
    type: 'select',
    defaultValue: 'medium',
    options: [
      {
        label: 'Small',
        value: 'small',
      },
      {
        label: 'Medium',
        value: 'medium',
      },
      {
        label: 'Large',
        value: 'large',
      },
    ],
    admin: {
      width: '50%',
    },
  },
  {
    name: 'paddingBottom',
    label: 'Padding Bottom',
    type: 'select',
    defaultValue: 'medium',
    options: [
      {
        label: 'Small',
        value: 'small',
      },
      {
        label: 'Medium',
        value: 'medium',
      },
      {
        label: 'Large',
        value: 'large',
      },
    ],
    admin: {
      width: '50%',
    },
  },
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    {
      name: 'rows',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: RowFields,
    }
  ],
}
