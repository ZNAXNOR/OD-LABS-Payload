import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { authenticated } from '@/access/authenticated'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: authenticated,
  },
  label: 'Header',
  fields: [
    {
      name: 'tabs',
      dbName: 'header_tabs',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@/globals/Header/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enableDirectLink',
              type: 'checkbox',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'enableDropdown',
              type: 'checkbox',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'directLink',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData.enableDirectLink,
          },
          fields: [
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
        },
        {
          name: 'dropdown',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData.enableDropdown,
          },
          fields: [
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'descriptionLinks',
              dbName: 'header_description',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                }),
              ],
            },
            {
              name: 'navItems',
              dbName: 'header_nav_items',
              type: 'array',
              admin: {
                components: {
                  RowLabel: '@/globals/Header/RowLabel#NavItemRowLabel',
                },
              },
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Featured', value: 'featured' },
                    { label: 'List', value: 'list' },
                  ],
                },
                {
                  name: 'defaultLink',
                  type: 'group',
                  admin: {
                    condition: (_, siblingData) => siblingData.style === 'default',
                  },
                  fields: [link({ appearances: false }), { name: 'description', type: 'textarea' }],
                },
                {
                  name: 'featuredLink',
                  type: 'group',
                  admin: {
                    condition: (_, siblingData) => siblingData.style === 'featured',
                  },
                  fields: [
                    { name: 'tag', type: 'text' },
                    { name: 'label', type: 'text' },
                    {
                      name: 'links',
                      dbName: 'header_featured',
                      type: 'array',
                      fields: [link({ appearances: false })],
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
                    { name: 'tag', type: 'text' },
                    {
                      name: 'links',
                      dbName: 'header_list',
                      type: 'array',
                      fields: [link({ appearances: false })],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    link({
      appearances: false,
      overrides: {
        name: 'menuCta',
        label: 'Menu CTA Button',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
