import type { CollectionAfterChangeHook } from 'payload'

/**
 * Comprehensive revalidation hook for Pages collection
 * Handles special cases like home page and hierarchical page relationships
 */
export const revalidatePage: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) return doc

  try {
    const { revalidatePath } = await import('next/cache')

    // Revalidate current page if published
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      revalidatePath(path)
      req.payload.logger.info(`Revalidated page path: ${path}`)
    }

    // Revalidate old page if unpublished or slug changed
    if (previousDoc?._status === 'published') {
      if (doc._status !== 'published' || doc.slug !== previousDoc.slug) {
        const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
        revalidatePath(oldPath)
        req.payload.logger.info(`Revalidated old page path: ${oldPath}`)
      }
    }

    // If this page has children, revalidate them too (they may show breadcrumbs)
    if (doc.id && (doc._status === 'published' || previousDoc?._status === 'published')) {
      try {
        const childPages = await req.payload.find({
          collection: 'pages',
          where: { parent: { equals: doc.id } },
          req, // Maintain transaction context
        })

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
