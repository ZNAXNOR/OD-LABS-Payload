import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface PostsData {
  title: string
  slug: string
  href: string
  description?: string
  metaTitle?: string | null
  metaDescription?: string | null
}

/**
 * Returns published posts with their title and SEO metadata for site navigation and MegaMenu.
 */
export const getPostsData = async (): Promise<PostsData[]> => {
  const payload = await getPayload({
    config: configPromise,
  })

  const result = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
    depth: 0,
    limit: 100,
    pagination: false,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  })

  return result.docs.map((post) => ({
    title: post.title,
    slug: post.slug || '',
    href: `/posts/${post.slug}`,
    description: post.meta?.description || '',
    metaTitle: post.meta?.title || null,
    metaDescription: post.meta?.description || null,
  }))
}
