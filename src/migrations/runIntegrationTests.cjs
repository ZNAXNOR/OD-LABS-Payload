#!/usr/bin/env node

/**
 * Integration test runner for database identifier optimization migration
 * Runs all validation and testing scripts to ensure migration readiness
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 Running Integration Tests for Database Identifier Optimization Migration\n')
console.log('='.repeat(80))

const tests = [
  {
    name: 'Migration Structure Validation',
    script: 'src/migrations/validateMigration.cjs',
    description: 'Validates migration file structure and syntax',
  },
  {
    name: 'Sample Data Testing',
    script: 'src/migrations/testWithSampleData.cjs',
    description: 'Tests migration with simulated sample data',
  },
]

let allTestsPassed = true
const results = []

for (const test of tests) {
  console.log(`\n📋 Running: ${test.name}`)
  console.log(`📝 Description: ${test.description}`)
  console.log('-'.repeat(60))

  try {
    const startTime = Date.now()

    // Run the test script
    execSync(`node ${test.script}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })

    const duration = Date.now() - startTime

    results.push({
      name: test.name,
      status: 'PASSED',
      duration: duration,
    })

    console.log(`\n✅ ${test.name}: PASSED (${duration}ms)`)
  } catch (error) {
    allTestsPassed = false

    results.push({
      name: test.name,
      status: 'FAILED',
      error: error.message,
    })

    console.log(`\n❌ ${test.name}: FAILED`)
    console.log(`Error: ${error.message}`)
  }
}

// Print final summary
console.log('\n' + '='.repeat(80))
console.log('📊 INTEGRATION TEST SUMMARY')
console.log('='.repeat(80))

results.forEach((result) => {
  const status = result.status === 'PASSED' ? '✅' : '❌'
  const duration = result.duration ? ` (${result.duration}ms)` : ''
  console.log(`${status} ${result.name}${duration}`)

  if (result.error) {
    console.log(`   Error: ${result.error}`)
  }
})

console.log('\n' + '-'.repeat(80))

if (allTestsPassed) {
  console.log('🎉 ALL INTEGRATION TESTS PASSED!')
  console.log('\n✅ Migration is fully validated and ready for deployment')
  console.log('\n📋 Next Steps:')
  console.log('   1. Create database backup')
  console.log('   2. Deploy to staging environment')
  console.log('   3. Run migration: payload migrate')
  console.log('   4. Verify application functionality')
  console.log('   5. Deploy to production')

  process.exit(0)
} else {
  console.log('❌ SOME INTEGRATION TESTS FAILED!')
  console.log('\n🔧 Please fix the failing tests before deployment')

  process.exit(1)
}
