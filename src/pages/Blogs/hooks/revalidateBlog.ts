import type { CollectionAfterChangeHook } from 'payload'

/**
 * Comprehensive revalidation hook for Blogs collection
 * Revalidates both the specific blog page and related pages that may display blog content
 */
export const revalidateBlog: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) return doc

  try {
    const { revalidatePath } = await import('next/cache')

    // Revalidate current blog page if published
    if (doc._status === 'published') {
      const path = `/blogs/${doc.slug}`
      revalidatePath(path)
      req.payload.logger.info(`Revalidated blog path: ${path}`)
    }

    // Revalidate old blog page if unpublished or slug changed
    if (previousDoc?._status === 'published') {
      if (doc._status !== 'published' || doc.slug !== previousDoc.slug) {
        const oldPath = `/blogs/${previousDoc.slug}`
        revalidatePath(oldPath)
        req.payload.logger.info(`Revalidated old blog path: ${oldPath}`)
      }
    }

    // Revalidate homepage as it may display recent blog posts
    revalidatePath('/')
    req.payload.logger.info('Revalidated homepage for blog changes')
  } catch (error) {
    req.payload.logger.error(`Blog revalidation failed: ${error}`)
    // Don't throw - revalidation failure shouldn't break the operation
  }

  return doc
}
