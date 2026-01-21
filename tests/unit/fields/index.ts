/**
 * Fields Unit Tests Index
 *
 * This file exports all field-related unit tests for easy importing and running.
 * Use this to run all field unit tests as a group.
 */

// Export all field unit test modules
export * from './richTextFeatures.unit.spec'

// Test categories for selective running
export const FIELDS_UNIT_TESTS = {
  richTextFeatures: './richTextFeatures.unit.spec.ts',
} as const

// Test patterns for vitest configuration
export const FIELDS_UNIT_TEST_PATTERNS = ['tests/unit/fields/**/*.unit.spec.{ts,tsx}'] as const
