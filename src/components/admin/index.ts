// Admin components exports
// This file will contain combined exports for all admin-specific components

// Re-export admin components
export * from './AdminBar'
export * from './BreadcrumbCell'
export * from './DashboardCollections'
export * from './LegacyBlockWarning'
export * from './RowLabel'
export * from './UniqueSelect'

// Category-based exports for tree-shaking
export const adminComponents = {
  AdminBar: () => import('./AdminBar'),
  BreadcrumbCell: () => import('./BreadcrumbCell'),
  DashboardCollections: () => import('./DashboardCollections'),
  LegacyBlockWarning: () => import('./LegacyBlockWarning'),
  RowLabel: () => import('./RowLabel'),
  UniqueSelect: () => import('./UniqueSelect'),
} as const

// Type definitions
export type AdminComponent = keyof typeof adminComponents
