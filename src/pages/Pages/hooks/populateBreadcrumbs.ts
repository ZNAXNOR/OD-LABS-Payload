import type { CollectionBeforeChangeHook } from 'payload'

export const populateBreadcrumbs: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
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
  visited.add(data.id || 'new')

  // Recursively fetch parent pages
  let currentParentId = data.parent
  const maxDepth = 10 // Safety limit to prevent infinite loops

  for (let depth = 0; depth < maxDepth && currentParentId; depth++) {
    // Check for circular reference
    if (visited.has(currentParentId)) {
      req.payload.logger.error(
        `Circular reference detected in page hierarchy for page ${data.id || 'new'}`,
      )
      throw new Error('This would create a circular reference')
    }

    visited.add(currentParentId)

    try {
      // Fetch the parent page
      const parentPage = await req.payload.findByID({
        collection: 'pages',
        id: currentParentId,
        depth: 0, // Don't populate nested relationships
        req, // Pass req for transaction safety
      })

      // Add parent to breadcrumbs (prepend to maintain order from root to immediate parent)
      breadcrumbs.unshift({
        doc: parentPage.id,
        url: parentPage.slug || '',
        label: parentPage.title || '',
      })

      // Move to next parent
      currentParentId = parentPage.parent
    } catch (error) {
      req.payload.logger.error(`Failed to fetch parent page ${currentParentId}: ${error}`)
      break
    }
  }

  // Store breadcrumbs in data
  data.breadcrumbs = breadcrumbs

  return data
}
