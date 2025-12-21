import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticatedAdmins } from '../access/authenticatedAdmins'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticatedAdmins,
    delete: authenticatedAdmins,
    read: anyone,
    update: authenticatedAdmins,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
