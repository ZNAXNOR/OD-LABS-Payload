import type { Metadata } from 'next'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { SitemapView } from './SitemapView'
import type { SitemapData, SitemapFeedItem, SitemapRouteItem, SitemapSectionAnchor } from './types'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const url = `${getServerSideURL()}/sitemap`

  return {
    title: 'Sitemap & Directory | OD LABS',
    description:
      'Comprehensive topology and routing directory of published OD LABS pages, engineering notes, legal policies, and machine-readable sitemaps.',
    openGraph: mergeOpenGraph({
      title: 'Sitemap & Directory | OD LABS',
      url,
    }),
    alternates: {
      canonical: url,
    },
  }
}

export default async function SitemapPage() {
  const payload = await getPayload({ config: configPromise })

  const [pagesResult, postsResult, legalResult] = await Promise.all([
    payload.find({
      collection: 'pages',
      draft: false,
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      depth: 1,
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      depth: 1,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'legal-pages',
      draft: false,
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      depth: 0,
      sort: 'title',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
  ])

  // Extract pages and their layout anchor sections
  const dynamicPages: SitemapRouteItem[] = pagesResult.docs
    .filter((doc) => Boolean(doc?.slug))
    .sort((a, b) => {
      if (a.slug === 'home') return -1
      if (b.slug === 'home') return 1
      return (a.title || '').localeCompare(b.title || '')
    })
    .map((doc, idx) => {
      const pageHref = doc.slug === 'home' ? '/' : `/${doc.slug}`
      const sections: SitemapSectionAnchor[] = []

      if (doc.hero && doc.hero.type !== 'none') {
        sections.push({
          id: 'hero',
          label: 'Hero',
          href: `${pageHref}#hero`,
        })
      }

      for (const block of doc.layout ?? []) {
        const label = block.blockName || block.blockType
        if (!label || !block.id) continue
        sections.push({
          id: block.id,
          label,
          href: `${pageHref}#${block.id}`,
        })
      }

      return {
        number: String(idx + 1).padStart(2, '0'),
        title: doc.title || (doc.slug === 'home' ? 'Home' : doc.slug),
        slug: doc.slug,
        href: pageHref,
        description: doc.meta?.description || (doc.slug === 'home' ? 'Main landing terminal' : null),
        updatedAt: doc.updatedAt,
        sections: sections.length > 0 ? sections : undefined,
      }
    })

  // Ensure default system static routes are represented
  const hasPostsRoute = dynamicPages.some((p) => p.href === '/posts')
  const hasSearchRoute = dynamicPages.some((p) => p.href === '/search')
  const hasSitemapRoute = dynamicPages.some((p) => p.href === '/sitemap')

  let counter = dynamicPages.length
  if (!hasPostsRoute) {
    counter++
    dynamicPages.push({
      number: String(counter).padStart(2, '0'),
      title: 'Insights & Publications Archive',
      slug: 'posts',
      href: '/posts',
      description: 'Collection of technical engineering articles, research notes, and insights.',
    })
  }

  if (!hasSearchRoute) {
    counter++
    dynamicPages.push({
      number: String(counter).padStart(2, '0'),
      title: 'Knowledgebase Search',
      slug: 'search',
      href: '/search',
      description: 'Full-text query interface across documentation, articles, and content.',
    })
  }

  if (!hasSitemapRoute) {
    counter++
    dynamicPages.push({
      number: String(counter).padStart(2, '0'),
      title: 'System Routing Directory',
      slug: 'sitemap',
      href: '/sitemap',
      description: 'Directory and topology map of all public routes and endpoints.',
    })
  }

  // Format posts
  const posts: SitemapRouteItem[] = postsResult.docs
    .filter((doc) => Boolean(doc?.slug))
    .map((doc, idx) => {
      let categoryName: string | null = null
      let categorySlug: string | null = null

      if (Array.isArray(doc.categories) && doc.categories.length > 0) {
        const firstCategory = doc.categories[0]
        if (typeof firstCategory === 'object' && firstCategory !== null && 'title' in firstCategory) {
          categoryName = firstCategory.title as string
          categorySlug = (firstCategory.slug as string) || null
        }
      }

      return {
        number: String(idx + 1).padStart(2, '0'),
        title: doc.title,
        slug: doc.slug,
        href: `/posts/${doc.slug}`,
        description: doc.meta?.description || null,
        publishedAt: doc.publishedAt || doc.createdAt,
        updatedAt: doc.updatedAt,
        category: categoryName,
        categorySlug,
      }
    })

  // Format legal pages
  const legalPages: SitemapRouteItem[] = legalResult.docs
    .filter((doc) => Boolean(doc?.slug))
    .map((doc, idx) => ({
      number: String(idx + 1).padStart(2, '0'),
      title: doc.title,
      slug: doc.slug,
      href: `/${doc.slug}`,
      description: doc.meta?.description || null,
      documentType: doc.documentType || 'Legal Specification',
      updatedAt: doc.updatedAt,
    }))

  // Define machine-readable feeds
  const feeds: SitemapFeedItem[] = [
    {
      number: '01',
      title: 'Pages XML Sitemap',
      href: '/pages-sitemap.xml',
      endpoint: '/pages-sitemap.xml',
      format: 'XML',
      description: 'Search engine index feed for all core application and landing pages.',
    },
    {
      number: '02',
      title: 'Posts XML Sitemap',
      href: '/posts-sitemap.xml',
      endpoint: '/posts-sitemap.xml',
      format: 'XML',
      description: 'Search engine index feed for all published engineering publications.',
    },
    {
      number: '03',
      title: 'Legal Pages XML Sitemap',
      href: '/legal-pages-sitemap.xml',
      endpoint: '/legal-pages-sitemap.xml',
      format: 'XML',
      description: 'Search engine index feed for all regulatory and compliance documents.',
    },
    {
      number: '04',
      title: 'Robots Specification',
      href: '/robots.txt',
      endpoint: '/robots.txt',
      format: 'TXT',
      description: 'Crawler crawler policy directives and sitemap declarations.',
    },
  ]

  const totalRoutes = dynamicPages.length + posts.length + legalPages.length + feeds.length

  const sitemapData: SitemapData = {
    pages: dynamicPages,
    posts,
    legalPages,
    feeds,
    stats: {
      totalPages: dynamicPages.length,
      totalPosts: posts.length,
      totalLegalPages: legalPages.length,
      totalFeeds: feeds.length,
      totalRoutes,
    },
  }

  return <SitemapView data={sitemapData} />
}
