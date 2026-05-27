import type { Block } from 'payload'

import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { createArtifactField } from '@/artifacts'
import { link } from '@/fields/link'

export const ServiceShowcaseBlock: Block = {
  slug: 'serviceShowcase',

  interfaceName: 'ServiceShowcaseBlock',

  fields: [
    {
      name: 'items',

      type: 'array',

      minRows: 1,

      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!Array.isArray(value)) return value
            return value.map((item, index) => ({
              ...item,
              number: String(index + 1).padStart(2, '0'),
            }))
          },
        ],
      },

      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Left Rail',
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'tag',
                  type: 'group',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        {
                          label: 'Architecture',
                          value: 'architecture',
                        },
                        {
                          label: 'Workflow',
                          value: 'workflow',
                        },
                        {
                          label: 'Systems',
                          value: 'systems',
                        },
                      ],
                    },
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'timeline',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'deliverables',
                  type: 'text',
                  hasMany: true
                },
                link({
                  appearances: false,
                  overrides: {
                    name: 'cta',
                  },
                }),
              ],
            },
            {
              label: 'Right Content',
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      label: 'The Challenge',
                      fields: [
                        {
                          name: 'challenge',
                          type: 'richText',
                          editor: lexicalEditor({
                            features: () => [
                              BoldFeature(),
                              ItalicFeature(),
                              UnorderedListFeature(),
                              FixedToolbarFeature(),
                              InlineToolbarFeature(),
                            ],
                          }),
                        },
                      ],
                    },
                    {
                      label: 'The Approach',
                      fields: [
                        {
                          name: 'approach',
                          type: 'richText',
                          editor: lexicalEditor({
                            features: () => [
                              BoldFeature(),
                              ItalicFeature(),
                              UnorderedListFeature(),
                              FixedToolbarFeature(),
                              InlineToolbarFeature(),
                            ],
                          }),
                        },
                        createArtifactField({
                          allowedArtifacts: ['stackList', 'processFlow', 'codeSnippet', 'ad'],
                        }),
                      ],
                    },
                    {
                      label: 'Capabilities',
                      fields: [
                        {
                          name: 'capabilities',
                          maxRows: 4,
                          fields: [
                            {
                              name: 'capability',
                              type: 'text',
                              required: true,
                            },
                          ],
                          type: 'array',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
