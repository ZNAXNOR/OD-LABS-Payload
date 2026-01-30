/**
 * Preview Configuration Migration Utilities
 *
 * Utilities for migrating and preserving preview configurations
 * from original collections during the consolidation process.
 */

import type { CollectionConfig } from 'payload'
import {
  extractLegacyPreviewConfig,
  legacyPreviewConfigurations,
  validatePreviewConfig,
  type PageTypePreviewConfig,
} from './previewConfigManager'

/**
 * Migration report interface
 */
export interface PreviewMigrationReport {
  success: boolean
  migratedConfigurations: Record<string, PageTypePreviewConfig>
  errors: string[]
  warnings: string[]
  preservedSettings: Record<string, any>
}

/**
 * Migrate preview configurations from original collections
 * This preserves existing customizations during consolidation
 */
export const migratePreviewConfigurations = (
  originalCollections: Record<string, CollectionConfig>,
): PreviewMigrationReport => {
  const report: PreviewMigrationReport = {
    success: true,
    migratedConfigurations: {},
    errors: [],
    warnings: [],
    preservedSettings: {},
  }

  // Collection slug to page type mapping
  const collectionToPageType: Record<string, string> = {
    blogs: 'blog',
    services: 'service',
    legal: 'legal',
    contacts: 'contact',
    pages: 'page',
  }

  // Process each original collection
  Object.entries(originalCollections).forEach(([slug, config]) => {
    const pageType = collectionToPageType[slug]

    if (!pageType) {
      report.warnings.push(`Unknown collection slug: ${slug}`)
      return
    }

    try {
      // Extract legacy configuration
      const legacyConfig = extractLegacyPreviewConfig(config)

      // Get default configuration for this page type
      const defaultConfig = legacyPreviewConfigurations[pageType]

      // Merge with legacy settings
      const migratedConfig: PageTypePreviewConfig = {
        ...defaultConfig,
        ...legacyConfig,
        pageType,
        customSettings: {
          ...defaultConfig?.customSettings,
          ...legacyConfig.customSettings,
        },
      }

      // Validate the migrated configuration
      const validation = validatePreviewConfig(migratedConfig)
      if (!validation.isValid) {
        report.errors.push(`Invalid configuration for ${pageType}: ${validation.errors.join(', ')}`)
        report.success = false
        return
      }

      // Store migrated configuration
      report.migratedConfigurations[pageType] = migratedConfig

      // Track preserved settings
      if (legacyConfig.customSettings) {
        report.preservedSettings[pageType] = legacyConfig.customSettings
      }

      console.log(`[PreviewMigration] Successfully migrated ${pageType} preview configuration`)
    } catch (error) {
      const errorMessage = `Failed to migrate ${pageType} configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      report.errors.push(errorMessage)
      report.success = false
      console.error(`[PreviewMigration] ${errorMessage}`)
    }
  })

  return report
}

/**
 * Generate migration summary for documentation
 */
export const generateMigrationSummary = (report: PreviewMigrationReport): string => {
  const lines: string[] = []

  lines.push('# Preview Configuration Migration Summary')
  lines.push('')
  lines.push(`**Status:** ${report.success ? '✅ Success' : '❌ Failed'}`)
  lines.push('')

  if (Object.keys(report.migratedConfigurations).length > 0) {
    lines.push('## Migrated Configurations')
    lines.push('')
    Object.entries(report.migratedConfigurations).forEach(([pageType, config]) => {
      lines.push(`### ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Pages`)
      lines.push(`- **URL Pattern:** ${config.urlPattern}`)
      lines.push(`- **Auth Required:** ${config.authRequired ? 'Yes' : 'No'}`)
      lines.push(`- **Draft Support:** ${config.draftSupport ? 'Yes' : 'No'}`)
      lines.push(`- **Breakpoints:** ${config.breakpoints?.length || 0} configured`)

      if (config.customSettings && Object.keys(config.customSettings).length > 0) {
        lines.push('- **Custom Settings:**')
        Object.entries(config.customSettings).forEach(([key, value]) => {
          lines.push(`  - ${key}: ${value}`)
        })
      }
      lines.push('')
    })
  }

  if (Object.keys(report.preservedSettings).length > 0) {
    lines.push('## Preserved Settings')
    lines.push('')
    Object.entries(report.preservedSettings).forEach(([pageType, settings]) => {
      lines.push(`### ${pageType.charAt(0).toUpperCase() + pageType.slice(1)}`)
      Object.entries(settings).forEach(([key, value]) => {
        lines.push(`- ${key}: ${value}`)
      })
      lines.push('')
    })
  }

  if (report.warnings.length > 0) {
    lines.push('## Warnings')
    lines.push('')
    report.warnings.forEach((warning) => {
      lines.push(`- ⚠️ ${warning}`)
    })
    lines.push('')
  }

  if (report.errors.length > 0) {
    lines.push('## Errors')
    lines.push('')
    report.errors.forEach((error) => {
      lines.push(`- ❌ ${error}`)
    })
    lines.push('')
  }

  lines.push('## Next Steps')
  lines.push('')
  if (report.success) {
    lines.push('1. ✅ All preview configurations have been successfully migrated')
    lines.push('2. ✅ Custom settings have been preserved')
    lines.push('3. ✅ Breakpoints have been consolidated')
    lines.push('4. 🔄 Test live preview functionality for each page type')
    lines.push('5. 🔄 Verify custom settings are working correctly')
  } else {
    lines.push('1. ❌ Fix the errors listed above')
    lines.push('2. 🔄 Re-run the migration process')
    lines.push('3. 🔄 Test configurations after fixes')
  }

  return lines.join('\n')
}

/**
 * Validate migrated preview configurations
 */
export const validateMigratedConfigurations = (
  configurations: Record<string, PageTypePreviewConfig>,
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check that all required page types have configurations
  const requiredPageTypes = ['page', 'blog', 'service', 'legal', 'contact']
  requiredPageTypes.forEach((pageType) => {
    if (!configurations[pageType]) {
      errors.push(`Missing configuration for page type: ${pageType}`)
    }
  })

  // Validate each configuration
  Object.entries(configurations).forEach(([pageType, config]) => {
    const validation = validatePreviewConfig(config)
    if (!validation.isValid) {
      errors.push(`Invalid ${pageType} configuration: ${validation.errors.join(', ')}`)
    }

    // Check for potential issues
    if (!config.breakpoints || config.breakpoints.length === 0) {
      warnings.push(`${pageType} configuration has no breakpoints defined`)
    }

    if (!config.urlPattern) {
      warnings.push(`${pageType} configuration has no URL pattern defined`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Create backup of original preview configurations
 */
export const backupOriginalConfigurations = (
  originalCollections: Record<string, CollectionConfig>,
): Record<string, any> => {
  const backup: Record<string, any> = {}

  Object.entries(originalCollections).forEach(([slug, config]) => {
    if (config.admin?.livePreview) {
      backup[slug] = {
        livePreview: config.admin.livePreview,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    }
  })

  return backup
}

/**
 * Restore preview configurations from backup
 */
export const restoreFromBackup = (
  backup: Record<string, any>,
): Record<string, PageTypePreviewConfig> => {
  const restored: Record<string, PageTypePreviewConfig> = {}

  // Collection slug to page type mapping
  const collectionToPageType: Record<string, string> = {
    blogs: 'blog',
    services: 'service',
    legal: 'legal',
    contacts: 'contact',
    pages: 'page',
  }

  Object.entries(backup).forEach(([slug, backupData]) => {
    const pageType = collectionToPageType[slug]
    if (pageType && backupData.livePreview) {
      // Convert backup data to PageTypePreviewConfig format
      const config: PageTypePreviewConfig = {
        pageType,
        breakpoints: backupData.livePreview.breakpoints || [],
        urlPattern: `/${pageType === 'page' ? '' : pageType + '/'}${'{slug}'}`,
        authRequired: false,
        draftSupport: true,
        customSettings: {},
      }

      // Extract custom settings from backup
      const { url, breakpoints, ...customSettings } = backupData.livePreview
      if (Object.keys(customSettings).length > 0) {
        config.customSettings = customSettings
      }

      restored[pageType] = config
    }
  })

  return restored
}
