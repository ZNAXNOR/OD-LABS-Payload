/**
 * Property-Based Tests Index
 *
 * This file exports all property-based tests for easy importing and running.
 * Use this to run all PBT tests as a group.
 */

// Export test categories
export * from './utilities'
export * from './workflow'

// Test categories for selective running
export const PBT_TESTS = {
  utilities: './utilities',
  workflow: './workflow',
} as const

// Test patterns for vitest configuration
export const PBT_TEST_PATTERNS = ['tests/pbt/**/*.pbt.spec.{ts,tsx}'] as const
