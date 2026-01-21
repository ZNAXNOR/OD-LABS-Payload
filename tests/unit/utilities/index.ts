/**
 * Utilities Unit Tests Index
 *
 * This file exports all utility-related unit tests for easy importing and running.
 * Use this to run all utility unit tests as a group.
 */

// Export all utility unit test modules
export * from './slugGeneration.unit.spec'

// Test categories for selective running
export const UTILITIES_UNIT_TESTS = {
  slugGeneration: './slugGeneration.unit.spec.ts',
} as const

// Test patterns for vitest configuration
export const UTILITIES_UNIT_TEST_PATTERNS = [
  'tests/unit/utilities/**/*.unit.spec.{ts,tsx}',
] as const
