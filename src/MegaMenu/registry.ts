import type { PagesData } from '@/getPagesData'
import type { PostsData } from '@/getPostsData'

export interface MegaMenuEntry {
  id: string
  kind: 'page' | 'post'
  title: string
  slug: string
  href: string
  description: string
  image: PagesData['seoImage'] | PostsData['seoImage']
  sections: PagesData['sections']
  publishedAt?: string | null
  categories?: string[]
}

export interface MegaMenuCategory {
  slug: string
  label: string
  order: number
  layout: 'list' | 'editorial'
  entries: MegaMenuEntry[]
}

/** Explicit opt-in registry. Add a collection and its data adapter when it should appear. */
export const megaMenuCollectionRegistry = [
  { slug: 'pages', label: 'Pages', order: 1, layout: 'list', enabled: true },
  { slug: 'posts', label: 'Insights', order: 2, layout: 'editorial', enabled: true },
] as const

export const buildMegaMenuCategories = (pages: PagesData[], posts: PostsData[]): MegaMenuCategory[] => {
  const entriesByCollection: Record<string, MegaMenuEntry[]> = {
    pages: pages.map((page) => ({
      id: 'page:' + page.slug, kind: 'page', title: page.title, slug: page.slug,
      href: page.href, description: page.description, image: page.seoImage, sections: page.sections,
    })),
    posts: posts.map((post) => ({
      id: 'post:' + post.slug, kind: 'post', title: post.title, slug: post.slug,
      href: post.href, description: post.metaDescription || post.description, image: post.seoImage,
      sections: [], publishedAt: post.publishedAt, categories: post.categories,
    })),
  }

  return megaMenuCollectionRegistry
    .filter((collection) => collection.enabled)
    .map((collection) => ({ ...collection, entries: entriesByCollection[collection.slug] ?? [] }))
    .filter((category) => category.entries.length > 0)
    .sort((a, b) => a.order - b.order)
}