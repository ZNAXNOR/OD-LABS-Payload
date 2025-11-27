import type { Block } from 'payload'
import { link } from '../../fields/link'

export const CTAGrid: Block = {
  slug: 'cta-grid',
  interfaceName: 'CTAGridBlock',
  labels: {
    singular: 'CTA Grid',
    plural: 'CTA Grids',
  },
  fields: [
    {
      name: 'actions',
      label: 'Actions',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      fields: [
        {
          name: 'headline',
          label: 'Headline',
          type: 'text',
          required: true,
        },
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
