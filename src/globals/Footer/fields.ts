import { link } from '@/fields/link'
import { socialMediaLinks } from '@/fields/socialMediaLinks'
import type { Field } from 'payload'

// Import rich text features
import { minimalRichText } from '@/fields/richTextFeatures'

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
            dbName: 'nav_cols', // Abbreviate navigation columns
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
                dbName: 'nav_items', // Snake case conversion
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
              description: 'Copyright notice and legal text with enhanced formatting',
            },
            editor: minimalRichText,
          },
          {
            name: 'legalLinks',
            type: 'array',
            dbName: 'legal_links', // Snake case conversion
            label: 'Legal Links',
            maxRows: 8,
            admin: {
              description: 'Legal and policy links (max 8)',
            },
            fields: [
              {
                name: 'link',
                type: 'group',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'type',
                        type: 'radio',
                        dbName: 'link_type',
                        admin: {
                          layout: 'horizontal',
                          width: '50%',
                        },
                        defaultValue: 'reference',
                        options: [
                          {
                            label: 'Legal Page',
                            value: 'reference',
                          },
                          {
                            label: 'Custom URL',
                            value: 'custom',
                          },
                        ],
                      },
                      {
                        name: 'newTab',
                        type: 'checkbox',
                        admin: {
                          style: {
                            alignSelf: 'flex-end',
                          },
                          width: '50%',
                        },
                        label: 'Open in new tab',
                      },
                    ],
                  },
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'reference',
                        type: 'relationship',
                        admin: {
                          condition: (_, siblingData) => siblingData?.type === 'reference',
                          width: '50%',
                        },
                        label: 'Legal Page',
                        relationTo: ['pages'], // Only show Pages (filtered by pageType in admin)
                        required: true,
                      },
                      {
                        name: 'url',
                        type: 'text',
                        admin: {
                          condition: (_, siblingData) => siblingData?.type === 'custom',
                          width: '50%',
                        },
                        label: 'Custom URL',
                        required: true,
                        validate: (value: any) => {
                          if (!value) return true
                          try {
                            new URL(value)
                            return true
                          } catch {
                            if (value.startsWith('/') || value.startsWith('#')) {
                              return true
                            }
                            return 'Please enter a valid URL (e.g., https://example.com or /page)'
                          }
                        },
                      },
                      {
                        name: 'label',
                        type: 'text',
                        admin: {
                          width: '50%',
                        },
                        label: 'Label',
                        required: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          socialMediaLinks({
            label: 'Social Media',
            description: 'Select social media links to display in the footer',
            maxLinks: 15,
            enableToggle: true,
          }),
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
