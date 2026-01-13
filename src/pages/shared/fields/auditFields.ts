import type { Field } from 'payload'

/**
 * Shared audit trail fields that can be added to any collection
 * These fields track who created/updated documents and when
 */
export const auditFields: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      hidden: true,
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      hidden: true,
    },
  },
]
