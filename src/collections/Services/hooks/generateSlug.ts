import { createSlugGenerationHook } from '@/utilities/slugGeneration'

export const generateSlug = createSlugGenerationHook('services', {
  sourceField: 'title',
  enforceUniqueness: true,
  maxLength: 100,
})
