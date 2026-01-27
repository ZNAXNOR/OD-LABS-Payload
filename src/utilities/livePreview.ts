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
 * Generate preview URL for Pages collection
 */
export const generatePagesPreviewUrl = (doc: any, locale?: string | any): string => {
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
      console.warn('[generatePagesPreviewUrl] Unexpected locale format:', locale)
      localeString = undefined
    }
  }

  // Handle home page (slug === 'home' or empty)
  if (!slug || slug === 'home') {
    return `${baseUrl}${localeString ? `/${localeString}` : ''}`
  }

  return `${baseUrl}${localeString ? `/${localeString}` : ''}/${slug}`
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
 * Collection-specific URL generators map
 */
export const previewUrlGenerators = {
  pages: generatePagesPreviewUrl,
  blogs: generateBlogPagesPreviewUrl,
  services: generateServicesPagesPreviewUrl,
  legal: generateLegalPagesPreviewUrl,
  contacts: generateContactPagesPreviewUrl,
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
