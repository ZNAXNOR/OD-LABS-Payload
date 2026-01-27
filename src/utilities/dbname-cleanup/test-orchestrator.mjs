/**
 * Simple test script to verify orchestrator functionality
 */

import { createCleanupOrchestrator } from './cleanup-orchestrator.js'
import { ErrorHandler } from './error-handler.js'

console.log('Testing CleanupOrchestrator...')

try {
  // Test orchestrator creation
  const orchestrator = createCleanupOrchestrator()
  console.log('✓ CleanupOrchestrator created successfully')

  // Test error handler
  const errorHandler = new ErrorHandler()
  errorHandler.addWarning('Test warning')
  const warnings = errorHandler.getWarnings()
  console.log('✓ ErrorHandler working, warnings:', warnings.length)

  // Test error summary
  const summary = errorHandler.getErrorSummary()
  console.log('✓ Error summary generated:', summary.total, 'total errors')

  console.log('All basic tests passed!')
} catch (error) {
  console.error('Test failed:', error.message)
  process.exit(1)
}
