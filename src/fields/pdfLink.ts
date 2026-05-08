import type { Field, GroupField } from 'payload'
import deepMerge from '@/utilities/deepMerge'

type PdfLinkType = (overrides?: Partial<Field>) => Field

export const pdfLink: PdfLinkType = (overrides = {}) => {
  const generatedPdfLink: GroupField = {
    name: 'pdfLink',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'reference',
        type: 'upload',
        label: 'PDF File',
        relationTo: 'media',
        required: true,
        filterOptions: {
          mimeType: { contains: 'pdf' },
        },
      },
      {
        name: 'label',
        type: 'text',
        label: 'Label',
        required: true,
      },
    ],
  }

  return deepMerge(generatedPdfLink, overrides) as Field
}
