#!/usr/bin/env node

/**
 * Script to test the database identifier optimization migration
 *
 * Usage: npx tsx src/migrations/testMigration.ts
 */

import { getAllIdentifierChanges } from './identifierOptimizationMigration'
import { runMigrationTests } from './utils/migrationTester'

async function main() {
  console.log('🧪 Testing Database Identifier Optimization Migration...\n')

  try {
    // Get all identifier changes from the migration
    const changes = getAllIdentifierChanges()

    console.log(`📊 Testing ${changes.length} identifier changes...\n`)

    // Run comprehensive migration tests
    const { migrationTest, rollbackTest, report } = await runMigrationTests(changes)

    // Display the test report
    console.log(report)

    // Exit with appropriate code
    if (migrationTest.success && rollbackTest.success) {
      console.log('✅ All migration tests passed!')
      process.exit(0)
    } else {
      console.log('❌ Migration tests failed!')
      process.exit(1)
    }
  } catch (error) {
    console.error('💥 Error running migration tests:', error)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
