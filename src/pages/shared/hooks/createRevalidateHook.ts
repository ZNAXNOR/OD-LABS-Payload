import type { CollectionAfterChangeHook } from 'payload'

/**
 * Factory function to create revalidation hooks for different page types
 * @param pathPrefix - The URL path prefix for this collection (e.g., 'blog', 'services')
 */
export const createRevalidateHook = (pathPrefix: string): CollectionAfterChangeHook => {
  return ({ doc, previousDoc, req: { payload, context } }) => {
    // Check if revalidation is disabled via context flag
    if (context.disableRevalidate) {
      return doc
    }

    // Handle published status changes
    if (doc._status === 'published') {
      // Determine the path to revalidate
      const path = `/${pathPrefix}/${doc.slug}`

      payload.logger.info(`${pathPrefix} page published at path: ${path}`)

      // In a production environment, you might want to trigger revalidation
      // via an API route or webhook instead of directly calling revalidatePath
      // For now, we'll just log the action
    }

    // Handle unpublish (when previously published but now not)
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${pathPrefix}/${previousDoc.slug}`

      payload.logger.info(`${pathPrefix} page unpublished at path: ${oldPath}`)
    }

    // Handle slug changes (revalidate both old and new paths)
    if (previousDoc?.slug && doc.slug !== previousDoc.slug && previousDoc._status === 'published') {
      const oldPath = `/${pathPrefix}/${previousDoc.slug}`
      const newPath = `/${pathPrefix}/${doc.slug}`

      payload.logger.info(`${pathPrefix} page slug changed from ${oldPath} to ${newPath}`)
    }

    return doc
  }
}
