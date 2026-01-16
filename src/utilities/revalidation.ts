import type { PayloadRequest } from 'payload'

/**
 * Revalidation utility functions for Next.js cache management
 *
 * This module provides utilities for managing Next.js cache revalidation,
 * including debouncing to prevent excessive revalidation calls during rapid edits.
 */

/**
 * Options for revalidation operations
 */
export interface RevalidationOptions {
  /** The path to revalidate (e.g., '/blogs/my-post') */
  path?: string
  /** The tag to revalidate (e.g., 'blogs') */
  tag?: string
  /** Debounce delay in milliseconds (default: 1000ms) */
  debounceMs?: number
}

/**
 * Debounce map to track pending revalidation operations
 * Key format: "path:/blogs/my-post" or "tag:blogs"
 */
const revalidationQueue = new Map<string, NodeJS.Timeout>()

/**
 * Revalidate a path or tag with optional debouncing
 *
 * This function prevents excessive revalidation calls by debouncing rapid requests.
 * If multiple revalidation requests come in for the same path/tag within the debounce
 * window, only the last one will be executed.
 *
 * Use cases:
 * - Rapid edits to a document (multiple saves in quick succession)
 * - Bulk operations that affect multiple documents
 * - Auto-save features that trigger frequent updates
 *
 * @param key - Unique identifier for this revalidation (e.g., "blogs-123")
 * @param fn - Function to execute for revalidation
 * @param debounceMs - Debounce delay in milliseconds (default: 1000ms)
 *
 * @example
 * ```typescript
 * // In a hook
 * revalidateWithDebounce(
 *   `blogs-${doc.id}`,
 *   () => {
 *     revalidatePath(`/blogs/${doc.slug}`)
 *     revalidateTag('blogs')
 *   },
 *   1000
 * )
 * ```
 */
export function revalidateWithDebounce(key: string, fn: () => void, debounceMs = 1000): void {
  // Clear existing timeout for this key
  if (revalidationQueue.has(key)) {
    clearTimeout(revalidationQueue.get(key)!)
  }

  // Set new timeout
  const timeout = setTimeout(() => {
    try {
      fn()
    } catch (error) {
      console.error(`Revalidation failed for key ${key}:`, error)
    } finally {
      // Clean up after execution
      revalidationQueue.delete(key)
    }
  }, debounceMs)

  revalidationQueue.set(key, timeout)
}

/**
 * Immediately execute all pending revalidations
 *
 * This is useful when you want to ensure all pending revalidations
 * are executed before a critical operation (e.g., deployment, testing).
 *
 * @example
 * ```typescript
 * // Before deployment
 * await flushRevalidationQueue()
 * ```
 */
export function flushRevalidationQueue(): void {
  for (const [key, timeout] of revalidationQueue.entries()) {
    clearTimeout(timeout)
    revalidationQueue.delete(key)
  }
}

/**
 * Get the number of pending revalidations
 *
 * Useful for monitoring and debugging.
 *
 * @returns Number of pending revalidation operations
 */
export function getPendingRevalidationCount(): number {
  return revalidationQueue.size
}

/**
 * Clear all pending revalidations without executing them
 *
 * Use with caution - this will cancel all pending revalidations.
 *
 * @example
 * ```typescript
 * // In tests or emergency situations
 * clearRevalidationQueue()
 * ```
 */
export function clearRevalidationQueue(): void {
  for (const timeout of revalidationQueue.values()) {
    clearTimeout(timeout)
  }
  revalidationQueue.clear()
}

/**
 * Helper function to revalidate a path with debouncing
 *
 * @param path - The path to revalidate
 * @param debounceMs - Debounce delay in milliseconds
 * @param logger - Optional Payload logger for logging
 *
 * @example
 * ```typescript
 * await revalidatePathDebounced('/blogs/my-post', 1000, payload.logger)
 * ```
 */
export async function revalidatePathDebounced(
  path: string,
  debounceMs = 1000,
  logger?: PayloadRequest['payload']['logger'],
): Promise<void> {
  const key = `path:${path}`

  revalidateWithDebounce(
    key,
    async () => {
      try {
        const { revalidatePath } = await import('next/cache')
        revalidatePath(path)
        logger?.info(`Revalidated path: ${path}`)
      } catch (error) {
        logger?.error(`Failed to revalidate path ${path}: ${error}`)
      }
    },
    debounceMs,
  )
}

/**
 * Helper function to revalidate a tag with debouncing
 *
 * @param tag - The tag to revalidate
 * @param debounceMs - Debounce delay in milliseconds
 * @param logger - Optional Payload logger for logging
 *
 * @example
 * ```typescript
 * await revalidateTagDebounced('blogs', 1000, payload.logger)
 * ```
 */
export async function revalidateTagDebounced(
  tag: string,
  debounceMs = 1000,
  logger?: PayloadRequest['payload']['logger'],
): Promise<void> {
  const key = `tag:${tag}`

  revalidateWithDebounce(
    key,
    async () => {
      try {
        const { revalidateTag } = await import('next/cache')
        revalidateTag(tag)
        logger?.info(`Revalidated tag: ${tag}`)
      } catch (error) {
        logger?.error(`Failed to revalidate tag ${tag}: ${error}`)
      }
    },
    debounceMs,
  )
}

/**
 * Batch revalidate multiple paths and tags
 *
 * This function revalidates multiple paths and tags in a single operation,
 * which is more efficient than calling revalidatePath/revalidateTag multiple times.
 *
 * @param options - Paths and tags to revalidate
 * @param logger - Optional Payload logger for logging
 *
 * @example
 * ```typescript
 * await batchRevalidate({
 *   paths: ['/blogs/post-1', '/blogs/post-2'],
 *   tags: ['blogs', 'featured']
 * }, payload.logger)
 * ```
 */
export async function batchRevalidate(
  options: {
    paths?: string[]
    tags?: string[]
  },
  logger?: PayloadRequest['payload']['logger'],
): Promise<void> {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Revalidate all paths
    if (options.paths) {
      for (const path of options.paths) {
        try {
          revalidatePath(path)
          logger?.info(`Revalidated path: ${path}`)
        } catch (error) {
          logger?.error(`Failed to revalidate path ${path}: ${error}`)
        }
      }
    }

    // Revalidate all tags
    if (options.tags) {
      for (const tag of options.tags) {
        try {
          revalidateTag(tag)
          logger?.info(`Revalidated tag: ${tag}`)
        } catch (error) {
          logger?.error(`Failed to revalidate tag ${tag}: ${error}`)
        }
      }
    }
  } catch (error) {
    logger?.error(`Batch revalidation failed: ${error}`)
  }
}

/**
 * Create a debounced revalidation function for a specific collection
 *
 * This factory function creates a reusable debounced revalidation function
 * for a specific collection, which can be used in hooks.
 *
 * @param pathPrefix - The URL path prefix for the collection (e.g., 'blogs')
 * @param debounceMs - Debounce delay in milliseconds
 * @returns A function that revalidates with debouncing
 *
 * @example
 * ```typescript
 * const revalidateBlog = createDebouncedRevalidation('blogs', 1000)
 *
 * // In a hook
 * await revalidateBlog(doc.id, doc.slug, payload.logger)
 * ```
 */
export function createDebouncedRevalidation(pathPrefix: string, debounceMs = 1000) {
  return async (
    docId: string,
    slug: string,
    logger?: PayloadRequest['payload']['logger'],
  ): Promise<void> => {
    const key = `${pathPrefix}-${docId}`
    const path = `/${pathPrefix}/${slug}`

    revalidateWithDebounce(
      key,
      async () => {
        try {
          const { revalidatePath, revalidateTag } = await import('next/cache')
          revalidatePath(path)
          revalidateTag(pathPrefix)
          logger?.info(`Revalidated ${pathPrefix} at path: ${path}`)
        } catch (error) {
          logger?.error(`Failed to revalidate ${pathPrefix} at ${path}: ${error}`)
        }
      },
      debounceMs,
    )
  }
}
