import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminsAndSelf, isAdmin } from '../../access/adminsAndSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: adminsAndSelf,
    read: adminsAndSelf,
    update: adminsAndSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['public'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Public',
          value: 'public',
        },
      ],
      access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
    },
  ],
  timestamps: true,
}
