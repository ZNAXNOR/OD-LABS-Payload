import type { Field } from 'payload'

export const stackListFields: Field[] = [
  {
    name: 'rows',
    dbName: 'art_sl_rows',
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
]
