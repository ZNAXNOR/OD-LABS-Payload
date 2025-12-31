import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'
import { hasRole } from './adminsAndSelf'

type isAdmin = (args: AccessArgs<User>) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  return hasRole(user, 'admin')
}
