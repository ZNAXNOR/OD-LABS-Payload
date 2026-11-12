import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Post } from '../../../payload-types'
import { CACHE_TAGS } from '../../../utilities/cacheTags'

const getPostPath = (slug?: string | null) => `/posts/${slug}`

const revalidatePostCaches = () => {
  revalidateTag(CACHE_TAGS.posts, { expire: 0 })
  revalidateTag(CACHE_TAGS.postsNavigation, { expire: 0 })
  revalidateTag('posts-sitemap', { expire: 0 })
  revalidatePath('/posts')
  revalidatePath('/sitemap')
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
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
        const currentPath = getPostPath(doc.slug)
        payload.logger.info(`Revalidating post at path: ${currentPath}`)
        revalidatePath(currentPath)
      }

      if (wasPublished && (slugChanged || !isPublished)) {
        const previousPath = getPostPath(previousDoc?.slug)
        payload.logger.info(`Revalidating previous post path: ${previousPath}`)
        revalidatePath(previousPath)
      }

      revalidatePostCaches()
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(getPostPath(doc.slug))
    revalidatePostCaches()
  }

  return doc
}
