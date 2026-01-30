// Collections index - organized exports for all collections
import type { CollectionConfig } from 'payload'

// Core collections
export { Media } from './Media'
export { SocialMedia } from './SocialMedia'
export { Users } from './Users'

// Consolidated Pages collection
export { Pages } from './Pages'

// Collection utilities and templates
export * from './access'
export * from './fields'
export * from './hooks'
export * from './templates'

// Collection arrays for easy configuration
export const coreCollections: CollectionConfig[] = [
  // Import dynamically to avoid circular dependencies
]

export const pageCollections: CollectionConfig[] = [
  // Import dynamically to avoid circular dependencies
]

// Collection groups for admin organization
export const collectionGroups = {
  core: ['users', 'media'],
  content: ['pages'], // Consolidated into single pages collection
  settings: ['social-media'],
} as const

// Collection metadata for documentation and tooling
export const collectionMetadata = {
  users: {
    description: 'User accounts and authentication',
    category: 'core',
    hasAuth: true,
    hasVersions: true,
    hasDrafts: false,
  },
  media: {
    description: 'Media files and assets',
    category: 'core',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: false,
    hasUpload: true,
  },
  pages: {
    description: 'All website pages and content (consolidated)',
    category: 'content',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: true,
    pageTypes: ['page', 'blog', 'service', 'legal', 'contact'],
  },
} as const
