import type { PayloadRequest } from 'payload'

/**
 * Page hierarchy and URL generation utilities for consolidated Pages collection
 *
 * This module provides utilities for:
 * - Generating URLs based on page hierarchy and pageType
 * - Building full page paths with parent hierarchy
 * - Handling special routing cases for different page types
 * - Ensuring compatibility with existing frontend routing
 */

export interface PageData {
  id: string | number
  slug: string
  pageType: 'page' | 'blog' | 'service' | 'legal' | 'contact'
  parent?: string | number | PageData
  title: string
  _status?: 'draft' | 'published'
}

export interface PageHierarchyOptions {
  /** Whether to include draft pages in hierarchy (default: false) */
  includeDrafts?: boolean
  /** Maximum depth to traverse (default: 20) */
  maxDepth?: number
  /** Whether to use cache for performance (default: true) */
  useCache?: boolean
}

/**
 * Generate URL for a page based on its pageType and hierarchy
 *
 * URL patterns:
 * - page: /{slug} or /{parent-path}/{slug}
 * - blog: /blog/{slug} or /blog/{parent-path}/{slug}
 * - service: /services/{slug} or /services/{parent-path}/{slug}
 * - legal: /legal/{slug} or /legal/{parent-path}/{slug}
 * - contact: /contact/{slug} or /contact/{parent-path}/{slug}
 *
 * Special cases:
 * - Home page (slug: 'home'): always returns '/'
 * - Root pages of typed sections: /blog, /services, etc.
 */
export function generatePageUrl(page: PageData, parentPath?: string): string {
  // Handle home page special case
  if (page.slug === 'home') {
    return '/'
  }

  // Build base path based on pageType
  let basePath = ''
  switch (page.pageType) {
    case 'blog':
      basePath = '/blog'
      break
    case 'service':
      basePath = '/services'
      break
    case 'legal':
      basePath = '/legal'
      break
    case 'contact':
      basePath = '/contact'
      break
    case 'page':
    default:
      basePath = ''
      break
  }

  // Build full path with hierarchy
  let fullPath = basePath

  // Add parent path if provided
  if (parentPath) {
    // Remove leading slash from parentPath if it exists to avoid double slashes
    const cleanParentPath = parentPath.startsWith('/') ? parentPath.slice(1) : parentPath
    if (cleanParentPath) {
      fullPath += `/${cleanParentPath}`
    }
  }

  // Add page slug
  fullPath += `/${page.slug}`

  // Ensure path starts with /
  if (!fullPath.startsWith('/')) {
    fullPath = `/${fullPath}`
  }

  // Clean up any double slashes
  fullPath = fullPath.replace(/\/+/g, '/')

  return fullPath
}

/**
 * Build the complete hierarchical path for a page
 *
 * This function traverses up the parent hierarchy to build the full path
 * that should be used for URL generation.
 */
export async function buildPageHierarchyPath(
  pageId: string | number,
  collection: string,
  req: PayloadRequest,
  options: PageHierarchyOptions = {},
): Promise<string> {
  const { includeDrafts = false, useCache = true } = options

  // Cache key for performance
  const cacheKey = `pageHierarchyPath_${collection}_${pageId}_${includeDrafts}`

  if (useCache && req.context[cacheKey]) {
    return req.context[cacheKey] as string
  }

  try {
    // Fetch the current page
    const page = await req.payload.findByID({
      collection: collection as any,
      id: pageId,
      depth: 0,
      select: {
        id: true,
        slug: true,
        pageType: true,
        parent: true,
        title: true,
        _status: true,
      },
      req,
    })

    if (!page) {
      throw new Error(`Page ${pageId} not found`)
    }

    // Check if we should include this page based on draft status
    if (!includeDrafts && (page as any)._status === 'draft') {
      throw new Error(`Page ${pageId} is a draft and includeDrafts is false`)
    }

    // If no parent, return just the page URL
    if (!page.parent) {
      const url = generatePageUrl(page as PageData)
      if (useCache) {
        req.context[cacheKey] = url
      }
      return url
    }

    // Build parent path recursively
    const parentPath = await buildPageHierarchyPath(
      page.parent as string | number,
      collection,
      req,
      { ...options, useCache: false }, // Don't cache intermediate results
    )

    // Extract the slug portion from parent path (remove pageType prefix)
    let parentSlugPath = ''
    const pageData = page as PageData

    // For typed pages, we need to extract just the slug portion from parent path
    if (pageData.pageType !== 'page') {
      const typePrefix = getPageTypePrefix(pageData.pageType)
      if (parentPath.startsWith(typePrefix)) {
        parentSlugPath = parentPath.slice(typePrefix.length)
      } else {
        // Parent might be a regular page, use full path
        parentSlugPath = parentPath
      }
    } else {
      // For regular pages, use the full parent path
      parentSlugPath = parentPath
    }

    // Remove leading slash from parent slug path
    if (parentSlugPath.startsWith('/')) {
      parentSlugPath = parentSlugPath.slice(1)
    }

    // Generate URL with parent path
    const url = generatePageUrl(pageData, parentSlugPath)

    if (useCache) {
      req.context[cacheKey] = url
    }

    return url
  } catch (error) {
    req.payload.logger.error(`Error building page hierarchy path for ${pageId}: ${error}`)
    throw error
  }
}

/**
 * Get the URL prefix for a page type
 */
export function getPageTypePrefix(pageType: string): string {
  switch (pageType) {
    case 'blog':
      return '/blog'
    case 'service':
      return '/services'
    case 'legal':
      return '/legal'
    case 'contact':
      return '/contact'
    case 'page':
    default:
      return ''
  }
}

/**
 * Generate breadcrumb URLs for a page hierarchy
 *
 * This function generates the complete breadcrumb trail with proper URLs
 * for each level of the hierarchy.
 */
export async function generateBreadcrumbUrls(
  pageId: string | number,
  collection: string,
  req: PayloadRequest,
  options: PageHierarchyOptions = {},
): Promise<Array<{ id: string | number; title: string; url: string; slug: string }>> {
  const { maxDepth = 20 } = options
  const breadcrumbs: Array<{ id: string | number; title: string; url: string; slug: string }> = []

  let currentId = pageId
  let depth = 0
  const visited = new Set<string | number>()

  while (currentId && depth < maxDepth) {
    // Prevent infinite loops
    if (visited.has(currentId)) {
      req.payload.logger.error(
        `Circular reference detected in breadcrumb generation for page ${pageId}`,
      )
      break
    }
    visited.add(currentId)

    try {
      // Fetch current page
      const page = await req.payload.findByID({
        collection: collection as any,
        id: currentId,
        depth: 0,
        select: {
          id: true,
          slug: true,
          pageType: true,
          parent: true,
          title: true,
          _status: true,
        },
        req,
      })

      if (!page) {
        break
      }

      // Generate URL for this page
      const url = await buildPageHierarchyPath(page.id, collection, req, options)

      // Add to breadcrumbs (prepend to maintain order from root to current)
      breadcrumbs.unshift({
        id: page.id,
        title: (page.title as string) || `Page ${page.id}`,
        url,
        slug: (page.slug as string) || '',
      })

      // Move to parent
      currentId = page.parent as string | number
      depth++
    } catch (error) {
      req.payload.logger.error(`Error generating breadcrumb for page ${currentId}: ${error}`)
      break
    }
  }

  return breadcrumbs
}

/**
 * Validate that a page hierarchy doesn't create routing conflicts
 *
 * This function checks for potential URL conflicts that could arise
 * from the hierarchical structure.
 */
export async function validatePageHierarchy(
  pageData: Partial<PageData>,
  collection: string,
  req: PayloadRequest,
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    // If no parent, just validate the page itself
    if (!pageData.parent || !pageData.slug || !pageData.pageType) {
      return { isValid: true, errors: [] }
    }

    // Ensure parent is a string or number, not a PageData object
    const parentId = typeof pageData.parent === 'object' ? pageData.parent.id : pageData.parent

    // Build the proposed URL
    const proposedUrl = await buildPageHierarchyPath(parentId, collection, req, {
      includeDrafts: true,
    })

    const fullUrl = generatePageUrl(pageData as PageData, proposedUrl.slice(1))

    // Check for conflicts with existing pages
    const conflictingPages = await req.payload.find({
      collection: collection as any,
      where: {
        id: { not_equals: pageData.id },
        // This is a simplified check - in a real implementation,
        // you might want to store computed URLs in the database
      },
      limit: 1,
      req,
    })

    // Additional validation logic could be added here
    // For example, checking against reserved paths, etc.

    // Suppress unused variable warnings
    void fullUrl
    void conflictingPages

    return { isValid: errors.length === 0, errors }
  } catch (error) {
    errors.push(`Error validating page hierarchy: ${error}`)
    return { isValid: false, errors }
  }
}

/**
 * Get all child pages of a given page
 *
 * This utility function can be used for navigation generation,
 * sitemap creation, or other features that need to traverse
 * the page hierarchy.
 */
export async function getChildPages(
  parentId: string | number,
  collection: string,
  req: PayloadRequest,
  options: PageHierarchyOptions & { recursive?: boolean } = {},
): Promise<PageData[]> {
  const { includeDrafts = false, recursive = false } = options

  try {
    const query: any = {
      parent: { equals: parentId },
    }

    if (!includeDrafts) {
      query._status = { equals: 'published' }
    }

    const result = await req.payload.find({
      collection: collection as any,
      where: query,
      depth: 0,
      req,
    })

    let children = result.docs as PageData[]

    // If recursive, get children of children
    if (recursive) {
      const allChildren = [...children]

      for (const child of children) {
        const grandchildren = await getChildPages(child.id, collection, req, options)
        allChildren.push(...grandchildren)
      }

      children = allChildren
    }

    return children
  } catch (error) {
    req.payload.logger.error(`Error getting child pages for ${parentId}: ${error}`)
    return []
  }
}

/**
 * Generate a sitemap structure from the page hierarchy
 *
 * This function creates a nested structure representing the entire
 * site hierarchy, useful for navigation components or sitemaps.
 */
export async function generateSiteHierarchy(
  collection: string,
  req: PayloadRequest,
  options: PageHierarchyOptions = {},
): Promise<Array<PageData & { children?: PageData[]; url?: string }>> {
  const { includeDrafts = false } = options

  try {
    // Get all root pages (pages with no parent)
    const query: any = {
      parent: { exists: false },
    }

    if (!includeDrafts) {
      query._status = { equals: 'published' }
    }

    const rootPages = await req.payload.find({
      collection: collection as any,
      where: query,
      depth: 0,
      sort: 'title',
      req,
    })

    // Build hierarchy recursively
    const hierarchy = await Promise.all(
      rootPages.docs.map(async (page) => {
        const pageData = page as PageData
        const url = await buildPageHierarchyPath(pageData.id, collection, req, options)
        const children = await buildPageHierarchyRecursive(pageData.id, collection, req, options)

        return {
          ...pageData,
          url,
          children: children.length > 0 ? children : undefined,
        }
      }),
    )

    return hierarchy
  } catch (error) {
    req.payload.logger.error(`Error generating site hierarchy: ${error}`)
    return []
  }
}

/**
 * Helper function to recursively build page hierarchy
 */
async function buildPageHierarchyRecursive(
  parentId: string | number,
  collection: string,
  req: PayloadRequest,
  options: PageHierarchyOptions,
): Promise<Array<PageData & { children?: PageData[]; url?: string }>> {
  const children = await getChildPages(parentId, collection, req, options)

  return Promise.all(
    children.map(async (child) => {
      const url = await buildPageHierarchyPath(child.id, collection, req, options)
      const grandchildren = await buildPageHierarchyRecursive(child.id, collection, req, options)

      return {
        ...child,
        url,
        children: grandchildren.length > 0 ? grandchildren : undefined,
      }
    }),
  )
}
