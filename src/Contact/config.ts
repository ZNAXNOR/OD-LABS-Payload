import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateContact } from './hooks/revalidateContact'

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Information',
          description: 'Primary contact details for use in contact pages, CTAs, and footers',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Street Address',
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'City',
                },
                {
                  name: 'state',
                  type: 'text',
                  label: 'State/Province',
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Postal Code',
                },
                {
                  name: 'country',
                  type: 'text',
                  label: 'Country',
                },
              ],
            },
            {
              name: 'email',
              type: 'email',
              label: 'Contact Email',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
            },
            link({
              appearances: false,
              overrides: {
                name: 'contactPageLink',
                label: 'Contact Page Link',
                admin: {
                  description: 'Link to your primary contact page',
                },
              },
            }),

            {
              name: 'businessHours',
              type: 'textarea',
              label: 'Business Hours',
              admin: {
                description: 'Optional: Display your business hours',
              },
            },
          ],
        },
        {
          label: 'Social Media',
          description: 'Social media links for use across your site',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
              admin: {
                placeholder: 'https://facebook.com/yourpage',
              },
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
              admin: {
                placeholder: 'https://instagram.com/yourprofile',
              },
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X URL',
              admin: {
                placeholder: 'https://twitter.com/yourhandle',
              },
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
              admin: {
                placeholder: 'https://linkedin.com/company/yourcompany',
              },
            },
            {
              name: 'youtube',
              type: 'text',
              label: 'YouTube URL',
              admin: {
                placeholder: 'https://youtube.com/@yourchannel',
              },
            },
            {
              name: 'github',
              type: 'text',
              label: 'GitHub URL',
              admin: {
                placeholder: 'https://github.com/yourorg',
              },
            },
            {
              name: 'tiktok',
              type: 'text',
              label: 'TikTok URL',
              admin: {
                placeholder: 'https://tiktok.com/@yourhandle',
              },
            },
            {
              name: 'customSocial',
              type: 'array',
              label: 'Other Social Media',
              fields: [
                {
                  name: 'platform',
                  type: 'text',
                  label: 'Platform Name',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
              ],
              admin: {
                description: 'Add any additional social media platforms',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateContact],
  },
}
