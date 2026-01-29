import type { Block } from 'payload'

export const BeforeAfterBlock: Block = {
  slug: 'beforeAfter',
  dbName: 'before_after', // Root level optimization
  interfaceName: 'BeforeAfterBlock',
  labels: {
    singular: 'Before/After Comparison Block',
    plural: 'Before/After Comparison Blocks',
  },
  admin: {
    group: 'Portfolio',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      maxLength: 120,
      admin: {
        description: 'Optional heading for the comparison section',
        placeholder: 'See the Transformation',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
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
      maxLength: 30,
      admin: {
        description: 'Label for the before image',
        placeholder: 'Before',
      },
    },
    {
      name: 'afterLabel',
      type: 'text',
      defaultValue: 'After',
      maxLength: 30,
      admin: {
        description: 'Label for the after image',
        placeholder: 'After',
      },
    },
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        {
          label: 'Horizontal',
          value: 'horizontal',
        },
        {
          label: 'Vertical',
          value: 'vertical',
        },
      ],
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
