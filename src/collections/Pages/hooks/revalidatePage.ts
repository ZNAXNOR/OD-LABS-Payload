import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Page } from '../../../payload-types'
import { CACHE_TAGS } from '../../../utilities/cacheTags'

const getPagePath = (slug?: string | null) => (slug === 'home' ? '/' : `/${slug}`)

const revalidatePageCaches = () => {
  // Expire immediately: a publish/unpublish should not serve a stale document
  // on the next request while a background refresh is pending.
  revalidateTag(CACHE_TAGS.pages, { expire: 0 })
  revalidateTag(CACHE_TAGS.pagesNavigation, { expire: 0 })
  revalidateTag('pages-sitemap', { expire: 0 })
  revalidatePath('/sitemap')
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const wasPublished = previousDoc?._status === 'published'
    const isPublished = doc._status === 'published'
    const slugChanged = Boolean(
      wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug,
    )

    if (isPublished || wasPublished) {
      const currentPath = getPagePath(doc.slug)
      const previousPath = wasPublished ? getPagePath(previousDoc?.slug) : null

      if (isPublished) {
        payload.logger.info(`Revalidating page at path: ${currentPath}`)
        revalidatePath(currentPath)
      }

      if (previousPath && (slugChanged || !isPublished)) {
        payload.logger.info(`Revalidating previous page path: ${previousPath}`)
        revalidatePath(previousPath)
      }

      revalidatePageCaches()
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(getPagePath(doc.slug))
    revalidatePageCaches()
  }

  return doc
}
