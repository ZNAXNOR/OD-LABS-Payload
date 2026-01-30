import type { CollectionAfterChangeHook } from 'payload'

/**
 * Enhanced revalidation hook for Pages collection
 * Uses optimized revalidation logic and adds child page revalidation
 *
 * Performance optimizations:
 * - Skips revalidation for draft-only operations
 * - Only revalidates when status or slug actually changes
 * - Only queries child pages when necessary
 */
export const revalidatePage: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
  operation,
}) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) {
    req.payload.logger.info('Revalidation skipped for pages (disabled via context)')
    return doc
  }

  // Performance optimization: Skip revalidation for draft-only operations
  if (operation === 'create' && doc._status === 'draft') {
    req.payload.logger.debug('Skipping revalidation for new draft page')
    return doc
  }

  // Performance optimization: Check if anything that affects the frontend actually changed
  const statusChanged = doc._status !== previousDoc?._status
  const slugChanged = doc.slug !== previousDoc?.slug
  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published'

  // If nothing relevant changed, skip revalidation
  if (!statusChanged && !slugChanged && !isPublished && !wasPublished) {
    req.payload.logger.debug('Skipping revalidation for page - no relevant changes')
    return doc
  }

  // Dynamic import to avoid build errors
  const { revalidatePath } = await import('next/cache')

  try {
    // Revalidate current page if published
    if (isPublished) {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      revalidatePath(path)
      req.payload.logger.info(`Revalidated page path: ${path}`)
    }

    // Revalidate old page if unpublished or slug changed
    if (wasPublished && (!isPublished || slugChanged)) {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
      revalidatePath(oldPath)
      req.payload.logger.info(`Revalidated old page path: ${oldPath}`)
    }

    // Additional Pages-specific logic: Revalidate child pages
    // This is necessary because child pages may display breadcrumbs that reference this page
    // Only do this if the page is or was published (affects frontend)
    if (doc.id && (isPublished || wasPublished)) {
      try {
        const childPages = await req.payload.find({
          collection: 'pages',
          where: { parent: { equals: doc.id } },
          req, // Maintain transaction context
        })

        // Only revalidate published child pages
        for (const childPage of childPages.docs) {
          if (childPage._status === 'published') {
            const childPath = childPage.slug === 'home' ? '/' : `/${childPage.slug}`
            revalidatePath(childPath)
            req.payload.logger.info(`Revalidated child page path: ${childPath}`)
          }
        }
      } catch (error) {
        req.payload.logger.error(`Failed to revalidate child pages: ${error}`)
        // Don't throw - child revalidation failure shouldn't break the operation
      }
    }
  } catch (error) {
    req.payload.logger.error(`Page revalidation failed: ${error}`)
    // Don't throw - revalidation failure shouldn't break the operation
  }

  return doc
}
