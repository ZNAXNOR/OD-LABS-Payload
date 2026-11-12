import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import { CACHE_TAGS } from '@/utilities/cacheTags'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { LegalContent } from '@/components/LegalContent'

// Regenerate cached page output periodically as a fallback to on-demand
// revalidation. Newly published slugs remain eligible for on-demand rendering.
export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const [pages, legalPages] = await Promise.all([
    payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    }),
    payload.find({
      collection: 'legal-pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    }),
  ])

  return [
    ...pages.docs
      .filter((doc) => doc.slug !== 'home')
      .map(({ slug }) => ({ slug })),
    ...legalPages.docs.map(({ slug }) => ({ slug })),
  ]
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug(
    decodedSlug,
    draft,
  )

  // Remove this fallback once your website is seeded.
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    const legalPage = await queryLegalPageBySlug(decodedSlug, draft)

    if (!legalPage) {
      return <PayloadRedirects url={url} />
    }

    return (
      <React.Fragment>
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <LegalContent legalPage={legalPage} />
      </React.Fragment>
    )
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug(decodedSlug, draft)

  if (page) {
    return generateMeta({ doc: page })
  }

  const legalPage = await queryLegalPageBySlug(decodedSlug, draft)

  return {
    title: legalPage?.meta?.title || legalPage?.title,
    description: legalPage?.meta?.description || undefined,
    robots: legalPage?.meta?.excludeFromIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  }
}

/**
 * Published documents use the persistent Next.js Data Cache.
 * Draft documents always use a direct Payload query and never enter that cache.
 */
const getPublishedPageBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      const result = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1,
        pagination: false,
        overrideAccess: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return result.docs?.[0] || null
    },
    ['published-page-by-slug-v1', slug],
    { tags: [CACHE_TAGS.pages] },
  )()

const getDraftPageBySlug = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: true,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}

const queryPageBySlug = cache(async (slug: string, draft: boolean) => {
  return draft ? getDraftPageBySlug(slug) : getPublishedPageBySlug(slug)
})

const getPublishedLegalPageBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      const result = await payload.find({
        collection: 'legal-pages',
        draft: false,
        limit: 1,
        pagination: false,
        overrideAccess: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return result.docs?.[0] || null
    },
    ['published-legal-page-by-slug-v1', slug],
    { tags: [CACHE_TAGS.legalPages] },
  )()

const getDraftLegalPageBySlug = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'legal-pages',
    draft: true,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}

const queryLegalPageBySlug = cache(async (slug: string, draft: boolean) => {
  return draft ? getDraftLegalPageBySlug(slug) : getPublishedLegalPageBySlug(slug)
})
