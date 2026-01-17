/**
 * Vitest setup file for analysis tools tests
 */

import { expect, beforeAll, afterAll } from 'vitest'
import fc from 'fast-check'

// Configure fast-check globally for all property-based tests
// Minimum 100 iterations as per design specification
fc.configureGlobal({
  numRuns: 100,
  verbose: true,
  seed: Date.now(),
})

// Setup for accessibility testing
beforeAll(() => {
  // Any global setup needed for tests
})

afterAll(() => {
  // Any global cleanup needed after tests
})

// Custom matchers can be added here if needed
