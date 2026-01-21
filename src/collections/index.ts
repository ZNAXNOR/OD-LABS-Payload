// Collections index - organized exports for all collections
import type { CollectionConfig } from 'payload'

// Core collections
export { Users } from './Users'
export { Media } from './Media'

// Page collections (re-exported from pages directory for consistency)
export { Pages } from '../pages/Pages'
export { BlogPages } from '../pages/Blogs'
export { ServicesPages } from '../pages/Services'
export { LegalPages } from '../pages/Legal'
export { ContactPages } from '../pages/Contacts'

// Collection utilities and templates
export * from './templates'
export * from './fields'
export * from './access'
export * from './hooks'

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
  content: ['pages', 'blogs', 'services', 'legal', 'contacts'],
  settings: [], // Add settings collections here
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
    description: 'Website pages and content',
    category: 'content',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: true,
  },
  blogs: {
    description: 'Blog posts and articles',
    category: 'content',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: true,
  },
  services: {
    description: 'Service offerings and descriptions',
    category: 'content',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: true,
  },
  legal: {
    description: 'Legal pages and policies',
    category: 'content',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: true,
  },
  contacts: {
    description: 'Contact pages and information',
    category: 'content',
    hasAuth: false,
    hasVersions: true,
    hasDrafts: true,
  },
} as const
