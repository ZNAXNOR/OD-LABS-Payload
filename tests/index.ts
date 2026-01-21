/**
 * Tests Index
 *
 * This file exports all test categories for easy importing and running.
 * Use this to run tests by category or all tests as a group.
 */

// Export all test categories
export * from './e2e'
export * from './int'
export * from './pbt'
export * from './performance'
export * from './unit'

// Test categories for selective running
export const ALL_TESTS = {
  e2e: './e2e',
  integration: './int',
  pbt: './pbt',
  performance: './performance',
  unit: './unit',
} as const

// Test patterns for vitest configuration
export const ALL_TEST_PATTERNS = [
  'tests/unit/**/*.unit.spec.{ts,tsx}',
  'tests/int/**/*.int.spec.{ts,tsx}',
  'tests/e2e/**/*.e2e.spec.{ts,tsx}',
  'tests/performance/**/*.perf.spec.{ts,tsx}',
  'tests/pbt/**/*.pbt.spec.{ts,tsx}',
] as const

// Test type patterns
export const TEST_TYPE_PATTERNS = {
  unit: ['tests/unit/**/*.unit.spec.{ts,tsx}'],
  integration: ['tests/int/**/*.int.spec.{ts,tsx}'],
  e2e: ['tests/e2e/**/*.e2e.spec.{ts,tsx}'],
  performance: ['tests/performance/**/*.perf.spec.{ts,tsx}'],
  pbt: ['tests/pbt/**/*.pbt.spec.{ts,tsx}'],
} as const
