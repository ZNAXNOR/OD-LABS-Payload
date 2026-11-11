import type { PagesData } from '@/getPagesData'
import type { LegalPagesData } from '@/getLegalPagesData'
import type { CurrentPageInfo, ErrorRecoveryAction } from '../types'

interface ResolveCurrentPageArgs {
  pathname: string | null
  pages: PagesData[]
  legalPages?: LegalPagesData[]
}

const DEFAULT_404_RECOVERY_ACTIONS: ErrorRecoveryAction[] = [
  { number: '01', label: 'Main Terminal', href: '/' },
  { number: '02', label: 'Sitemap Directory', href: '/sitemap' },
  { number: '03', label: 'Knowledge Search', href: '/search' },
  { number: '04', label: 'Browse Posts', href: '/posts' },
]

const DEFAULT_500_RECOVERY_ACTIONS: ErrorRecoveryAction[] = [
  { number: '01', label: 'Return Home', href: '/' },
  { number: '02', label: 'Sitemap Directory', href: '/sitemap' },
  { number: '03', label: 'Knowledge Search', href: '/search' },
]

const DEFAULT_503_RECOVERY_ACTIONS: ErrorRecoveryAction[] = [
  { number: '01', label: 'Main Terminal', href: '/' },
  { number: '02', label: 'Sitemap Directory', href: '/sitemap' },
]

const KNOWN_SYSTEM_ROUTES: Record<
  string,
  { title: string; description: string }
> = {
  sitemap: {
    title: 'Sitemap',
    description:
      'System routing directory and topology map of all public application routes, specifications, and feeds.',
  },
  search: {
    title: 'Knowledge Search',
    description:
      'Full-text search interface querying articles, documentation, topics, and knowledgebase records.',
  },
  posts: {
    title: 'Insights & Posts',
    description:
      'Technical engineering publications, architecture breakdowns, research notes, and updates.',
  },
  'sentry-example-page': {
    title: 'Telemetry Diagnostic Page',
    description:
      'Diagnostic testing suite verifying real-time Sentry exception capture and monitoring pipelines.',
  },
}

export function resolveCurrentPage({
  pathname,
  pages = [],
  legalPages = [],
}: ResolveCurrentPageArgs): CurrentPageInfo {
  const path = pathname ? pathname.replace(/\/$/, '') || '/' : '/'
  const currentSlug = path === '/' ? 'home' : path.split('/')[1] || 'home'

  // Tier 0: Explicit Error Routes (404, 500, 503 / maintenance)
  if (currentSlug === '404' || path.includes('not-found')) {
    return {
      title: 'Resource Not Found',
      slug: '404',
      href: path,
      description:
        'The requested endpoint does not exist, has migrated, or is temporarily unavailable in the routing table.',
      isPayloadDoc: false,
      source: 'error-404',
      errorCode: '404',
      errorEyebrow: ['ERROR', 'ROUTE_RESOLUTION_FAILURE'],
      recoveryActions: DEFAULT_404_RECOVERY_ACTIONS,
    }
  }

  if (currentSlug === '500') {
    return {
      title: 'Internal Execution Error',
      slug: '500',
      href: path,
      description:
        'An unexpected runtime error occurred while processing the request. Our telemetry monitors have been alerted and recovery options are ready.',
      isPayloadDoc: false,
      source: 'error-500',
      errorCode: '500',
      errorEyebrow: ['SYSTEM EXCEPTION', 'UNHANDLED_RUNTIME_ERROR'],
      recoveryActions: DEFAULT_500_RECOVERY_ACTIONS,
    }
  }

  if (
    currentSlug === '503' ||
    currentSlug === 'maintenance' ||
    path === '/error'
  ) {
    return {
      title: 'Service Anomaly Detected',
      slug: currentSlug,
      href: path,
      description:
        'System telemetry detected a non-standard runtime or maintenance condition. Health monitors are actively polling.',
      isPayloadDoc: false,
      source: 'error-something',
      errorCode: '503',
      errorEyebrow: ['SERVICE ALERT', 'ANOMALY_DETECTED'],
      recoveryActions: DEFAULT_503_RECOVERY_ACTIONS,
    }
  }

  // Tier 1: Check Payload CMS pages collection
  const matchedPage = pages.find(
    (page) => page.slug === currentSlug || page.href === path,
  )
  if (matchedPage) {
    return {
      title: matchedPage.title,
      slug: matchedPage.slug,
      href: matchedPage.href,
      description: matchedPage.description || 'OD LABS publication.',
      isPayloadDoc: true,
      source: 'payload-pages',
      sections: matchedPage.sections,
    }
  }

  // Tier 2: Check Payload CMS legal-pages collection
  const matchedLegal = legalPages.find(
    (lp) =>
      lp.slug === currentSlug || lp.href === path || `/${lp.slug}` === path,
  )
  if (matchedLegal) {
    return {
      title: matchedLegal.title,
      slug: matchedLegal.slug,
      href: matchedLegal.href,
      description:
        'Governance, legal terms, and compliance specification document.',
      isPayloadDoc: true,
      source: 'payload-legal',
    }
  }

  // Tier 3: Check known standalone Next.js routes
  const known = KNOWN_SYSTEM_ROUTES[currentSlug]
  if (known) {
    return {
      title: known.title,
      slug: currentSlug,
      href: path,
      description: known.description,
      isPayloadDoc: false,
      source: 'system-raw',
    }
  }

  // Tier 3b: Handle post articles (/posts/[slug] or /posts/page/[pageNumber])
  if (path.startsWith('/posts/')) {
    return {
      title: 'Publication Article',
      slug: currentSlug,
      href: path,
      description:
        'Engineering publication, research breakdown, or technical archive page.',
      isPayloadDoc: false,
      source: 'system-raw',
    }
  }

  // Tier 4: Unmatched route on site -> Triggers Next.js 404 (Resource Not Found)
  return {
    title: 'Resource Not Found',
    slug: currentSlug,
    href: path,
    description:
      'The requested endpoint does not exist, has migrated, or is temporarily unavailable in the routing table.',
    isPayloadDoc: false,
    source: 'error-404',
    errorCode: '404',
    errorEyebrow: ['ERROR', 'ROUTE_RESOLUTION_FAILURE'],
    recoveryActions: DEFAULT_404_RECOVERY_ACTIONS,
  }
}
