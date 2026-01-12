import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { ContactPage } from '../../../payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateContact: CollectionAfterChangeHook<ContactPage> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if ((doc as any)._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('contacts-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if ((previousDoc as any)?._status === 'published' && (doc as any)._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('contacts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<ContactPage> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('contacts-sitemap')
  }

  return doc
}
