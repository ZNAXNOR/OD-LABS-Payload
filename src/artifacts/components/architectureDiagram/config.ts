import type { Field } from 'payload'

const itemFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
]

export const architectureDiagramFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'sections',
    dbName: 'sect',
    type: 'array',
    minRows: 1,
    label: 'Sections',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'layout',
            type: 'select',
            required: true,
            label: 'Layout',
            options: [
              { label: 'Row', value: 'row' },
              { label: 'Columns', value: 'columns' },
              { label: 'Split', value: 'split' },
            ],
            admin: { width: '50%' },
          },
          {
            name: 'variant',
            type: 'select',
            defaultValue: 'secondary',
            label: 'Hierarchy',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Highlight', value: 'highlight' },
            ],
            admin: { width: '50%' },
          },
        ],
      },
      {
        name: 'items',
        type: 'array',
        label: 'Items',
        admin: {
          condition: (_, siblingData) =>
            siblingData?.layout !== 'split',
        },
        fields: itemFields,
      },
      {
        name: 'left',
        type: 'array',
        label: 'Left Region',
        admin: {
          condition: (_, siblingData) =>
            siblingData?.layout === 'split',
        },
        fields: itemFields,
      },
      {
        name: 'right',
        type: 'array',
        label: 'Right Region',
        admin: {
          condition: (_, siblingData) =>
            siblingData?.layout === 'split',
        },
        fields: itemFields,
      },
    ],
  },
]
