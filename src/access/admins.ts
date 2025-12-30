import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

export const admins = ({ req: { user } }: AccessArgs<User>): boolean => {
  return user?.roles?.includes('admin') || false
}
