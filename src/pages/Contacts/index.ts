import type { CollectionConfig } from 'payload'

export const ContactPages: CollectionConfig = {
  slug: 'contacts',
  typescript: {
    interface: 'ContactPage',
  },
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Pages',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
        {
          label: 'Contact Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'purpose',
                  type: 'select',
                  options: [
                    { label: 'General Inquiry', value: 'general' },
                    { label: 'Technical Support', value: 'technical' },
                    { label: 'Bug Report', value: 'bug' },
                    { label: 'Feature Request', value: 'feature' },
                    { label: 'Feedback', value: 'feedback' },
                    { label: 'Sales Inquiry', value: 'sales' },
                    { label: 'Partnership/Collaboration', value: 'partnership' },
                    { label: 'Media/Press', value: 'media' },
                    { label: 'Careers', value: 'careers' },
                    { label: 'Custom', value: 'custom' },
                  ],
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'form',
                  type: 'relationship',
                  relationTo: 'forms',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'displayContactInfo',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'showFormAboveContent',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'contactInfoSections',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'General Info', value: 'general' },
                { label: 'Office Locations', value: 'offices' },
                { label: 'Social Media', value: 'social' },
                { label: 'Business Hours', value: 'hours' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.displayContactInfo,
              },
            },
          ],
        },
        {
          label: 'Sidebar',
          fields: [
            {
              name: 'sidebar',
              type: 'group',
              fields: [
                {
                  name: 'enableSidebar',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'content',
                  type: 'richText',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enableSidebar,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
