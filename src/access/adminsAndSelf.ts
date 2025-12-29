import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type hasRole = (user: User, role: User['roles'][number]) => boolean

export const hasRole: hasRole = (user, role) => {
  return Boolean(user?.roles?.includes(role))
}

type isAdmin = (args: AccessArgs<User>) => boolean

export const isAdmin: isAdmin = ({ req: { user } }) => {
  return hasRole(user, 'admin')
}

type adminsAndSelf = (args: AccessArgs<User>) => boolean

export const adminsAndSelf: adminsAndSelf = args => {
  const {
    req: { user },
  } = args

  if (user) {
    if (hasRole(user, 'admin')) {
      return true
    }

    if (user?.id) {
      return {
        id: {
          equals: user.id,
        },
      }
    }
  }

  return false
}
