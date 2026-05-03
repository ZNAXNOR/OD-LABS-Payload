import type { Block } from 'payload'

export const MetricsStrip: Block = {
  slug: 'metricsStrip',
  labels: {
    singular: 'Metrics Strip',
    plural: 'Metrics Strips',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                width: '60%',
              },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                width: '40%',
              },
            },
          ],
        },
      ],
    },
  ],
}
