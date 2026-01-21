// Configuration validation utilities for Payload CMS
import type { Config, CollectionConfig, GlobalConfig } from 'payload'

/**
 * Validate collection configuration consistency
 */
export const validateCollectionConfig = (collection: CollectionConfig): string[] => {
  const errors: string[] = []

  // Check required fields
  if (!collection.slug) {
    errors.push('Collection must have a slug')
  }

  if (!collection.fields || collection.fields.length === 0) {
    errors.push(`Collection "${collection.slug}" must have fields`)
  }

  // Check slug format
  if (collection.slug && !/^[a-z][a-z0-9-]*$/.test(collection.slug)) {
    errors.push(`Collection slug "${collection.slug}" must be lowercase with hyphens only`)
  }

  // Check TypeScript interface
  if (
    collection.typescript?.interface &&
    !/^[A-Z][A-Za-z0-9]*$/.test(collection.typescript.interface)
  ) {
    errors.push(`Collection "${collection.slug}" TypeScript interface must be PascalCase`)
  }

  // Check admin configuration
  if (collection.admin) {
    if (collection.admin.useAsTitle && typeof collection.admin.useAsTitle !== 'string') {
      errors.push(`Collection "${collection.slug}" useAsTitle must be a string field name`)
    }

    if (collection.admin.defaultColumns && !Array.isArray(collection.admin.defaultColumns)) {
      errors.push(`Collection "${collection.slug}" defaultColumns must be an array`)
    }
  }

  // Check access control
  if (collection.access) {
    const accessMethods = ['create', 'read', 'update', 'delete', 'admin'] as const
    accessMethods.forEach((method) => {
      if (collection.access![method] && typeof collection.access![method] !== 'function') {
        errors.push(`Collection "${collection.slug}" access.${method} must be a function`)
      }
    })
  }

  // Check versioning configuration
  if (collection.versions && typeof collection.versions === 'object') {
    if (
      'maxPerDoc' in collection.versions &&
      collection.versions.maxPerDoc &&
      (typeof collection.versions.maxPerDoc !== 'number' || collection.versions.maxPerDoc < 1)
    ) {
      errors.push(`Collection "${collection.slug}" versions.maxPerDoc must be a positive number`)
    }

    if (
      'drafts' in collection.versions &&
      collection.versions.drafts &&
      typeof collection.versions.drafts === 'object'
    ) {
      if (
        'autosave' in collection.versions.drafts &&
        collection.versions.drafts.autosave &&
        typeof collection.versions.drafts.autosave !== 'boolean'
      ) {
        errors.push(`Collection "${collection.slug}" versions.drafts.autosave must be a boolean`)
      }
    }
  }

  // Check upload configuration (if present)
  if (collection.upload && typeof collection.upload === 'object') {
    if (!collection.upload.staticDir) {
      errors.push(`Collection "${collection.slug}" upload configuration must have staticDir`)
    }

    if (collection.upload.imageSizes) {
      collection.upload.imageSizes.forEach((size: any, index: number) => {
        if (!size.name) {
          errors.push(
            `Collection "${collection.slug}" image size at index ${index} must have a name`,
          )
        }
        if (!size.width || !size.height) {
          errors.push(
            `Collection "${collection.slug}" image size "${size.name}" must have width and height`,
          )
        }
      })
    }
  }

  return errors
}

/**
 * Validate global configuration consistency
 */
export const validateGlobalConfig = (global: GlobalConfig): string[] => {
  const errors: string[] = []

  // Check required fields
  if (!global.slug) {
    errors.push('Global must have a slug')
  }

  if (!global.fields || global.fields.length === 0) {
    errors.push(`Global "${global.slug}" must have fields`)
  }

  // Check slug format
  if (global.slug && !/^[a-z][a-z0-9-]*$/.test(global.slug)) {
    errors.push(`Global slug "${global.slug}" must be lowercase with hyphens only`)
  }

  // Check TypeScript interface
  if (global.typescript?.interface && !/^[A-Z][A-Za-z0-9]*$/.test(global.typescript.interface)) {
    errors.push(`Global "${global.slug}" TypeScript interface must be PascalCase`)
  }

  // Check access control
  if (global.access) {
    const accessMethods = ['read', 'update'] as const
    accessMethods.forEach((method) => {
      if (global.access![method] && typeof global.access![method] !== 'function') {
        errors.push(`Global "${global.slug}" access.${method} must be a function`)
      }
    })
  }

  // Check versioning configuration
  if (global.versions && typeof global.versions === 'object') {
    if (
      'maxPerDoc' in global.versions &&
      global.versions.maxPerDoc &&
      (typeof global.versions.maxPerDoc !== 'number' || global.versions.maxPerDoc < 1)
    ) {
      errors.push(`Global "${global.slug}" versions.maxPerDoc must be a positive number`)
    }
  }

  return errors
}

/**
 * Validate entire Payload configuration
 */
export const validatePayloadConfig = (
  config: Config,
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required configuration
  if (!config.secret) {
    errors.push('Payload config must have a secret')
  }

  if (!config.db) {
    errors.push('Payload config must have a database adapter')
  }

  // Validate collections
  if (config.collections) {
    const collectionSlugs = new Set<string>()

    config.collections.forEach((collection) => {
      // Check for duplicate slugs
      if (collectionSlugs.has(collection.slug)) {
        errors.push(`Duplicate collection slug: "${collection.slug}"`)
      }
      collectionSlugs.add(collection.slug)

      // Validate individual collection
      const collectionErrors = validateCollectionConfig(collection)
      errors.push(...collectionErrors)
    })
  }

  // Validate globals
  if (config.globals) {
    const globalSlugs = new Set<string>()

    config.globals.forEach((global) => {
      // Check for duplicate slugs
      if (globalSlugs.has(global.slug)) {
        errors.push(`Duplicate global slug: "${global.slug}"`)
      }
      globalSlugs.add(global.slug)

      // Validate individual global
      const globalErrors = validateGlobalConfig(global)
      errors.push(...globalErrors)
    })
  }

  // Check admin configuration
  if (config.admin) {
    if (config.admin.user && config.collections) {
      const userCollection = config.collections.find((c) => c.slug === config.admin!.user)
      if (!userCollection) {
        errors.push(`Admin user collection "${config.admin.user}" not found`)
      } else if (!userCollection.auth) {
        errors.push(`Admin user collection "${config.admin.user}" must have auth enabled`)
      }
    }
  }

  // Check TypeScript configuration
  if (config.typescript) {
    if (config.typescript.outputFile && !config.typescript.outputFile.endsWith('.ts')) {
      warnings.push('TypeScript output file should have .ts extension')
    }
  }

  // Check GraphQL configuration
  if (config.graphQL) {
    if (
      config.graphQL.maxComplexity &&
      (typeof config.graphQL.maxComplexity !== 'number' || config.graphQL.maxComplexity < 1)
    ) {
      warnings.push('GraphQL maxComplexity should be a positive number')
    }
  }

  // Performance warnings
  if (config.collections && config.collections.length > 20) {
    warnings.push(
      `Large number of collections (${config.collections.length}). Consider grouping related collections.`,
    )
  }

  if (config.globals && config.globals.length > 10) {
    warnings.push(
      `Large number of globals (${config.globals.length}). Consider consolidating related globals.`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Check for common configuration issues
 */
export const checkConfigurationIssues = (
  config: Config,
): {
  security: string[]
  performance: string[]
  maintainability: string[]
} => {
  const security: string[] = []
  const performance: string[] = []
  const maintainability: string[] = []

  // Security checks
  if (!config.cors || (Array.isArray(config.cors) && config.cors.length === 0)) {
    security.push('CORS configuration is missing or empty')
  }

  if (!config.csrf || (Array.isArray(config.csrf) && config.csrf.length === 0)) {
    security.push('CSRF configuration is missing or empty')
  }

  if (config.graphQL && !config.graphQL.maxComplexity) {
    security.push('GraphQL complexity limiting is not configured')
  }

  // Performance checks
  if (config.collections) {
    config.collections.forEach((collection) => {
      if (
        collection.versions &&
        typeof collection.versions === 'object' &&
        'maxPerDoc' in collection.versions &&
        collection.versions.maxPerDoc &&
        collection.versions.maxPerDoc > 100
      ) {
        performance.push(
          `Collection "${collection.slug}" has high version limit (${collection.versions.maxPerDoc})`,
        )
      }

      if (
        collection.upload &&
        typeof collection.upload === 'object' &&
        collection.upload.imageSizes &&
        collection.upload.imageSizes.length > 10
      ) {
        performance.push(
          `Collection "${collection.slug}" has many image sizes (${collection.upload.imageSizes.length})`,
        )
      }
    })
  }

  // Maintainability checks
  if (config.collections) {
    const collectionsWithoutGroups = config.collections.filter((c) => !c.admin?.group)
    if (collectionsWithoutGroups.length > 5) {
      maintainability.push(`${collectionsWithoutGroups.length} collections without admin groups`)
    }
  }

  if (config.globals) {
    const globalsWithoutGroups = config.globals.filter((g) => !g.admin?.group)
    if (globalsWithoutGroups.length > 3) {
      maintainability.push(`${globalsWithoutGroups.length} globals without admin groups`)
    }
  }

  return {
    security,
    performance,
    maintainability,
  }
}

// Export validation utilities
export const configValidation = {
  validateCollectionConfig,
  validateGlobalConfig,
  validatePayloadConfig,
  checkConfigurationIssues,
}
