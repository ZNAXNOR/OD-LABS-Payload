/**
 * Validation Unit Tests Index
 *
 * This file exports all validation-related unit tests for easy importing and running.
 * Use this to run all validation unit tests as a group.
 */

// Export all validation unit test modules
export * from './circularReference.unit.spec'

// Test categories for selective running
export const VALIDATION_UNIT_TESTS = {
  circularReference: './circularReference.unit.spec.ts',
} as const

// Test patterns for vitest configuration
export const VALIDATION_UNIT_TEST_PATTERNS = [
  'tests/unit/validation/**/*.unit.spec.{ts,tsx}',
] as const
