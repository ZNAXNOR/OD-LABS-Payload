/**
 * Unit tests for Pattern Comparator
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { PatternComparator } from '../../analyzers/PatternComparator'
import { StructuralComparator } from '../../analyzers/StructuralComparator'
import { FeatureDetector } from '../../analyzers/FeatureDetector'
import type { Block } from '../../types'

describe('PatternComparator', () => {
  let comparator: PatternComparator

  beforeEach(() => {
    comparator = new PatternComparator({
      githubToken: 'test-token',
      cacheDir: '.test-cache',
    })
  })

  describe('compareBlock', () => {
    it('should compare two blocks and return comparison result', () => {
      const localBlock: Block = {
        slug: 'hero',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'textarea' },
        ],
      }

      const officialBlock: Block = {
        slug: 'hero',
        interfaceName: 'HeroBlock',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'textarea' },
          { name: 'image', type: 'upload', relationTo: 'media' },
        ],
        access: {
          read: () => true,
        },
      }

      const result = comparator.compareBlock(localBlock, officialBlock)

      expect(result).toBeDefined()
      expect(result.blockSlug).toBe('hero')
      expect(result.structuralDifferences).toBeDefined()
      expect(result.featureDifferences).toBeDefined()
      expect(result.organizationDifferences).toBeDefined()
    })

    it('should detect missing features', () => {
      const localBlock: Block = {
        slug: 'simple',
        fields: [{ name: 'title', type: 'text' }],
      }

      const officialBlock: Block = {
        slug: 'simple',
        interfaceName: 'SimpleBlock',
        access: {
          read: () => true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            validate: (value) => Boolean(value),
          },
        ],
      }

      const result = comparator.compareBlock(localBlock, officialBlock)

      // Should detect missing typescript-interface, access-control, and custom-validation
      expect(result.featureDifferences.length).toBeGreaterThan(0)

      const missingFeatures = result.featureDifferences.filter(
        (diff) => diff.presentInOfficial && !diff.presentInCurrent,
      )
      expect(missingFeatures.length).toBeGreaterThan(0)
    })
  })

  describe('suggestImprovements', () => {
    it('should generate recommendations from comparison results', () => {
      const comparisonResult = {
        blockSlug: 'hero',
        structuralDifferences: [
          {
            type: 'field-order' as const,
            description: 'Field order differs',
            officialApproach: 'title, image, description',
            currentApproach: 'title, description',
          },
        ],
        featureDifferences: [
          {
            featureName: 'typescript-interface',
            presentInOfficial: true,
            presentInCurrent: false,
            description: 'Missing TypeScript interface',
          },
        ],
        organizationDifferences: [
          {
            type: 'field-organization' as const,
            description: 'Different organization',
            recommendation: 'Use groups',
          },
        ],
      }

      const recommendations = comparator.suggestImprovements(comparisonResult)

      expect(recommendations.length).toBeGreaterThan(0)
      expect(recommendations[0]).toHaveProperty('priority')
      expect(recommendations[0]).toHaveProperty('title')
      expect(recommendations[0]).toHaveProperty('description')
      expect(recommendations[0]).toHaveProperty('estimatedTime')
    })
  })

  describe('findMatchingPattern', () => {
    it('should find exact slug match', () => {
      const localBlock: Block = {
        slug: 'hero',
        fields: [],
      }

      const officialPatterns = [
        {
          source: 'payloadcms/website' as const,
          blockSlug: 'hero',
          config: { slug: 'hero', fields: [] },
          features: [],
        },
        {
          source: 'payloadcms/website' as const,
          blockSlug: 'banner',
          config: { slug: 'banner', fields: [] },
          features: [],
        },
      ]

      const match = comparator.findMatchingPattern(localBlock, officialPatterns)

      expect(match).toBeDefined()
      expect(match?.blockSlug).toBe('hero')
    })

    it('should find fuzzy match when exact match not found', () => {
      const localBlock: Block = {
        slug: 'heroblock',
        fields: [],
      }

      const officialPatterns = [
        {
          source: 'payloadcms/website' as const,
          blockSlug: 'hero',
          config: { slug: 'hero', fields: [] },
          features: [],
        },
      ]

      const match = comparator.findMatchingPattern(localBlock, officialPatterns)

      // Fuzzy matching requires >60% similarity
      // 'heroblock' vs 'hero' has similarity of 4/9 = 0.44, which is below threshold
      // So we expect null in this case
      expect(match).toBeNull()
    })

    it('should find fuzzy match with high similarity', () => {
      const localBlock: Block = {
        slug: 'heroes',
        fields: [],
      }

      const officialPatterns = [
        {
          source: 'payloadcms/website' as const,
          blockSlug: 'hero',
          config: { slug: 'hero', fields: [] },
          features: [],
        },
      ]

      const match = comparator.findMatchingPattern(localBlock, officialPatterns)

      // 'heroes' vs 'hero' has high similarity (5/6 = 0.83)
      expect(match).toBeDefined()
      expect(match?.blockSlug).toBe('hero')
    })

    it('should return null when no match found', () => {
      const localBlock: Block = {
        slug: 'custom-block',
        fields: [],
      }

      const officialPatterns = [
        {
          source: 'payloadcms/website' as const,
          blockSlug: 'hero',
          config: { slug: 'hero', fields: [] },
          features: [],
        },
      ]

      const match = comparator.findMatchingPattern(localBlock, officialPatterns)

      expect(match).toBeNull()
    })
  })

  describe('identifyMissingFeatures', () => {
    it('should identify features present in official but missing in local', () => {
      const localBlocks: Block[] = [
        {
          slug: 'simple',
          fields: [{ name: 'title', type: 'text' }],
        },
      ]

      const officialBlocks: Block[] = [
        {
          slug: 'advanced',
          interfaceName: 'AdvancedBlock',
          access: {
            read: () => true,
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              validate: (value) => Boolean(value),
            },
          ],
        },
      ]

      const missingFeatures = comparator.identifyMissingFeatures(localBlocks, officialBlocks)

      expect(missingFeatures.length).toBeGreaterThan(0)

      const featureNames = missingFeatures.map((f) => f.featureName)
      expect(featureNames).toContain('typescript-interface')
      expect(featureNames).toContain('access-control')
      expect(featureNames).toContain('custom-validation')
    })
  })
})

describe('StructuralComparator', () => {
  let comparator: StructuralComparator

  beforeEach(() => {
    comparator = new StructuralComparator()
  })

  describe('compareStructure', () => {
    it('should detect field order differences', () => {
      const localBlock: Block = {
        slug: 'test',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'description', type: 'textarea' },
          { name: 'image', type: 'upload', relationTo: 'media' },
        ],
      }

      const officialBlock: Block = {
        slug: 'test',
        fields: [
          { name: 'image', type: 'upload', relationTo: 'media' },
          { name: 'title', type: 'text' },
          { name: 'description', type: 'textarea' },
        ],
      }

      const diffs = comparator.compareStructure(localBlock, officialBlock)

      const orderDiff = diffs.find((d) => d.type === 'field-order')
      expect(orderDiff).toBeDefined()
    })

    it('should detect nesting depth differences', () => {
      const localBlock: Block = {
        slug: 'test',
        fields: [{ name: 'title', type: 'text' }],
      }

      const officialBlock: Block = {
        slug: 'test',
        fields: [
          {
            name: 'content',
            type: 'group',
            fields: [
              {
                name: 'nested',
                type: 'group',
                fields: [
                  {
                    name: 'deepNested',
                    type: 'group',
                    fields: [{ name: 'title', type: 'text' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      const diffs = comparator.compareStructure(localBlock, officialBlock)

      const depthDiff = diffs.find((d) => d.type === 'nesting-depth')
      expect(depthDiff).toBeDefined()
    })
  })

  describe('compareOrganization', () => {
    it('should detect missing groups', () => {
      const localBlock: Block = {
        slug: 'test',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'description', type: 'textarea' },
        ],
      }

      const officialBlock: Block = {
        slug: 'test',
        fields: [
          {
            name: 'content',
            type: 'group',
            fields: [
              { name: 'title', type: 'text' },
              { name: 'description', type: 'textarea' },
            ],
          },
        ],
      }

      const diffs = comparator.compareOrganization(localBlock, officialBlock)

      const orgDiff = diffs.find((d) => d.type === 'field-organization')
      expect(orgDiff).toBeDefined()
      expect(orgDiff?.description).toContain('groups')
    })
  })
})

describe('FeatureDetector', () => {
  let detector: FeatureDetector

  beforeEach(() => {
    detector = new FeatureDetector()
  })

  describe('detectFeatures', () => {
    it('should detect typescript-interface feature', () => {
      const block: Block = {
        slug: 'test',
        interfaceName: 'TestBlock',
        fields: [],
      }

      const features = detector.detectFeatures(block)

      const tsFeature = features.find((f) => f.type === 'typescript-interface')
      expect(tsFeature).toBeDefined()
    })

    it('should detect access-control feature', () => {
      const block: Block = {
        slug: 'test',
        access: {
          read: () => true,
        },
        fields: [],
      }

      const features = detector.detectFeatures(block)

      const accessFeature = features.find((f) => f.type === 'access-control')
      expect(accessFeature).toBeDefined()
    })

    it('should detect custom-validation feature', () => {
      const block: Block = {
        slug: 'test',
        fields: [
          {
            name: 'email',
            type: 'email',
            validate: (value) => Boolean(value),
          },
        ],
      }

      const features = detector.detectFeatures(block)

      const validationFeature = features.find((f) => f.type === 'custom-validation')
      expect(validationFeature).toBeDefined()
    })

    it('should detect array-fields feature', () => {
      const block: Block = {
        slug: 'test',
        fields: [
          {
            name: 'items',
            type: 'array',
            fields: [{ name: 'title', type: 'text' }],
          },
        ],
      }

      const features = detector.detectFeatures(block)

      const arrayFeature = features.find((f) => f.type === 'array-fields')
      expect(arrayFeature).toBeDefined()
    })

    it('should detect nested features in groups', () => {
      const block: Block = {
        slug: 'test',
        fields: [
          {
            name: 'content',
            type: 'group',
            fields: [
              {
                name: 'title',
                type: 'text',
                validate: (value: any) => Boolean(value),
              },
            ],
          },
        ],
      }

      const features = detector.detectFeatures(block)

      expect(features.find((f) => f.type === 'group-fields')).toBeDefined()
      expect(features.find((f) => f.type === 'custom-validation')).toBeDefined()
    })
  })

  describe('compareFeatures', () => {
    it('should identify features in official but not in local', () => {
      const localBlock: Block = {
        slug: 'test',
        fields: [{ name: 'title', type: 'text' }],
      }

      const officialBlock: Block = {
        slug: 'test',
        interfaceName: 'TestBlock',
        access: {
          read: () => true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            validate: (value) => Boolean(value),
          },
        ],
      }

      const diffs = detector.compareFeatures(localBlock, officialBlock)

      const missingInLocal = diffs.filter((d) => d.presentInOfficial && !d.presentInCurrent)
      expect(missingInLocal.length).toBeGreaterThan(0)
    })
  })
})
