/**
 * RichText Unit Tests Index
 *
 * This file exports all RichText-related unit tests for easy importing and running.
 * Use this to run all RichText unit tests as a group.
 */

// Export all RichText unit test modules
export * from './richtext-accessibility.unit.spec'
export * from './richtext-color-contrast.unit.spec'
export * from './richtext-keyboard-navigation.unit.spec'
export * from './richtext-media.unit.spec'

// Test categories for selective running
export const RICHTEXT_UNIT_TESTS = {
  accessibility: './richtext-accessibility.unit.spec.ts',
  colorContrast: './richtext-color-contrast.unit.spec.ts',
  keyboardNavigation: './richtext-keyboard-navigation.unit.spec.ts',
  media: './richtext-media.unit.spec.ts',
} as const

// Test patterns for vitest configuration
export const RICHTEXT_UNIT_TEST_PATTERNS = ['tests/unit/richtext/**/*.unit.spec.{ts,tsx}'] as const
