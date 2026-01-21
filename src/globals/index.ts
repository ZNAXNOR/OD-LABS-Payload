// Globals index - organized exports for all global configurations
import type { GlobalConfig } from 'payload'

// Navigation globals
export { Header } from './Header'
export { Footer } from './Footer'

// Settings globals
export { ContactGlobal } from './Contact'

// Global utilities and templates
export * from './templates'

// Global arrays for easy configuration
export const navigationGlobals: GlobalConfig[] = [
  // Import dynamically to avoid circular dependencies
]

export const settingsGlobals: GlobalConfig[] = [
  // Import dynamically to avoid circular dependencies
]

// Global groups for admin organization
export const globalGroups = {
  navigation: ['header', 'footer'],
  settings: ['contact'],
  content: [], // Add content globals here
} as const

// Global metadata for documentation and tooling
export const globalMetadata = {
  header: {
    description: 'Site header navigation and branding',
    category: 'navigation',
    hasVersions: true,
    hasDrafts: false,
  },
  footer: {
    description: 'Site footer navigation and content',
    category: 'navigation',
    hasVersions: true,
    hasDrafts: false,
  },
  contact: {
    description: 'Global contact information and social media',
    category: 'settings',
    hasVersions: true,
    hasDrafts: false,
  },
} as const
