import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  // Check if revalidation is disabled via context flag
  if (context.disableRevalidate) {
    return doc
  }

  // Handle published status changes
  if (doc._status === 'published') {
    // Determine the path to revalidate
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

    payload.logger.info(`Revalidating page at path: ${path}`)
    revalidatePath(path)
  }

  // Handle unpublish (when previously published but now not)
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

    payload.logger.info(`Revalidating unpublished page at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  // Handle slug changes (revalidate both old and new paths)
  if (previousDoc?.slug && doc.slug !== previousDoc.slug && previousDoc._status === 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

    payload.logger.info(`Revalidating old path after slug change: ${oldPath}`)
    revalidatePath(oldPath)
  }

  return doc
}
