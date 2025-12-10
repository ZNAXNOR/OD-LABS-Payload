import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'CTA Section',
          fields: [
            {
              name: 'ctaHeading',
              type: 'text',
              label: 'CTA Heading',
              defaultValue: 'Get started',
            },
            {
              name: 'ctaTitle',
              type: 'text',
              label: 'CTA Title',
              defaultValue: 'Ready to dive in? Start your free trial today.',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
              label: 'CTA Description',
              defaultValue:
                "Get the cheat codes for selling and unlock your team's revenue potential.",
            },
            {
              name: 'ctaButton',
              type: 'group',
              fields: [
                link({
                  appearances: false,
                }),
              ],
            },
          ],
        },
        {
          label: 'Footer Links',
          fields: [
            {
              name: 'linkColumns',
              type: 'array',
              label: 'Link Columns',
              fields: [
                {
                  name: 'columnHeading',
                  type: 'text',
                  label: 'Column Heading',
                  required: true,
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  fields: [
                    link({
                      appearances: false,
                    }),
                  ],
                },
              ],
              maxRows: 4,
            },
          ],
        },
        {
          label: 'Bottom Section',
          fields: [
            {
              name: 'copyrightText',
              type: 'text',
              label: 'Copyright Text',
              defaultValue: '© 2025 Radiant Inc.',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
