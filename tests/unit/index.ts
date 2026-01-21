/**
 * Unit Tests Index
 *
 * This file exports all unit tests for easy importing and running.
 * Use this to run all unit tests as a group.
 */

// Export test categories
export * from './fields'
export * from './hooks'
export * from './responsive'
export * from './richtext'
export * from './utilities'
export * from './validation'

// Test categories for selective running
export const UNIT_TESTS = {
  fields: './fields',
  hooks: './hooks',
  responsive: './responsive',
  richtext: './richtext',
  utilities: './utilities',
  validation: './validation',
} as const

// Test patterns for vitest configuration
export const UNIT_TEST_PATTERNS = ['tests/unit/**/*.unit.spec.{ts,tsx}'] as const
