import type { CollectionConfig } from 'payload'
import { collectionTemplates } from '../templates'
import { access } from './access'
import { fields } from './fields'
import { hooks } from './hooks'

export const Users: CollectionConfig = collectionTemplates.createUserCollection({
  slug: 'users',
  dbName: 'users', // Explicit database naming for consistency and predictability
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  fields,
  access,
  hooks,
  admin: {
    description: 'Manage user accounts and permissions',
  },
})
