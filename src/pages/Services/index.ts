import type { CollectionConfig } from 'payload'

export const ServicesPages: CollectionConfig = {
  slug: 'services',
  typescript: {
    interface: 'ServicePage',
  },
  labels: {
    singular: 'Service Page',
    plural: 'Service Pages',
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
      name: 'content',
      type: 'richText',
    },
  ],
}
