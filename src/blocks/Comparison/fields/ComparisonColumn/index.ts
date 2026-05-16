import type { Field } from 'payload'
import { comparisonItemFields } from '../ComparisonItem'

export const createComparisonColumn = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 6,
      fields: comparisonItemFields,
    },
  ],
})
