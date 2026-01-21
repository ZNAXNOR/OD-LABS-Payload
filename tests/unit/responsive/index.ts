/**
 * Responsive Unit Tests Index
 *
 * This file exports all responsive-related unit tests for easy importing and running.
 * Use this to run all responsive unit tests as a group.
 */

// Export all responsive unit test modules
export * from './device-testing-utils.unit.spec'
export * from './responsive-integration.unit.spec'

// Test categories for selective running
export const RESPONSIVE_UNIT_TESTS = {
  deviceTestingUtils: './device-testing-utils.unit.spec.ts',
  responsiveIntegration: './responsive-integration.unit.spec.ts',
} as const

// Test patterns for vitest configuration
export const RESPONSIVE_UNIT_TEST_PATTERNS = [
  'tests/unit/responsive/**/*.unit.spec.{ts,tsx}',
] as const
