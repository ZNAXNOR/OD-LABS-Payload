import type { CollectionConfig } from 'payload'
import {
  mediaReadAccess,
  mediaCreateAccess,
  mediaUpdateAccess,
  mediaDeleteAccess,
} from '@/access/collections/media'

export const access: CollectionConfig['access'] = {
  create: mediaCreateAccess,
  delete: mediaDeleteAccess,
  read: mediaReadAccess, // Public read access for media
  update: mediaUpdateAccess,
}
