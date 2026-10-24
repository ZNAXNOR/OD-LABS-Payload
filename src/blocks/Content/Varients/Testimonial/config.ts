import type { Field } from 'payload'

/**
 * Fields shared by testimonial entries.
 * Kept separate so the main ContentBlock config stays readable.
 */
export const testimonialFields: Field[] = [
  {
    name: 'clientName',
    type: 'text',
    label: 'Client name',
    required: true,
    admin: {
      width: '100%',
    },
  },
  {
    name: 'clientPosition',
    type: 'text',
    label: 'Position',
    admin: {
      width: '50%',
    },
  },
  {
    name: 'clientCompany',
    type: 'text',
    label: 'Company',
    admin: {
      width: '50%',
    },
  },
  {
    name: 'clientMedia',
    type: 'upload',
    relationTo: 'media',
    label: 'Client photo',
    required: false,
    admin: {
      description: 'Optional. If omitted, the testimonial displays without a photo.',
    },
  },
]
