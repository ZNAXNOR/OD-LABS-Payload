import { createSlugGenerationHook } from '@/utilities/slugGeneration'

export const generateSlug = createSlugGenerationHook('contacts', {
  sourceField: 'title',
  enforceUniqueness: true,
  maxLength: 100,
})
