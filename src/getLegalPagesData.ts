import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface LegalPagesData {
  title: string
  slug: string
  href: string
}

/**
 * Returns only published legal pages for public-facing legal navigation.
 */
export const getLegalPagesData = async (): Promise<LegalPagesData[]> => {
  const payload = await getPayload({
    config: configPromise,
  })

  const result = await payload.find({
    collection: 'legal-pages',
    where: {
      _status: { equals: 'published' },
    },
    sort: 'title',
    depth: 0,
    limit: 100,
    pagination: false,
    select: {
      title: true,
      slug: true,
    },
  })

  return result.docs.map((page) => ({
    title: page.title,
    slug: page.slug,
    href: `/${page.slug}`,
  }))
}
