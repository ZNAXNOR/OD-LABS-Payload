import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Enhanced breadcrumb population with improved circular reference prevention
 * and better error handling
 */
export const populateBreadcrumbs: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  try {
    // Only populate breadcrumbs if there's a parent
    if (!data?.parent) {
      data.breadcrumbs = []
      return data
    }

    // Initialize breadcrumbs array
    const breadcrumbs: Array<{
      doc: string | number
      url: string
      label: string
    }> = []

    // Track visited pages to detect circular references
    const visited = new Set<string | number>()

    // Add current document ID to visited set
    const currentId = data.id || originalDoc?.id
    if (currentId) {
      visited.add(currentId)
    }

    // Validate parent relationship to prevent self-reference
    if (currentId && data.parent === currentId) {
      req.payload.logger.error(
        `Self-reference detected: page ${currentId} cannot be its own parent`,
      )
      throw new Error('A page cannot be its own parent')
    }

    // Recursively fetch parent pages
    let currentParentId = data.parent
    const maxDepth = 20 // Increased safety limit for deeper hierarchies
    let depth = 0

    while (currentParentId && depth < maxDepth) {
      // Check for circular reference
      if (visited.has(currentParentId)) {
        req.payload.logger.error(
          `Circular reference detected in page hierarchy for page ${currentId || 'new'} at depth ${depth}`,
        )
        throw new Error(
          'This parent selection would create a circular reference in the page hierarchy',
        )
      }

      visited.add(currentParentId)

      try {
        // Fetch the parent page with minimal data
        const parentPage = await req.payload.findByID({
          collection: 'pages',
          id: currentParentId,
          depth: 0, // Don't populate nested relationships for performance
          select: {
            id: true,
            title: true,
            slug: true,
            parent: true,
            _status: true,
          },
          req, // Pass req for transaction safety
        })

        // Validate parent page exists and is accessible
        if (!parentPage) {
          req.payload.logger.warn(`Parent page ${currentParentId} not found or not accessible`)
          break
        }

        // Generate URL for breadcrumb
        let url = ''
        if (parentPage.slug) {
          // Handle special case for home page
          url = parentPage.slug === 'home' ? '/' : `/${parentPage.slug}`
        }

        // Add parent to breadcrumbs (prepend to maintain order from root to immediate parent)
        breadcrumbs.unshift({
          doc: parentPage.id,
          url,
          label: (parentPage.title as string) || `Page ${parentPage.id}`,
        })

        // Move to next parent
        currentParentId = parentPage.parent
        depth++

        // Log progress for debugging deep hierarchies
        if (depth > 10) {
          req.payload.logger.info(
            `Deep page hierarchy detected: ${depth} levels for page ${currentId || 'new'}`,
          )
        }
      } catch (error) {
        req.payload.logger.error(`Failed to fetch parent page ${currentParentId}: ${error}`)

        // If it's an access control error, we might want to continue
        // If it's a not found error, we should break
        if (
          error instanceof Error &&
          (error.message?.includes('not found') || (error as any).status === 404)
        ) {
          req.payload.logger.warn(
            `Parent page ${currentParentId} not found, stopping breadcrumb generation`,
          )
          break
        }

        // For other errors, we might want to continue with partial breadcrumbs
        req.payload.logger.warn(
          `Continuing breadcrumb generation despite error for parent ${currentParentId}`,
        )
        break
      }
    }

    // Warn if we hit the depth limit
    if (depth >= maxDepth) {
      req.payload.logger.warn(
        `Maximum breadcrumb depth (${maxDepth}) reached for page ${currentId || 'new'}. Hierarchy may be too deep.`,
      )
    }

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
