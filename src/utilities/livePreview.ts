/**
 * Live Preview URL Generation Utilities
 *
 * This module provides URL generation functions for PayloadCMS Live Preview
 * functionality across all page collections.
 */

import type { CollectionSlug } from 'payload'

/**
 * Base URL for the frontend application
 */
const getBaseUrl = (): string => {
  return process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

/**
 * Generate preview URL for consolidated Pages collection
 * Supports all page types: page, blog, service, legal, contact
 * Handles both draft and published content with proper authentication
 */
export const generatePagesPreviewUrl = (doc: any, locale?: string | any): string => {
  const baseUrl = getBaseUrl()
  const slug = doc?.slug || ''
  const pageType = doc?.pageType || 'page'
  const isDraft = doc?._status === 'draft'
  const url = doc?.url // Use hierarchical URL if available

  // Handle locale parameter - it might be passed as an object instead of string
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      localeString = locale.locale
    } else {
      console.warn('[generatePagesPreviewUrl] Unexpected locale format:', locale)
      localeString = undefined
    }
  }

  // Build base URL with locale
  const baseWithLocale = `${baseUrl}${localeString ? `/${localeString}` : ''}`

  // Use hierarchical URL if available (for nested pages)
  let finalUrl: string
  if (url && url !== '/') {
    // Use the computed hierarchical URL
    finalUrl = `${baseWithLocale}${url}`
  } else {
    // Handle home page (slug === 'home' or empty)
    if (!slug || slug === 'home') {
      finalUrl = baseWithLocale
    } else {
      // Generate URL based on pageType
      switch (pageType) {
        case 'blog':
          finalUrl = `${baseWithLocale}/blog/${slug}`
          break
        case 'service':
          finalUrl = `${baseWithLocale}/services/${slug}`
          break
        case 'legal':
          finalUrl = `${baseWithLocale}/legal/${slug}`
          break
        case 'contact':
          finalUrl = `${baseWithLocale}/contact/${slug}`
          break
        case 'page':
        default:
          finalUrl = `${baseWithLocale}/${slug}`
          break
      }
    }
  }

  // Add draft mode parameters for unpublished content
  if (isDraft) {
    return generateAuthenticatedPreviewUrl(finalUrl, undefined, localeString)
  }

  return finalUrl
}

/**
 * Generate preview URL for BlogPages collection
 */
export const generateBlogPagesPreviewUrl = (doc: any, locale?: string | any): string => {
  const baseUrl = getBaseUrl()
  const slug = doc?.slug || ''

  // Handle locale parameter - it might be passed as an object instead of string
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      localeString = locale.locale
    } else {
      console.warn('[generateBlogPagesPreviewUrl] Unexpected locale format:', locale)
      localeString = undefined
    }
  }

  if (!slug) {
    return `${baseUrl}${localeString ? `/${localeString}` : ''}/blogs`
  }

  return `${baseUrl}${localeString ? `/${localeString}` : ''}/blogs/${slug}`
}

/**
 * Generate preview URL for ServicesPages collection
 */
export const generateServicesPagesPreviewUrl = (doc: any, locale?: string | any): string => {
  const baseUrl = getBaseUrl()
  const slug = doc?.slug || ''

  // Handle locale parameter - it might be passed as an object instead of string
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      // Handle locale object with code property
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      // Handle locale object with locale property
      localeString = locale.locale
    } else {
      // Log the unexpected locale format and ignore it
      console.warn('[generateServicesPagesPreviewUrl] Unexpected locale format:', {
        locale: locale,
        localeType: typeof locale,
        localeKeys: typeof locale === 'object' ? Object.keys(locale) : 'not object',
      })
      localeString = undefined
    }
  }

  // Comprehensive debug logging to help troubleshoot URL generation
  if (process.env.NODE_ENV === 'development') {
    console.log('[generateServicesPagesPreviewUrl] COMPREHENSIVE DEBUG:', {
      timestamp: new Date().toISOString(),
      functionCalled: 'generateServicesPagesPreviewUrl',
      doc: doc,
      docType: typeof doc,
      docKeys: doc ? Object.keys(doc) : 'no doc',
      slug: slug,
      slugType: typeof slug,
      docSlug: doc?.slug,
      docId: doc?.id,
      docTitle: doc?.title,
      baseUrl: baseUrl,
      originalLocale: locale,
      originalLocaleType: typeof locale,
      processedLocale: localeString,
      fullUrl: slug
        ? `${baseUrl}${localeString ? `/${localeString}` : ''}/services/${slug}`
        : `${baseUrl}${localeString ? `/${localeString}` : ''}/services`,
      stackTrace: new Error().stack?.split('\n').slice(1, 5).join('\n'), // First 4 stack frames
    })
  }

  if (!slug) {
    console.warn(
      '[generateServicesPagesPreviewUrl] WARNING: No slug found in document, returning services index URL',
      {
        doc: doc,
        docKeys: doc ? Object.keys(doc) : 'no doc',
      },
    )
    return `${baseUrl}${localeString ? `/${localeString}` : ''}/services`
  }

  const finalUrl = `${baseUrl}${localeString ? `/${localeString}` : ''}/services/${slug}`
  console.log('[generateServicesPagesPreviewUrl] SUCCESS: Generated URL:', finalUrl)
  return finalUrl
}

/**
 * Generate preview URL for LegalPages collection
 */
export const generateLegalPagesPreviewUrl = (doc: any, locale?: string | any): string => {
  const baseUrl = getBaseUrl()
  const slug = doc?.slug || ''

  // Handle locale parameter - it might be passed as an object instead of string
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      localeString = locale.locale
    } else {
      console.warn('[generateLegalPagesPreviewUrl] Unexpected locale format:', locale)
      localeString = undefined
    }
  }

  if (!slug) {
    return `${baseUrl}${localeString ? `/${localeString}` : ''}/legal`
  }

  return `${baseUrl}${localeString ? `/${localeString}` : ''}/legal/${slug}`
}

/**
 * Generate preview URL for ContactPages collection
 */
export const generateContactPagesPreviewUrl = (doc: any, locale?: string | any): string => {
  const baseUrl = getBaseUrl()
  const slug = doc?.slug || ''

  // Handle locale parameter - it might be passed as an object instead of string
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      localeString = locale.locale
    } else {
      console.warn('[generateContactPagesPreviewUrl] Unexpected locale format:', locale)
      localeString = undefined
    }
  }

  if (!slug) {
    return `${baseUrl}${localeString ? `/${localeString}` : ''}/contacts`
  }

  return `${baseUrl}${localeString ? `/${localeString}` : ''}/contacts/${slug}`
}

/**
 * Generate hierarchical preview URL based on page parent-child relationships
 * Handles nested page structures and maintains proper URL hierarchy
 */
export const generateHierarchicalPreviewUrl = async (
  doc: any,
  locale?: string | any,
  payload?: any,
): Promise<string> => {
  const baseUrl = getBaseUrl()
  const pageType = doc?.pageType || 'page'

  // Handle locale parameter
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      localeString = locale.locale
    }
  }

  const baseWithLocale = `${baseUrl}${localeString ? `/${localeString}` : ''}`

  // If the document already has a computed URL, use it
  if (doc?.url && doc.url !== '/') {
    return `${baseWithLocale}${doc.url}`
  }

  // Build hierarchical URL from breadcrumbs or parent chain
  let urlPath = ''

  if (doc?.breadcrumbs && doc.breadcrumbs.length > 0) {
    // Use existing breadcrumbs to build URL
    urlPath = doc.breadcrumbs.map((crumb: any) => crumb.url || `/${crumb.doc?.slug || ''}`).join('')

    // Add current page slug
    if (doc.slug && doc.slug !== 'home') {
      urlPath += `/${doc.slug}`
    }
  } else if (doc?.parent && payload) {
    // Build URL by traversing parent chain
    try {
      const parentChain = await buildParentChain(doc, payload)
      urlPath = parentChain
        .reverse()
        .map((page) => (page.slug === 'home' ? '' : `/${page.slug}`))
        .join('')

      // Add current page slug
      if (doc.slug && doc.slug !== 'home') {
        urlPath += `/${doc.slug}`
      }
    } catch (error) {
      console.warn('[generateHierarchicalPreviewUrl] Failed to build parent chain:', error)
      // Fallback to simple URL generation
      urlPath = doc.slug === 'home' ? '' : `/${doc.slug}`
    }
  } else {
    // Simple URL for pages without hierarchy
    urlPath = doc.slug === 'home' ? '' : `/${doc.slug}`
  }

  // Apply page type-specific URL prefixes
  let finalUrl: string
  switch (pageType) {
    case 'blog':
      finalUrl = `${baseWithLocale}/blog${urlPath}`
      break
    case 'service':
      finalUrl = `${baseWithLocale}/services${urlPath}`
      break
    case 'legal':
      finalUrl = `${baseWithLocale}/legal${urlPath}`
      break
    case 'contact':
      finalUrl = `${baseWithLocale}/contact${urlPath}`
      break
    case 'page':
    default:
      finalUrl = `${baseWithLocale}${urlPath || ''}`
      break
  }

  return finalUrl
}

/**
 * Build parent chain for hierarchical URL generation
 */
const buildParentChain = async (doc: any, payload: any): Promise<any[]> => {
  const chain: any[] = []
  let currentDoc = doc

  // Traverse up the parent chain
  while (currentDoc?.parent) {
    try {
      const parent = await payload.findByID({
        collection: 'pages',
        id: typeof currentDoc.parent === 'string' ? currentDoc.parent : currentDoc.parent.id,
        depth: 0, // Only need basic fields
      })

      if (parent) {
        chain.push(parent)
        currentDoc = parent
      } else {
        break
      }
    } catch (error) {
      console.warn('[buildParentChain] Failed to fetch parent:', error)
      break
    }
  }

  return chain
}

/**
 * Generate preview URL with page type-aware routing compatibility
 * Ensures URLs work with existing frontend routing structure
 */
export const generateRoutingCompatiblePreviewUrl = (
  doc: any,
  locale?: string | any,
  options?: {
    useHierarchy?: boolean
    includePageType?: boolean
    customRouting?: Record<string, string>
  },
): string => {
  const { useHierarchy = true, includePageType = true, customRouting = {} } = options || {}
  const baseUrl = getBaseUrl()
  const pageType = doc?.pageType || 'page'
  const slug = doc?.slug || ''

  // Handle locale parameter
  let localeString: string | undefined
  if (locale) {
    if (typeof locale === 'string') {
      localeString = locale
    } else if (typeof locale === 'object' && locale.code) {
      localeString = locale.code
    } else if (typeof locale === 'object' && locale.locale) {
      localeString = locale.locale
    }
  }

  const baseWithLocale = `${baseUrl}${localeString ? `/${localeString}` : ''}`

  // Use custom routing if provided
  if (customRouting[pageType]) {
    const customPath = customRouting[pageType].replace('{slug}', slug)
    return `${baseWithLocale}${customPath}`
  }

  // Use hierarchical URL if available and requested
  if (useHierarchy && doc?.url && doc.url !== '/') {
    return `${baseWithLocale}${doc.url}`
  }

  // Handle home page
  if (!slug || slug === 'home') {
    return baseWithLocale
  }

  // Generate URL based on page type with routing compatibility
  if (includePageType) {
    switch (pageType) {
      case 'blog':
        return `${baseWithLocale}/blog/${slug}`
      case 'service':
        return `${baseWithLocale}/services/${slug}`
      case 'legal':
        return `${baseWithLocale}/legal/${slug}`
      case 'contact':
        return `${baseWithLocale}/contact/${slug}`
      case 'page':
      default:
        return `${baseWithLocale}/${slug}`
    }
  }

  // Simple slug-based URL
  return `${baseWithLocale}/${slug}`
}

/**
 * Generate preview URL with page type context
 * Includes metadata for frontend routing decisions
 */
export const generateContextualPreviewUrl = (
  doc: any,
  locale?: string,
  context?: {
    user?: any
    collection?: string
    operation?: string
  },
): string => {
  // Use the synchronous generatePagesPreviewUrl instead of async generateHierarchicalPreviewUrl
  const baseUrl = generatePagesPreviewUrl(doc, locale)
  const url = new URL(baseUrl)

  // Add context parameters for frontend routing
  if (context?.collection) {
    url.searchParams.set('collection', context.collection)
  }

  if (context?.operation) {
    url.searchParams.set('operation', context.operation)
  }

  // Add page type for frontend logic
  if (doc?.pageType) {
    url.searchParams.set('pageType', doc.pageType)
  }

  // Add draft status
  if (doc?._status) {
    url.searchParams.set('status', doc._status)
  }

  // Add user context for personalized previews
  if (context?.user?.id) {
    url.searchParams.set('userId', context.user.id)
  }

  // Add timestamp for cache busting
  url.searchParams.set('t', Date.now().toString())

  return url.toString()
}

/**
 * Collection-specific URL generators map
 * Note: Legacy generators maintained for backward compatibility during migration
 */
export const previewUrlGenerators = {
  pages: generatePagesPreviewUrl, // Now handles all page types
  blogs: generateBlogPagesPreviewUrl, // Legacy - will be removed after migration
  services: generateServicesPagesPreviewUrl, // Legacy - will be removed after migration
  legal: generateLegalPagesPreviewUrl, // Legacy - will be removed after migration
  contacts: generateContactPagesPreviewUrl, // Legacy - will be removed after migration
} as const

/**
 * Get preview URL generator for a specific collection
 */
export const getPreviewUrlGenerator = (collection: CollectionSlug) => {
  return previewUrlGenerators[collection as keyof typeof previewUrlGenerators]
}

/**
 * Validate preview URL generation
 */
export const validatePreviewUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Generate preview URL with authentication parameters
 * Supports draft mode, authentication tokens, and locale parameters
 */
export const generateAuthenticatedPreviewUrl = (
  baseUrl: string,
  token?: string,
  locale?: string,
): string => {
  const url = new URL(baseUrl)

  // Add draft mode parameter
  url.searchParams.set('draft', 'true')

  // Add authentication token if provided
  if (token) {
    url.searchParams.set('token', token)
  }

  // Add locale parameter if provided
  if (locale) {
    url.searchParams.set('locale', locale)
  }

  return url.toString()
}

/**
 * Generate preview URL with page type-specific authentication
 * Handles different authentication requirements for different page types
 */
export const generatePageTypePreviewUrl = (
  doc: any,
  pageType: string,
  locale?: string,
  options?: {
    token?: string
    requireAuth?: boolean
    customParams?: Record<string, string>
  },
): string => {
  const baseUrl = generatePagesPreviewUrl(doc, locale)
  const { token, requireAuth = false, customParams = {} } = options || {}

  // For sensitive page types, always require authentication
  const sensitivePageTypes = ['legal', 'contact']
  const shouldAuthenticate =
    requireAuth || sensitivePageTypes.includes(pageType) || doc?._status === 'draft'

  if (shouldAuthenticate) {
    const url = new URL(baseUrl)

    // Add draft mode for unpublished content
    if (doc?._status === 'draft') {
      url.searchParams.set('draft', 'true')
    }

    // Add authentication token
    if (token) {
      url.searchParams.set('token', token)
    }

    // Add page type for frontend routing
    url.searchParams.set('pageType', pageType)

    // Add custom parameters
    Object.entries(customParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    return url.toString()
  }

  return baseUrl
}

/**
 * Validate preview authentication token
 * This would typically integrate with your authentication system
 */
export const validatePreviewToken = async (token: string): Promise<boolean> => {
  // In a real implementation, this would validate against your auth system
  // For now, we'll do basic validation
  if (!token || typeof token !== 'string') {
    return false
  }

  // Basic token format validation
  if (token.length < 10) {
    return false
  }

  // TODO: Implement actual token validation with your auth system
  // This might involve:
  // - JWT verification
  // - Database lookup
  // - Session validation
  // - Permission checks

  return true
}

/**
 * Generate preview session data for secure preview access
 */
export const generatePreviewSession = (
  doc: any,
  user?: any,
): {
  sessionId: string
  expiresAt: Date
  permissions: string[]
  metadata: Record<string, any>
} => {
  const sessionId = `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Determine permissions based on user role and page type
  const permissions: string[] = ['read']
  if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) {
    permissions.push('edit', 'publish')
  }

  // Add page type-specific permissions
  if (doc?.pageType === 'legal' && user?.roles?.includes('legal-admin')) {
    permissions.push('legal-edit')
  }

  return {
    sessionId,
    expiresAt,
    permissions,
    metadata: {
      pageType: doc?.pageType,
      documentId: doc?.id,
      userId: user?.id,
      userRoles: user?.roles || [],
    },
  }
}
