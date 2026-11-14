/**
 * Shared Next.js Data Cache tags.
 *
 * Keep collection tags separate from navigation tags so collection mutations
 * can invalidate both detail queries and derived navigation metadata.
 */
export const CACHE_TAGS = {
  pages: 'pages',
  pagesNavigation: 'pages-navigation',
  legalPages: 'legal-pages',
  legalPagesNavigation: 'legal-pages-navigation',
  posts: 'posts',
  postsNavigation: 'posts-navigation',
} as const
