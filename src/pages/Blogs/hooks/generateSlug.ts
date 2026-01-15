import { createSlugGenerationHook } from '@/utilities/slugGeneration'

export const generateSlug = createSlugGenerationHook('blogs', {
  sourceField: 'title',
  enforceUniqueness: true,
  maxLength: 100,
})
