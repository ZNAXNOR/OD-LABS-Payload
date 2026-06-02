import type { Field } from 'payload'

const itemFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
]

const variantOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Highlight', value: 'highlight' },
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
            options: variantOptions,
            admin: {
              width: '50%',
            },
          },
        ],
      },
      {
        name: 'items',
        type: 'array',
        label: 'Items',
        admin: {
          condition: (_, siblingData) => siblingData?.layout !== 'split',
        },
        fields: itemFields,
      },
      {
        name: 'left',
        type: 'array',
        label: 'Left Items',
        admin: {
          condition: (_, siblingData) => siblingData?.layout === 'split',
        },
        fields: itemFields,
      },
      {
        name: 'right_layout',
        type: 'radio',
        defaultValue: 'stack',
        label: 'Right Layout',
        admin: {
          condition: (_, siblingData) => siblingData?.layout === 'split',
          width: '50%',
        },
        options: [
          { label: 'Stack', value: 'stack' },
          { label: 'Grid', value: 'grid' },
        ],
      },
      {
        name: 'right',
        type: 'array',
        label: 'Right Items',
        admin: {
          condition: (_, siblingData) => siblingData?.layout === 'split',
        },
        fields: itemFields,
      },
    ],
  },
]
