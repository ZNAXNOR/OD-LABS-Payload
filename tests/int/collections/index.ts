/**
 * Collections Integration Tests Index
 *
 * This file exports all collection-related integration tests for easy importing and running.
 * Use this to run all collection integration tests as a group.
 */

// Export all collection integration test modules
export * from './blogs.int.spec'
export * from './contacts.int.spec'
export * from './legal.int.spec'
export * from './pages.int.spec'
export * from './services.int.spec'

// Test categories for selective running
export const COLLECTIONS_INT_TESTS = {
  blogs: './blogs.int.spec.ts',
  contacts: './contacts.int.spec.ts',
  legal: './legal.int.spec.ts',
  pages: './pages.int.spec.ts',
  services: './services.int.spec.ts',
} as const

// Test patterns for vitest configuration
export const COLLECTIONS_INT_TEST_PATTERNS = [
  'tests/int/collections/**/*.int.spec.{ts,tsx}',
] as const
