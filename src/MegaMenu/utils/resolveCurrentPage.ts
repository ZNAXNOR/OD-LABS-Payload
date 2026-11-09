import type { PagesData } from '@/getPagesData'
import type { LegalPagesData } from '@/getLegalPagesData'
import type { PostsData } from '@/getPostsData'
import type { CurrentPageInfo, ErrorRecoveryAction, ErrorStateCode } from '../types'

export interface RuntimeErrorState {
  code: ErrorStateCode
  error?: Error & { digest?: string }
  retry?: () => void
}

interface ResolveCurrentPageArgs {
  pathname: string | null
  pages: PagesData[]
  legalPages?: LegalPagesData[]
  posts?: PostsData[]
  activePost?: PostsData | null
  runtimeError?: RuntimeErrorState | null
}

const RECOVERY_ACTIONS: Record<ErrorStateCode, ErrorRecoveryAction[]> = {
  '404': [
    { number: '01', label: 'Return Home', href: '/' },
    { number: '02', label: 'View Sitemap', href: '/sitemap' },
    { number: '03', label: 'Knowledge Search', href: '/search' },
  ],
  '500': [
    { number: '01', label: 'Return Home', href: '/' },
    { number: '02', label: 'View Sitemap', href: '/sitemap' },
  ],
  '503': [
    { number: '01', label: 'Return Home', href: '/' },
    { number: '02', label: 'View Sitemap', href: '/sitemap' },
  ],
  ERR: [{ number: '01', label: 'Return Home', href: '/' }],
}

const SYSTEM_ROUTES: Record<string, { title: string; description: string }> = {
  sitemap: {
    title: 'Sitemap',
    description: 'Browse the public pages and content available across OD LABS.',
  },
  search: {
    title: 'Knowledge Search',
    description: 'Search published articles, documentation and topics.',
  },
  posts: {
    title: 'Insights & Posts',
    description: 'Engineering publications, research notes and updates.',
  },
  'sentry-example-page': {
    title: 'Telemetry Diagnostic Page',
    description: 'Diagnostic page for testing the Sentry monitoring integration.',
  },
}

const createErrorContext = (
  code: ErrorStateCode,
  href: string,
  runtimeError?: RuntimeErrorState | null,
): CurrentPageInfo => {
  const title =
    code === '404' ? 'Resource Not Found' :
    code === '500' ? 'Internal Execution Error' :
    code === '503' ? 'Service Unavailable' : 'Unexpected Error'

  const description =
    code === '404'
      ? 'The requested page could not be found. It may have moved, been unpublished or never existed.'
      : code === '500'
        ? 'An unexpected error occurred while processing this request. Recovery options are available.'
        : code === '503'
          ? 'The requested service is temporarily unavailable. Please try again later.'
          : 'An unexpected condition prevented this page from loading.'

  return {
    type: 'error',
    code,
    title,
    slug: code,
    href,
    description,
    recoveryActions: RECOVERY_ACTIONS[code],
    error: runtimeError?.error,
    retry: runtimeError?.retry,
  }
}

export function resolveCurrentPage({
  pathname,
  pages = [],
  legalPages = [],
  posts = [],
  activePost,
  runtimeError,
}: ResolveCurrentPageArgs): CurrentPageInfo {
  const path = pathname ? pathname.replace(/\/$/, '') || '/' : '/'

  if (runtimeError) return createErrorContext(runtimeError.code, path, runtimeError)
  if (path === '/404' || path === '/not-found') return createErrorContext('404', path)
  if (path === '/500') return createErrorContext('500', path)
  if (path === '/503' || path === '/maintenance' || path === '/error') {
    return createErrorContext('503', path)
  }

  const page = pages.find((item) => item.href === path)
  if (page) {
    return {
      type: 'page',
      title: page.title,
      slug: page.slug,
      href: page.href,
      description: page.description || 'Published OD LABS page.',
      seoImage: page.seoImage,
      sections: page.sections,
    }
  }

  const legalPage = legalPages.find((item) => item.href === path)
  if (legalPage) {
    return {
      type: 'legal',
      title: legalPage.title,
      slug: legalPage.slug,
      href: legalPage.href,
      description: legalPage.description,
      documentType: legalPage.documentType,
      updatedAt: legalPage.updatedAt,
      seoImage: legalPage.seoImage,
    }
  }

  if (path === '/posts' || path.startsWith('/posts/page/')) {
    return {
      type: 'posts-index',
      title: 'Insights & Posts',
      slug: 'posts',
      href: '/posts',
      description: SYSTEM_ROUTES.posts.description,
      latestPosts: posts.slice(0, 4),
    }
  }

  if (path.startsWith('/posts/')) {
    const slug = decodeURIComponent(path.slice('/posts/'.length).split('/')[0] || '')
    const post = activePost?.slug === slug ? activePost : posts.find((item) => item.slug === slug)
    if (post) {
      return {
        type: 'post',
        title: post.title,
        slug: post.slug,
        href: post.href,
        description: post.metaDescription || post.description || 'Published OD LABS article.',
        seoImage: post.seoImage,
        publishedAt: post.publishedAt,
        categories: post.categories,
        relatedPosts: post.relatedPosts.length > 0
          ? post.relatedPosts
          : posts
              .filter((candidate) =>
                candidate.slug !== post.slug &&
                candidate.categories.some((category) => post.categories.includes(category)),
              )
              .slice(0, 4)
              .map((candidate) => ({ title: candidate.title, href: candidate.href })),
      }
    }
    return {
      type: 'standalone',
      title: 'Loading publication',
      slug,
      href: path,
      description: 'Loading publication metadata for the current route.',
    }
  }

  const systemRoute = SYSTEM_ROUTES[path.slice(1)]
  if (systemRoute) {
    return {
      type: 'standalone',
      title: systemRoute.title,
      slug: path.slice(1),
      href: path,
      description: systemRoute.description,
    }
  }

  return createErrorContext('404', path)
}
