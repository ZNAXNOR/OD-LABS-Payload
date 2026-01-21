// Collection configuration templates for consistent patterns
import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

/**
 * Base collection configuration template
 */
export const createBaseCollection = (config: {
  slug: string
  labels: { singular: string; plural: string }
  fields: CollectionConfig['fields']
  access?: CollectionConfig['access']
  admin?: CollectionConfig['admin']
  hooks?: CollectionConfig['hooks']
  versions?: CollectionConfig['versions']
  timestamps?: boolean
  auth?: boolean
  upload?: CollectionConfig['upload']
}): CollectionConfig => {
  const {
    slug,
    labels,
    fields,
    access,
    admin,
    hooks,
    versions,
    timestamps = true,
    auth = false,
    upload,
  } = config

  return {
    slug,
    labels,
    typescript: {
      interface: labels.singular.replace(/\s+/g, ''),
    },
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', '_status', 'updatedAt'],
      group: 'Content',
      ...admin,
    },
    access: access || {
      create: authenticated,
      read: authenticatedOrPublished,
      update: authenticated,
      delete: authenticated,
    },
    fields,
    hooks,
    timestamps,
    auth,
    upload,
    versions: versions || {
      drafts: {
        autosave: true,
        schedulePublish: true,
        validate: false,
      },
      maxPerDoc: 50,
    },
  }
}

/**
 * Content collection template (for pages, blogs, etc.)
 */
export const createContentCollection = (config: {
  slug: string
  labels: { singular: string; plural: string }
  fields: CollectionConfig['fields']
  access?: CollectionConfig['access']
  admin?: Partial<CollectionConfig['admin']>
  hooks?: CollectionConfig['hooks']
  maxVersions?: number
}): CollectionConfig => {
  const { maxVersions = 50, ...rest } = config

  return createBaseCollection({
    ...rest,
    admin: {
      group: 'Content',
      ...rest.admin,
    },
    versions: {
      drafts: {
        autosave: true,
        schedulePublish: true,
        validate: false,
      },
      maxPerDoc: maxVersions,
    },
  })
}

/**
 * User collection template
 */
export const createUserCollection = (config: {
  slug: string
  labels: { singular: string; plural: string }
  fields: CollectionConfig['fields']
  access?: CollectionConfig['access']
  admin?: Partial<CollectionConfig['admin']>
  hooks?: CollectionConfig['hooks']
}): CollectionConfig => {
  return createBaseCollection({
    ...config,
    auth: true,
    admin: {
      useAsTitle: 'email',
      defaultColumns: ['email', 'roles', 'lastLoginAt', 'createdAt'],
      group: 'Users',
      ...config.admin,
    },
    versions: {
      drafts: false, // Users typically don't need drafts
      maxPerDoc: 10,
    },
  })
}

/**
 * Media collection template
 */
export const createMediaCollection = (config: {
  slug: string
  labels: { singular: string; plural: string }
  fields: CollectionConfig['fields']
  upload: CollectionConfig['upload']
  access?: CollectionConfig['access']
  admin?: Partial<CollectionConfig['admin']>
  hooks?: CollectionConfig['hooks']
}): CollectionConfig => {
  return createBaseCollection({
    ...config,
    admin: {
      useAsTitle: 'alt',
      defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'updatedAt'],
      group: 'Media',
      ...config.admin,
    },
    access: config.access || {
      create: authenticated,
      read: () => true, // Media typically needs to be publicly readable
      update: authenticated,
      delete: authenticated,
    },
    versions: {
      drafts: false, // Media typically doesn't need drafts
      maxPerDoc: 5,
    },
  })
}

/**
 * Settings collection template (for configuration data)
 */
export const createSettingsCollection = (config: {
  slug: string
  labels: { singular: string; plural: string }
  fields: CollectionConfig['fields']
  access?: CollectionConfig['access']
  admin?: Partial<CollectionConfig['admin']>
  hooks?: CollectionConfig['hooks']
}): CollectionConfig => {
  return createBaseCollection({
    ...config,
    admin: {
      group: 'Settings',
      ...config.admin,
    },
    access: config.access || {
      create: authenticated,
      read: authenticated,
      update: authenticated,
      delete: authenticated,
    },
    versions: {
      drafts: false, // Settings typically don't need drafts
      maxPerDoc: 20, // Keep more versions for settings
    },
  })
}

/**
 * Standard access control patterns
 */
export const accessPatterns = {
  // Public read, authenticated write
  publicRead: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  } as CollectionConfig['access'],

  // Authenticated or published content
  contentAccess: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  } as CollectionConfig['access'],

  // Admin only
  adminOnly: {
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    read: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  } as CollectionConfig['access'],

  // Self or admin (for user profiles)
  selfOrAdmin: {
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  } as CollectionConfig['access'],
}

/**
 * Standard admin configurations
 */
export const adminPatterns = {
  content: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'updatedAt'],
  },

  users: {
    group: 'Users',
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'lastLoginAt', 'createdAt'],
  },

  media: {
    group: 'Media',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'updatedAt'],
  },

  settings: {
    group: 'Settings',
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
}

/**
 * Standard versioning configurations
 */
export const versioningPatterns = {
  content: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 50,
  },

  users: {
    drafts: false,
    maxPerDoc: 10,
  },

  media: {
    drafts: false,
    maxPerDoc: 5,
  },

  settings: {
    drafts: false,
    maxPerDoc: 20,
  },

  globals: {
    drafts: false,
    maxPerDoc: 10,
  },
}

// Export all templates and patterns
export const collectionTemplates = {
  createBaseCollection,
  createContentCollection,
  createUserCollection,
  createMediaCollection,
  createSettingsCollection,
  accessPatterns,
  adminPatterns,
  versioningPatterns,
}
