import type { Block } from 'payload'

import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const ArtifactBlock: Block = {
  slug: 'artifactBlock',

  interfaceName: 'ArtifactBlock',

  labels: {
    singular: 'Artifact Block',
    plural: 'Artifact Blocks',
  },

  fields: [
    {
      type: 'row',

      fields: [
        {
          name: 'theme',

          type: 'select',

          defaultValue: 'dark',

          options: [
            {
              label: 'Dark',
              value: 'dark',
            },
            {
              label: 'Light',
              value: 'light',
            },
          ],

          admin: {
            width: '50%',
          },
        },

        {
          name: 'eyebrow',

          type: 'text',

          admin: {
            width: '50%',
          },
        },
      ],
    },

    {
      name: 'heading',
      type: 'text',
      required: true,
    },

    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Architecture',
                  value: 'architecture',
                },
                {
                  label: 'Mediation',
                  value: 'mediation',
                },
                {
                  label: 'Verified',
                  value: 'verified',
                },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'width',
              dbName: 'wd',
              type: 'select',
              defaultValue: 'oneThird',
              options: [
                {
                  label: '1/3 Width',
                  value: 'oneThird',
                },
                {
                  label: '2/3 Width',
                  value: 'twoThirds',
                },
                {
                  label: '1/2 Width',
                  value: 'half',
                },
                {
                  label: 'Full Width',
                  value: 'full',
                },
              ],
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
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
        {
          name: 'artifactType',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Stack List',
              value: 'stackList',
            },
            {
              label: 'Process Flow',
              value: 'processFlow',
            },
            {
              label: 'Code Snippet',
              value: 'codeSnippet',
            },
          ],
        },
        {
          name: 'stackList',
          type: 'group',
          admin: {
            condition: (_, siblingData) =>
              siblingData.artifactType ===
              'stackList',
          },
          fields: [
            {
              name: 'rows',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'processFlow',
          type: 'group',
          admin: {
            condition: (_, siblingData) =>
              siblingData.artifactType ===
              'processFlow',
          },
          fields: [
            {
              name: 'steps',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      required: true,
                      dbName: 'icon',
                      options: [
                        {
                          label: 'Git Commit',
                          value: 'GitCommitHorizontal',
                        },
                        {
                          label: 'Flask Conical',
                          value: 'FlaskConical',
                        },
                        {
                          label: 'Rocket',
                          value: 'Rocket',
                        },
                      ],
                      defaultValue: 'GitCommitHorizontal',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'highlight',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    components: {
                      Field: '@/components/ExclusiveCheckbox#ExclusiveCheckbox',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'codeSnippet',
          type: 'group',
          admin: {
            condition: (_, siblingData) =>
              siblingData.artifactType ===
              'codeSnippet',
          },
          fields: [
            {
              name: 'code',
              type: 'code',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
