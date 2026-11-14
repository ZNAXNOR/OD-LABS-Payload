import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { CACHE_TAGS } from '@/utilities/cacheTags'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug(decodedSlug, draft)

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug(decodedSlug, draft)

  return generateMeta({ doc: post })
}

/**
 * Published posts use the persistent Data Cache. Draft documents are fetched
 * directly so preview content can never leak into the public cache.
 */
const getPublishedPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      const result = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return result.docs?.[0] || null
    },
    ['published-post-by-slug-v1', slug],
    { tags: [CACHE_TAGS.posts] },
  )()

const getDraftPostBySlug = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: true,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}

const queryPostBySlug = cache(async (slug: string, draft: boolean) => {
  return draft ? getDraftPostBySlug(slug) : getPublishedPostBySlug(slug)
})
