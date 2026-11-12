import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { LegalPage } from '../../../payload-types'
import { CACHE_TAGS } from '../../../utilities/cacheTags'

const getLegalPagePath = (slug?: string | null) => `/${slug}`

const revalidateLegalPageCaches = () => {
  revalidateTag(CACHE_TAGS.legalPages, { expire: 0 })
  revalidateTag(CACHE_TAGS.legalPagesNavigation, { expire: 0 })
  revalidateTag('legal-pages-sitemap', { expire: 0 })
  revalidatePath('/sitemap')
}

export const revalidateLegalPage: CollectionAfterChangeHook<LegalPage> = ({
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
      if (isPublished) {
        const currentPath = getLegalPagePath(doc.slug)
        payload.logger.info(`Revalidating legal page at path: ${currentPath}`)
        revalidatePath(currentPath)
      }

      if (wasPublished && (slugChanged || !isPublished)) {
        const previousPath = getLegalPagePath(previousDoc?.slug)
        payload.logger.info(`Revalidating previous legal page path: ${previousPath}`)
        revalidatePath(previousPath)
      }

      revalidateLegalPageCaches()
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<LegalPage> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(getLegalPagePath(doc.slug))
    revalidateLegalPageCaches()
  }

  return doc
}
