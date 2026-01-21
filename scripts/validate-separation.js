#!/usr/bin/env node

/**
 * Validation script for separation of concerns
 *
 * This script can be run to validate that the project follows proper
 * separation between frontend, backend, and shared code.
 */

const {
  validateProject,
  printValidationReport,
} = require('../src/utilities/validation/validateProject')

console.log('🔍 Validating separation of concerns...\n')

try {
  const result = validateProject()
  printValidationReport(result)

  if (result.invalidFiles === 0) {
    console.log('✅ All files pass separation of concerns validation!')
    process.exit(0)
  } else {
    console.log(`❌ Found ${result.invalidFiles} files with violations`)
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Validation failed:', error.message)
  process.exit(1)
}
