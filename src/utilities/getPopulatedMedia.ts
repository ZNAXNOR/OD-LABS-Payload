import type { Media } from '@/payload-types'

/**
 * Returns an uploaded Media document only when Payload has populated the
 * relationship. Numeric relationship IDs are intentionally not resolved here.
 */
export const getPopulatedMedia = (
  value: number | Media | null | undefined,
): Media | null => (typeof value === 'object' && value !== null ? value : null)
