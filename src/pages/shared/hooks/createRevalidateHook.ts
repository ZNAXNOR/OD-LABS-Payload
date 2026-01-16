import type { CollectionAfterChangeHook } from 'payload'

/**
 * Factory function to create revalidation hooks for different page types
 *
 * This hook handles Next.js cache revalidation for published content, including:
 * - Publishing new content
 * - Unpublishing content
 * - Slug changes
 * - Status changes
 *
 * Performance optimizations:
 * - Skips revalidation for draft-only operations
 * - Only revalidates when status or slug actually changes
 * - Supports context flag to disable revalidation for bulk operations
 *
 * @param pathPrefix - The URL path prefix for this collection (e.g., 'blogs', 'services', 'pages')
 * @returns An afterChange hook that revalidates Next.js cache when needed
 *
 * @example
 * ```typescript
 * export const Blogs: CollectionConfig = {
 *   slug: 'blogs',
 *   hooks: {
 *     afterChange: [createRevalidateHook('blogs')],
 *   },
 * }
 * ```
 */
export const createRevalidateHook = (pathPrefix: string): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req: { payload, context }, operation }) => {
    // Check if revalidation is disabled via context flag
    // This is useful for bulk operations where you want to revalidate once at the end
    if (context.disableRevalidate) {
      payload.logger.info(`Revalidation skipped for ${pathPrefix} (disabled via context)`)
      return doc
    }

    // Performance optimization: Skip revalidation for draft-only operations
    // If creating a draft or updating a draft that was never published, no revalidation needed
    if (operation === 'create' && doc._status === 'draft') {
      payload.logger.debug(`Skipping revalidation for new draft ${pathPrefix}`)
      return doc
    }

    // Performance optimization: Check if anything that affects the frontend actually changed
    const statusChanged = doc._status !== previousDoc?._status
    const slugChanged = doc.slug !== previousDoc?.slug
    const isPublished = doc._status === 'published'
    const wasPublished = previousDoc?._status === 'published'

    // If nothing relevant changed, skip revalidation
    if (!statusChanged && !slugChanged && !isPublished && !wasPublished) {
      payload.logger.debug(`Skipping revalidation for ${pathPrefix} - no relevant changes`)
      return doc
    }

    // Dynamic import to avoid build errors
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Handle published status
    if (isPublished) {
      // Special handling for home page in pages collection
      const path =
        pathPrefix === 'pages' && doc.slug === 'home' ? '/' : `/${pathPrefix}/${doc.slug}`

      try {
        revalidatePath(path)
        payload.logger.info(`Revalidated ${pathPrefix} page at path: ${path}`)
      } catch (error) {
        payload.logger.error(`Failed to revalidate path ${path}: ${error}`)
      }
    }

    // Handle unpublish (when previously published but now not)
    if (wasPublished && !isPublished) {
      const oldPath =
        pathPrefix === 'pages' && previousDoc.slug === 'home'
          ? '/'
          : `/${pathPrefix}/${previousDoc.slug}`

      try {
        revalidatePath(oldPath)
        payload.logger.info(`Revalidated unpublished ${pathPrefix} page at path: ${oldPath}`)
      } catch (error) {
        payload.logger.error(`Failed to revalidate unpublished path ${oldPath}: ${error}`)
      }
    }

    // Handle slug changes (revalidate both old and new paths)
    if (isPublished && slugChanged && previousDoc?.slug) {
      const oldPath =
        pathPrefix === 'pages' && previousDoc.slug === 'home'
          ? '/'
          : `/${pathPrefix}/${previousDoc.slug}`
      const newPath =
        pathPrefix === 'pages' && doc.slug === 'home' ? '/' : `/${pathPrefix}/${doc.slug}`

      try {
        revalidatePath(oldPath)
        revalidatePath(newPath)
        payload.logger.info(
          `Revalidated ${pathPrefix} page slug change from ${oldPath} to ${newPath}`,
        )
      } catch (error) {
        payload.logger.error(`Failed to revalidate slug change: ${error}`)
      }
    }

    // Revalidate collection tag for list pages (only if status changed or was/is published)
    if (statusChanged || isPublished || wasPublished) {
      try {
        revalidateTag(pathPrefix)
        payload.logger.info(`Revalidated ${pathPrefix} collection tag`)
      } catch (error) {
        payload.logger.error(`Failed to revalidate collection tag ${pathPrefix}: ${error}`)
      }
    }

    return doc
  }
}
