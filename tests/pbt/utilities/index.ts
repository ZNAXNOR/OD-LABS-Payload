/**
 * Utilities Property-Based Tests Index
 *
 * This file exports all utility-related property-based tests for easy importing and running.
 * Use this to run all utility PBT tests as a group.
 */

// Export all utility PBT test modules
export * from './circularReference.pbt.spec'
export * from './slugGeneration.pbt.spec'
export * from './slugUniqueness.pbt.spec'

// Test categories for selective running
export const UTILITIES_PBT_TESTS = {
  circularReference: './circularReference.pbt.spec.ts',
  slugGeneration: './slugGeneration.pbt.spec.ts',
  slugUniqueness: './slugUniqueness.pbt.spec.ts',
} as const

// Test patterns for vitest configuration
export const UTILITIES_PBT_TEST_PATTERNS = ['tests/pbt/utilities/**/*.pbt.spec.{ts,tsx}'] as const
