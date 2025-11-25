import { GlobalConfig } from 'payload'

const MegaMenu: GlobalConfig = {
  slug: 'mega-menu',
  fields: [
    {
      name: 'nav',
      label: 'Navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          label: 'Link',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'Internal',
              value: 'internal',
            },
            {
              label: 'External',
              value: 'external',
            },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'internalLink',
          label: 'Internal Link',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData.link === 'internal',
          },
        },
        {
          name: 'externalLink',
          label: 'External Link',
          type: 'text',
          required: false,
          admin: {
            condition: (_, siblingData) => siblingData.link === 'external',
          },
        },
      ],
    },
  ],
}
