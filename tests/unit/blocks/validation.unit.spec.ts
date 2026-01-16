import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  validateBlockConfiguration,
  validateBlockConfigurations,
  validateNestedBlocksField,
} from '@/blocks/config/validation'
import type { Block } from 'payload'

/**
 * Unit tests for block configuration validation
 *
 * These tests verify that the validation functions correctly detect
 * and report various types of invalid block configurations.
 *
 * **Validates: Requirements 6.4**
 */
describe('Block Configuration Validation', () => {
  // Mock console.warn to prevent test output pollution
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>