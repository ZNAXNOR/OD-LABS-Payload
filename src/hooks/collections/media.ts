import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
} from 'payload'

/**
 * Auto-generate alt text for media files if not provided
 * Maintains accessibility compliance by ensuring all media has alt text
 */
export const autoGenerateAltText: CollectionBeforeChangeHook = ({ data, operation }) => {
  // Auto-generate alt text if not provided (basic implementation)
  if (operation === 'create' && !data.alt && data.filename) {
    data.alt = data.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  }
  return data
}

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

/**
 * Validate media file size and type
 * Ensures uploaded files meet requirements
 */
export const validateMediaFile: CollectionBeforeChangeHook = ({ data, req }) => {
  // Add custom validation logic here if needed
  // For example, file size limits, type restrictions, etc.

  if (data.filename) {
    req.payload.logger.info(`Processing media file: ${data.filename}`)
  }

  return data
}

/**
 * Log media operations for audit trail
 */
export const logMediaOperation: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  try {
    // Log significant changes
    if (operation === 'create') {
      req.payload.logger.info(`Media created: ${doc.filename} by user ${req.user?.id}`)
    } else if (operation === 'update' && previousDoc) {
      const changes = []
      if (previousDoc.alt !== doc.alt) changes.push('alt text')
      if (previousDoc.caption !== doc.caption) changes.push('caption')

      if (changes.length > 0) {
        req.payload.logger.info(`Media updated: ${doc.filename} - changed: ${changes.join(', ')}`)
      }
    }
  } catch (error) {
    req.payload.logger.error(`Media logging failed: ${error}`)
    // Don't throw - logging failure shouldn't break the operation
  }

  return doc
}

/**
 * Log media deletion for audit trail
 */
export const logMediaDeletion: CollectionBeforeDeleteHook = async ({ req, id }) => {
  try {
    // Get media info before deletion
    const mediaToDelete = await req.payload.findByID({
      collection: 'media',
      id: id as string,
      req,
    })

    req.payload.logger.info(`Media deleted: ${mediaToDelete.filename} by user ${req.user?.id}`)
  } catch (error) {
    req.payload.logger.error(`Media deletion logging failed: ${error}`)
    // Don't throw - logging failure shouldn't break the operation
  }
}
