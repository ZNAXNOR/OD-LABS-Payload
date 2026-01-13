import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Shared hook to auto-generate slugs from titles
 * Can be used across all page collections
 */
export const generateSlug: CollectionBeforeValidateHook = ({ data, operation }) => {
  // Auto-generate slug from title if not provided
  if (operation === 'create' && data?.title && !data?.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }
  return data
}
