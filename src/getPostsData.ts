import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
import { getPopulatedMedia } from '@/utilities/getPopulatedMedia'

export interface RelatedPostData {
  title: string
  href: string
}

export interface PostsData {
  title: string
  slug: string
  href: string
  description: string
  metaTitle: string | null
  metaDescription: string | null
  seoImage: Media | null
  publishedAt: string | null
  categories: string[]
  relatedPosts: RelatedPostData[]
}

/** Fetches only published post metadata required by the site navigation and Megamenu. */
export const getPostsData = async (): Promise<PostsData[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 12,
    pagination: false,
    select: {
      title: true,
      slug: true,
      meta: { title: true, image: true, description: true },
      publishedAt: true,
      categories: true,
      relatedPosts: true,
    },
  })

  return result.docs.map((post) => ({
    title: post.title,
    slug: post.slug || '',
    href: `/posts/${post.slug}`,
    description: post.meta?.description || '',
    metaTitle: post.meta?.title || null,
    metaDescription: post.meta?.description || null,
    seoImage: getPopulatedMedia(post.meta?.image),
    publishedAt: post.publishedAt || null,
    categories: (post.categories ?? []).flatMap((category) =>
      typeof category === 'object' && category !== null ? [category.title] : [],
    ),
    relatedPosts: (post.relatedPosts ?? []).flatMap((relatedPost) =>
      typeof relatedPost === 'object' && relatedPost !== null && relatedPost.slug
        ? [{ title: relatedPost.title, href: `/posts/${relatedPost.slug}` }]
        : [],
    ),
  }))
}
