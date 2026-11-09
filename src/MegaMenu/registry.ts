import type { PagesData } from '@/getPagesData'
import type { PostsData } from '@/getPostsData'

export interface MegaMenuEntry {
  id: string
  kind: string
  title: string
  slug: string
  href: string
  description: string
  image: PagesData['seoImage'] | PostsData['seoImage']
  sections: PagesData['sections']
  publishedAt?: string | null
  categories?: string[]
  previewLabel: string
  destinationLabel: string
  breadcrumbLabel: string
}

export interface MegaMenuCategory {
  slug: string
  label: string
  order: number
  layout: string
  entries: MegaMenuEntry[]
}

/**
 * Explicit opt-in registry. Add a collection and a data adapter in buildMegaMenuCategories
 * when it should appear. A tab is rendered only when its collection has published entries.
 */
export const megaMenuCollectionRegistry = [
  { slug: 'pages', label: 'Pages', order: 1, layout: 'list', enabled: true },
  { slug: 'posts', label: 'Posts', order: 2, layout: 'editorial', enabled: true },
] as const

export const buildMegaMenuCategories = (pages: PagesData[], posts: PostsData[]): MegaMenuCategory[] => {
  const entriesByCollection: Record<string, MegaMenuEntry[]> = {
    pages: pages.map((page) => ({
      id: 'page:' + page.slug, kind: 'page', title: page.title, slug: page.slug, href: page.href,
      description: page.description, image: page.seoImage, sections: page.sections,
      previewLabel: 'Page Preview', destinationLabel: 'page', breadcrumbLabel: 'Pages',
    })),
    posts: posts.map((post) => ({
      id: 'post:' + post.slug, kind: 'post', title: post.title, slug: post.slug, href: post.href,
      description: post.metaDescription || post.description, image: post.seoImage, sections: [],
      publishedAt: post.publishedAt, categories: post.categories,
      previewLabel: 'Post Preview', destinationLabel: 'post', breadcrumbLabel: 'Posts',
    })),
  }

  return megaMenuCollectionRegistry
    .filter((collection) => collection.enabled)
    .map((collection) => ({ ...collection, entries: entriesByCollection[collection.slug] ?? [] }))
    .filter((category) => category.entries.length > 0)
    .sort((a, b) => a.order - b.order)
}
