import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { BlogPage } from '../../../payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateBlog: CollectionAfterChangeHook<BlogPage> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if ((doc as any)._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('blogs-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if ((previousDoc as any)?._status === 'published' && (doc as any)._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('blogs-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<BlogPage> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('blogs-sitemap')
  }

  return doc
}
