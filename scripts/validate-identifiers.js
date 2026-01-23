#!/usr/bin/env node

/**
 * CLI script to validate database identifiers
 * Usage: node scripts/validate-identifiers.js
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  try {
    // Import the validation utilities
    const { runBuildTimeValidation } =
      await import('../src/utilities/validation/buildTimeValidator.js')

    console.log('🔍 Running database identifier validation...\n')

    // Run validation with default configuration
    const result = await runBuildTimeValidation({
      configPath: './src/payload.config.ts',
      verbose: true,
      generateReports: true,
      outputDir: './validation-reports',
    })

    if (result.success) {
      console.log('\n✅ Validation completed successfully!')
      console.log('📄 Reports generated in ./validation-reports/')
    } else {
      console.log('\n❌ Validation failed!')
      process.exit(result.exitCode)
    }
  } catch (error) {
    console.error('💥 Error running validation:', error.message)
    process.exit(1)
  }
}

// Run if called directly
main().catch((error) => {
  console.error('💥 CLI execution failed:', error)
  process.exit(2)
})
