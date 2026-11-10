import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
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
export const getLegalPagesData = async (): Promise<LegalPagesData[]> => {
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
