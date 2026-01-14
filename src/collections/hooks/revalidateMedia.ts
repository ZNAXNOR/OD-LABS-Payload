import type { CollectionAfterChangeHook } from 'payload'

/**
 * Revalidation hook for Media collection
 * Since media can be used across multiple pages, we use a conservative approach
 * and revalidate the homepage and use cache tags for more granular control
 */
export const revalidateMedia: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) return doc

  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Revalidate homepage as it likely uses media
    revalidatePath('/')
    req.payload.logger.info('Revalidated homepage for media changes')

    // Use cache tags for more granular media revalidation
    // Frontend pages should tag their media usage with media-{id}
    revalidateTag(`media-${doc.id}`)
    req.payload.logger.info(`Revalidated media tag: media-${doc.id}`)
  } catch (error) {
    req.payload.logger.error(`Media revalidation failed: ${error}`)
    // Don't throw - revalidation failure shouldn't break the operation
  }

  return doc
}
