import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  const getPageSlug = (page: Page) => {
    const { slug, pageType } = page
    let prefix = ''
    if (typeof pageType === 'string' && pageType !== 'standard') {
      prefix = `/${pageType}`
    }
    return `${prefix}/${slug}`
  }

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Page | Post

      if (collection === 'pages') {
        redirectUrl = getPageSlug(document as Page)
      } else {
        redirectUrl = `/${collection}/${document?.slug}`
      }
    } else {
      const relationTo = redirectItem.to?.reference?.relationTo
      const value = redirectItem.to?.reference?.value

      if (relationTo === 'pages' && typeof value === 'object') {
        redirectUrl = getPageSlug(value as Page)
      } else {
        const slug = typeof value === 'object' ? value?.slug : ''
        redirectUrl = `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${slug}`
      }
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
