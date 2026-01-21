import type { CollectionConfig } from 'payload'
import {
  userCreateAccess,
  userReadAccess,
  userUpdateAccess,
  userDeleteAccess,
} from '@/access/collections/users'

export const access: CollectionConfig['access'] = {
  // Only admins can create users
  create: userCreateAccess,
  // Users can read their own profile, admins can read all
  read: userReadAccess,
  // Users can update their own profile, admins can update all
  update: userUpdateAccess,
  // Only super-admins can delete users
  delete: userDeleteAccess,
}
