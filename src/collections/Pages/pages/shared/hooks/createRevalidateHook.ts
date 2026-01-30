import type { CollectionAfterChangeHook } from 'payload'

interface RevalidateHookOptions {
  getRevalidationPaths?: (doc: any) => string[]
  pathPrefix?: string
}

/**
 * Factory function to create revalidation hooks for different page types
 *
 * This hook handles Next.js cache revalidation for published content, including:
 * - Publishing new content
 * - Unpublishing content
 * - Slug changes
 * - Status changes
 *
 * Performance optimizations:
 * - Skips revalidation for draft-only operations
 * - Only revalidates when status or slug actually changes
 * - Supports context flag to disable revalidation for bulk operations
 *
 * @param pathPrefixOrOptions - Either a string path prefix or options object
 * @param options - Additional options (when first param is string)
 * @returns An afterChange hook that revalidates Next.js cache when needed
 *
 * @example
 * ```typescript
 * // Simple usage
 * export const Blogs: CollectionConfig = {
 *   slug: 'blogs',
 *   hooks: {
 *     afterChange: [createRevalidateHook('blogs')],
 *   },
 * }
 *
 * // Advanced usage with custom path generation
 * export const Pages: CollectionConfig = {
 *   slug: 'pages',
 *   hooks: {
 *     afterChange: [createRevalidateHook('pages', {
 *       getRevalidationPaths: (doc) => {
 *         const paths = [`/${doc.slug}`]
 *         if (doc.pageType === 'blog') {
 *           paths.push('/blog', `/blog/${doc.slug}`)
 *         }
 *         return paths
 *       }
 *     })],
 *   },
 * }
 * ```
 */
export const createRevalidateHook = (
  pathPrefixOrOptions: string | RevalidateHookOptions,
  options?: RevalidateHookOptions,
): CollectionAfterChangeHook => {
  // Handle overloaded parameters
  let pathPrefix: string
  let config: RevalidateHookOptions

  if (typeof pathPrefixOrOptions === 'string') {
    pathPrefix = pathPrefixOrOptions
    config = options || {}
  } else {
    pathPrefix = pathPrefixOrOptions.pathPrefix || 'pages'
    config = pathPrefixOrOptions
  }

  return async ({ doc, previousDoc, req: { payload, context }, operation }) => {
    // Check if revalidation is disabled via context flag
    if (context.disableRevalidate) {
      payload.logger.info(`Revalidation skipped for ${pathPrefix} (disabled via context)`)
      return doc
    }

    // Performance optimization: Skip revalidation for draft-only operations
    if (operation === 'create' && doc._status === 'draft') {
      payload.logger.debug(`Skipping revalidation for new draft ${pathPrefix}`)
      return doc
    }

    // Performance optimization: Check if anything that affects the frontend actually changed
    const statusChanged = doc._status !== previousDoc?._status
    const slugChanged = doc.slug !== previousDoc?.slug
    const isPublished = doc._status === 'published'
    const wasPublished = previousDoc?._status === 'published'

    // If nothing relevant changed, skip revalidation
    if (!statusChanged && !slugChanged && !isPublished && !wasPublished) {
      payload.logger.debug(`Skipping revalidation for ${pathPrefix} - no relevant changes`)
      return doc
    }

    // Dynamic import to avoid build errors
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Get paths to revalidate
    let pathsToRevalidate: string[] = []

    if (config.getRevalidationPaths) {
      // Use custom path generation
      pathsToRevalidate = config.getRevalidationPaths(doc)
    } else {
      // Use default path generation
      const path =
        pathPrefix === 'pages' && doc.slug === 'home' ? '/' : `/${pathPrefix}/${doc.slug}`
      pathsToRevalidate = [path]
    }

    // Handle published status
    if (isPublished) {
      for (const path of pathsToRevalidate) {
        try {
          revalidatePath(path)
          payload.logger.info(`Revalidated ${pathPrefix} page at path: ${path}`)
        } catch (error) {
          payload.logger.error(`Failed to revalidate path ${path}: ${error}`)
        }
      }
    }

    // Handle unpublish (when previously published but now not)
    if (wasPublished && !isPublished) {
      let oldPaths: string[] = []

      if (config.getRevalidationPaths) {
        oldPaths = config.getRevalidationPaths(previousDoc)
      } else {
        const oldPath =
          pathPrefix === 'pages' && previousDoc.slug === 'home'
            ? '/'
            : `/${pathPrefix}/${previousDoc.slug}`
        oldPaths = [oldPath]
      }

      for (const path of oldPaths) {
        try {
          revalidatePath(path)
          payload.logger.info(`Revalidated unpublished ${pathPrefix} page at path: ${path}`)
        } catch (error) {
          payload.logger.error(`Failed to revalidate unpublished path ${path}: ${error}`)
        }
      }
    }

    // Handle slug changes (revalidate both old and new paths)
    if (isPublished && slugChanged && previousDoc?.slug) {
      let oldPaths: string[] = []
      let newPaths: string[] = pathsToRevalidate

      if (config.getRevalidationPaths) {
        oldPaths = config.getRevalidationPaths(previousDoc)
      } else {
        const oldPath =
          pathPrefix === 'pages' && previousDoc.slug === 'home'
            ? '/'
            : `/${pathPrefix}/${previousDoc.slug}`
        oldPaths = [oldPath]
      }

      const allPaths = Array.from(new Set([...oldPaths, ...newPaths]))

      for (const path of allPaths) {
        try {
          revalidatePath(path)
          payload.logger.info(`Revalidated ${pathPrefix} page slug change at path: ${path}`)
        } catch (error) {
          payload.logger.error(`Failed to revalidate slug change path ${path}: ${error}`)
        }
      }
    }

    // Revalidate collection tag for list pages (only if status changed or was/is published)
    if (statusChanged || isPublished || wasPublished) {
      try {
        revalidateTag(pathPrefix)
        payload.logger.info(`Revalidated ${pathPrefix} collection tag`)
      } catch (error) {
        payload.logger.error(`Failed to revalidate collection tag ${pathPrefix}: ${error}`)
      }
    }

    return doc
  }
}
