import type { CollectionBeforeChangeHook } from 'payload'
import { buildPageHierarchyPath } from '../../../utilities/pageHierarchy'

/**
 * Hook to generate and store the full URL for a page based on its hierarchy and pageType
 *
 * This hook adds a computed 'url' field to each page that represents the full URL
 * that should be used for frontend routing. The URL takes into account:
 * - Page hierarchy (parent-child relationships)
 * - Page type routing (blog, services, legal, contact)
 * - Special cases (home page)
 */
export const generatePageUrl: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  try {
    // Skip URL generation for drafts in some cases to improve performance
    // URLs will be generated when the page is published
    const isDraft = data._status === 'draft'
    const wasPublished = originalDoc?._status === 'published'

    // Always generate URL for published pages or when transitioning from draft to published
    const shouldGenerateUrl = !isDraft || wasPublished || data._status === 'published'

    if (!shouldGenerateUrl) {
      // For drafts, we might still want to generate a preview URL
      // but we'll skip it for performance unless specifically needed
      return data
    }

    // Get the current document ID
    const currentId = data.id || originalDoc?.id

    if (!currentId) {
      // For new documents, we can't generate a full hierarchical URL yet
      // The URL will be generated after the document is created
      return data
    }

    // Generate the full hierarchical URL
    const url = await buildPageHierarchyPath(currentId, 'pages', req, {
      includeDrafts: true, // Include drafts for admin context
      maxDepth: 20,
      useCache: true,
    })

    // Store the generated URL
    data.url = url

    req.payload.logger.info(
      `Generated URL "${url}" for page ${currentId} (${data.title || 'untitled'})`,
    )

    return data
  } catch (error) {
    req.payload.logger.error(`URL generation failed for page ${data.id || 'new'}: ${error}`)

    // Don't let URL generation failure prevent the document from being saved
    // The URL can be regenerated later
    req.payload.logger.warn('Continuing without URL generation due to error')
    return data
  }
}

/**
 * After change hook to regenerate URLs for child pages when a parent page changes
 *
 * This hook ensures that when a page's slug or pageType changes, all child pages
 * have their URLs updated to reflect the new hierarchy.
 */
export const regenerateChildUrls: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
  operation,
}) => {
  try {
    // Only regenerate child URLs if this is an update and certain fields changed
    if (operation !== 'update' || !originalDoc) {
      return data
    }

    const currentId = data.id || originalDoc.id
    if (!currentId) {
      return data
    }

    // Check if fields that affect URL generation have changed
    const slugChanged = data.slug !== originalDoc.slug
    const pageTypeChanged = data.pageType !== originalDoc.pageType
    const parentChanged = data.parent !== originalDoc.parent

    if (!slugChanged && !pageTypeChanged && !parentChanged) {
      // No changes that would affect child URLs
      return data
    }

    req.payload.logger.info(
      `Page ${currentId} hierarchy-affecting fields changed, scheduling child URL regeneration`,
    )

    // Schedule child URL regeneration in the background
    // We use setImmediate to avoid blocking the current operation
    setImmediate(async () => {
      try {
        await regenerateChildUrlsRecursive(currentId, req)
      } catch (error) {
        req.payload.logger.error(`Failed to regenerate child URLs for page ${currentId}: ${error}`)
      }
    })

    return data
  } catch (error) {
    req.payload.logger.error(
      `Child URL regeneration scheduling failed for page ${data.id || 'new'}: ${error}`,
    )
    return data
  }
}

/**
 * Recursively regenerate URLs for all child pages
 */
async function regenerateChildUrlsRecursive(
  parentId: string | number,
  req: any,
  depth = 0,
  maxDepth = 10,
): Promise<void> {
  if (depth >= maxDepth) {
    req.payload.logger.warn(
      `Maximum depth ${maxDepth} reached while regenerating child URLs for parent ${parentId}`,
    )
    return
  }

  try {
    // Find all direct children of this page
    const children = await req.payload.find({
      collection: 'pages',
      where: {
        parent: { equals: parentId },
      },
      depth: 0,
      req,
    })

    // Update each child's URL
    for (const child of children.docs) {
      try {
        // Generate new URL for the child
        const newUrl = await buildPageHierarchyPath(child.id, 'pages', req, {
          includeDrafts: true,
          maxDepth: 20,
          useCache: false, // Don't use cache during regeneration
        })

        // Update the child page with the new URL
        await req.payload.update({
          collection: 'pages',
          id: child.id,
          data: {
            url: newUrl,
          },
          req,
          // Use context to prevent infinite recursion
          context: {
            skipUrlGeneration: true,
            skipChildUrlRegeneration: true,
          },
        })

        req.payload.logger.info(`Regenerated URL for child page ${child.id}: ${newUrl}`)

        // Recursively update grandchildren
        await regenerateChildUrlsRecursive(child.id, req, depth + 1, maxDepth)
      } catch (error) {
        req.payload.logger.error(`Failed to regenerate URL for child page ${child.id}: ${error}`)
      }
    }
  } catch (error) {
    req.payload.logger.error(`Failed to find children for parent ${parentId}: ${error}`)
  }
}
