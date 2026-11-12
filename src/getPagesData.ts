import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
import { getPopulatedMedia } from '@/utilities/getPopulatedMedia'

export interface PagesData {
  title: string
  slug: string
  href: string
  description: string
  seoImage: Media | null
  showSeoImageInMegaMenu: boolean
  showCssPreviewInMegaMenu: boolean
  sections: {
    id: string
    label: string
    href: string
  }[]
}

const getPageHref = (slug: string) => (slug === 'home' ? '/' : `/${slug}`)

export const getPagesData = async (): Promise<PagesData[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    sort: 'id',
    depth: 1,
    limit: 100,
    pagination: false,
    select: {
      title: true,
      slug: true,
      hero: { type: true },
      // Payload's generated block-select union does not expose block metadata
      // (id, blockName, blockType) as selectable fields. Keep the typed full
      // block selection until a schema-supported minimal selection is available.
      layout: true,
      meta: { description: true, image: true, showSeoImageInMegaMenu: true, showCssPreviewInMegaMenu: true },
    },
  })

  return result.docs
    .sort((a, b) => {
      if (a.slug === 'home') return -1
      if (b.slug === 'home') return 1
      return 0
    })
    .map((page) => {
      const pageHref = getPageHref(page.slug)
      const sections: PagesData['sections'] = []

      if (page.hero?.type !== 'none') {
        sections.push({ id: 'hero', label: 'Hero', href: `${pageHref}#hero` })
      }

      for (const block of page.layout ?? []) {
        const label = block.blockName ?? block.blockType
        if (!label || !block.id) continue
        sections.push({ id: block.id, label, href: `${pageHref}#${block.id}` })
      }

      return {
        title: page.title,
        slug: page.slug,
        href: pageHref,
        description: page.meta?.description ?? '',
        seoImage: getPopulatedMedia(page.meta?.image),
        showSeoImageInMegaMenu: page.meta?.showSeoImageInMegaMenu ?? false,
        showCssPreviewInMegaMenu: page.meta?.showCssPreviewInMegaMenu ?? true,
        sections,
      }
    })
}
