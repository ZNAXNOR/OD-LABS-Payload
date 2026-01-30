import type { Validate } from 'payload'

/**
 * Create a validator that detects circular parent references in hierarchical collections
 *
 * This validator prevents scenarios like:
 * - Direct cycle: A → B → A
 * - Indirect cycle: A → B → C → A
 * - Self-reference: A → A
 *
 * The validator uses depth-first search (DFS) with a visited set to detect cycles
 * and includes a max depth limit to prevent DoS attacks.
 *
 * Performance optimizations:
 * - Caches parent chains in req.context to avoid repeated queries
 * - Reuses cached data across multiple field validations in the same request
 *
 * @param collection - The collection slug to validate against (e.g., 'pages')
 * @param maxDepth - Maximum depth to traverse (default: 50) to prevent excessive queries
 * @returns A Payload validation function
 *
 * @example
 * ```typescript
 * {
 *   name: 'parent',
 *   type: 'relationship',
 *   relationTo: 'pages',
 *   validate: createCircularReferenceValidator('pages'),
 * }
 * ```
 */
export const createCircularReferenceValidator = (collection: string, maxDepth = 50): Validate => {
  return async (value, { data, req }) => {
    // No validation needed if no parent is set
    if (!value || !data?.id) {
      return true
    }

    // Prevent self-reference
    if (value === data.id) {
      return 'A page cannot be its own parent'
    }

    // Performance optimization: Check if we've already built the parent chain for this document
    // This avoids repeated queries when validating multiple fields or during bulk operations
    const cacheKey = `parentChain_${collection}_${data.id}`

    // If we don't have the parent chain cached, build it
    if (!req.context[cacheKey]) {
      req.context[cacheKey] = await buildParentChain(value, collection, req, maxDepth)
    }

    const parentChain = req.context[cacheKey] as string[]

    // Check if the current document ID appears in the parent chain (cycle detected)
    if (parentChain.includes(data.id)) {
      return 'Circular parent reference detected. This would create an infinite loop in the page hierarchy.'
    }

    // Check if we hit the max depth limit
    if (parentChain.length >= maxDepth) {
      return `Parent hierarchy too deep (maximum ${maxDepth} levels). This may indicate a circular reference or an excessively deep hierarchy.`
    }

    // No cycle detected
    return true
  }
}

/**
 * Build the complete parent chain for a document
 *
 * This is a utility function that can be used for breadcrumb generation
 * or other features that need the full parent hierarchy.
 *
 * Performance optimizations:
 * - Caches fetched documents in req.context to avoid repeated queries
 * - Reuses cached parent documents across multiple calls
 *
 * @param documentId - The document ID to start from
 * @param collection - The collection slug
 * @param req - The Payload request object
 * @param maxDepth - Maximum depth to traverse
 * @returns Array of parent IDs from root to the document
 */
export async function buildParentChain(
  documentId: string,
  collection: string,
  req: any,
  maxDepth = 50,
): Promise<string[]> {
  const chain: string[] = []
  let currentId = documentId
  let depth = 0

  // Cache for fetched documents to avoid repeated queries
  const docCacheKey = `docCache_${collection}`
  if (!req.context[docCacheKey]) {
    req.context[docCacheKey] = new Map<string, any>()
  }
  const docCache = req.context[docCacheKey]

  while (currentId && depth < maxDepth) {
    try {
      // Check if we've already fetched this document
      let doc = docCache.get(currentId)

      if (!doc) {
        // Fetch the document and cache it
        doc = await req.payload.findByID({
          collection,
          id: currentId,
          depth: 0,
          req, // Maintain transaction context
        })
        docCache.set(currentId, doc)
      }

      if (doc?.parent) {
        chain.unshift(doc.parent) // Add to beginning of array
        currentId = doc.parent
      } else {
        break
      }

      depth++
    } catch (error) {
      req.payload.logger.error(`Error building parent chain: ${error}`)
      break
    }
  }

  return chain
}

/**
 * Check if a document is an ancestor of another document
 *
 * Performance optimizations:
 * - Uses cached parent chain if available
 * - Caches result for reuse
 *
 * @param ancestorId - The potential ancestor document ID
 * @param descendantId - The potential descendant document ID
 * @param collection - The collection slug
 * @param req - The Payload request object
 * @returns True if ancestorId is an ancestor of descendantId
 */
export async function isAncestor(
  ancestorId: string,
  descendantId: string,
  collection: string,
  req: any,
): Promise<boolean> {
  // Check cache first
  const cacheKey = `isAncestor_${collection}_${ancestorId}_${descendantId}`
  if (req.context[cacheKey] !== undefined) {
    return req.context[cacheKey]
  }

  // Build parent chain (will use cache if available)
  const chain = await buildParentChain(descendantId, collection, req)
  const result = chain.includes(ancestorId)

  // Cache the result
  req.context[cacheKey] = result

  return result
}
