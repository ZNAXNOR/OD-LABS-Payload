/**
 * Preview Configuration Manager
 *
 * Preserves and manages preview configurations from original collections
 * during the consolidation process. Ensures backward compatibility and
 * maintains existing preview customizations.
 */

import type { CollectionConfig } from 'payload'

/**
 * Preview configuration interface for different page types
 */
export interface PageTypePreviewConfig {
  pageType: string
  breakpoints?: Array<{
    label: string
    name: string
    width: number
    height: number
  }>
  customSettings?: Record<string, any>
  urlPattern?: string
  authRequired?: boolean
  draftSupport?: boolean
}

/**
 * Legacy preview configurations from original collections
 * These are preserved during migration to maintain existing functionality
 */
export const legacyPreviewConfigurations: Record<string, PageTypePreviewConfig> = {
  // Blog pages preview configuration
  blog: {
    pageType: 'blog',
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1200, height: 800 },
    ],
    urlPattern: '/blog/{slug}',
    authRequired: false,
    draftSupport: true,
    customSettings: {
      showAuthor: true,
      showPublishDate: true,
      showTags: true,
      enableComments: true,
    },
  },

  // Service pages preview configuration
  service: {
    pageType: 'service',
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      { label: 'Large Desktop', name: 'large', width: 1920, height: 1080 },
    ],
    urlPattern: '/services/{slug}',
    authRequired: false,
    draftSupport: true,
    customSettings: {
      showPricing: true,
      showServiceType: true,
      showFeaturedBadge: true,
      enableInquiryForm: true,
    },
  },

  // Legal pages preview configuration
  legal: {
    pageType: 'legal',
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Desktop', name: 'desktop', width: 1200, height: 800 },
    ],
    urlPattern: '/legal/{slug}',
    authRequired: true, // Legal documents may require authentication
    draftSupport: true,
    customSettings: {
      showEffectiveDate: true,
      showLastUpdated: true,
      showDocumentType: true,
      enableNotifications: true,
      highlightChanges: true,
    },
  },

  // Contact pages preview configuration
  contact: {
    pageType: 'contact',
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1200, height: 800 },
    ],
    urlPattern: '/contact/{slug}',
    authRequired: false,
    draftSupport: true,
    customSettings: {
      showPurpose: true,
      showFormRelations: true,
      enableFormValidation: true,
      showContactInfo: true,
    },
  },

  // Regular pages preview configuration
  page: {
    pageType: 'page',
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      { label: 'Large Desktop', name: 'large', width: 1920, height: 1080 },
    ],
    urlPattern: '/{slug}',
    authRequired: false,
    draftSupport: true,
    customSettings: {
      showHierarchy: true,
      showBreadcrumbs: true,
      enableNavigation: true,
    },
  },
}

/**
 * Get preview configuration for a specific page type
 */
export const getPreviewConfigForPageType = (pageType: string): PageTypePreviewConfig => {
  return legacyPreviewConfigurations[pageType] || legacyPreviewConfigurations.page!
}

/**
 * Merge custom preview settings with default configuration
 */
export const mergePreviewConfig = (
  pageType: string,
  customConfig?: Partial<PageTypePreviewConfig>,
): PageTypePreviewConfig => {
  const defaultConfig = getPreviewConfigForPageType(pageType)

  if (!customConfig) {
    return defaultConfig
  }

  return {
    ...defaultConfig,
    ...customConfig,
    breakpoints: customConfig.breakpoints || defaultConfig.breakpoints,
    customSettings: {
      ...defaultConfig.customSettings,
      ...customConfig.customSettings,
    },
  }
}

/**
 * Generate consolidated breakpoints for all page types
 * Combines breakpoints from all page type configurations
 */
export const getConsolidatedBreakpoints = (): Array<{
  label: string
  name: string
  width: number
  height: number
}> => {
  const breakpointMap = new Map<
    string,
    { label: string; name: string; width: number; height: number }
  >()

  // Collect all unique breakpoints from all page types
  Object.values(legacyPreviewConfigurations).forEach((config) => {
    config.breakpoints?.forEach((breakpoint) => {
      if (!breakpointMap.has(breakpoint.name)) {
        breakpointMap.set(breakpoint.name, breakpoint)
      }
    })
  })

  // Sort breakpoints by width
  return Array.from(breakpointMap.values()).sort((a, b) => a.width - b.width)
}

/**
 * Validate preview configuration
 */
export const validatePreviewConfig = (
  config: PageTypePreviewConfig,
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (!config.pageType) {
    errors.push('Page type is required')
  }

  if (config.breakpoints) {
    config.breakpoints.forEach((breakpoint, index) => {
      if (!breakpoint.name) {
        errors.push(`Breakpoint ${index} is missing name`)
      }
      if (!breakpoint.label) {
        errors.push(`Breakpoint ${index} is missing label`)
      }
      if (!breakpoint.width || breakpoint.width <= 0) {
        errors.push(`Breakpoint ${index} has invalid width`)
      }
      if (!breakpoint.height || breakpoint.height <= 0) {
        errors.push(`Breakpoint ${index} has invalid height`)
      }
    })
  }

  if (config.urlPattern && !config.urlPattern.includes('{slug}')) {
    errors.push('URL pattern must include {slug} placeholder')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Generate preview configuration for the consolidated Pages collection
 * Preserves all original collection configurations
 */
export const generateConsolidatedPreviewConfig = (): {
  breakpoints: Array<{
    label: string
    name: string
    width: number
    height: number
  }>
  pageTypeConfigs: Record<string, PageTypePreviewConfig>
} => {
  return {
    breakpoints: getConsolidatedBreakpoints(),
    pageTypeConfigs: { ...legacyPreviewConfigurations },
  }
}

/**
 * Apply page type-specific preview customizations
 */
export const applyPageTypeCustomizations = (doc: any, basePreviewData: any): any => {
  const pageType = doc?.pageType || 'page'
  const config = getPreviewConfigForPageType(pageType)

  if (!config.customSettings) {
    return basePreviewData
  }

  // Apply page type-specific customizations
  const customizedData = { ...basePreviewData }

  // Add page type-specific metadata
  customizedData.previewSettings = {
    pageType,
    customizations: config.customSettings,
    authRequired: config.authRequired,
    draftSupport: config.draftSupport,
  }

  // Apply specific customizations based on page type
  switch (pageType) {
    case 'blog':
      if (config.customSettings.showAuthor && doc.blogConfig?.author) {
        customizedData.author = doc.blogConfig.author
      }
      if (config.customSettings.showTags && doc.blogConfig?.tags) {
        customizedData.tags = doc.blogConfig.tags
      }
      if (config.customSettings.showPublishDate && doc.blogConfig?.publishedDate) {
        customizedData.publishedDate = doc.blogConfig.publishedDate
      }
      break

    case 'service':
      if (config.customSettings.showPricing && doc.serviceConfig?.pricing) {
        customizedData.pricing = doc.serviceConfig.pricing
      }
      if (config.customSettings.showServiceType && doc.serviceConfig?.serviceType) {
        customizedData.serviceType = doc.serviceConfig.serviceType
      }
      if (config.customSettings.showFeaturedBadge && doc.serviceConfig?.featured) {
        customizedData.featured = doc.serviceConfig.featured
      }
      break

    case 'legal':
      if (config.customSettings.showEffectiveDate && doc.legalConfig?.effectiveDate) {
        customizedData.effectiveDate = doc.legalConfig.effectiveDate
      }
      if (config.customSettings.showLastUpdated && doc.legalConfig?.lastUpdated) {
        customizedData.lastUpdated = doc.legalConfig.lastUpdated
      }
      if (config.customSettings.showDocumentType && doc.legalConfig?.documentType) {
        customizedData.documentType = doc.legalConfig.documentType
      }
      break

    case 'contact':
      if (config.customSettings.showPurpose && doc.contactConfig?.purpose) {
        customizedData.purpose = doc.contactConfig.purpose
      }
      if (config.customSettings.showFormRelations && doc.contactConfig?.formRelations) {
        customizedData.formRelations = doc.contactConfig.formRelations
      }
      break

    case 'page':
    default:
      if (config.customSettings.showHierarchy && doc.parent) {
        customizedData.hierarchy = {
          parent: doc.parent,
          breadcrumbs: doc.breadcrumbs,
        }
      }
      break
  }

  return customizedData
}

/**
 * Migration helper: Extract preview configurations from original collections
 * This would be used during the migration process to preserve existing settings
 */
export const extractLegacyPreviewConfig = (
  collectionConfig: CollectionConfig,
): Partial<PageTypePreviewConfig> => {
  const livePreview = collectionConfig.admin?.livePreview

  if (!livePreview) {
    return {}
  }

  const config: Partial<PageTypePreviewConfig> = {}

  // Extract breakpoints if they exist
  if ('breakpoints' in livePreview && Array.isArray(livePreview.breakpoints)) {
    config.breakpoints = livePreview.breakpoints.map((bp) => ({
      label: bp.label,
      name: bp.name,
      width: typeof bp.width === 'string' ? parseInt(bp.width, 10) : bp.width,
      height: typeof bp.height === 'string' ? parseInt(bp.height, 10) : bp.height,
    }))
  }

  // Extract other custom settings
  if (typeof livePreview === 'object') {
    const { url, breakpoints, ...customSettings } = livePreview as any
    if (Object.keys(customSettings).length > 0) {
      config.customSettings = customSettings
    }
  }

  return config
}
