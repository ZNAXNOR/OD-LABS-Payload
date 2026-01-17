import { describe, it, expect } from 'vitest'
import { validateDirectories, validateOutputPath } from '../../cli/utils/validation.js'

describe('CLI Validation', () => {
  describe('validateDirectories', () => {
    it('should validate existing directories', () => {
      const result = validateDirectories('.', '.')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should report errors for non-existent directories', () => {
      const result = validateDirectories('./non-existent', './also-non-existent')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateOutputPath', () => {
    it('should validate JSON output path', () => {
      const result = validateOutputPath('./test.json', 'json')
      expect(result.isValid).toBe(true)
    })

    it('should validate HTML output path', () => {
      const result = validateOutputPath('./test.html', 'html')
      expect(result.isValid).toBe(true)
    })

    it('should warn about incorrect file extensions', () => {
      const result = validateOutputPath('./test.txt', 'json')
      expect(result.warnings.length).toBeGreaterThan(0)
    })

    it('should require output path', () => {
      const result = validateOutputPath('', 'json')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})
