/**
 * Preview Configuration Tests
 *
 * Tests for preview configuration management, migration, and preservation
 * during the Pages collection consolidation.
 */

import type { CollectionConfig } from 'payload'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  applyPageTypeCustomizations,
  generateConsolidatedPreviewConfig,
  getConsolidatedBreakpoints,
  getPreviewConfigForPageType,
  legacyPreviewConfigurations,
  mergePreviewConfig,
  validatePreviewConfig,
} from '../../../src/utilities/previewConfigManager'
import {
  backupOriginalConfigurations,
  generateMigrationSummary,
  migratePreviewConfigurations,
  restoreFromBackup,
  validateMigratedConfigurations,
} from '../../../src/utilities/previewMigration'

describe('Preview Configuration Manager', () => {
  describe('getPreviewConfigForPageType', () => {
    it('should return correct configuration for each page type', () => {
      const blogConfig = getPreviewConfigForPageType('blog')
      expect(blogConfig.pageType).toBe('blog')
      expect(blogConfig.urlPattern).toBe('/blog/{slug}')
      expect(blogConfig.draftSupport).toBe(true)

      const serviceConfig = getPreviewConfigForPageType('service')
      expect(serviceConfig.pageType).toBe('service')
      expect(serviceConfig.urlPattern).toBe('/services/{slug}')

      const legalConfig = getPreviewConfigForPageType('legal')
      expect(legalConfig.pageType).toBe('legal')
      expect(legalConfig.authRequired).toBe(true)

      const contactConfig = getPreviewConfigForPageType('contact')
      expect(contactConfig.pageType).toBe('contact')
      expect(contactConfig.urlPattern).toBe('/contact/{slug}')

      const pageConfig = getPreviewConfigForPageType('page')
      expect(pageConfig.pageType).toBe('page')
      expect(pageConfig.urlPattern).toBe('/{slug}')
    })

    it('should return default page config for unknown page types', () => {
      const unknownConfig = getPreviewConfigForPageType('unknown')
      expect(unknownConfig.pageType).toBe('page')
    })
  })

  describe('mergePreviewConfig', () => {
    it('should merge custom configuration with defaults', () => {
      const customConfig = {
        breakpoints: [{ label: 'Custom Mobile', name: 'custom-mobile', width: 320, height: 568 }],
        customSettings: {
          customFeature: true,
        },
      }

      const merged = mergePreviewConfig('blog', customConfig)
      expect(merged.pageType).toBe('blog')
      expect(merged.breakpoints).toEqual(customConfig.breakpoints)
      expect(merged.customSettings).toMatchObject({
        ...legacyPreviewConfigurations.blog?.customSettings,
        customFeature: true,
      })
    })

    it('should return default config when no custom config provided', () => {
      const merged = mergePreviewConfig('service')
      expect(merged).toEqual(legacyPreviewConfigurations.service)
    })
  })

  describe('getConsolidatedBreakpoints', () => {
    it('should return unique breakpoints sorted by width', () => {
      const breakpoints = getConsolidatedBreakpoints()

      expect(breakpoints.length).toBeGreaterThan(0)
      expect(breakpoints[0]?.name).toBe('mobile')
      expect(breakpoints[0]?.width).toBe(375)

      // Check that breakpoints are sorted by width
      for (let i = 1; i < breakpoints.length; i++) {
        expect(breakpoints[i]?.width).toBeGreaterThanOrEqual(breakpoints[i - 1]?.width || 0)
      }

      // Check that all breakpoints have required properties
      breakpoints.forEach((breakpoint) => {
        expect(breakpoint).toHaveProperty('name')
        expect(breakpoint).toHaveProperty('label')
        expect(breakpoint).toHaveProperty('width')
        expect(breakpoint).toHaveProperty('height')
        expect(typeof breakpoint.width).toBe('number')
        expect(typeof breakpoint.height).toBe('number')
      })
    })
  })

  describe('validatePreviewConfig', () => {
    it('should validate correct configuration', () => {
      const config = legacyPreviewConfigurations.blog!
      const validation = validatePreviewConfig(config)

      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect missing page type', () => {
      const config = { ...legacyPreviewConfigurations.blog!, pageType: '' }
      const validation = validatePreviewConfig(config)

      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Page type is required')
    })

    it('should detect invalid breakpoints', () => {
      const config = {
        ...legacyPreviewConfigurations.blog!,
        breakpoints: [{ label: '', name: '', width: 0, height: -1 }],
      }
      const validation = validatePreviewConfig(config)

      expect(validation.isValid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })

    it('should detect invalid URL pattern', () => {
      const config = {
        ...legacyPreviewConfigurations.blog!,
        urlPattern: '/blog/invalid-pattern',
      }
      const validation = validatePreviewConfig(config)

      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('URL pattern must include {slug} placeholder')
    })
  })

  describe('generateConsolidatedPreviewConfig', () => {
    it('should generate consolidated configuration', () => {
      const consolidated = generateConsolidatedPreviewConfig()

      expect(consolidated).toHaveProperty('breakpoints')
      expect(consolidated).toHaveProperty('pageTypeConfigs')
      expect(Array.isArray(consolidated.breakpoints)).toBe(true)
      expect(typeof consolidated.pageTypeConfigs).toBe('object')

      // Check that all page types are included
      const pageTypes = ['page', 'blog', 'service', 'legal', 'contact']
      pageTypes.forEach((pageType) => {
        expect(consolidated.pageTypeConfigs).toHaveProperty(pageType)
      })
    })
  })

  describe('applyPageTypeCustomizations', () => {
    it('should apply blog customizations', () => {
      const doc = {
        pageType: 'blog',
        blogConfig: {
          author: 'John Doe',
          tags: [{ tag: 'tech' }, { tag: 'cms' }],
          publishedDate: '2024-01-01',
        },
      }
      const baseData = { title: 'Test Blog Post' }

      const customized = applyPageTypeCustomizations(doc, baseData)

      expect(customized.author).toBe('John Doe')
      expect(customized.tags).toEqual(doc.blogConfig.tags)
      expect(customized.publishedDate).toBe('2024-01-01')
      expect(customized.previewSettings.pageType).toBe('blog')
    })

    it('should apply service customizations', () => {
      const doc = {
        pageType: 'service',
        serviceConfig: {
          pricing: { amount: 100, currency: 'USD', period: 'hourly' },
          serviceType: 'web-dev',
          featured: true,
        },
      }
      const baseData = { title: 'Web Development Service' }

      const customized = applyPageTypeCustomizations(doc, baseData)

      expect(customized.pricing).toEqual(doc.serviceConfig.pricing)
      expect(customized.serviceType).toBe('web-dev')
      expect(customized.featured).toBe(true)
      expect(customized.previewSettings.pageType).toBe('service')
    })

    it('should apply legal customizations', () => {
      const doc = {
        pageType: 'legal',
        legalConfig: {
          effectiveDate: '2024-01-01',
          lastUpdated: '2024-01-15',
          documentType: 'privacy',
        },
      }
      const baseData = { title: 'Privacy Policy' }

      const customized = applyPageTypeCustomizations(doc, baseData)

      expect(customized.effectiveDate).toBe('2024-01-01')
      expect(customized.lastUpdated).toBe('2024-01-15')
      expect(customized.documentType).toBe('privacy')
      expect(customized.previewSettings.pageType).toBe('legal')
    })

    it('should apply contact customizations', () => {
      const doc = {
        pageType: 'contact',
        contactConfig: {
          purpose: 'general',
          formRelations: [{ form: 'contact-form-1' }],
        },
      }
      const baseData = { title: 'Contact Us' }

      const customized = applyPageTypeCustomizations(doc, baseData)

      expect(customized.purpose).toBe('general')
      expect(customized.formRelations).toEqual(doc.contactConfig.formRelations)
      expect(customized.previewSettings.pageType).toBe('contact')
    })

    it('should apply page hierarchy customizations', () => {
      const doc = {
        pageType: 'page',
        parent: 'parent-page-id',
        breadcrumbs: [
          { doc: 'home', label: 'Home', url: '/' },
          { doc: 'parent', label: 'Parent', url: '/parent' },
        ],
      }
      const baseData = { title: 'Child Page' }

      const customized = applyPageTypeCustomizations(doc, baseData)

      expect(customized.hierarchy.parent).toBe('parent-page-id')
      expect(customized.hierarchy.breadcrumbs).toEqual(doc.breadcrumbs)
      expect(customized.previewSettings.pageType).toBe('page')
    })
  })
})

describe('Preview Configuration Migration', () => {
  let mockOriginalCollections: Record<string, CollectionConfig>

  beforeEach(() => {
    mockOriginalCollections = {
      blogs: {
        slug: 'blogs',
        admin: {
          livePreview: {
            url: 'http://localhost:3000/blog/{slug}',
            breakpoints: [
              { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
              { label: 'Desktop', name: 'desktop', width: 1200, height: 800 },
            ],
          },
        },
        fields: [],
      },
      services: {
        slug: 'services',
        admin: {
          livePreview: {
            url: 'http://localhost:3000/services/{slug}',
            breakpoints: [
              { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
              { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
              { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
            ],
          },
        },
        fields: [],
      },
      legal: {
        slug: 'legal',
        admin: {
          livePreview: {
            url: 'http://localhost:3000/legal/{slug}',
          },
        },
        fields: [],
      },
      contacts: {
        slug: 'contacts',
        admin: {
          livePreview: {
            url: 'http://localhost:3000/contact/{slug}',
          },
        },
        fields: [],
      },
      pages: {
        slug: 'pages',
        admin: {
          livePreview: {
            url: 'http://localhost:3000/{slug}',
            breakpoints: [
              { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
              { label: 'Desktop', name: 'desktop', width: 1200, height: 800 },
            ],
          },
        },
        fields: [],
      },
    }
  })

  describe('migratePreviewConfigurations', () => {
    it('should successfully migrate all configurations', () => {
      const report = migratePreviewConfigurations(mockOriginalCollections)

      expect(report.success).toBe(true)
      expect(report.errors).toHaveLength(0)
      expect(Object.keys(report.migratedConfigurations)).toHaveLength(5)

      // Check that all page types are migrated
      expect(report.migratedConfigurations).toHaveProperty('blog')
      expect(report.migratedConfigurations).toHaveProperty('service')
      expect(report.migratedConfigurations).toHaveProperty('legal')
      expect(report.migratedConfigurations).toHaveProperty('contact')
      expect(report.migratedConfigurations).toHaveProperty('page')
    })

    it('should preserve custom settings', () => {
      const report = migratePreviewConfigurations(mockOriginalCollections)

      expect(report.preservedSettings.blog).toMatchObject({
        customSetting: true,
      })
      expect(report.preservedSettings.service).toMatchObject({
        showPricing: true,
      })
    })

    it('should handle unknown collection slugs', () => {
      const collectionsWithUnknown = {
        ...mockOriginalCollections,
        unknown: {
          slug: 'unknown',
          admin: { livePreview: { url: '/unknown/{slug}' } },
          fields: [],
        },
      }

      const report = migratePreviewConfigurations(collectionsWithUnknown)

      expect(report.warnings).toContain('Unknown collection slug: unknown')
    })
  })

  describe('generateMigrationSummary', () => {
    it('should generate comprehensive migration summary', () => {
      const report = migratePreviewConfigurations(mockOriginalCollections)
      const summary = generateMigrationSummary(report)

      expect(summary).toContain('# Preview Configuration Migration Summary')
      expect(summary).toContain('✅ Success')
      expect(summary).toContain('## Migrated Configurations')
      expect(summary).toContain('## Preserved Settings')
      expect(summary).toContain('## Next Steps')
    })

    it('should show errors in summary when migration fails', () => {
      const invalidCollections = {
        blogs: {
          slug: 'blogs',
          admin: {
            livePreview: {
              breakpoints: [
                { label: '', name: '', width: 0, height: 0 }, // Invalid breakpoint
              ],
            },
          },
          fields: [],
        },
      }

      const report = migratePreviewConfigurations(invalidCollections)
      const summary = generateMigrationSummary(report)

      expect(summary).toContain('❌ Failed')
      expect(summary).toContain('## Errors')
    })
  })

  describe('validateMigratedConfigurations', () => {
    it('should validate successful migration', () => {
      const report = migratePreviewConfigurations(mockOriginalCollections)
      const validation = validateMigratedConfigurations(report.migratedConfigurations)

      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect missing required page types', () => {
      const incompleteConfigs = {
        blog: legacyPreviewConfigurations.blog!,
        // Missing other required page types
      }

      const validation = validateMigratedConfigurations(incompleteConfigs)

      expect(validation.isValid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
      expect(validation.errors.some((error) => error.includes('Missing configuration'))).toBe(true)
    })
  })

  describe('backupOriginalConfigurations', () => {
    it('should create backup of original configurations', () => {
      const backup = backupOriginalConfigurations(mockOriginalCollections)

      expect(backup).toHaveProperty('blogs')
      expect(backup).toHaveProperty('services')
      expect(backup).toHaveProperty('legal')
      expect(backup).toHaveProperty('contacts')
      expect(backup).toHaveProperty('pages')

      expect(backup.blogs?.livePreview).toEqual(mockOriginalCollections.blogs?.admin?.livePreview)
      expect(backup.blogs).toHaveProperty('timestamp')
      expect(backup.blogs).toHaveProperty('version')
    })

    it('should skip collections without live preview', () => {
      const collectionsWithoutPreview = {
        ...mockOriginalCollections,
        noPreview: {
          slug: 'noPreview',
          admin: {},
          fields: [],
        },
      }

      const backup = backupOriginalConfigurations(collectionsWithoutPreview)

      expect(backup).not.toHaveProperty('noPreview')
    })
  })

  describe('restoreFromBackup', () => {
    it('should restore configurations from backup', () => {
      const backup = backupOriginalConfigurations(mockOriginalCollections)
      const restored = restoreFromBackup(backup)

      expect(restored).toHaveProperty('blog')
      expect(restored).toHaveProperty('service')
      expect(restored).toHaveProperty('legal')
      expect(restored).toHaveProperty('contact')
      expect(restored).toHaveProperty('page')

      expect(restored.blog?.pageType).toBe('blog')
      expect(restored.service?.pageType).toBe('service')
    })
  })
})
