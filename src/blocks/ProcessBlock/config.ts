import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Process: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  labels: {
    singular: 'Process',
    plural: 'Processes',
  },
  fields: [
    {
      name: 'blockVariant',
      type: 'radio',
      defaultValue: 'journey',
      options: [
        { label: 'Journey', value: 'journey' },
        { label: 'Numbered Panels', value: 'numberedPanels' },
      ],
      required: true,
    },

    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'numberedPanels' || siblingData?.blockVariant === 'journey',
      },
    },

    {
      name: 'heading',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'numberedPanels' || siblingData?.blockVariant === 'journey',
      },
    },

    {
      name: 'stepShape',
      type: 'radio',
      defaultValue: 'circle',
      options: [
        { label: 'Circle', value: 'circle' },
        { label: 'Rectangle', value: 'rectangle' },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData?.blockVariant === 'journey',
      },
    },

    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'isHighlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data: unknown, siblingData: unknown, { blockData }: any) => {
              if (!blockData) return true
              return blockData.blockVariant === 'journey'
            },
            components: {
              Field: '/components/ExclusiveCheckbox#ExclusiveCheckbox',
            },
          },
        },
      ],
    },
  ],
}
