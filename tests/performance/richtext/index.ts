/**
 * RichText Performance Tests Index
 *
 * This file exports all RichText-related performance tests for easy importing and running.
 * Use this to run all RichText performance tests as a group.
 */

// Export all RichText performance test modules
export * from './richtext-editor.perf.spec'

// Test categories for selective running
export const RICHTEXT_PERF_TESTS = {
  editor: './richtext-editor.perf.spec.ts',
} as const

// Test patterns for vitest configuration
export const RICHTEXT_PERF_TEST_PATTERNS = [
  'tests/performance/richtext/**/*.perf.spec.{ts,tsx}',
] as const
