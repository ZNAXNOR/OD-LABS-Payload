import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import { TableOfContents } from '@/table-of-content/Component'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({
    collection: 'services',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const serviceParams = services.docs?.map(({ slug }) => {
    return { slug }
  })

  return serviceParams || []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  // If slug is missing, we might want to handle it (e.g., /services root), but for now assume slug is there.
  if (!slug) {
    // Handle missing slug, maybe redirect or 404
    return <PayloadRedirects url="/services" />
  }

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/services/' + decodedSlug

  const page = await queryServiceBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { content, tableOfContents } = page

  return (
    <article className="pt-16 pb-24">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={page} />

      {content && (
        <div className="flex flex-col items-center gap-4 mt-16">
          <div className="container lg:flex lg:gap-12">
            {tableOfContents?.isEnabled && (
              <aside className="w-full shrink-0 lg:w-[250px] mb-8 lg:mb-0">
                <div className="lg:sticky lg:top-24">
                  <TableOfContents post={page} />
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
  const { slug } = await paramsPromise
  if (!slug) return {}

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryServiceBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryServiceBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
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
