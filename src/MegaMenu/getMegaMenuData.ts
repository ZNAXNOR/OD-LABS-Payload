import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { MegaMenuPage } from './Sections/pageData'

const getPageHref = (slug: string) => {
  return slug === 'home' ? '/' : `/${slug}`
}

export const getMegaMenuData = async (): Promise<MegaMenuPage[]> => {
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

      const sections: MegaMenuPage['sections'] = [{ label: 'Hero', href: `${pageHref}#hero` }]

      // Layout blocks
      for (const block of page.layout ?? []) {
        const label = block.blockName ?? block.blockType

        if (!label || !block.id) continue

        sections.push({
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
