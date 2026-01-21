/**
 * Integration Tests Index
 *
 * This file exports all integration tests for easy importing and running.
 * Use this to run all integration tests as a group.
 */

// Export all integration test modules
export * from './access-control.int.spec'

// Export test categories
export * from './collections'
export * from './richtext'

// Test categories for selective running
export const INTEGRATION_TESTS = {
  accessControl: './access-control.int.spec.ts',
  collections: './collections',
  richtext: './richtext',
} as const

// Test patterns for vitest configuration
export const INTEGRATION_TEST_PATTERNS = ['tests/int/**/*.int.spec.{ts,tsx}'] as const
