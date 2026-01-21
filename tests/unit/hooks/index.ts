/**
 * Hooks Unit Tests Index
 *
 * This file exports all hook-related unit tests for easy importing and running.
 * Use this to run all hook unit tests as a group.
 */

// Export all hook unit test modules
export * from './createAuditTrailHook.unit.spec'
export * from './createRevalidateHook.unit.spec'

// Test categories for selective running
export const HOOKS_UNIT_TESTS = {
  auditTrail: './createAuditTrailHook.unit.spec.ts',
  revalidate: './createRevalidateHook.unit.spec.ts',
} as const

// Test patterns for vitest configuration
export const HOOKS_UNIT_TEST_PATTERNS = ['tests/unit/hooks/**/*.unit.spec.{ts,tsx}'] as const
