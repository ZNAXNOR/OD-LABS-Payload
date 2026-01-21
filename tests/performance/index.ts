/**
 * Performance Tests Index
 *
 * This file exports all performance tests for easy importing and running.
 * Use this to run all performance tests as a group.
 */

// Export all performance test modules
export * from './hooks.perf.spec'
export * from './load.perf.spec'
export * from './queries.perf.spec'

// Export test categories
export * from './richtext'

// Test categories for selective running
export const PERFORMANCE_TESTS = {
  hooks: './hooks.perf.spec.ts',
  load: './load.perf.spec.ts',
  queries: './queries.perf.spec.ts',
  richtext: './richtext',
} as const

// Test patterns for vitest configuration
export const PERFORMANCE_TEST_PATTERNS = ['tests/performance/**/*.perf.spec.{ts,tsx}'] as const
