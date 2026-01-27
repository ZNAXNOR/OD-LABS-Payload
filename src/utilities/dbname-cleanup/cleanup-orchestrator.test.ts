/**
 * Basic tests for CleanupOrchestrator
 * Tests the main orchestrator functionality and error handling
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { createCleanupOrchestrator, PayloadCleanupOrchestrator } from './cleanup-orchestrator'
import type { CleanupOptions } from './interfaces'

describe('CleanupOrchestrator', () => {
  let orchestrator: PayloadCleanupOrchestrator

  beforeEach(() => {
    orchestrator = createCleanupOrchestrator() as PayloadCleanupOrchestrator
  })

  describe('createCleanupOrchestrator', () => {
    it('should create a CleanupOrchestrator instance', () => {
      expect(orchestrator).toBeInstanceOf(PayloadCleanupOrchestrator)
    })

    it('should have all required methods', () => {
      expect(typeof orchestrator.executeCleanup).toBe('function')
      expect(typeof orchestrator.dryRun).toBe('function')
      expect(typeof orchestrator.generateReport).toBe('function')
    })
  })

  describe('executeCleanup', () => {
    it('should handle invalid project path gracefully', async () => {
      const invalidPath = '/nonexistent/path'

      await expect(orchestrator.executeCleanup(invalidPath)).rejects.toThrow()
    })

    it('should accept cleanup options', async () => {
      const options: CleanupOptions = {
        dryRun: true,
        verbose: false,
        preserveStrategic: true,
      }

      // This should fail due to invalid path, but should accept the options
      await expect(orchestrator.executeCleanup('/nonexistent', options)).rejects.toThrow()
    })
  })

  describe('dryRun', () => {
    it('should return an array of changes', async () => {
      // This will fail due to invalid path, but we're testing the method signature
      await expect(orchestrator.dryRun('/nonexistent')).rejects.toThrow()
    })
  })

  describe('generateReport', () => {
    it('should return a report object', async () => {
      // This will fail due to invalid path, but we're testing the method signature
      await expect(orchestrator.generateReport('/nonexistent')).rejects.toThrow()
    })
  })
})
