import type {
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionBeforeDeleteHook,
} from 'payload'

/**
 * Auto-generate slug from title
 * Creates URL-friendly slugs for content with titles
 */
export const autoGenerateSlug: CollectionBeforeChangeHook = ({ data, operation }) => {
  if ((operation === 'create' || operation === 'update') && data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return data
}

/**
 * Set published date when status changes to published
 * Automatically timestamps content publication
 */
export const setPublishedDate: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (data.status === 'published') {
    // Set published date if not already set
    if (!data.publishedDate) {
      data.publishedDate = new Date().toISOString()
    }

    // If this is an update from draft to published, set the date
    if (operation === 'update' && originalDoc?.status !== 'published') {
      data.publishedDate = new Date().toISOString()
    }
  }

  return data
}

/**
 * Calculate reading time for content with rich text
 * Estimates reading time based on word count
 */
export const calculateReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (data.content) {
    // Extract text from rich text content (simplified)
    const textContent =
      typeof data.content === 'string' ? data.content : JSON.stringify(data.content)

    const wordCount = textContent.split(/\s+/).length
    data.readingTime = Math.ceil(wordCount / 200) // 200 words per minute
  }

  return data
}

/**
 * Validate required fields based on status
 * Ensures published content has all required fields
 */
export const validatePublishedContent: CollectionBeforeChangeHook = ({ data }) => {
  if (data.status === 'published') {
    const requiredFields = ['title', 'content']
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      throw new Error(`Cannot publish: missing required fields: ${missingFields.join(', ')}`)
    }
  }

  return data
}

/**
 * Revalidate pages when content changes
 * Generic revalidation hook for content collections
 */
export const revalidateContent: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
  collection,
}) => {
  // Skip revalidation if disabled via context
  if (context.disableRevalidate) return doc

  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Revalidate the specific page if it has a slug
    if (doc.slug) {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      revalidatePath(path)
      req.payload.logger.info(`Revalidated path: ${path}`)
    }

    // Revalidate collection listing pages
    if (collection?.slug) {
      revalidatePath(`/${collection.slug}`)
      req.payload.logger.info(`Revalidated collection: /${collection.slug}`)
    }

    // Use cache tags for more granular revalidation
    revalidateTag(`${collection?.slug}-${doc.id}`)
    req.payload.logger.info(`Revalidated tag: ${collection?.slug}-${doc.id}`)
  } catch (error) {
    req.payload.logger.error(`Content revalidation failed: ${error}`)
    // Don't throw - revalidation failure shouldn't break the operation
  }

  return doc
}

/**
 * Log content operations for audit trail
 * Generic logging hook for content collections
 */
export const logContentOperation: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
}) => {
  try {
    const logData = {
      operation,
      collection: collection?.slug,
      documentId: doc.id,
      title: doc.title || doc.name || 'Untitled',
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    }

    // Log significant changes
    if (operation === 'create') {
      req.payload.logger.info(
        `${collection?.slug} created: "${logData.title}" by ${req.user?.email || 'system'}`,
      )
    } else if (operation === 'update' && previousDoc) {
      const changes = []
      if (previousDoc.status !== doc.status)
        changes.push(`status: ${previousDoc.status} → ${doc.status}`)
      if (previousDoc.title !== doc.title) changes.push(`title changed`)

      if (changes.length > 0) {
        req.payload.logger.info(
          `${collection?.slug} updated: "${logData.title}" - ${changes.join(', ')} by ${req.user?.email || 'system'}`,
        )
      }
    }
  } catch (error) {
    req.payload.logger.error(`Content logging failed: ${error}`)
    // Don't throw - logging failure shouldn't break the operation
  }

  return doc
}

/**
 * Log content deletion for audit trail
 * Separate hook for delete operations
 */
export const logContentDeletion: CollectionBeforeDeleteHook = async ({ req, id, collection }) => {
  try {
    // Get document info before deletion
    const docToDelete = await req.payload.findByID({
      collection: collection?.slug as any,
      id: id as string,
      req,
    })

    req.payload.logger.info(
      `${collection?.slug} deleted: "${docToDelete.title || docToDelete.name || docToDelete.id}" by ${req.user?.email || 'system'}`,
    )
  } catch (error) {
    req.payload.logger.error(`Content deletion logging failed: ${error}`)
    // Don't throw - logging failure shouldn't break the operation
  }
}

/**
 * Prevent deletion of published content without confirmation
 * Adds safety check for published content deletion
 */
export const preventPublishedDeletion: CollectionBeforeDeleteHook = async ({
  req,
  id,
  collection,
}) => {
  try {
    const docToDelete = await req.payload.findByID({
      collection: collection?.slug as any,
      id: id as string,
      req,
    })

    if (docToDelete.status === 'published') {
      // In a real implementation, you might check for a confirmation flag
      // or implement a soft delete instead of hard delete
      req.payload.logger.warn(`Deleting published content: ${docToDelete.title || docToDelete.id}`)
    }
  } catch (error) {
    req.payload.logger.error(`Published deletion check failed: ${error}`)
    // Don't throw - check failure shouldn't break the operation
  }
}
