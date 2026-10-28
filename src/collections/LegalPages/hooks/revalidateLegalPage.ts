import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { LegalPage } from '../../../payload-types'

export const revalidateLegalPage: CollectionAfterChangeHook<LegalPage> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${doc.slug}`

      payload.logger.info(`Revalidating legal page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('legal-pages-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old legal page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('legal-pages-sitemap', 'max')
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<LegalPage> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/${doc.slug}`)
    revalidateTag('legal-pages-sitemap', 'max')
  }

  return doc
}
