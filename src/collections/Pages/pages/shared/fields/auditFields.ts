import type { Field } from 'payload'

/**
 * Shared audit trail fields that can be added to any collection
 *
 * These fields track who created/updated documents. The timestamps (createdAt/updatedAt)
 * are automatically managed by Payload when `timestamps: true` is set in the collection config.
 *
 * Features:
 * - Read-only in admin UI (cannot be manually edited)
 * - System-only fields (cannot be created or updated via API)
 * - Only visible to authenticated users
 * - Auto-populated by createAuditTrailHook
 *
 * @example
 * ```typescript
 * export const Posts: CollectionConfig = {
 *   slug: 'posts',
 *   timestamps: true, // Enables automatic createdAt/updatedAt
 *   hooks: {
 *     beforeChange: [createAuditTrailHook()],
 *   },
 *   fields: [
 *     // ... your fields
 *     ...auditFields, // Spread the shared audit fields
 *   ],
 * }
 * ```
 */
export const auditFields: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'User who created this document (auto-populated)',
    },
    access: {
      // System-only field - cannot be created by users
      create: () => false,
      // System-only field - cannot be updated by users
      update: () => false,
      // Only authenticated users can see who created content
      read: ({ req: { user } }) => Boolean(user),
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'User who last updated this document (auto-populated)',
    },
    access: {
      // System-only field - cannot be created by users
      create: () => false,
      // System-only field - cannot be updated by users
      update: () => false,
      // Only authenticated users can see who updated content
      read: ({ req: { user } }) => Boolean(user),
    },
  },
]
