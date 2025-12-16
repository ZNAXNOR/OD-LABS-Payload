import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const services = await payload.find({
    collection: 'services',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Services</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="services"
          currentPage={services.page}
          limit={12}
          totalDocs={services.totalDocs}
        />
      </div>

      <CollectionArchive posts={services.docs} relationTo="services" />

      <div className="container">
        {services.totalPages > 1 && services.page && (
          <Pagination page={services.page} totalPages={services.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `OD LABS Services`,
  }
}
