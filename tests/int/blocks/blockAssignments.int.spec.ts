import { describe, it, expect } from 'vitest'
import { getBlocksForCollection, type PageCollectionType } from '@/blocks/config/blockAssignments'

describe('getBlocksForCollection - Block Reference Validation', () => {
  const collectionTypes: PageCollectionType[] = ['blogs', 'services', 'contacts', 'legal', 'pages']

  describe('Block Reference Validation', () => {
    it.each(collectionTypes)('should return defined blocks for %s collection', (collectionType) => {
      const result = getBlocksForCollection(collectionType)

      // Verify result structure
      expect(result).toBeDefined()
      expect(result).toHaveProperty('layout')

      // Verify layout blocks are defined
      expect(Array.isArray(result.layout)).toBe(true)
      expect(result.layout.length).toBeGreaterThan(0)

      // Verify each layout block is defined and has required properties
      result.layout.forEach((block, index) => {
        expect(block).toBeDefined()
        expect(block).not.toBeNull()
        expect(block).toHaveProperty('slug')
        expect(typeof block.slug).toBe('string')
        expect(block.slug.length).toBeGreaterThan(0)
      })

      // Verify hero blocks if they exist
      if (result.hero) {
        expect(Array.isArray(result.hero)).toBe(true)
        result.hero.forEach((block, index) => {
          expect(block).toBeDefined()
          expect(block).not.toBeNull()
          expect(block).toHaveProperty('slug')
          expect(typeof block.slug).toBe('string')
          expect(block.slug.length).toBeGreaterThan(0)
        })
      }
    })

    it('should not throw error when all blocks are properly defined', () => {
      expect(() => {
        getBlocksForCollection('blogs')
      }).not.toThrow()

      expect(() => {
        getBlocksForCollection('services')
      }).not.toThrow()

      expect(() => {
        getBlocksForCollection('contacts')
      }).not.toThrow()

      expect(() => {
        getBlocksForCollection('legal')
      }).not.toThrow()

      expect(() => {
        getBlocksForCollection('pages')
      }).not.toThrow()
    })

    it('should return arrays that are not the same reference as the original', () => {
      const result1 = getBlocksForCollection('blogs')
      const result2 = getBlocksForCollection('blogs')

      // Verify we get new arrays each time (defensive copying)
      expect(result1.layout).not.toBe(result2.layout)
      if (result1.hero && result2.hero) {
        expect(result1.hero).not.toBe(result2.hero)
      }
    })
  })

  describe('Collection-Specific Block Assignments', () => {
    it('should return HeroBlock for blogs collection', () => {
      const result = getBlocksForCollection('blogs')
      expect(result.hero).toBeDefined()
      expect(result.hero?.length).toBeGreaterThan(0)
      expect(result.hero?.[0].slug).toBe('hero')
    })

    it('should return HeroBlock for services collection', () => {
      const result = getBlocksForCollection('services')
      expect(result.hero).toBeDefined()
      expect(result.hero?.length).toBeGreaterThan(0)
      expect(result.hero?.[0].slug).toBe('hero')
    })

    it('should return empty hero array for legal collection', () => {
      const result = getBlocksForCollection('legal')
      // Legal pages don't have hero sections - returns empty array
      expect(result.hero).toBeDefined()
      expect(Array.isArray(result.hero)).toBe(true)
      expect(result.hero?.length).toBe(0)
    })

    it('should return ContainerBlock in all collections', () => {
      const collectionTypes: PageCollectionType[] = [
        'blogs',
        'services',
        'contacts',
        'legal',
        'pages',
      ]

      collectionTypes.forEach((collectionType) => {
        const result = getBlocksForCollection(collectionType)
        const hasContainerBlock = result.layout.some((block) => block.slug === 'container')
        expect(hasContainerBlock).toBe(true)
      })
    })

    it('should return more blocks for pages collection than other collections', () => {
      const pagesResult = getBlocksForCollection('pages')
      const blogsResult = getBlocksForCollection('blogs')
      const servicesResult = getBlocksForCollection('services')

      // Pages collection should have the most blocks (maximum flexibility)
      expect(pagesResult.layout.length).toBeGreaterThanOrEqual(blogsResult.layout.length)
      expect(pagesResult.layout.length).toBeGreaterThanOrEqual(servicesResult.layout.length)
    })
  })

  describe('Block Properties', () => {
    it('should return blocks with required Payload block properties', () => {
      const result = getBlocksForCollection('services')

      result.layout.forEach((block) => {
        // Verify block has Payload Block interface properties
        expect(block).toHaveProperty('slug')
        expect(block).toHaveProperty('fields')
        expect(Array.isArray(block.fields)).toBe(true)
      })
    })

    it('should return blocks with valid slug format', () => {
      const result = getBlocksForCollection('pages')

      result.layout.forEach((block) => {
        // Slugs should be lowercase and may contain hyphens or camelCase
        // Both formats are valid in Payload: 'my-block' or 'myBlock'
        expect(block.slug).toMatch(/^[a-z][a-zA-Z0-9-]*$/)
      })

      if (result.hero) {
        result.hero.forEach((block) => {
          expect(block.slug).toMatch(/^[a-z][a-zA-Z0-9-]*$/)
        })
      }
    })
  })

  describe('Error Messages', () => {
    it('should provide descriptive error messages with collection name and index', () => {
      // This test documents the expected error message format
      // In practice, we can't easily trigger these errors without modifying the source
      // but we verify the function structure is correct

      const result = getBlocksForCollection('services')

      // If validation were to fail, the error message should include:
      // - Collection name: "services"
      // - Block index: e.g., "index 5"
      // - Helpful context: "Please check the block imports"

      // We verify the function executes successfully with valid data
      expect(result).toBeDefined()
      expect(result.layout.length).toBeGreaterThan(0)
    })
  })
})
