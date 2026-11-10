'use client'

import { useEffect, useState } from 'react'
import type { Media } from '@/payload-types'
import type { PostsData } from '@/getPostsData'
import { getPopulatedMedia } from '@/utilities/getPopulatedMedia'

interface PostApiDocument {
  title: string
  slug: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: number | Media | null
    showSeoImageInMegaMenu?: boolean | null
    showCssPreviewInMegaMenu?: boolean | null
  }
  publishedAt?: string | null
  categories?: Array<number | { title: string } | null> | null
  relatedPosts?: Array<number | { title: string; slug?: string | null } | null> | null
}

/**
 * Uses the server-provided navigation index first. A narrow Payload REST query
 * is only made when the current post is outside that preloaded index.
 */
export const useCurrentPost = (pathname: string | null, posts: PostsData[], enabled: boolean) => {
  const [activePost, setActivePost] = useState<PostsData | null>(null)

  useEffect(() => {
    if (!enabled) return

    const path = pathname?.replace(/\/$/, '') || '/'
    const isPostRoute = path.startsWith('/posts/') && !path.startsWith('/posts/page/')
    if (!isPostRoute) {
      setActivePost(null)
      return
    }

    const slug = decodeURIComponent(path.slice('/posts/'.length).split('/')[0] || '')
    if (!slug) {
      setActivePost(null)
      return
    }

    const indexedPost = posts.find((post) => post.slug === slug)
    if (indexedPost) {
      setActivePost(indexedPost)
      return
    }

    const controller = new AbortController()
    const params = new URLSearchParams({
      'where[slug][equals]': slug,
      'where[_status][equals]': 'published',
      depth: '1',
      limit: '1',
      'select[title]': 'true',
      'select[slug]': 'true',
      'select[meta][title]': 'true',
      'select[meta][description]': 'true',
      'select[meta][image]': 'true',
      'select[meta][showSeoImageInMegaMenu]': 'true',
      'select[meta][showCssPreviewInMegaMenu]': 'true',
      'select[publishedAt]': 'true',
      'select[categories]': 'true',
      'select[relatedPosts]': 'true',
    })

    setActivePost(null)

    fetch(`/api/posts?${params.toString()}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const doc = data?.docs?.[0] as PostApiDocument | undefined
        if (!doc || controller.signal.aborted) return

        setActivePost({
          title: doc.title,
          slug: doc.slug,
          href: `/posts/${doc.slug}`,
          description: doc.meta?.description || '',
          metaTitle: doc.meta?.title || null,
          metaDescription: doc.meta?.description || null,
          seoImage: getPopulatedMedia(doc.meta?.image),
          showSeoImageInMegaMenu: doc.meta?.showSeoImageInMegaMenu ?? true,
          showCssPreviewInMegaMenu: doc.meta?.showCssPreviewInMegaMenu ?? true,
          publishedAt: doc.publishedAt || null,
          categories: (doc.categories ?? []).flatMap((category) =>
            category && typeof category === 'object' ? [category.title] : [],
          ),
          relatedPosts: (doc.relatedPosts ?? []).flatMap((relatedPost) =>
            relatedPost && typeof relatedPost === 'object' && relatedPost.slug
              ? [{ title: relatedPost.title, href: `/posts/${relatedPost.slug}` }]
              : [],
          ),
        })
      })
      .catch(() => undefined)

    return () => controller.abort()
  }, [pathname, posts, enabled])

  return activePost
}
