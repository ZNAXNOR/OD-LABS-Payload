import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  pageType?: string | null | undefined
}

export const generatePreviewPath = ({ collection, slug, pageType }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  let path = `${collectionPrefixMap[collection]}/${encodedSlug}`

  if (collection === 'pages') {
    if (pageType && pageType !== 'default' && pageType !== 'page') {
      path = `/${pageType}/${encodedSlug}`
    } else {
      path = `/${encodedSlug}`
    }
  }

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  if (pageType) {
    encodedParams.append('pageType', pageType)
  }

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
