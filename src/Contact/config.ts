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
              name: 'offices',
              type: 'array',
              label: 'Offices',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Office Label',
                  required: true,
                  admin: {
                    placeholder: 'e.g. Headquarters, San Francisco Office',
                  },
                },
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
                {
                  name: 'email',
                  type: 'email',
                  label: 'Office Email',
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Office Phone',
                },
              ],
            },

            {
              name: 'email',
              type: 'email',
              label: 'General Contact Email',
              required: true,
              admin: {
                description:
                  'Primary email for general inquiries (if different from office emails)',
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'General Phone Number',
              admin: {
                description:
                  'Primary phone for general inquiries (if different from office phones)',
              },
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
              name: 'workingHours',
              type: 'array',
              label: 'Working Hours',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  options: [
                    { label: 'Monday', value: 'monday' },
                    { label: 'Tuesday', value: 'tuesday' },
                    { label: 'Wednesday', value: 'wednesday' },
                    { label: 'Thursday', value: 'thursday' },
                    { label: 'Friday', value: 'friday' },
                    { label: 'Saturday', value: 'saturday' },
                    { label: 'Sunday', value: 'sunday' },
                  ],
                  required: true,
                },
                {
                  name: 'openTime',
                  type: 'date',
                  label: 'Open Time',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm a',
                    },
                  },
                },
                {
                  name: 'closeTime',
                  type: 'date',
                  label: 'Close Time',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm a',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          description: 'Social media links for use across your site',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Links',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Platform',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                  admin: {
                    placeholder: 'https://...',
                  },
                },
              ],
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
