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
      defaultValue: 'default',
      options: [
        {
          label: 'Form',
          value: 'default',
        },
        {
          label: 'Contact',
          value: 'contact',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
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
        },
        {
          label: 'Supporting Content',
          admin: {
            condition: (_, { variant }) => variant === 'contact',
          },
          fields: [
            {
              name: 'trustPanel',
              type: 'group',
              label: 'Trust Panel',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Heading',
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Items',
                  fields: [
                    {
                      name: 'icon',
                      type: 'text',
                      label: 'Icon',
                    },
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Title',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description',
                    },
                  ],
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                },
              ],
            },
          ],
        },
      ],
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
