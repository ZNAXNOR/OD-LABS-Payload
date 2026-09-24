import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface PagesData {
  title: string
  slug: string
  href: string
  description: string
  sections: {
    id: string
    label: string
    href: string
  }[]
}

const getPageHref = (slug: string) => {
  return slug === 'home' ? '/' : `/${slug}`
}

export const getPagesData = async (): Promise<PagesData[]> => {
  const payload = await getPayload({
    config: configPromise,
  })

  const result = await payload.find({
    collection: 'pages',
    where: {
      _status: { equals: 'published' },
    },
    sort: 'id',
    depth: 0,
    limit: 100,
  })

  return result.docs
    .sort((a, b) => {
      // Home should always be first
      if (a.slug === 'home') return -1
      if (b.slug === 'home') return 1
      return 0
    })
    .map((page) => {
      const pageHref = getPageHref(page.slug)

      const sections: PagesData['sections'] = []

      // Hero
      if (page.hero?.type !== 'none') {
        sections.push({
          id: 'hero',
          label: 'Hero',
          href: `${pageHref}#hero`,
        })
      }

      // Layout blocks
      for (const block of page.layout ?? []) {
        const label = block.blockName ?? block.blockType

        if (!label || !block.id) continue

        sections.push({
          id: block.id,
          label,
          href: `${pageHref}#${block.id}`,
        })
      }

      return {
        title: page.title,
        slug: page.slug,
        href: pageHref,
        description: page.meta?.description ?? '',
        sections,
      }
    })
}
