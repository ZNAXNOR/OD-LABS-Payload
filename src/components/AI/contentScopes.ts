export const CONTENT_SCOPES = [
  {
    value: 'all',
    label: 'All content',
    description: 'Search all published OD LABS content.',
    collections: ['pages', 'posts'],
    icon: null,
  },
  {
    value: 'pages',
    label: 'Pages',
    description: 'Search published website pages only.',
    collections: ['pages'],
    icon: 'FileText',
  },
  {
    value: 'posts',
    label: 'Blog posts',
    description: 'Search published blog posts only.',
    collections: ['posts'],
    icon: 'Newspaper',
  },
] as const

export type ContentScope = (typeof CONTENT_SCOPES)[number]['value']
export type ContentCollection =
  (typeof CONTENT_SCOPES)[number]['collections'][number]

export const CONTENT_COLLECTIONS = [
  ...new Set(CONTENT_SCOPES.flatMap((scope) => scope.collections)),
] as ContentCollection[]

export const isContentScope = (value: unknown): value is ContentScope =>
  typeof value === 'string' &&
  CONTENT_SCOPES.some((scope) => scope.value === value)

export const DEFAULT_CONTENT_SCOPE: ContentScope = 'all'

export const getContentCategory = (collection: string) =>
  CONTENT_SCOPES.find(
    (scope) => scope.value !== 'all' && scope.collections.includes(collection as never),
  )
