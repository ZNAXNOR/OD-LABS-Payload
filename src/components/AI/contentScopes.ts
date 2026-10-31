export const CONTENT_SCOPES = [
  {
    value: 'all',
    label: 'All content',
    description: 'Search all published OD LABS content.',
    collections: ['pages', 'posts'],
  },
  {
    value: 'pages',
    label: 'Pages',
    description: 'Search published website pages only.',
    collections: ['pages'],
  },
  {
    value: 'posts',
    label: 'Blog posts',
    description: 'Search published blog posts only.',
    collections: ['posts'],
  },
] as const

export type ContentScope = (typeof CONTENT_SCOPES)[number]['value']

export const isContentScope = (value: unknown): value is ContentScope =>
  typeof value === 'string' &&
  CONTENT_SCOPES.some((scope) => scope.value === value)

export const DEFAULT_CONTENT_SCOPE: ContentScope = 'all'
