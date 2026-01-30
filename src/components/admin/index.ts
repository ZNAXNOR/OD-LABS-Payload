// Admin components exports
// This file will contain combined exports for all admin-specific components

// Re-export admin components
export * from './AdminBar'
export * from './BreadcrumbCell'
export * from './DashboardCollections'
export * from './LegacyBlockWarning'
export * from './RowLabel'
export * from './UniqueSelect'

// Pages collection admin components
export * from './LayoutFieldHelper'
export * from './PagesListHeader'
export * from './PagesPreviewButton'
export * from './PagesSaveButton'
export * from './PageTypeFilter'
export * from './PageTypeSelector'

// Category-based exports for tree-shaking
export const adminComponents = {
  AdminBar: () => import('./AdminBar'),
  BreadcrumbCell: () => import('./BreadcrumbCell'),
  DashboardCollections: () => import('./DashboardCollections'),
  LegacyBlockWarning: () => import('./LegacyBlockWarning'),
  RowLabel: () => import('./RowLabel'),
  UniqueSelect: () => import('./UniqueSelect'),

  // Pages collection components
  PagesListHeader: () => import('./PagesListHeader'),
  PageTypeFilter: () => import('./PageTypeFilter'),
  PagesSaveButton: () => import('./PagesSaveButton'),
  PagesPreviewButton: () => import('./PagesPreviewButton'),
  PageTypeSelector: () => import('./PageTypeSelector'),
  LayoutFieldHelper: () => import('./LayoutFieldHelper'),
} as const

// Type definitions
export type AdminComponent = keyof typeof adminComponents
