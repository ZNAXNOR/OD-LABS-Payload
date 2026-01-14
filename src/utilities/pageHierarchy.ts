import type { Page } from '@/payload-types'

/**
 * Utility functions for working with page hierarchies
 */

export interface PageWithChildren extends Omit<Page, 'children'> {
  children?: PageWithChildren[]
}

export interface BreadcrumbItem {
  doc: string | number
  url: string
  label: string
}

/**
 * Build a hierarchical tree structure from flat page array
 */
export function buildPageTree(pages: Page[]): PageWithChildren[] {
  const pageMap = new Map<string | number, PageWithChildren>()
  const rootPages: PageWithChildren[] = []

  // First pass: create map of all pages
  pages.forEach((page) => {
    pageMap.set(page.id, { ...page, children: [] })
  })

  // Second pass: build hierarchy
  pages.forEach((page) => {
    const pageWithChildren = pageMap.get(page.id)!

    if (page.parent && typeof page.parent === 'object' && 'id' in page.parent) {
      // Page has a parent
      const parentId = page.parent.id
      const parent = pageMap.get(parentId)

      if (parent) {
        parent.children = parent.children || []
        parent.children.push(pageWithChildren)
      } else {
        // Parent not found in current dataset, treat as root
        rootPages.push(pageWithChildren)
      }
    } else if (
      page.parent &&
      (typeof page.parent === 'string' || typeof page.parent === 'number')
    ) {
      // Parent is just an ID
      const parent = pageMap.get(page.parent)

      if (parent) {
        parent.children = parent.children || []
        parent.children.push(pageWithChildren)
      } else {
        // Parent not found in current dataset, treat as root
        rootPages.push(pageWithChildren)
      }
    } else {
      // No parent, this is a root page
      rootPages.push(pageWithChildren)
    }
  })

  return rootPages
}

/**
 * Get all descendant pages of a given page
 */
export function getDescendants(page: PageWithChildren): PageWithChildren[] {
  const descendants: PageWithChildren[] = []

  if (page.children) {
    page.children.forEach((child) => {
      descendants.push(child)
      descendants.push(...getDescendants(child))
    })
  }

  return descendants
}

/**
 * Get all ancestor pages of a given page (from breadcrumbs)
 */
export function getAncestors(page: Page): BreadcrumbItem[] {
  if (!page.breadcrumbs || !Array.isArray(page.breadcrumbs)) {
    return []
  }

  return page.breadcrumbs
    .filter((crumb): crumb is NonNullable<typeof crumb> => Boolean(crumb))
    .map((crumb) => {
      // Handle doc field which can be a Page object or an ID
      const docId =
        typeof crumb.doc === 'object' && crumb.doc && 'id' in crumb.doc ? crumb.doc.id : crumb.doc

      return {
        doc: docId as string | number,
        url: crumb.url || '',
        label: crumb.label || '',
      }
    })
    .filter(
      (crumb): crumb is BreadcrumbItem =>
        (typeof crumb.doc === 'string' || typeof crumb.doc === 'number') &&
        typeof crumb.url === 'string' &&
        typeof crumb.label === 'string',
    )
}

/**
 * Get the full path (ancestors + current page) for a page
 */
export function getFullPath(page: Page): BreadcrumbItem[] {
  const ancestors = getAncestors(page)
  const currentPageCrumb: BreadcrumbItem = {
    doc: page.id,
    url: page.slug === 'home' ? '/' : `/${page.slug}`,
    label: page.title,
  }

  return [...ancestors, currentPageCrumb]
}

/**
 * Check if a page is an ancestor of another page
 */
export function isAncestor(potentialAncestor: Page, page: Page): boolean {
  if (!page.breadcrumbs || !Array.isArray(page.breadcrumbs)) {
    return false
  }

  return page.breadcrumbs.some((crumb) => crumb.doc === potentialAncestor.id)
}

/**
 * Get the depth level of a page in the hierarchy (0 = root)
 */
export function getPageDepth(page: Page): number {
  if (!page.breadcrumbs || !Array.isArray(page.breadcrumbs)) {
    return 0
  }

  return page.breadcrumbs.length
}

/**
 * Find a page by slug in a hierarchical tree
 */
export function findPageBySlug(pages: PageWithChildren[], slug: string): PageWithChildren | null {
  for (const page of pages) {
    if (page.slug === slug) {
      return page
    }

    if (page.children) {
      const found = findPageBySlug(page.children, slug)
      if (found) {
        return found
      }
    }
  }

  return null
}

/**
 * Get siblings of a page (pages with the same parent)
 */
export function getSiblings(page: Page, allPages: Page[]): Page[] {
  const parentId =
    typeof page.parent === 'object' && page.parent && 'id' in page.parent
      ? page.parent.id
      : page.parent

  return allPages.filter((p) => {
    if (p.id === page.id) return false // Exclude self

    const pParentId =
      typeof p.parent === 'object' && p.parent && 'id' in p.parent ? p.parent.id : p.parent

    return pParentId === parentId
  })
}

/**
 * Generate navigation menu structure from pages
 */
export function generateNavigation(
  pages: PageWithChildren[],
  maxDepth = 3,
  currentDepth = 0,
): Array<{
  id: string | number
  title: string
  slug: string
  url: string
  children?: any[]
}> {
  if (currentDepth >= maxDepth) {
    return []
  }

  return pages.map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug || '',
    url: page.slug === 'home' ? '/' : `/${page.slug}`,
    children:
      page.children && page.children.length > 0
        ? generateNavigation(page.children, maxDepth, currentDepth + 1)
        : undefined,
  }))
}

/**
 * Validate that a parent selection won't create a circular reference
 */
export function validateParentSelection(
  pageId: string | number,
  proposedParentId: string | number,
  allPages: Page[],
): { isValid: boolean; error?: string } {
  // Can't be own parent
  if (pageId === proposedParentId) {
    return { isValid: false, error: 'A page cannot be its own parent' }
  }

  // Find the proposed parent
  const proposedParent = allPages.find((p) => p.id === proposedParentId)
  if (!proposedParent) {
    return { isValid: false, error: 'Proposed parent page not found' }
  }

  // Check if the current page is an ancestor of the proposed parent
  // This would create a circular reference
  if (isAncestor(allPages.find((p) => p.id === pageId)!, proposedParent)) {
    return {
      isValid: false,
      error: 'This selection would create a circular reference in the page hierarchy',
    }
  }

  return { isValid: true }
}
