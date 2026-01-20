import { describe, it, expect, vi } from 'vitest'
import {
  defaultBlockConverters,
  mergeBlockConverters,
  validateBlockNode,
  isBlockTypeSupported,
  getSupportedBlockTypes,
  createEnhancedBlockConverters,
} from '../blockConverters'

// Mock React
vi.mock('react', () => ({
  createElement: vi.fn((component, props) => ({ component, props })),
  lazy: vi.fn((loader) => ({ loader })),
  Suspense: vi.fn(({ children }) => children),
}))

// Mock the error boundary utilities
vi.mock('../utils', () => ({
  createErrorBoundaryWrapper: vi.fn((Component) => Component),
  DefaultBlockErrorFallback: vi.fn(),
}))

describe('Block Converter System', () => {
  describe('defaultBlockConverters', () => {
    it('should have converters for all major block types', () => {
      const expectedBlockTypes = [
        'hero',
        'content',
        'mediaBlock',
        'banner',
        'code',
        'cta',
        'contactForm',
        'newsletter',
        'socialProof',
        'servicesGrid',
        'techStack',
        'processSteps',
        'pricingTable',
        'projectShowcase',
        'caseStudy',
        'beforeAfter',
        'testimonial',
        'featureGrid',
        'statsCounter',
        'faqAccordion',
        'timeline',
        'container',
        'divider',
        'spacer',
      ]

      expectedBlockTypes.forEach((blockType) => {
        expect(defaultBlockConverters).toHaveProperty(blockType)
        expect(typeof (defaultBlockConverters as any)[blockType]).toBe('function')
      })
    })

    it('should return React elements when converters are called', () => {
      const mockNode = {
        fields: {
          blockType: 'hero',
          heading: 'Test Heading',
          variant: 'default',
        },
      }

      const result = defaultBlockConverters.hero({ node: mockNode as any })
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })
  })

  describe('mergeBlockConverters', () => {
    it('should merge custom converters with defaults', () => {
      const customConverters = {
        customBlock: vi.fn(),
        hero: vi.fn(), // Override existing
      }

      const merged = mergeBlockConverters(customConverters)

      expect(merged.customBlock).toBe(customConverters.customBlock)
      expect(merged.hero).toBe(customConverters.hero)
      expect(merged.content).toBe(defaultBlockConverters.content)
    })

    it('should return defaults when no custom converters provided', () => {
      const merged = mergeBlockConverters()
      expect(merged).toEqual(defaultBlockConverters)
    })
  })

  describe('validateBlockNode', () => {
    it('should validate correct block node structure', () => {
      const validNode = {
        fields: {
          blockType: 'hero',
          heading: 'Test',
        },
      }

      expect(validateBlockNode(validNode)).toBe(true)
    })

    it('should reject invalid block node structures', () => {
      expect(validateBlockNode(null)).toBe(false)
      expect(validateBlockNode({})).toBe(false)
      expect(validateBlockNode({ fields: null })).toBe(false)
      expect(validateBlockNode({ notFields: {} })).toBe(false)
    })
  })

  describe('isBlockTypeSupported', () => {
    it('should return true for supported block types', () => {
      expect(isBlockTypeSupported('hero')).toBe(true)
      expect(isBlockTypeSupported('content')).toBe(true)
      expect(isBlockTypeSupported('cta')).toBe(true)
    })

    it('should return false for unsupported block types', () => {
      expect(isBlockTypeSupported('unknownBlock')).toBe(false)
      expect(isBlockTypeSupported('')).toBe(false)
    })
  })

  describe('getSupportedBlockTypes', () => {
    it('should return array of all supported block types', () => {
      const supportedTypes = getSupportedBlockTypes()

      expect(Array.isArray(supportedTypes)).toBe(true)
      expect(supportedTypes.length).toBeGreaterThan(0)
      expect(supportedTypes).toContain('hero')
      expect(supportedTypes).toContain('content')
      expect(supportedTypes).toContain('cta')
    })
  })

  describe('createEnhancedBlockConverters', () => {
    it('should create enhanced converters with fallback support', () => {
      const enhanced = createEnhancedBlockConverters()

      // Should have all default converters
      expect(enhanced.hero).toBeDefined()
      expect(enhanced.content).toBeDefined()

      // Should handle unknown block types gracefully
      expect(typeof enhanced.unknownBlock).toBe('function')
    })

    it('should merge custom converters into enhanced system', () => {
      const customConverters = {
        customBlock: vi.fn(),
      }

      const enhanced = createEnhancedBlockConverters(customConverters)

      expect(enhanced.customBlock).toBe(customConverters.customBlock)
      expect(enhanced.hero).toBeDefined()
    })
  })
})
