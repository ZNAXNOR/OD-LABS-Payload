// Global configuration templates for consistent patterns
import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

/**
 * Base global configuration template
 */
export const createBaseGlobal = (config: {
  slug: string
  label: string
  fields: GlobalConfig['fields']
  access?: GlobalConfig['access']
  admin?: GlobalConfig['admin']
  hooks?: GlobalConfig['hooks']
  versions?: GlobalConfig['versions']
}): GlobalConfig => {
  const { slug, label, fields, access, admin, hooks, versions } = config

  return {
    slug,
    label,
    typescript: {
      interface: label.replace(/\s+/g, ''),
    },
    admin: {
      group: 'Settings',
      ...admin,
    },
    access: access || {
      read: () => true, // Globals typically need to be publicly readable
      update: authenticated,
    },
    fields,
    hooks,
    versions: versions || {
      drafts: false,
    },
  }
}

/**
 * Navigation global template
 */
export const createNavigationGlobal = (config: {
  slug: string
  label: string
  fields: GlobalConfig['fields']
  access?: GlobalConfig['access']
  admin?: Partial<GlobalConfig['admin']>
  hooks?: GlobalConfig['hooks']
}): GlobalConfig => {
  return createBaseGlobal({
    ...config,
    admin: {
      group: 'Navigation',
      ...config.admin,
    },
  })
}

/**
 * Settings global template
 */
export const createSettingsGlobal = (config: {
  slug: string
  label: string
  fields: GlobalConfig['fields']
  access?: GlobalConfig['access']
  admin?: Partial<GlobalConfig['admin']>
  hooks?: GlobalConfig['hooks']
}): GlobalConfig => {
  return createBaseGlobal({
    ...config,
    admin: {
      group: 'Settings',
      ...config.admin,
    },
    versions: {
      drafts: false,
    },
  })
}

/**
 * Content global template (for site-wide content)
 */
export const createContentGlobal = (config: {
  slug: string
  label: string
  fields: GlobalConfig['fields']
  access?: GlobalConfig['access']
  admin?: Partial<GlobalConfig['admin']>
  hooks?: GlobalConfig['hooks']
}): GlobalConfig => {
  return createBaseGlobal({
    ...config,
    admin: {
      group: 'Content',
      ...config.admin,
    },
    versions: {
      drafts: true,
    },
  })
}

/**
 * Standard access control patterns for globals
 */
export const globalAccessPatterns = {
  // Public read, authenticated write (most common for globals)
  publicRead: {
    read: () => true,
    update: authenticated,
  } as GlobalConfig['access'],

  // Admin only
  adminOnly: {
    read: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  } as GlobalConfig['access'],

  // Authenticated read and write
  authenticatedOnly: {
    read: authenticated,
    update: authenticated,
  } as GlobalConfig['access'],
}

/**
 * Standard admin configurations for globals
 */
export const globalAdminPatterns = {
  navigation: {
    group: 'Navigation',
  },

  settings: {
    group: 'Settings',
  },

  content: {
    group: 'Content',
  },
}

/**
 * Standard versioning configurations for globals
 */
export const globalVersioningPatterns = {
  navigation: {
    drafts: false,
  },

  settings: {
    drafts: false,
  },

  content: {
    drafts: true,
  },
}

// Export all templates and patterns
export const globalTemplates = {
  createBaseGlobal,
  createNavigationGlobal,
  createSettingsGlobal,
  createContentGlobal,
  globalAccessPatterns,
  globalAdminPatterns,
  globalVersioningPatterns,
}
