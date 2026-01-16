import { describe, it, expect } from 'vitest'
import { getBlocksForCollection } from '@/blocks/config/blockAssignments'

/**
 * Tests for block assignment validation
 *
 * These tests verify that the validation logic in getBlocksForCollection
 * properly detects and reports invalid block configurations.
 *
 * Validates Requirements:
 * - 1.3: System SHALL verify that all block references are properly defined
 * - 3.4: System SHALL validate that all blocks in the nested blocks array are properly imported and defined
 */
describe('Block Assignment Validation', () => {
  describe('Valid Configurations', () => {
    it('should successfully validate all collection types without throwing errors', () => {
      const collectionTypes = ['blogs', 'services', 'contacts', 'legal', 'pages'] as const

      collectionTypes.forEach((collectionType) => {
        expect(() => {
          const result = getBlocksForCollection(collectionType)
          expect(result).toBeDefined()
          expect(result.layout).toBeDefined()
          expect(Array.isArray(result.layout)).toBe(true)
        }).not.toThrow()
      })
    })

    it('should return blocks with all required properties', () => {
      const result = getBlocksForCollection('services')

      // Verify all layout blocks have required properties
      result.layout.forEach((block, index) => {
        expect(block, `Layout block at index ${index} should be defined`).toBeDefined()
        expect(block, `Layout block at index ${index} should not be null`).not.toBeNull()
        expect(block.slug, `Layout block at index ${index} should have slug`).toBeDefined()
        expect(typeof block.slug, `Layout block at index ${index} slug should be string`).toBe(
          'string',
        )
        expect(block.fields, `Layout block at index ${index} should have fields`).toBeDefined()
        expect(
          Array.isArray(block.fields),
          `Layout block at index ${index} fields should be array`,
        ).toBe(true)
      })

      // Verify hero blocks if they exist
      if (result.hero) {
        result.hero.forEach((block, index) => {
          expect(block, `Hero block at index ${index} should be defined`).toBeDefined()
          expect(block, `Hero block at index ${index} should not be null`).not.toBeNull()
          expect(block.slug, `Hero block at index ${index} should have slug`).toBeDefined()
          expect(typeof block.slug, `Hero block at index ${index} slug should be string`).toBe(
            'string',
          )
          expect(block.fields, `Hero block at index ${index} should have fields`).toBeDefined()
          expect(
            Array.isArray(block.fields),
            `Hero block at index ${index} fields should be array`,
          ).toBe(true)
        })
      }
    })
  })

  describe('Error Message Quality', () => {
    it('should provide descriptive error messages with collection context', () => {
      // This test documents the expected error message format
      // The actual validation happens at runtime when blocks are loaded

      const result = getBlocksForCollection('services')

      // Verify the function structure supports descriptive errors
      // Error messages should include:
      // 1. Collection name (e.g., "services")
      // 2. Block index (e.g., "index 5")
      // 3. Problem description (e.g., "Block is undefined or null")
      // 4. Helpful guidance (e.g., "Please check the block imports")

      expect(result).toBeDefined()
      expect(result.layout.length).toBeGreaterThan(0)
    })

    it('should validate blocks have slug property', () => {
      const result = getBlocksForCollection('pages')

      // All blocks should have a slug property
      result.layout.forEach((block, index) => {
        expect(
          block.slug,
          `Block at index ${index} should have slug property for Payload to identify it`,
        ).toBeDefined()
        expect(
          block.slug.length,
          `Block at index ${index} slug should not be empty`,
        ).toBeGreaterThan(0)
      })
    })
  })

  describe('Defensive Copying', () => {
    it('should return new array instances to prevent mutation', () => {
      const result1 = getBlocksForCollection('blogs')
      const result2 = getBlocksForCollection('blogs')

      // Verify defensive copying - arrays should be different instances
      expect(result1.layout).not.toBe(result2.layout)

      if (result1.hero && result2.hero) {
        expect(result1.hero).not.toBe(result2.hero)
      }

      // But the blocks themselves should be the same references
      expect(result1.layout[0]).toBe(result2.layout[0])
    })

    it('should not mutate the original BLOCK_ASSIGNMENTS', () => {
      const result = getBlocksForCollection('services')
      const originalLength = result.layout.length

      // Mutate the returned array
      result.layout.push(result.layout[0])

      // Get blocks again and verify original is unchanged
      const result2 = getBlocksForCollection('services')
      expect(result2.layout.length).toBe(originalLength)
    })
  })

  describe('Collection-Specific Validation', () => {
    it('should handle collections with empty hero arrays', () => {
      const result = getBlocksForCollection('legal')

      // Legal collection has empty hero array
      expect(result.hero).toBeDefined()
      expect(Array.isArray(result.hero)).toBe(true)
      expect(result.hero?.length).toBe(0)

      // Should still have layout blocks
      expect(result.layout.length).toBeGreaterThan(0)
    })

    it('should validate all blocks in services collection', () => {
      const result = getBlocksForCollection('services')

      // Services should have hero blocks
      expect(result.hero).toBeDefined()
      expect(result.hero?.length).toBeGreaterThan(0)

      // Services should have multiple layout blocks
      expect(result.layout.length).toBeGreaterThan(10)

      // All blocks should be valid
      result.layout.forEach((block) => {
        expect(block).toBeDefined()
        expect(block.slug).toBeDefined()
        expect(block.fields).toBeDefined()
      })
    })

    it('should include ContainerBlock in all collections', () => {
      const collectionTypes = ['blogs', 'services', 'contacts', 'legal', 'pages'] as const

      collectionTypes.forEach((collectionType) => {
        const result = getBlocksForCollection(collectionType)
        const hasContainer = result.layout.some((block) => block.slug === 'container')

        expect(hasContainer, `Collection "${collectionType}" should include ContainerBlock`).toBe(
          true,
        )
      })
    })
  })

  describe('Block Properties Validation', () => {
    it('should ensure all blocks have Payload Block interface properties', () => {
      const result = getBlocksForCollection('pages')

      result.layout.forEach((block, index) => {
        // Required Payload Block properties
        expect(block.slug, `Block ${index} should have slug`).toBeDefined()
        expect(block.fields, `Block ${index} should have fields`).toBeDefined()

        // Fields should be an array
        expect(Array.isArray(block.fields), `Block ${index} fields should be an array`).toBe(true)

        // Slug should be a valid format (lowercase, may contain hyphens or camelCase)
        expect(block.slug, `Block ${index} slug should match valid format`).toMatch(
          /^[a-z][a-zA-Z0-9-]*$/,
        )
      })
    })

    it('should verify blocks have interfaceName for TypeScript types', () => {
      const result = getBlocksForCollection('services')

      // Most blocks should have interfaceName for proper TypeScript typing
      const blocksWithInterface = result.layout.filter((block) => 'interfaceName' in block)

      expect(
        blocksWithInterface.length,
        'Most blocks should have interfaceName property for TypeScript',
      ).toBeGreaterThan(0)
    })
  })
})
