// ============================================================================
// TREE-SHAKING OPTIMIZED UI COMPONENT EXPORTS
// ============================================================================

// Individual component exports for tree-shaking
export * from './Button'
export * from './Card'
export * from './Input'
export * from './Checkbox'
export * from './Label'
export * from './Pagination'
export * from './Select'
export * from './Textarea'
export * from './Link'
export * from './Media'
export * from './RichText'

// ============================================================================
// LAZY-LOADED UI COMPONENTS FOR CODE SPLITTING
// ============================================================================

// Lazy-loaded UI components for optimal bundle splitting
export const uiComponents = {
  Button: () => import('./Button'),
  Card: () => import('./Card'),
  Input: () => import('./Input'),
  Checkbox: () => import('./Checkbox'),
  Label: () => import('./Label'),
  Pagination: () => import('./Pagination'),
  Select: () => import('./Select'),
  Textarea: () => import('./Textarea'),
  Link: () => import('./Link'),
  Media: () => import('./Media'),
  RichText: () => import('./RichText'),
} as const

// Type definitions
export type UIComponent = keyof typeof uiComponents

// ============================================================================
// TREE-SHAKING FRIENDLY COMPONENT LOADERS
// ============================================================================

// Individual component loaders for optimal tree-shaking
export const loadButton = () => import('./Button')
export const loadCard = () => import('./Card')
export const loadInput = () => import('./Input')
export const loadCheckbox = () => import('./Checkbox')
export const loadLabel = () => import('./Label')
export const loadPagination = () => import('./Pagination')
export const loadSelect = () => import('./Select')
export const loadTextarea = () => import('./Textarea')
export const loadLink = () => import('./Link')
export const loadMedia = () => import('./Media')
export const loadRichText = () => import('./RichText')

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

// Helper to load UI component dynamically
export async function loadUIComponent(componentName: UIComponent) {
  const loader = uiComponents[componentName]
  if (!loader) {
    throw new Error(`UI Component "${componentName}" not found`)
  }
  return await loader()
}

// Get all available UI component names
export function getUIComponentNames(): UIComponent[] {
  return Object.keys(uiComponents) as UIComponent[]
}
