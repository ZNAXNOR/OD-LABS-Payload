import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
import { CACHE_TAGS } from '@/utilities/cacheTags'
import { getPopulatedMedia } from '@/utilities/getPopulatedMedia'

export interface LegalPagesData {
  title: string
  slug: string
  href: string
  description: string
  documentType: string | null
  updatedAt: string
  seoImage: Media | null
  showSeoImageInMegaMenu: boolean
  showCssPreviewInMegaMenu: boolean
}

/** Returns published legal document metadata for the footer and Megamenu. */
const getLegalPagesDataUncached = async (): Promise<LegalPagesData[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'legal-pages',
    where: { _status: { equals: 'published' } },
    sort: 'title',
    depth: 1,
    limit: 100,
    pagination: false,
    select: {
      title: true,
      slug: true,
      documentType: true,
      updatedAt: true,
      meta: { description: true, image: true, showSeoImageInMegaMenu: true, showCssPreviewInMegaMenu: true },
    },
  })

  return result.docs.map((page) => ({
    title: page.title,
    slug: page.slug,
    href: `/${page.slug}`,
    description: page.meta?.description || 'Legal and compliance document.',
    documentType: page.documentType || null,
    updatedAt: page.updatedAt,
    seoImage: getPopulatedMedia(page.meta?.image),
    showSeoImageInMegaMenu: page.meta?.showSeoImageInMegaMenu ?? false,
    showCssPreviewInMegaMenu: page.meta?.showCssPreviewInMegaMenu ?? true,
  }))
}

/** Persistent cache for published legal navigation metadata. */
export const getLegalPagesData = unstable_cache(
  getLegalPagesDataUncached,
  ['legal-pages-navigation-v1'],
  { tags: [CACHE_TAGS.legalPages, CACHE_TAGS.legalPagesNavigation] },
)
