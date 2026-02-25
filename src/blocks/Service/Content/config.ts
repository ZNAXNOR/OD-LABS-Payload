import type { Block } from 'payload'

export const ExpertiseContent: Block = {
  slug: 'expertiseContent',
  interfaceName: 'ExpertiseContentBlock',
  fields: [
    {
      name: 'variant',
      type: 'radio',
      label: 'Expertise Variant',
      defaultValue: 'inline',
      options: [
        {
          label: 'Inline Variant',
          value: 'inline',
        },
        {
          label: 'Side Variant',
          value: 'sideVarient',
        },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'size',
      type: 'radio',
      label: 'Size',
      defaultValue: 'small',
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'inline',
        layout: 'horizontal',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Our Expertise',
      admin: {
        condition: (data, siblingData) =>
          siblingData?.variant !== 'inline' && data?.servicesHero?.type !== 'highImpact',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Expertise Items',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'stat',
          type: 'text',
          label: 'Stat',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.size === 'large' ||
              siblingData?.variant === 'sideVarient' ||
              data?.servicesHero?.type === 'highImpact',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],
}
