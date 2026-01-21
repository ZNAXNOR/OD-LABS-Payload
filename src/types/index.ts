// ============================================================================
// TREE-SHAKING OPTIMIZED TYPE EXPORTS
// ============================================================================

// Individual type category exports for tree-shaking
export * from './payload'
export * from './components'
export * from './api'

// ============================================================================
// LAZY-LOADED TYPE CATEGORIES FOR CODE SPLITTING
// ============================================================================

// Lazy-loaded type categories for optimal bundle splitting
export const typeCategories = {
  payload: () => import('./payload'),
  components: () => import('./components'),
  api: () => import('./api'),
  blocks: () => import('./blocks'),
} as const

// Type definitions for type categories
export type TypeCategory = keyof typeof typeCategories

// ============================================================================
// TREE-SHAKING FRIENDLY TYPE LOADERS
// ============================================================================

// Individual type category loaders for optimal tree-shaking
export const loadPayloadTypes = () => import('./payload')
export const loadComponentTypes = () => import('./components')
export const loadAPITypes = () => import('./api')
export const loadBlockTypes = () => import('./blocks')

// ============================================================================
// TYPE UTILITIES
// ============================================================================

// Helper to load type category dynamically
export async function loadTypeCategory(category: TypeCategory) {
  const loader = typeCategories[category]
  if (!loader) {
    throw new Error(`Type category "${category}" not found`)
  }
  return await loader()
}

// Get all available type category names
export function getTypeCategoryNames(): TypeCategory[] {
  return Object.keys(typeCategories) as TypeCategory[]
}
