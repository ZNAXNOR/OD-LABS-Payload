/**
 * End-to-End Tests Index
 *
 * This file exports all E2E tests for easy importing and running.
 * Use this to run all E2E tests as a group.
 */

// Export all E2E test modules
export * from './frontend.e2e.spec'
export * from './homepage.e2e.spec'
export * from './blog-navigation.e2e.spec'
export * from './services-navigation.e2e.spec'
export * from './contact-form.e2e.spec'
export * from './legal-pages.e2e.spec'
export * from './admin-panel.e2e.spec'
export * from './page-navigation.e2e.spec'

// Test categories for selective running
export const E2E_TESTS = {
  frontend: './frontend.e2e.spec.ts',
  homepage: './homepage.e2e.spec.ts',
  blogNavigation: './blog-navigation.e2e.spec.ts',
  servicesNavigation: './services-navigation.e2e.spec.ts',
  contactForm: './contact-form.e2e.spec.ts',
  legalPages: './legal-pages.e2e.spec.ts',
  adminPanel: './admin-panel.e2e.spec.ts',
  pageNavigation: './page-navigation.e2e.spec.ts',
} as const

// Test patterns for vitest configuration
export const E2E_TEST_PATTERNS = ['tests/e2e/**/*.e2e.spec.{ts,tsx}'] as const
