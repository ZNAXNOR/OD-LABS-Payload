import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

export interface LivePreviewDataOptions {
  collection: string
  slug?: string
  id?: string
  depth?: number
  locale?: string
}

export interface LivePreviewPageData {
  doc: any
  isPreview: boolean
  collection: string
  lastModified?: string
}

/**
 * Cached function to fetch live preview data for a specific collection and document
 * This function handles both draft mode and published content fetching
 */
export const getLivePreviewData = cache(
  async (options: LivePreviewDataOptions): Promise<LivePreviewPageData | null> => {
    const { collection, slug, id, depth = 2, locale } = options
    const { isEnabled: isDraftMode } = await draftMode()

    try {
      const payload = await getPayload({ config })

      let result

      if (id) {
        // Fetch by ID
        result = await payload.findByID({
          collection: collection as any,
          id,
          draft: isDraftMode,
          depth,
          locale: locale as any,
          overrideAccess: false, // Respect access control
        })

        if (!result) return null

        return {
          doc: result,
          isPreview: isDraftMode,
          collection,
          lastModified: (result as any).updatedAt || (result as any).createdAt,
        }
      } else if (slug) {
        // Fetch by slug
        result = await payload.find({
          collection: collection as any,
          where: { slug: { equals: slug } },
          draft: isDraftMode,
          depth,
          locale: locale as any,
          limit: 1,
          overrideAccess: false, // Respect access control
        })

        if (!result.docs[0]) return null

        return {
          doc: result.docs[0],
          isPreview: isDraftMode,
          collection,
          lastModified: (result.docs[0] as any).updatedAt || (result.docs[0] as any).createdAt,
        }
      } else {
        throw new Error('Either slug or id must be provided')
      }
    } catch (error) {
      console.error(`[LivePreviewData] Error fetching ${collection} data:`, error)
      return null
    }
  },
)

/**
 * Cached function to fetch multiple documents for live preview
 */
export const getLivePreviewCollection = cache(
  async (
    collection: string,
    options: {
      where?: any
      limit?: number
      depth?: number
      locale?: string
      sort?: string
    } = {},
  ): Promise<{ docs: any[]; totalDocs: number; isPreview: boolean }> => {
    const { where, limit = 10, depth = 1, locale, sort } = options
    const { isEnabled: isDraftMode } = await draftMode()

    try {
      const payload = await getPayload({ config })

      const result = await payload.find({
        collection: collection as any,
        where: {
          ...where,
          // In draft mode, show all content; otherwise only published
          ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
        },
        draft: isDraftMode,
        depth,
        locale: locale as any,
        limit,
        sort,
        overrideAccess: false, // Respect access control
      })

      return {
        docs: result.docs,
        totalDocs: result.totalDocs,
        isPreview: isDraftMode,
      }
    } catch (error) {
      console.error(`[LivePreviewData] Error fetching ${collection} collection:`, error)
      return {
        docs: [],
        totalDocs: 0,
        isPreview: isDraftMode,
      }
    }
  },
)

/**
 * Generate cache tags for live preview data
 * This helps with cache invalidation when content changes
 */
export function generateLivePreviewCacheTags(
  collection: string,
  id?: string,
  slug?: string,
): string[] {
  const tags = [`collection:${collection}`]

  if (id) {
    tags.push(`${collection}:${id}`)
  }

  if (slug) {
    tags.push(`${collection}:slug:${slug}`)
  }

  return tags
}

/**
 * Check if the current request is in preview mode
 */
export async function isPreviewMode(): Promise<boolean> {
  const { isEnabled } = await draftMode()
  return isEnabled
}

/**
 * Get preview session information from cookies or headers
 */
export async function getPreviewSession(): Promise<{
  sessionId?: string
  collection?: string
  documentId?: string
} | null> {
  try {
    // In a real implementation, you would extract this from cookies or headers
    // For now, we'll return null as this would be handled by the preview API routes
    return null
  } catch (error) {
    console.error('[LivePreviewData] Error getting preview session:', error)
    return null
  }
}

/**
 * Collection-specific data fetchers with proper typing
 */
export const getPageData = (slug: string, locale?: string) =>
  getLivePreviewData({ collection: 'pages', slug, locale })

export const getBlogData = (slug: string, locale?: string) =>
  getLivePreviewData({ collection: 'blogs', slug, locale })

export const getServiceData = (slug: string, locale?: string) =>
  getLivePreviewData({ collection: 'services', slug, locale })

export const getLegalData = (slug: string, locale?: string) =>
  getLivePreviewData({ collection: 'legal', slug, locale })

export const getContactData = (slug: string, locale?: string) =>
  getLivePreviewData({ collection: 'contacts', slug, locale })

/**
 * Collection list fetchers
 */
export const getServicesCollection = (options?: { limit?: number; locale?: string }) =>
  getLivePreviewCollection('services', options)

export const getBlogsCollection = (options?: { limit?: number; locale?: string }) =>
  getLivePreviewCollection('blogs', options)

export const getPagesCollection = (options?: { limit?: number; locale?: string }) =>
  getLivePreviewCollection('pages', options)
