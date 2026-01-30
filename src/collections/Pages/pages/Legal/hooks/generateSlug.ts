import { createSlugGenerationHook } from '@/utilities/slugGeneration'

export const generateSlug = createSlugGenerationHook('legal', {
  sourceField: 'title',
  enforceUniqueness: true,
  maxLength: 100,
})
