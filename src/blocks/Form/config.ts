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
      name: 'generalForm',
      type: 'relationship',
      relationTo: 'forms',
      required: false,
      label: 'General Contact Form',
      admin: {
        description: 'Select the form used for general enquiries.',
      },
    },
    {
      name: 'projectInquiryForm',
      type: 'relationship',
      relationTo: 'forms',
      required: false,
      label: 'Project Inquiry Form',
      admin: {
        description: 'Select the form whose Steps tab defines the multi-step inquiry.',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: false,
      label: 'Legacy Form (compatibility)',
      admin: {
        condition: (_, siblingData) => !siblingData?.generalForm,
        description: 'Fallback for existing pages. Select General Contact Form above when updating this block.',
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
