import type { CollectionAfterChangeHook, CollectionBeforeDeleteHook } from 'payload'

/**
 * Creates a revalidation hook for Next.js cache invalidation
 * This hook ensures proper Next.js ISR cache invalidation when content changes
 *
 * @param getPath - Function to extract the path from a document
 * @returns CollectionAfterChangeHook that handles revalidation
 */
export const createRevalidationHook = (
  getPath: (doc: any) => string,
): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req, context }) => {
    // Skip revalidation if disabled via context
    if (context.disableRevalidate) return doc

    try {
      const { revalidatePath } = await import('next/cache')

      // Revalidate current path if published
      if (doc._status === 'published') {
        const path = getPath(doc)
        revalidatePath(path)
        req.payload.logger.info(`Revalidated path: ${path}`)
      }

      // Revalidate old path if unpublished or slug changed
      if (previousDoc?._status === 'published') {
        if (doc._status !== 'published' || doc.slug !== previousDoc.slug) {
          const oldPath = getPath(previousDoc)
          revalidatePath(oldPath)
          req.payload.logger.info(`Revalidated old path: ${oldPath}`)
        }
      }
    } catch (error) {
      req.payload.logger.error(`Revalidation failed: ${error}`)
      // Don't throw - revalidation failure shouldn't break the operation
    }

    return doc
  }
}

/**
 * Creates a cascading delete hook for cleaning up related data
 * This hook ensures related documents are deleted in the same transaction
 *
 * @param relatedCollection - The collection containing related documents
 * @param relationField - The field in the related collection that references this document
 * @returns CollectionBeforeDeleteHook that handles cascading deletes
 */
export const createCascadingDeleteHook = (
  relatedCollection: string,
  relationField: string,
): CollectionBeforeDeleteHook => {
  return async ({ req, id }) => {
    try {
      // Find and delete related documents
      const relatedDocs = await req.payload.find({
        collection: relatedCollection as any, // Type assertion for collection slug
        where: { [relationField]: { equals: id } },
        req, // Maintain transaction context
      })

      // Delete related documents in the same transaction
      for (const relatedDoc of relatedDocs.docs) {
        await req.payload.delete({
          collection: relatedCollection as any, // Type assertion for collection slug
          id: relatedDoc.id,
          req, // Critical: maintain transaction context
        })
      }

      req.payload.logger.info(
        `Deleted ${relatedDocs.docs.length} related ${relatedCollection} documents`,
      )
    } catch (error) {
      req.payload.logger.error(`Cascading delete failed: ${error}`)
      throw error // Re-throw to rollback transaction
    }
  }
}

/**
 * Creates a hook that updates related documents when a parent document changes
 * This hook ensures all operations happen in the same transaction
 *
 * @param relatedCollection - The collection containing related documents
 * @param relationField - The field in the related collection that references this document
 * @param updateData - Function to generate update data based on the parent document
 * @returns CollectionAfterChangeHook that handles related updates
 */
export const createRelatedUpdateHook = (
  relatedCollection: string,
  relationField: string,
  updateData: (doc: any) => any,
): CollectionAfterChangeHook => {
  return async ({ doc, req, context }) => {
    // Skip if disabled via context to prevent infinite loops
    if (context.skipRelatedUpdates) return doc

    try {
      // Find related documents
      const relatedDocs = await req.payload.find({
        collection: relatedCollection as any, // Type assertion for collection slug
        where: { [relationField]: { equals: doc.id } },
        req, // Maintain transaction context
      })

      // Update each related document
      for (const relatedDoc of relatedDocs.docs) {
        await req.payload.update({
          collection: relatedCollection as any, // Type assertion for collection slug
          id: relatedDoc.id,
          data: updateData(doc),
          context: { skipRelatedUpdates: true }, // Prevent infinite loops
          req, // Critical: maintain transaction context
        })
      }

      req.payload.logger.info(
        `Updated ${relatedDocs.docs.length} related ${relatedCollection} documents`,
      )
    } catch (error) {
      req.payload.logger.error(`Related update failed: ${error}`)
      throw error // Re-throw to rollback transaction
    }

    return doc
  }
}

/**
 * Creates a hook that tracks audit trail for document changes
 * This hook ensures audit records are created in the same transaction
 *
 * @param auditCollection - The collection to store audit records (defaults to 'audit-trail')
 * @returns CollectionAfterChangeHook that creates audit records
 */
export const createAuditTrailHook = (
  auditCollection: string = 'audit-trail',
): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req, operation, collection }) => {
    try {
      const auditData = {
        collection: collection.slug,
        documentId: doc.id,
        operation,
        userId: req.user?.id,
        timestamp: new Date(),
        changes: operation === 'update' ? getChanges(previousDoc, doc) : undefined,
        document: doc,
      }

      await req.payload.create({
        collection: auditCollection as any, // Type assertion for collection slug
        data: auditData,
        req, // Maintain transaction context
      })

      req.payload.logger.info(`Created audit trail record for ${collection.slug}:${doc.id}`)
    } catch (error) {
      req.payload.logger.error(`Audit trail creation failed: ${error}`)
      // Don't throw - audit failure shouldn't break the main operation
    }

    return doc
  }
}

/**
 * Helper function to calculate changes between two documents
 * Used by the audit trail hook to track what changed
 */
function getChanges(previousDoc: any, currentDoc: any): Record<string, any> {
  const changes: Record<string, any> = {}

  if (!previousDoc) return changes

  for (const key in currentDoc) {
    if (currentDoc[key] !== previousDoc[key]) {
      changes[key] = {
        from: previousDoc[key],
        to: currentDoc[key],
      }
    }
  }

  return changes
}

/**
 * Creates a hook that validates business rules before saving
 * This hook ensures validation happens within the transaction context
 *
 * @param validator - Function that validates the document and throws if invalid
 * @returns CollectionBeforeChangeHook that validates business rules
 */
export const createBusinessRuleValidationHook = (
  validator: (doc: any, req: any) => Promise<void> | void,
): CollectionAfterChangeHook => {
  return async ({ data, req, operation }) => {
    try {
      await validator(data, req)
    } catch (error) {
      req.payload.logger.error(`Business rule validation failed: ${error}`)
      throw error // Re-throw to rollback transaction
    }

    return data
  }
}
