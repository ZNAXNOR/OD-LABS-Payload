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
      name: 'variant',
      type: 'select',
      label: 'Form layout',
      required: true,
      defaultValue: 'single',
      options: [
        { label: 'Single Form', value: 'single' },
        { label: 'Multi Form', value: 'multi' },
      ],
    },
    {
      name: 'singleForm',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Form',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'single',
        description: 'Select the form to display in this block.',
      },
    },
    {
      name: 'multiForms',
      type: 'array',
      label: 'Forms / Tabs',
      minRows: 2,
      maxRows: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'multi',
        description: 'Add 2–3 forms. Each entry becomes a selectable tab on the page. Reorder entries to change tab order.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
          label: 'Form',
        },
        {
          name: 'tabLabel',
          type: 'text',
          required: true,
          label: 'Tab label',
          admin: {
            description: 'Label displayed on the public form tab.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Tab description',
        },
      ],
      validate: (value) => {
        if (!Array.isArray(value)) return true
        const ids = value
          .map((item) => {
            const form = item?.form
            return typeof form === 'object' && form !== null ? form.id : form
          })
          .filter((id) => id !== undefined && id !== null)
          .map(String)
        return new Set(ids).size === ids.length || 'Select a different form for each tab.'
      },
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
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
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
