import { Tab } from 'payload'

const platforms = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Twitter/X', value: 'twitter' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'GitHub', value: 'github' },
]

export const SocialMediaTab: Tab = {
  name: 'socialMedia',
  label: 'Social Media',
  fields: [
    {
      name: 'links',
      type: 'array',
      dbName: 'links', // Keep semantic meaning
      admin: {
        components: {
          RowLabel: '@/globals/Contact/RowLabels#SocialMediaRowLabel',
        },
      },
      maxRows: platforms.length,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              dbName: 'platform', // Keep short names
              options: platforms,
              required: true,
              admin: {
                width: '49%',
                components: {
                  Field: '@/components/UniqueSelect',
                },
              },
              validate: (value: any, { data }: any) => {
                const links = data?.socialMedia?.links || []
                const occurrences = links.filter((link: any) => link.platform === value)
                if (occurrences.length > 1) {
                  return 'This platform is already added. Please choose a different one or edit the existing link.'
                }
                return true
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
