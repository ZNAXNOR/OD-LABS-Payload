import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Factory function to create an audit trail hook that auto-populates createdBy and updatedBy fields
 *
 * This hook respects Payload's built-in timestamps feature (createdAt/updatedAt)
 * and only manages the user relationship fields (createdBy/updatedBy).
 *
 * @returns A beforeChange hook that populates audit fields based on operation type
 *
 * @example
 * ```typescript
 * export const Posts: CollectionConfig = {
 *   slug: 'posts',
 *   timestamps: true, // Use Payload's built-in timestamps
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
export const createAuditTrailHook = (): CollectionBeforeChangeHook => {
  return ({ data, req, operation }) => {
    const user = req.user

    // Set createdBy on document creation
    if (operation === 'create' && user) {
      data.createdBy = user.id
      req.payload.logger.info(`Audit trail: Set createdBy to ${user.id}`)
    }

    // Set updatedBy on document update
    if (operation === 'update' && user) {
      data.updatedBy = user.id
      req.payload.logger.info(`Audit trail: Set updatedBy to ${user.id}`)
    }

    // Note: createdAt and updatedAt are automatically managed by Payload
    // when timestamps: true is set in the collection config

    return data
  }
}
