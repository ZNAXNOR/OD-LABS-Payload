import type { CollectionBeforeChangeHook } from 'payload'

export const auditTrail: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  const now = new Date()
  const user = req.user

  if (operation === 'create') {
    data.createdBy = user?.id
    data.createdAt = now
  }

  if (operation === 'update') {
    data.updatedBy = user?.id
    data.updatedAt = now
  }

  return data
}
