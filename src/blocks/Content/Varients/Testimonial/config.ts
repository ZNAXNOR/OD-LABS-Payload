import type { Field } from 'payload'

/**
 * Optional metadata fields for each item in the shared ContentBlock array.
 * These are only shown when the block uses the testimonial layout.
 */
export const testimonialFields: Field[] = [
  {
    name: 'clientName',
    type: 'text',
    label: 'Client name',
    admin: {
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
    },
  },
  {
    name: 'clientPosition',
    type: 'text',
    label: 'Position',
    admin: {
      width: '50%',
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
    },
  },
  {
    name: 'clientCompany',
    type: 'text',
    label: 'Company',
    admin: {
      width: '50%',
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
    },
  },
  {
    name: 'clientMedia',
    type: 'upload',
    relationTo: 'media',
    label: 'Client photo',
    required: false,
    admin: {
      condition: (_data, _siblingData, { blockData }) =>
        blockData?.layout === 'testimonial',
      description: 'Optional. If omitted, the testimonial displays without a photo.',
    },
  },
]
