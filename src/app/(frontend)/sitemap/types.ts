export type SitemapCategory = 'all' | 'pages' | 'posts' | 'legal' | 'feeds'

export interface SitemapSectionAnchor {
  id: string
  label: string
  href: string
}

export interface SitemapRouteItem {
  number: string
  title: string
  href: string
  slug: string
  description?: string | null
  updatedAt?: string | null
  publishedAt?: string | null
  category?: string | null
  categorySlug?: string | null
  documentType?: string | null
  badge?: string | null
  sections?: SitemapSectionAnchor[]
}

export interface SitemapFeedItem {
  number: string
  title: string
  href: string
  format: 'XML' | 'TXT'
  description: string
  endpoint: string
  lastmod?: string | null
}

export interface SitemapData {
  pages: SitemapRouteItem[]
  posts: SitemapRouteItem[]
  legalPages: SitemapRouteItem[]
  feeds: SitemapFeedItem[]
  stats: {
    totalPages: number
    totalPosts: number
    totalLegalPages: number
    totalFeeds: number
    totalRoutes: number
  }
}
