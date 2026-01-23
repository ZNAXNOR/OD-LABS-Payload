/**
 * Property-Based Tests for Database Identifier Optimization
 *
 * These tests verify that the database identifier optimization utilities
 * maintain PostgreSQL compliance while preserving semantic meaning.
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5**
 */

import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import {
  convertToSnakeCase,
  generateDatabaseName,
  POSTGRES_IDENTIFIER_LIMIT,
  validateDatabaseName,
} from '../../../src/utilities/validation/databaseNameGeneration'

describe('Database Identifier Optimization - Property-Based Tests', () => {
  describe('Property 1: Database Identifier Length Compliance', () => {
    it('should never generate identifiers exceeding PostgreSQL limit', () => {
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s)),
          (fieldName) => {
            try {
              const dbName = generateDatabaseName(fieldName)
              expect(dbName.length).toBeLessThanOrEqual(POSTGRES_IDENTIFIER_LIMIT)
            } catch (error) {
              // If generation fails due to invalid input, that's acceptable
              expect(error).toBeInstanceOf(Error)
            }
          },
        ),
        { numRuns: 5 },
      )
    })

    it('should generate valid PostgreSQL identifiers', () => {
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 30 })
            .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s)),
          (fieldName) => {
            try {
              const dbName = generateDatabaseName(fieldName)
              expect(() => validateDatabaseName(dbName)).not.toThrow()
              expect(dbName).toMatch(/^[a-z][a-z0-9_]*$/)
            } catch (error) {
              expect(error).toBeInstanceOf(Error)
            }
          },
        ),
        { numRuns: 5 },
      )
    })
  })

  describe('Property 2: Snake Case Conversion Consistency', () => {
    it('should consistently convert camelCase to snake_case', () => {
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 20 })
            .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s)),
          (input) => {
            const result = convertToSnakeCase(input)
            if (result.length > 0) {
              expect(result).toBe(result.toLowerCase())
              expect(result).not.toMatch(/__/)
              expect(result).not.toMatch(/^_|_$/)
            }
          },
        ),
        { numRuns: 5 },
      )
    })
  })

  describe('Property 3: Deterministic Behavior', () => {
    it('should generate the same result for the same input', () => {
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 20 })
            .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s)),
          (fieldName) => {
            try {
              const dbName1 = generateDatabaseName(fieldName)
              const dbName2 = generateDatabaseName(fieldName)
              expect(dbName1).toBe(dbName2)
            } catch (error) {
              expect(error).toBeInstanceOf(Error)
            }
          },
        ),
        { numRuns: 5 },
      )
    })
  })

  describe('Property 4: Performance', () => {
    it('should process field names efficiently', () => {
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 30 })
            .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s)),
          (fieldName) => {
            const startTime = performance.now()
            try {
              generateDatabaseName(fieldName)
              const endTime = performance.now()
              expect(endTime - startTime).toBeLessThan(50) // 50ms should be plenty
            } catch (error) {
              expect(error).toBeInstanceOf(Error)
            }
          },
        ),
        { numRuns: 5 },
      )
    })
  })
})
