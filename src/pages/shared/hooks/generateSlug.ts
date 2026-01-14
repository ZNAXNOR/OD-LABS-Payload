import { createSlugGenerationHook } from '@/utilities/slugGeneration'

/**
 * Shared hook to auto-generate slugs from titles
 * Can be used across all page collections
 * @deprecated Use createSlugGenerationHook from @/utilities/slugGeneration instead
 */
export const generateSlug = createSlugGenerationHook('pages', {
  sourceField: 'title',
  enforceUniqueness: true,
  maxLength: 100,
})
