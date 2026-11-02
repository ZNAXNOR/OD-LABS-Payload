import type { Field } from 'payload'

export const lowImpactFields: Field[] = [
  {
    name: 'addPadding',
    type: 'checkbox',
    label: 'Add Padding',
    defaultValue: false,
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'lowImpact',
    },
  },
  {
    type: 'row',
    admin: {
      condition: (_, siblingData) =>
        siblingData?.type === 'lowImpact' && Boolean(siblingData?.addPadding),
    },
    fields: [
      {
        name: 'paddingX',
        type: 'number',
        label: 'X Padding',
        admin: {
          width: '50%',
          placeholder: 'e.g. 40px',
          description: 'Padding in px',
        },
      },
      {
        name: 'paddingY',
        type: 'number',
        label: 'Y Padding',
        admin: {
          width: '50%',
          placeholder: 'e.g. 40px',
          description: 'Padding in px',
        },
      },
    ],
  },
]
