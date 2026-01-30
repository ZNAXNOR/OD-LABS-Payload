import type { CollectionBeforeChangeHook } from 'payload'
import { generateBreadcrumbUrls } from '../../../utilities/pageHierarchy'

/**
 * Enhanced breadcrumb population for consolidated Pages collection
 * with improved circular reference prevention and better error handling
 *
 * This hook uses the new pageHierarchy utilities to generate proper URLs
 * based on page hierarchy and pageType routing.
 */
export const populateBreadcrumbs: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  try {
    // Only populate breadcrumbs if there's a parent
    if (!data?.parent) {
      data.breadcrumbs = []
      return data
    }

    // Get current document ID for logging
    const currentId = data.id || originalDoc?.id

    // Validate parent relationship to prevent self-reference
    if (currentId && data.parent === currentId) {
      req.payload.logger.error(
        `Self-reference detected: page ${currentId} cannot be its own parent`,
      )
      throw new Error('A page cannot be its own parent')
    }

    // Use the new breadcrumb generation utility
    const breadcrumbData = await generateBreadcrumbUrls(data.parent, 'pages', req, {
      includeDrafts: true, // Include drafts in admin context
      maxDepth: 20,
      useCache: true,
    })

    // Transform to the expected format for the breadcrumbs field
    const breadcrumbs = breadcrumbData.map((breadcrumb) => ({
      doc: breadcrumb.id,
      url: breadcrumb.url,
      label: breadcrumb.title,
    }))

    // Store breadcrumbs in data
    data.breadcrumbs = breadcrumbs

    // Log successful breadcrumb generation
    if (breadcrumbs.length > 0) {
      req.payload.logger.info(
        `Generated ${breadcrumbs.length} breadcrumbs for page ${currentId || 'new'}: ${breadcrumbs.map((b) => b.label).join(' > ')}`,
      )
    }

    return data
  } catch (error) {
    req.payload.logger.error(`Breadcrumb population failed for page ${data.id || 'new'}: ${error}`)

    // Don't let breadcrumb generation failure prevent the document from being saved
    // Set empty breadcrumbs and continue
    data.breadcrumbs = []

    // Re-throw the error if it's a validation error (circular reference, self-reference)
    if (
      error instanceof Error &&
      (error.message?.includes('circular reference') || error.message?.includes('own parent'))
    ) {
      throw error
    }

    // For other errors, log and continue
    req.payload.logger.warn(`Continuing with empty breadcrumbs due to error: ${error}`)
    return data
  }
}
