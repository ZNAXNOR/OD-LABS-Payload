/**
 * RichText Integration Tests Index
 *
 * This file exports all RichText-related integration tests for easy importing and running.
 * Use this to run all RichText integration tests as a group.
 */

// Export all RichText integration test modules
export * from './richtext-block-contexts.int.spec'
export * from './richtext-cross-device.int.spec'
export * from './richtext-editor-workflow.int.spec'
export * from './richtext-frontend-rendering.int.spec'
export * from './richtext-responsive.int.spec'

// Test categories for selective running
export const RICHTEXT_INT_TESTS = {
  blockContexts: './richtext-block-contexts.int.spec.ts',
  crossDevice: './richtext-cross-device.int.spec.tsx',
  editorWorkflow: './richtext-editor-workflow.int.spec.ts',
  frontendRendering: './richtext-frontend-rendering.int.spec.ts',
  responsive: './richtext-responsive.int.spec.ts',
} as const

// Test patterns for vitest configuration
export const RICHTEXT_INT_TEST_PATTERNS = ['tests/int/richtext/**/*.int.spec.{ts,tsx}'] as const
