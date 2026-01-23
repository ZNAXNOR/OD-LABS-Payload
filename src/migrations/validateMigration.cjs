#!/usr/bin/env node

/**
 * Simple validation script for the database identifier optimization migration
 * This script validates the migration without requiring complex TypeScript setup
 */

const fs = require('fs')
const path = require('path')

// Read the migration file
const migrationPath = path.join(__dirname, '20260122_140000_identifier_optimization.ts')
const migrationContent = fs.readFileSync(migrationPath, 'utf8')

console.log('🔍 Validating Database Identifier Optimization Migration...\n')

// Validation checks
const checks = {
  hasUpFunction: migrationContent.includes('export async function up'),
  hasDownFunction: migrationContent.includes('export async function down'),
  hasImports:
    migrationContent.includes('MigrateUpArgs') && migrationContent.includes('MigrateDownArgs'),
  hasSqlExecute: migrationContent.includes('await db.execute(sql`'),
  hasEnumRenames: migrationContent.includes('ALTER TYPE') && migrationContent.includes('RENAME TO'),
  hasTableRenames:
    migrationContent.includes('ALTER TABLE') && migrationContent.includes('RENAME TO'),
  hasRollbackOperations:
    migrationContent.split('export async function down')[1]?.includes('ALTER TYPE') || false,
}

// Count operations
const upSection =
  migrationContent.split('export async function up')[1]?.split('export async function down')[0] ||
  ''
const downSection = migrationContent.split('export async function down')[1] || ''

const enumRenames = (upSection.match(/ALTER TYPE.*RENAME TO/g) || []).length
const tableRenames = (upSection.match(/ALTER TABLE.*RENAME TO/g) || []).length
const rollbackEnumRenames = (downSection.match(/ALTER TYPE.*RENAME TO/g) || []).length
const rollbackTableRenames = (downSection.match(/ALTER TABLE.*RENAME TO/g) || []).length

console.log('📊 Migration Structure Validation:')
console.log(`✅ Has up function: ${checks.hasUpFunction ? 'PASS' : 'FAIL'}`)
console.log(`✅ Has down function: ${checks.hasDownFunction ? 'PASS' : 'FAIL'}`)
console.log(`✅ Has required imports: ${checks.hasImports ? 'PASS' : 'FAIL'}`)
console.log(`✅ Has SQL execution: ${checks.hasSqlExecute ? 'PASS' : 'FAIL'}`)
console.log(`✅ Has enum renames: ${checks.hasEnumRenames ? 'PASS' : 'FAIL'}`)
console.log(`✅ Has table renames: ${checks.hasTableRenames ? 'PASS' : 'FAIL'}`)
console.log(`✅ Has rollback operations: ${checks.hasRollbackOperations ? 'PASS' : 'FAIL'}`)
console.log('')

console.log('📈 Migration Statistics:')
console.log(`- Enum renames (up): ${enumRenames}`)
console.log(`- Table renames (up): ${tableRenames}`)
console.log(`- Enum renames (down): ${rollbackEnumRenames}`)
console.log(`- Table renames (down): ${rollbackTableRenames}`)
console.log(`- Total operations: ${enumRenames + tableRenames}`)
console.log('')

// Validate identifier lengths
console.log('🔍 Identifier Length Validation:')
const identifierPattern = /"([^"]+)"/g
const identifiers = []
let match

while ((match = identifierPattern.exec(migrationContent)) !== null) {
  const identifier = match[1]
  if (
    identifier.startsWith('enum_') ||
    identifier.includes('_blocks_') ||
    identifier.includes('pages_')
  ) {
    identifiers.push(identifier)
  }
}

const longIdentifiers = identifiers.filter((id) => id.length > 63)
const shortIdentifiers = identifiers.filter((id) => id.length <= 63)

console.log(`- Total identifiers found: ${identifiers.length}`)
console.log(`- Identifiers ≤ 63 chars: ${shortIdentifiers.length}`)
console.log(`- Identifiers > 63 chars: ${longIdentifiers.length}`)

if (longIdentifiers.length > 0) {
  console.log('\n⚠️  Long identifiers found:')
  longIdentifiers.slice(0, 5).forEach((id) => {
    console.log(`   - ${id} (${id.length} chars)`)
  })
  if (longIdentifiers.length > 5) {
    console.log(`   ... and ${longIdentifiers.length - 5} more`)
  }
}

// Validate rollback completeness
console.log('\n🔄 Rollback Validation:')
const rollbackComplete =
  enumRenames === rollbackEnumRenames && tableRenames === rollbackTableRenames
console.log(`- Forward/rollback operation count match: ${rollbackComplete ? 'PASS' : 'FAIL'}`)

if (!rollbackComplete) {
  console.log(`  Forward: ${enumRenames} enums, ${tableRenames} tables`)
  console.log(`  Rollback: ${rollbackEnumRenames} enums, ${rollbackTableRenames} tables`)
}

// Overall validation result
const allChecks = Object.values(checks).every((check) => check)
const validationPassed = allChecks && longIdentifiers.length === 0 && rollbackComplete

console.log('\n' + '='.repeat(60))
console.log(`Overall Validation: ${validationPassed ? '✅ PASSED' : '❌ FAILED'}`)

if (validationPassed) {
  console.log('\n🎉 Migration is ready for deployment!')
  console.log('\nNext steps:')
  console.log('1. Backup your database')
  console.log('2. Test in development environment')
  console.log('3. Run: payload migrate')
} else {
  console.log('\n❌ Migration has issues that need to be addressed.')
  process.exit(1)
}
