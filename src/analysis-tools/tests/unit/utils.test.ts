/**
 * Unit tests for utility functions
 */

import { describe, it, expect } from 'vitest'
import {
  generateId,
  calculateComplexityScore,
  normalizePath,
  getFileNameWithoutExtension,
  toKebabCase,
  toPascalCase,
  toCamelCase,
  isPlainObject,
  deepMerge,
  formatBytes,
  formatDuration,
} from '../../utils/index.js'

describe('Utility Functions', () => {
  describe('generateId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateId('test')
      const id2 = generateId('test')

      expect(id1).toMatch(/^test-\d+-[a-z0-9]+$/)
      expect(id2).toMatch(/^test-\d+-[a-z0-9]+$/)
      expect(id1).not.toBe(id2)
    })

    it('should use default prefix when not provided', () => {
      const id = generateId()
      expect(id).toMatch(/^id-\d+-[a-z0-9]+$/)
    })
  })

  describe('calculateComplexityScore', () => {
    it('should calculate basic complexity score', () => {
      const score = calculateComplexityScore({
        fieldCount: 5,
        nestedDepth: 2,
      })

      expect(score).toBeGreaterThan(0)
      expect(typeof score).toBe('number')
    })

    it('should increase score with more fields and depth', () => {
      const simpleScore = calculateComplexityScore({
        fieldCount: 3,
        nestedDepth: 1,
      })

      const complexScore = calculateComplexityScore({
        fieldCount: 10,
        nestedDepth: 5,
      })

      expect(complexScore).toBeGreaterThan(simpleScore)
    })

    it('should reduce score with validation rules', () => {
      const withoutValidation = calculateComplexityScore({
        fieldCount: 5,
        nestedDepth: 2,
        validationRules: 0,
      })

      const withValidation = calculateComplexityScore({
        fieldCount: 5,
        nestedDepth: 2,
        validationRules: 5,
      })

      expect(withValidation).toBeLessThan(withoutValidation)
    })
  })

  describe('normalizePath', () => {
    it('should normalize Windows paths to Unix style', () => {
      expect(normalizePath('src\\blocks\\Hero\\config.ts')).toBe('src/blocks/Hero/config.ts')
    })

    it('should handle multiple slashes', () => {
      expect(normalizePath('src//blocks///Hero/config.ts')).toBe('src/blocks/Hero/config.ts')
    })

    it('should handle already normalized paths', () => {
      expect(normalizePath('src/blocks/Hero/config.ts')).toBe('src/blocks/Hero/config.ts')
    })
  })

  describe('getFileNameWithoutExtension', () => {
    it('should extract filename without extension', () => {
      expect(getFileNameWithoutExtension('src/blocks/Hero/config.ts')).toBe('config')
    })

    it('should handle files with multiple dots', () => {
      expect(getFileNameWithoutExtension('src/blocks/Hero.block.config.ts')).toBe(
        'Hero.block.config',
      )
    })

    it('should handle files without extension', () => {
      expect(getFileNameWithoutExtension('src/blocks/Hero')).toBe('Hero')
    })
  })

  describe('Case conversion functions', () => {
    it('should convert to kebab-case', () => {
      expect(toKebabCase('HeroBlock')).toBe('hero-block')
      expect(toKebabCase('hero_block')).toBe('hero-block')
      expect(toKebabCase('hero block')).toBe('hero-block')
    })

    it('should convert to PascalCase', () => {
      expect(toPascalCase('hero-block')).toBe('HeroBlock')
      expect(toPascalCase('hero_block')).toBe('HeroBlock')
      expect(toPascalCase('hero block')).toBe('HeroBlock')
    })

    it('should convert to camelCase', () => {
      expect(toCamelCase('hero-block')).toBe('heroBlock')
      expect(toCamelCase('hero_block')).toBe('heroBlock')
      expect(toCamelCase('hero block')).toBe('heroBlock')
    })
  })

  describe('isPlainObject', () => {
    it('should identify plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ key: 'value' })).toBe(true)
    })

    it('should reject non-plain objects', () => {
      expect(isPlainObject(null)).toBe(false)
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject('string')).toBe(false)
      expect(isPlainObject(123)).toBe(false)
      expect(isPlainObject(undefined)).toBe(false)
    })
  })

  describe('deepMerge', () => {
    it('should merge simple objects', () => {
      const target = { a: 1, b: 2 }
      const source = { b: 3, c: 4 }
      const result = deepMerge(target, source)

      expect(result).toEqual({ a: 1, b: 3, c: 4 })
    })

    it('should merge nested objects', () => {
      const target = { a: { x: 1, y: 2 }, b: 3 }
      const source: Partial<typeof target> = { a: { x: 1, y: 3, z: 4 } as any }
      const result = deepMerge(target, source)

      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 }, b: 3 })
    })

    it('should not mutate original objects', () => {
      const target = { a: 1 }
      const source: Partial<typeof target> = { b: 2 } as any
      const result = deepMerge(target, source)

      expect(target).toEqual({ a: 1 })
      expect(result).toEqual({ a: 1, b: 2 })
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1024 * 1024)).toBe('1 MB')
      expect(formatBytes(1536)).toBe('1.5 KB')
    })
  })

  describe('formatDuration', () => {
    it('should format milliseconds correctly', () => {
      expect(formatDuration(500)).toBe('500ms')
      expect(formatDuration(1500)).toBe('1.50s')
      expect(formatDuration(65000)).toBe('1.08m')
      expect(formatDuration(3700000)).toBe('1.03h')
    })
  })
})
