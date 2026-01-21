// ============================================================================
// TREE-SHAKING OPTIMIZED COMPONENT EXPORTS
// ============================================================================

// Individual category exports for tree-shaking
export * from './ui'
export * from './blocks'
export * from './forms'
export * from './layout'
export * from './admin'

// ============================================================================
// LAZY-LOADED COMPONENT CATEGORIES FOR CODE SPLITTING
// ============================================================================

// Lazy-loaded component categories for optimal bundle splitting
export const componentCategories = {
  ui: () => import('./ui'),
  blocks: () => import('./blocks'),
  forms: () => import('./forms'),
  layout: () => import('./layout'),
  admin: () => import('./admin'),
} as const

// Type definitions for component categories
export type ComponentCategory = keyof typeof componentCategories

// ============================================================================
// TREE-SHAKING FRIENDLY CATEGORY LOADERS
// ============================================================================

// Individual category loaders for optimal tree-shaking
export const loadUIComponents = () => import('./ui')
export const loadBlockComponents = () => import('./blocks')
export const loadFormComponents = () => import('./forms')
export const loadLayoutComponents = () => import('./layout')
export const loadAdminComponents = () => import('./admin')

// ============================================================================
// COMPONENT REGISTRY FOR DYNAMIC LOADING
// ============================================================================

export interface ComponentInfo {
  category: ComponentCategory
  loader: () => Promise<any>
}

// Registry for dynamic component loading
export const componentRegistry: Record<string, ComponentInfo> = {
  // UI Components
  Button: { category: 'ui', loader: () => import('./ui/Button') },
  Card: { category: 'ui', loader: () => import('./ui/Card') },
  Input: { category: 'ui', loader: () => import('./ui/Input') },
  Checkbox: { category: 'ui', loader: () => import('./ui/Checkbox') },
  Label: { category: 'ui', loader: () => import('./ui/Label') },
  Pagination: { category: 'ui', loader: () => import('./ui/Pagination') },
  Select: { category: 'ui', loader: () => import('./ui/Select') },
  Textarea: { category: 'ui', loader: () => import('./ui/Textarea') },
  Link: { category: 'ui', loader: () => import('./ui/Link') },
  Media: { category: 'ui', loader: () => import('./ui/Media') },
  RichText: { category: 'ui', loader: () => import('./ui/RichText') },

  // Block Components
  BlockRenderer: { category: 'blocks', loader: () => import('./blocks/BlockRenderer') },
  HeroBlock: { category: 'blocks', loader: () => import('./blocks/HeroBlock') },

  // Admin Components
  AdminBar: { category: 'admin', loader: () => import('./admin/AdminBar') },
}

// Helper to load component dynamically
export async function loadComponent(componentName: string) {
  const componentInfo = componentRegistry[componentName]
  if (!componentInfo) {
    throw new Error(`Component "${componentName}" not found in registry`)
  }
  return await componentInfo.loader()
}

// Helper to get components by category
export function getComponentsByCategory(category: ComponentCategory): string[] {
  return Object.entries(componentRegistry)
    .filter(([, info]) => info.category === category)
    .map(([name]) => name)
}
