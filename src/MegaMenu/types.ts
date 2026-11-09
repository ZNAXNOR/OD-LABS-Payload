import type { Media } from '@/payload-types'
import type { PagesData } from '@/getPagesData'
import type { LegalPagesData } from '@/getLegalPagesData'
import type { PostsData } from '@/getPostsData'

export type ErrorStateCode = '404' | '500' | '503' | 'ERR'

export interface ErrorRecoveryAction {
  number: string
  label: string
  href: string
}

interface ContextBase {
  title: string
  slug: string
  href: string
  description: string
}

export interface PageContextData extends ContextBase {
  type: 'page'
  seoImage: Media | null
  sections: PagesData['sections']
}

export interface PostContextData extends ContextBase {
  type: 'post'
  seoImage: Media | null
  publishedAt: string | null
  categories: string[]
  relatedPosts: PostsData['relatedPosts']
}

export interface PostsIndexContextData extends ContextBase {
  type: 'posts-index'
  latestPosts: PostsData[]
}

export interface LegalContextData extends ContextBase {
  type: 'legal'
  documentType: LegalPagesData['documentType']
  updatedAt: string
  seoImage: Media | null
}

export interface StandaloneContextData extends ContextBase {
  type: 'standalone'
}

export interface ErrorContextData extends ContextBase {
  type: 'error'
  code: ErrorStateCode
  recoveryActions: ErrorRecoveryAction[]
  error?: Error & { digest?: string }
  retry?: () => void
}

export type CurrentPageInfo =
  | PageContextData
  | PostContextData
  | PostsIndexContextData
  | LegalContextData
  | StandaloneContextData
  | ErrorContextData

export type { PagesData, LegalPagesData, PostsData }
