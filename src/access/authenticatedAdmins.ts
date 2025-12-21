import { Access } from 'payload'

export const authenticatedAdmins: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return false
}
