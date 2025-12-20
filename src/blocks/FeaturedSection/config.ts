import type { Block } from 'payload'

export const FeaturedSection: Block = {
  slug: 'featuredSection',
  interfaceName: 'FeaturedSectionBlock',
  fields: [
    {
      name: 'header',
      type: 'text',
      label: 'Header',
      required: true,
      defaultValue: 'Featured In',
    },
    {
      name: 'subheader',
      type: 'text',
      label: 'Subheader',
      required: false,
      defaultValue: 'Trusted by industry leaders',
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          required: false,
        },
      ],
    },
  ],
  labels: {
    plural: 'Featured Sections',
    singular: 'Featured Section',
  },
}
