import type { CollectionConfig } from 'payload'
import { updateLastLogin, resetLoginAttempts } from '@/hooks/collections/users'

export const hooks: CollectionConfig['hooks'] = {
  beforeLogin: [updateLastLogin, resetLoginAttempts],
}
