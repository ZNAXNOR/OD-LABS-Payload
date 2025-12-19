import type { FieldHook } from 'payload'

export const populatePublishedAt: FieldHook = ({ siblingData, value }) => {
  if (siblingData._status === 'published' && !value) {
    return new Date()
  }
  return value
}
