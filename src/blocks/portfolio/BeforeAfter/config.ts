import type { Block } from 'payload'

export const BeforeAfterBlock: Block = {
  slug: 'beforeAfter',
  interfaceName: 'BeforeAfterBlock',
  labels: {
    singular: 'Before/After Comparison Block',
    plural: 'Before/After Comparison Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the comparison section',
        placeholder: 'See the Transformation',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
        placeholder: 'Compare the before and after results',
      },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image showing the "before" state',
      },
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image showing the "after" state',
      },
    },
    {
      name: 'beforeLabel',
      type: 'text',
      defaultValue: 'Before',
      admin: {
        description: 'Label for the before image',
        placeholder: 'Before',
      },
    },
    {
      name: 'afterLabel',
      type: 'text',
      defaultValue: 'After',
      admin: {
        description: 'Label for the after image',
        placeholder: 'After',
      },
    },
    {
      name: 'orientation',
      type: 'select',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      defaultValue: 'horizontal',
      required: true,
      admin: {
        description: 'Slider orientation',
      },
    },
    {
      name: 'defaultPosition',
      type: 'number',
      defaultValue: 50,
      min: 0,
      max: 100,
      required: true,
      admin: {
        description: 'Default slider position (0-100)',
      },
    },
  ],
}
