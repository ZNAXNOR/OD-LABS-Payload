import type { CollectionAfterChangeHook } from 'payload'

/**
 * Comprehensive revalidation hook for Services collection
 * Revalidates both the specific service page and related pages that may display service content
 *
 * Performance optimizations:
 * - Skips revalidation for draft-only operations
 * - Only revalidates when status, slug, or featured flag actually changes
 * - Only revalidates homepage when featured status changes
 */
export const revalidateService: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
  operation,
}) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) {
    req.payload.logger.info('Revalidation skipped for services (disabled via context)')
    return doc
  }

  // Performance optimization: Skip revalidation for draft-only operations
  if (operation === 'create' && doc._status === 'draft') {
    req.payload.logger.debug('Skipping revalidation for new draft service')
    return doc
  }

  // Performance optimization: Check if anything that affects the frontend actually changed
  const statusChanged = doc._status !== previousDoc?._status
  const slugChanged = doc.slug !== previousDoc?.slug
  const featuredChanged = doc.featured !== previousDoc?.featured
  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published'

  // If nothing relevant changed, skip revalidation
  if (!statusChanged && !slugChanged && !featuredChanged && !isPublished && !wasPublished) {
    req.payload.logger.debug('Skipping revalidation for service - no relevant changes')
    return doc
  }

  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Revalidate current service page if published
    if (isPublished) {
      const path = `/services/${doc.slug}`
      revalidatePath(path)
      req.payload.logger.info(`Revalidated service path: ${path}`)
    }

    // Revalidate old service page if unpublished or slug changed
    if (wasPublished && (!isPublished || slugChanged)) {
      const oldPath = `/services/${previousDoc.slug}`
      revalidatePath(oldPath)
      req.payload.logger.info(`Revalidated old service path: ${oldPath}`)
    }

    // Revalidate collection tag for list pages (only if status changed or was/is published)
    if (statusChanged || isPublished || wasPublished) {
      revalidateTag('services')
      req.payload.logger.info('Revalidated services collection tag')
    }

    // Additional Services-specific logic: Revalidate homepage if featured status changed
    // Only revalidate homepage when featured flag actually changes
    if (featuredChanged && (doc.featured || previousDoc?.featured)) {
      revalidatePath('/')
      req.payload.logger.info('Revalidated homepage for featured service changes')
    }
  } catch (error) {
    req.payload.logger.error(`Service revalidation failed: ${error}`)
    // Don't throw - revalidation failure shouldn't break the operation
  }

  return doc
}
