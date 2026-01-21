import type { Field } from 'payload'
import { link } from '@/fields/link'

export const fields: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Navigation',
        description: 'Configure footer navigation columns',
        fields: [
          {
            name: 'columns',
            type: 'array',
            label: 'Footer Columns',
            minRows: 1,
            maxRows: 6,
            admin: {
              initCollapsed: true,
              components: {
                RowLabel: '@/globals/Footer/RowLabel#RowLabel',
              },
              description: 'Footer navigation columns (max 6 columns)',
            },
            fields: [
              {
                name: 'label',
                type: 'text',
                required: true,
                maxLength: 50,
                admin: {
                  description: 'Column heading (max 50 characters)',
                },
              },
              {
                name: 'navItems',
                type: 'array',
                label: 'Navigation Items',
                minRows: 1,
                maxRows: 10,
                admin: {
                  components: {
                    RowLabel: '@/globals/Footer/RowLabel#NavItemRowLabel',
                  },
                  description: 'Navigation links for this column (max 10)',
                },
                fields: [
                  link({
                    appearances: false,
                    enableAdvancedOptions: false,
                  }),
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Legal & Social',
        description: 'Configure legal information and social media links',
        fields: [
          {
            name: 'copyright',
            type: 'richText',
            admin: {
              description: 'Copyright notice and legal text',
            },
          },
          {
            name: 'legalLinks',
            type: 'array',
            label: 'Legal Links',
            maxRows: 8,
            admin: {
              description: 'Legal and policy links (max 8)',
            },
            fields: [
              link({
                appearances: false,
                enableAdvancedOptions: false,
              }),
            ],
          },
          {
            name: 'socialMedia',
            type: 'group',
            label: 'Social Media',
            admin: {
              description: 'Social media links and profiles',
            },
            fields: [
              {
                name: 'enabled',
                type: 'checkbox',
                label: 'Show Social Media Links',
                defaultValue: true,
              },
              {
                name: 'links',
                type: 'array',
                label: 'Social Links',
                maxRows: 10,
                admin: {
                  condition: (_, siblingData) => siblingData.enabled,
                  description: 'Social media profile links (max 10)',
                },
                fields: [
                  {
                    name: 'platform',
                    type: 'select',
                    required: true,
                    options: [
                      { label: 'Facebook', value: 'facebook' },
                      { label: 'Twitter/X', value: 'twitter' },
                      { label: 'LinkedIn', value: 'linkedin' },
                      { label: 'Instagram', value: 'instagram' },
                      { label: 'YouTube', value: 'youtube' },
                      { label: 'GitHub', value: 'github' },
                      { label: 'Discord', value: 'discord' },
                      { label: 'TikTok', value: 'tiktok' },
                      { label: 'Other', value: 'other' },
                    ],
                    admin: {
                      description: 'Social media platform',
                    },
                  },
                  {
                    name: 'url',
                    type: 'text',
                    required: true,
                    admin: {
                      description: 'Profile URL',
                    },
                    validate: (value: any) => {
                      if (!value) return 'URL is required'
                      try {
                        new URL(value)
                        return true
                      } catch {
                        return 'Please enter a valid URL'
                      }
                    },
                  },
                  {
                    name: 'label',
                    type: 'text',
                    admin: {
                      description: 'Custom label (optional, defaults to platform name)',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Newsletter',
        description: 'Configure newsletter signup (optional)',
        fields: [
          {
            name: 'newsletter',
            type: 'group',
            admin: {
              description: 'Newsletter signup configuration',
            },
            fields: [
              {
                name: 'enabled',
                type: 'checkbox',
                label: 'Show Newsletter Signup',
                defaultValue: false,
              },
              {
                name: 'title',
                type: 'text',
                admin: {
                  condition: (_, siblingData) => siblingData.enabled,
                  description: 'Newsletter section title',
                },
                validate: (value: any, { siblingData }: any) => {
                  if (siblingData?.enabled && !value) {
                    return 'Title is required when newsletter is enabled'
                  }
                  return true
                },
              },
              {
                name: 'description',
                type: 'textarea',
                admin: {
                  condition: (_, siblingData) => siblingData.enabled,
                  description: 'Newsletter description text',
                },
              },
              {
                name: 'placeholder',
                type: 'text',
                defaultValue: 'Enter your email address',
                admin: {
                  condition: (_, siblingData) => siblingData.enabled,
                  description: 'Email input placeholder text',
                },
              },
              {
                name: 'buttonText',
                type: 'text',
                defaultValue: 'Subscribe',
                admin: {
                  condition: (_, siblingData) => siblingData.enabled,
                  description: 'Subscribe button text',
                },
              },
            ],
          },
        ],
      },
    ],
  },
]
