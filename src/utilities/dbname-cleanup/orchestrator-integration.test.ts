/**
 * Integration test for CleanupOrchestrator
 * Tests the orchestrator with real components
 */

import { describe, expect, it } from 'vitest'
import { createCleanupOrchestrator } from './cleanup-orchestrator'
import { ErrorHandler } from './error-handler'

describe('CleanupOrchestrator Integration', () => {
  it('should create orchestrator with all components', () => {
    const orchestrator = createCleanupOrchestrator()
    expect(orchestrator).toBeDefined()
    expect(typeof orchestrator.executeCleanup).toBe('function')
    expect(typeof orchestrator.dryRun).toBe('function')
    expect(typeof orchestrator.generateReport).toBe('function')
  })

  it('should handle error handler functionality', () => {
    const errorHandler = new ErrorHandler()
    expect(errorHandler).toBeDefined()
    expect(typeof errorHandler.handleError).toBe('function')
    expect(typeof errorHandler.addWarning).toBe('function')
    expect(typeof errorHandler.getErrors).toBe('function')
    expect(typeof errorHandler.getWarnings).toBe('function')
    expect(typeof errorHandler.generateErrorReport).toBe('function')
  })

  it('should provide error summary functionality', () => {
    const errorHandler = new ErrorHandler()
    const summary = errorHandler.getErrorSummary()

    expect(summary).toHaveProperty('total')
    expect(summary).toHaveProperty('bySeverity')
    expect(summary).toHaveProperty('byCategory')
    expect(summary.total).toBe(0)
  })

  it('should handle warnings correctly', () => {
    const errorHandler = new ErrorHandler()

    errorHandler.addWarning('Test warning')
    const warnings = errorHandler.getWarnings()

    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toBe('Test warning')
  })
})
