// Layout components exports
// This file will contain combined exports for all layout-related components

// Re-export layout components
export * from './RenderBlocks'
export * from './Logo'
export * from './GoogleAnalytics'
export * from './LivePreviewListener'

// Category-based exports for tree-shaking
export const layoutComponents = {
  RenderBlocks: () => import('./RenderBlocks'),
  Logo: () => import('./Logo'),
  GoogleAnalytics: () => import('./GoogleAnalytics'),
  LivePreviewListener: () => import('./LivePreviewListener'),
} as const

// Type definitions
export type LayoutComponent = keyof typeof layoutComponents
