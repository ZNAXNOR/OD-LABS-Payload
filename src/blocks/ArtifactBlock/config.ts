import type { Block } from 'payload'

import { createArtifactField } from '@/artifacts'

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
        createArtifactField(),
      ],
    },
  ],
}
