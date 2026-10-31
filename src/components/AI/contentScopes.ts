export const CONTENT_CATEGORIES = [
  {
    value: 'pages',
    label: 'Pages',
    description: 'Published website pages.',
    collection: 'pages',
    icon: 'FileText',
  },
  {
    value: 'posts',
    label: 'Blog posts',
    description: 'Published blog posts.',
    collection: 'posts',
    icon: 'Newspaper',
  },
] as const

export type ContentScope = 'all' | (typeof CONTENT_CATEGORIES)[number]['value']
export type ContentCollection =
  (typeof CONTENT_CATEGORIES)[number]['collection']

export const CONTENT_COLLECTIONS = CONTENT_CATEGORIES.map(
  (category) => category.collection,
) as ContentCollection[]

export const CONTENT_SCOPES = [
  {
    value: 'all',
    label: 'All content',
    description: 'Search all published OD LABS content.',
    collections: CONTENT_COLLECTIONS,
    icon: null,
  },
  ...CONTENT_CATEGORIES.map((category) => ({
    value: category.value,
    label: category.label,
    description: category.description,
    collections: [category.collection],
    icon: category.icon,
  })),
] satisfies Array<{
  value: ContentScope
  label: string
  description: string
  collections: readonly string[]
  icon: string | null
}>

export const isContentScope = (value: unknown): value is ContentScope =>
  typeof value === 'string' &&
  CONTENT_SCOPES.some((scope) => scope.value === value)

export const DEFAULT_CONTENT_SCOPE: ContentScope = 'all'

export const getContentCategory = (collection: string): { icon: string } | undefined =>
  CONTENT_CATEGORIES.find((category) => category.collection === collection)
