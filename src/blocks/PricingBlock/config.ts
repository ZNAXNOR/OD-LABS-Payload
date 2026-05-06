import type { Block } from 'payload'

export const Pricing: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Pricing',
    plural: 'Pricing Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'note',
      type: 'text',
      admin: {
        description: 'Small uppercase note displayed below the subheading (e.g. delivery timeline)',
      },
    },
    {
      name: 'plans',
      type: 'array',
      required: true,
      minRows: 1,
      validate: (value) => {
        if (!Array.isArray(value)) return true
        const highlightedCount = value.filter((plan: any) => plan?.highlighted).length
        if (highlightedCount > 1) {
          return 'Only one plan can be highlighted at a time.'
        }
        return true
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'features',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show "Most Popular" badge and bold border on this plan',
            components: {
              Field: '@/components/ExclusiveCheckbox#ExclusiveCheckbox',
            },
          },
        },
      ],
    },
  ],
}
