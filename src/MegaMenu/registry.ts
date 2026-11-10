import type { Media } from '@/payload-types'
import type { PagesData } from '@/getPagesData'
import type { PostsData } from '@/getPostsData'
import type { LegalPagesData } from '@/getLegalPagesData'

export type MegaMenuEntryKind = 'page' | 'post' | 'legal'

export interface MegaMenuEntry {
  id: string
  kind: MegaMenuEntryKind
  title: string
  slug: string
  href: string
  description: string
  image: Media | null
  showSeoImageInMegaMenu: boolean
  showCssPreviewInMegaMenu: boolean
  sections: PagesData['sections']
  publishedAt?: string | null
  categories?: string[]
  documentType?: string | null
  updatedAt?: string
  destinationLabel: string
}

export interface MegaMenuCategory {
  slug: string
  label: string
  order: number
  layout: string
  entries: MegaMenuEntry[]
}

export const megaMenuCollectionRegistry = [
  { slug: 'pages', label: 'Pages', order: 1, layout: 'list', enabled: true },
  { slug: 'posts', label: 'Posts', order: 2, layout: 'editorial', enabled: true },
  { slug: 'legal-pages', label: 'Legal', order: 3, layout: 'list', enabled: true },
] as const

export const buildMegaMenuCategories = (
  pages: PagesData[],
  posts: PostsData[],
  legalPages: LegalPagesData[],
): MegaMenuCategory[] => {
  const entriesByCollection: Record<string, MegaMenuEntry[]> = {
    pages: pages.map((page) => ({
      id: 'page:' + page.slug, kind: 'page', title: page.title, slug: page.slug, href: page.href,
      description: page.description, image: page.seoImage,
      showSeoImageInMegaMenu: page.showSeoImageInMegaMenu,
      showCssPreviewInMegaMenu: page.showCssPreviewInMegaMenu,
      sections: page.sections, destinationLabel: 'page',
    })),
    posts: posts.map((post) => ({
      id: 'post:' + post.slug, kind: 'post', title: post.title, slug: post.slug, href: post.href,
      description: post.metaDescription || post.description, image: post.seoImage,
      showSeoImageInMegaMenu: post.showSeoImageInMegaMenu,
      showCssPreviewInMegaMenu: post.showCssPreviewInMegaMenu,
      sections: [], publishedAt: post.publishedAt, categories: post.categories,
      destinationLabel: 'post',
    })),
    'legal-pages': legalPages.map((page) => ({
      id: 'legal:' + page.slug, kind: 'legal', title: page.title, slug: page.slug, href: page.href,
      description: page.description, image: page.seoImage,
      showSeoImageInMegaMenu: page.showSeoImageInMegaMenu,
      showCssPreviewInMegaMenu: page.showCssPreviewInMegaMenu,
      sections: [], documentType: page.documentType, updatedAt: page.updatedAt,
      destinationLabel: 'document',
    })),
  }

  return megaMenuCollectionRegistry
    .filter((collection) => collection.enabled)
    .map((collection) => ({ ...collection, entries: entriesByCollection[collection.slug] ?? [] }))
    .filter((category) => category.entries.length > 0)
    .sort((a, b) => a.order - b.order)
}
