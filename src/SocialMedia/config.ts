import { GlobalConfig } from 'payload'

import { revalidateSocialMedia } from './hooks/revalidateSocialMedia'

export const SocialMedia: GlobalConfig = {
  slug: 'social-media',
  label: 'Social Media',
  fields: [
    {
      name: 'links',
      type: 'array',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
      admin: {
        components: {
          RowLabel: '@/SocialMedia/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSocialMedia],
  },
}
