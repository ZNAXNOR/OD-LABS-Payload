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
import { TableOfContents } from '@/table-of-content/Component'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const documents = await payload.find({
    collection: 'documents',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const pageParams = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  const documentParams = documents.docs?.map(({ slug }) => {
    return { slug }
  })

  return [...(pageParams || []), ...(documentParams || [])]
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page:
    | RequiredDataFromCollectionSlug<'pages'>
    | RequiredDataFromCollectionSlug<'documents'>
    | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // If no page found, try documents collection
  if (!page) {
    page = await queryDocumentBySlug({
      slug: decodedSlug,
    })
  }

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero } = page
  // Check if it's a page (has layout) or document (has content)
  const isDocument = 'content' in page
  const layout = !isDocument && 'layout' in page ? page.layout : undefined
  const content = isDocument && 'content' in page ? page.content : undefined
  const tableOfContents = isDocument && 'tableOfContents' in page ? page.tableOfContents : undefined
  const document = isDocument ? (page as RequiredDataFromCollectionSlug<'documents'>) : undefined

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      {layout && <RenderBlocks blocks={layout} />}
      {content && (
        <div className="flex flex-col items-center gap-4 mt-16">
          <div className="container lg:flex lg:gap-12">
            {tableOfContents?.isEnabled && (
              <aside className="w-full shrink-0 lg:w-[250px] mb-8 lg:mb-0">
                <div className="lg:sticky lg:top-24">
                  <TableOfContents post={document!} />
                </div>
              </aside>
            )}

            <div className="min-w-0 flex-1">
              <RichText className="mx-auto max-w-[48rem]" data={content} enableGutter={false} />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  let page:
    | RequiredDataFromCollectionSlug<'pages'>
    | RequiredDataFromCollectionSlug<'documents'>
    | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  // If no page found, try documents collection
  if (!page) {
    page = await queryDocumentBySlug({
      slug: decodedSlug,
    })
  }

  return generateMeta({ doc: page })
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

const queryDocumentBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'documents',
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
