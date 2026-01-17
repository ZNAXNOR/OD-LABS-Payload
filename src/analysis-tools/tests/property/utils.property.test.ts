/**
 * Property-based tests for utility functions
 * Using fast-check with minimum 100 iterations as per design specification
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  toKebabCase,
  toPascalCase,
  toCamelCase,
  normalizePath,
  isPlainObject,
  deepMerge,
} from '../../utils/index.js'

describe('Utility Functions - Property Tests', () => {
  describe('Case conversion properties', () => {
    it('should maintain idempotence for kebab-case conversion', () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const once = toKebabCase(str)
          const twice = toKebabCase(once)
          expect(once).toBe(twice)
        }),
      )
    })

    it('should maintain idempotence for PascalCase conversion', () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const once = toPascalCase(str)
          const twice = toPascalCase(once)
          expect(once).toBe(twice)
        }),
      )
    })

    it('should maintain idempotence for camelCase conversion', () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const once = toCamelCase(str)
          const twice = toCamelCase(once)
          expect(once).toBe(twice)
        }),
      )
    })

    it('should convert any string to lowercase for kebab-case', () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const result = toKebabCase(str)
          expect(result).toBe(result.toLowerCase())
        }),
      )
    })
  })

  describe('Path normalization properties', () => {
    it('should be idempotent', () => {
      fc.assert(
        fc.property(fc.string(), (path) => {
          const once = normalizePath(path)
          const twice = normalizePath(once)
          expect(once).toBe(twice)
        }),
      )
    })

    it('should not contain backslashes', () => {
      fc.assert(
        fc.property(fc.string(), (path) => {
          const result = normalizePath(path)
          expect(result).not.toContain('\\')
        }),
      )
    })

    it('should not contain consecutive slashes', () => {
      fc.assert(
        fc.property(fc.string(), (path) => {
          const result = normalizePath(path)
          expect(result).not.toMatch(/\/\/+/)
        }),
      )
    })
  })

  describe('isPlainObject properties', () => {
    it('should return true for any object literal', () => {
      fc.assert(
        fc.property(fc.dictionary(fc.string(), fc.anything()), (obj) => {
          expect(isPlainObject(obj)).toBe(true)
        }),
      )
    })

    it('should return false for arrays', () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), (arr) => {
          expect(isPlainObject(arr)).toBe(false)
        }),
      )
    })

    it('should return false for primitives', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
            fc.constant(undefined),
          ),
          (value) => {
            expect(isPlainObject(value)).toBe(false)
          },
        ),
      )
    })
  })

  describe('deepMerge properties', () => {
    it('should preserve all keys from both objects', () => {
      fc.assert(
        fc.property(
          fc.dictionary(fc.string(), fc.string()),
          fc.dictionary(fc.string(), fc.string()),
          (target, source) => {
            const result = deepMerge(target, source)
            const allKeys = new Set([...Object.keys(target), ...Object.keys(source)])

            // Filter out __proto__ as it's a special property
            const regularKeys = Array.from(allKeys).filter((key) => key !== '__proto__')

            regularKeys.forEach((key) => {
              expect(result).toHaveProperty(key)
            })
          },
        ),
      )
    })

    it('should not mutate the target object', () => {
      fc.assert(
        fc.property(
          fc.dictionary(fc.string(), fc.string()),
          fc.dictionary(fc.string(), fc.string()),
          (target, source) => {
            const originalTarget = JSON.parse(JSON.stringify(target))
            deepMerge(target, source)
            expect(target).toEqual(originalTarget)
          },
        ),
      )
    })

    it('should prefer source values over target values', () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), fc.string(), (key, targetValue, sourceValue) => {
          const target = { [key]: targetValue }
          const source = { [key]: sourceValue }
          const result = deepMerge(target, source)

          expect(result[key]).toBe(sourceValue)
        }),
      )
    })
  })
})
