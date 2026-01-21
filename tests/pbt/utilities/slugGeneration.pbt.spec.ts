import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateSlugFromText, validateSlugFormat } from '@/utilities/slugGeneration'

/**
 * Property-Based Tests for Slug Generation
 *
 * These tests validate that slug generation properties hold across a wide range of inputs.
 * Uses fast-check library to generate 1000+ test cases automatically.
 *
 * **Validates: Requirements 8.5, Property 3, Property 6**
 */
describe('Slug Generation Properties', () => {
  /**
   * Property 3: Slug Format Validity
   * All generated slugs must match the valid format pattern
   */
  describe('Property 3: Slug Format Validity', () => {
    it('property: generated slugs are always valid format', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)
              const validation = validateSlugFormat(slug)

              // Generated slug must be valid
              expect(validation.isValid).toBe(true)
              expect(validation.errors).toHaveLength(0)

              return true
            } catch (error) {
              // Reserved slugs throw, which is expected behavior
              if (error instanceof Error && error.message.includes('reserved')) {
                return true
              }
              // Empty slug generation throws, which is expected
              if (error instanceof Error && error.message.includes('empty')) {
                return true
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: slugs only contain valid characters (lowercase, numbers, hyphens)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Must match pattern: lowercase letters, numbers, hyphens only
              expect(slug).toMatch(/^[a-z0-9-]+$/)

              return true
            } catch (error) {
              // Expected errors are acceptable
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: slugs never start or end with hyphen', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Must not start or end with hyphen
              expect(slug).not.toMatch(/^-/)
              expect(slug).not.toMatch(/-$/)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: slugs never contain consecutive hyphens', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Must not contain consecutive hyphens
              expect(slug).not.toMatch(/--/)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: slugs never exceed maxLength constraint', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
          fc.integer({ min: 10, max: 100 }),
          (input, maxLength) => {
            try {
              const slug = generateSlugFromText(input, { maxLength })

              // Must not exceed specified max length
              expect(slug.length).toBeLessThanOrEqual(maxLength)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: slugs respect default 100 character limit', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Default max length is 100
              expect(slug.length).toBeLessThanOrEqual(100)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })
  })

  /**
   * Property 6: Slug Idempotence
   * Generating a slug from a slug produces the same slug
   */
  describe('Property 6: Slug Idempotence', () => {
    it('property: slug generation is idempotent (slug(slug(t)) = slug(t))', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug1 = generateSlugFromText(input)
              const slug2 = generateSlugFromText(slug1)

              // Applying slug generation twice should produce same result
              expect(slug2).toBe(slug1)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: same input always produces same slug (deterministic)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug1 = generateSlugFromText(input)
              const slug2 = generateSlugFromText(input)
              const slug3 = generateSlugFromText(input)

              // Multiple calls with same input produce same output
              expect(slug2).toBe(slug1)
              expect(slug3).toBe(slug1)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: already-valid slugs pass through unchanged', () => {
      fc.assert(
        fc.property(
          fc
            .stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
            .filter((s) => s.length > 0 && s.length <= 100),
          (validSlug) => {
            // Skip reserved slugs
            const reserved = ['admin', 'api', 'login', 'logout', 'register', 'dashboard']
            if (reserved.includes(validSlug)) {
              return true
            }

            try {
              const result = generateSlugFromText(validSlug)

              // Valid slug should pass through unchanged
              expect(result).toBe(validSlug)

              return true
            } catch (error) {
              if (error instanceof Error && error.message.includes('reserved')) {
                return true
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })
  })

  /**
   * Additional Properties
   */
  describe('Additional Slug Properties', () => {
    it('property: slugs are always lowercase', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Slug must equal its lowercase version
              expect(slug).toBe(slug.toLowerCase())

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 1000 },
      )
    })

    it('property: slugs with custom transform are deterministic', () => {
      const customTransform = (text: string) => text.toUpperCase().replace(/\s+/g, '_')

      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug1 = generateSlugFromText(input, { transform: customTransform })
              const slug2 = generateSlugFromText(input, { transform: customTransform })

              // Custom transform should be deterministic
              expect(slug2).toBe(slug1)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 500 },
      )
    })

    it('property: reserved slugs always throw error', () => {
      const reserved = ['admin', 'api', 'login', 'logout', 'register', 'dashboard']

      fc.assert(
        fc.property(fc.constantFrom(...reserved), (reservedSlug) => {
          // Reserved slugs should throw
          expect(() => generateSlugFromText(reservedSlug)).toThrow('reserved')

          return true
        }),
        { numRuns: 100 },
      )
    })

    it('property: custom reserved slugs are respected', () => {
      const customReserved = ['custom', 'special', 'forbidden']

      fc.assert(
        fc.property(fc.constantFrom(...customReserved), (reservedSlug) => {
          // Custom reserved slugs should throw
          expect(() =>
            generateSlugFromText(reservedSlug, { reservedSlugs: customReserved }),
          ).toThrow('reserved')

          return true
        }),
        { numRuns: 100 },
      )
    })
  })

  /**
   * Edge Cases and Boundary Conditions
   */
  describe('Edge Cases', () => {
    it('property: handles unicode characters correctly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Should produce valid ASCII slug
              expect(slug).toMatch(/^[a-z0-9-]+$/)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 500 },
      )
    })

    it('property: handles strings with only special characters', () => {
      fc.assert(
        fc.property(
          fc
            .stringMatching(/^[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?]+$/)
            .filter((s) => s.length > 0 && s.length <= 50),
          (input) => {
            try {
              generateSlugFromText(input)
              // If it doesn't throw, it should produce valid slug
              return true
            } catch (error) {
              // Expected to throw "Generated slug is empty"
              if (error instanceof Error && error.message.includes('empty')) {
                return true
              }
              throw error
            }
          },
        ),
        { numRuns: 200 },
      )
    })

    it('property: handles strings with mixed content', () => {
      fc.assert(
        fc.property(
          fc.mixedCase(fc.string({ minLength: 1, maxLength: 100 })).filter((s) => s.length > 0),
          (input) => {
            try {
              const slug = generateSlugFromText(input)

              // Should produce valid slug
              const validation = validateSlugFormat(slug)
              expect(validation.isValid).toBe(true)

              return true
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message
                if (message.includes('reserved') || message.includes('empty')) {
                  return true
                }
              }
              throw error
            }
          },
        ),
        { numRuns: 500 },
      )
    })
  })
})
