import type { CollectionAfterChangeHook } from 'payload'

/**
 * Comprehensive revalidation hook for Services collection
 * Revalidates both the specific service page and related pages that may display service content
 */
export const revalidateService: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) return doc

  try {
    const { revalidatePath } = await import('next/cache')

    // Revalidate current service page if published
    if (doc._status === 'published') {
      const path = `/services/${doc.slug}`
      revalidatePath(path)
      req.payload.logger.info(`Revalidated service path: ${path}`)
    }

    // Revalidate old service page if unpublished or slug changed
    if (previousDoc?._status === 'published') {
      if (doc._status !== 'published' || doc.slug !== previousDoc.slug) {
        const oldPath = `/services/${previousDoc.slug}`
        revalidatePath(oldPath)
        req.payload.logger.info(`Revalidated old service path: ${oldPath}`)
      }
    }

    // Revalidate homepage if this is a featured service
    if (doc.featured || previousDoc?.featured) {
      revalidatePath('/')
      req.payload.logger.info('Revalidated homepage for featured service changes')
    }
  } catch (error) {
    req.payload.logger.error(`Service revalidation failed: ${error}`)
    // Don't throw - revalidation failure shouldn't break the operation
  }

  return doc
}
