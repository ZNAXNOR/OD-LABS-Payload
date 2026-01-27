import { link } from '@/fields/link'
import type { Field } from 'payload'

export const fields: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Navigation',
        description: 'Configure the main navigation menu',
        fields: [
          {
            name: 'tabs',
            type: 'array',
            label: 'Navigation Tabs',
            minRows: 1,
            maxRows: 8,
            admin: {
              components: {
                RowLabel: '@/globals/Header/RowLabel#RowLabel',
              },
              description: 'Main navigation menu items (maximum 8 items)',
            },
            fields: [
              {
                name: 'label',
                type: 'text',
                required: true,
                maxLength: 50,
                admin: {
                  description: 'Navigation item label (max 50 characters)',
                },
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'enableDirectLink',
                    type: 'checkbox',
                    label: 'Direct Link',
                    admin: {
                      width: '50%',
                      description: 'Enable direct navigation link',
                    },
                  },
                  {
                    name: 'enableDropdown',
                    type: 'checkbox',
                    label: 'Dropdown Menu',
                    admin: {
                      width: '50%',
                      description: 'Enable dropdown submenu',
                    },
                  },
                ],
              },
              {
                name: 'directLink',
                type: 'group',
                admin: {
                  condition: (_, siblingData) => siblingData.enableDirectLink,
                  description: 'Configure direct navigation link',
                },
                fields: [
                  link({
                    appearances: false,
                    disableLabel: true,
                    enableAdvancedOptions: false,
                  }),
                ],
              },
              {
                name: 'dropdown',
                type: 'group',
                admin: {
                  condition: (_, siblingData) => siblingData.enableDropdown,
                  description: 'Configure dropdown submenu',
                },
                fields: [
                  {
                    name: 'description',
                    type: 'textarea',
                    maxLength: 200,
                    admin: {
                      description: 'Optional description for the dropdown (max 200 characters)',
                    },
                  },
                  {
                    name: 'descriptionLinks',
                    type: 'array',
                    label: 'Description Links',
                    maxRows: 3,
                    admin: {
                      description: 'Links within the dropdown description (max 3)',
                    },
                    fields: [
                      link({
                        appearances: false,
                      }),
                    ],
                  },
                  {
                    name: 'navItems',
                    type: 'array',
                    label: 'Dropdown Items',
                    minRows: 1,
                    maxRows: 12,
                    admin: {
                      components: {
                        RowLabel: '@/globals/Header/RowLabel#NavItemRowLabel',
                      },
                      description: 'Dropdown navigation items (max 12)',
                    },
                    fields: [
                      {
                        name: 'style',
                        type: 'select',
                        dbName: 'style',
                        defaultValue: 'default',
                        required: true,
                        options: [
                          { label: 'Default', value: 'default' },
                          { label: 'Featured', value: 'featured' },
                          { label: 'List', value: 'list' },
                        ],
                        admin: {
                          description: 'Visual style for this dropdown item',
                        },
                      },
                      {
                        name: 'defaultLink',
                        type: 'group',
                        admin: {
                          condition: (_, siblingData) => siblingData.style === 'default',
                        },
                        fields: [
                          link({
                            appearances: false,
                          }),
                          {
                            name: 'description',
                            type: 'textarea',
                            maxLength: 100,
                            admin: {
                              description: 'Optional description (max 100 characters)',
                            },
                          },
                        ],
                      },
                      {
                        name: 'featuredLink',
                        type: 'group',
                        admin: {
                          condition: (_, siblingData) => siblingData.style === 'featured',
                        },
                        fields: [
                          {
                            name: 'tag',
                            type: 'text',
                            maxLength: 20,
                            admin: {
                              description:
                                'Featured tag (e.g., "New", "Popular") - max 20 characters',
                            },
                          },
                          {
                            name: 'label',
                            type: 'text',
                            required: true,
                            maxLength: 50,
                            admin: {
                              description: 'Featured item label (max 50 characters)',
                            },
                          },
                          {
                            name: 'links',
                            type: 'array',
                            minRows: 1,
                            maxRows: 5,
                            admin: {
                              description: 'Featured links (max 5)',
                            },
                            fields: [
                              link({
                                appearances: false,
                              }),
                            ],
                          },
                        ],
                      },
                      {
                        name: 'listLinks',
                        type: 'group',
                        admin: {
                          condition: (_, siblingData) => siblingData.style === 'list',
                        },
                        fields: [
                          {
                            name: 'tag',
                            type: 'text',
                            maxLength: 20,
                            admin: {
                              description: 'List section tag (max 20 characters)',
                            },
                          },
                          {
                            name: 'links',
                            type: 'array',
                            minRows: 1,
                            maxRows: 8,
                            admin: {
                              description: 'List links (max 8)',
                            },
                            fields: [
                              link({
                                appearances: false,
                              }),
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Branding',
        description: 'Configure header branding and call-to-action',
        fields: [
          {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
            admin: {
              description:
                'Header logo image (recommended: SVG or PNG with transparent background)',
            },
            filterOptions: {
              mimeType: { contains: 'image' },
            },
          },
          {
            name: 'logoAlt',
            type: 'text',
            admin: {
              description: 'Alt text for the logo (required for accessibility)',
              condition: (data) => Boolean(data?.logo),
            },
            validate: (value: any, { siblingData }: any) => {
              if (siblingData?.logo && !value) {
                return 'Alt text is required when logo is provided'
              }
              return true
            },
          },
          link({
            appearances: ['default', 'secondary', 'outline'],
            overrides: {
              name: 'menuCta',
              label: 'Menu CTA Button',
              admin: {
                description: 'Call-to-action button in the header',
              },
            },
          }),
        ],
      },
    ],
  },
]
