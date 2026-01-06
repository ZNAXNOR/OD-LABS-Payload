import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'

export const ContactGlobal: GlobalConfig = {
  slug: 'contact',
  access: {
    read: () => true,
  },
  label: {
    singular: 'Contact Global',
    plural: 'Contact Globals',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
}
