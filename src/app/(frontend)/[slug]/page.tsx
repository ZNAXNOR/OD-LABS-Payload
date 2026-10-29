import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import { ExternalEmbed } from '@/components/ExternalEmbed'
import './legal-page.scss'

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

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this fallback once your website is seeded.
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    const legalPage = await queryLegalPageBySlug({ slug: decodedSlug })

    if (!legalPage) {
      return <PayloadRedirects url={url} />
    }

    return (
      <article className="legal-page">
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <div className="container">
          <header className="legal-page__header">
            <span className="legal-page__eyebrow">Legal</span>
            <h1 className="legal-page__title">{legalPage.title}</h1>
            {legalPage.meta?.description && (
              <p className="legal-page__description">{legalPage.meta.description}</p>
            )}
          </header>

          <div className="legal-page__content">
            {legalPage.contentMode === 'externalEmbed' && legalPage.embed ? (
              <div className="legal-page__embed">
                <ExternalEmbed embed={legalPage.embed} />
              </div>
            ) : (
              legalPage.content && (
                <RichText
                  className="legal-page__rich-text"
                  data={legalPage.content}
                  enableGutter={false}
                />
              )
            )}
          </div>
        </div>
      </article>
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
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({ slug: decodedSlug })

  if (page) {
    return generateMeta({ doc: page })
  }

  const legalPage = await queryLegalPageBySlug({ slug: decodedSlug })

  return {
    title: legalPage?.meta?.title || legalPage?.title,
    description: legalPage?.meta?.description || undefined,
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryLegalPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'legal-pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
