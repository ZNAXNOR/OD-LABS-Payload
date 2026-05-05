import type { Block } from 'payload'

export const Process: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  labels: {
    singular: 'Process',
    plural: 'Processes',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'isFinal',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
