import type { CollectionConfig } from 'payload'
import { collectionTemplates } from '../templates'
import { fields } from './fields'
import { hooks } from './hooks'
import { access } from './access'

export const Users: CollectionConfig = collectionTemplates.createUserCollection({
  slug: 'users',
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
