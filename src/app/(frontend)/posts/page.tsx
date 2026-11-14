import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { CACHE_TAGS } from '@/utilities/cacheTags'

export const dynamic = 'force-static'
export const revalidate = 600

const getPublishedPostsArchive = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    return payload.find({
      collection: 'posts',
      draft: false,
      depth: 1,
      limit: 12,
      overrideAccess: false,
      pagination: true,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
    })
  },
  ['published-posts-archive-v1'],
  { tags: [CACHE_TAGS.posts] },
)

export default async function Page() {
  const posts = await getPublishedPostsArchive()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Posts & Notes | OD LABS',
  }
}
