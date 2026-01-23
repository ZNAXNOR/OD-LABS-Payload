#!/usr/bin/env node

/**
 * Script to generate the database identifier optimization migration
 *
 * Usage: npx tsx src/migrations/generateOptimizationMigration.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import {
  generateChangesSummary,
  generateIdentifierOptimizationMigration,
  validateIdentifierLengths,
} from './identifierOptimizationMigration'

async function main() {
  console.log('🔧 Generating Database Identifier Optimization Migration...\n')

  try {
    // Validate identifier lengths first
    const validation = validateIdentifierLengths()
    if (!validation.compliant) {
      console.error('❌ Validation failed:')
      validation.violations.forEach((v) => {
        console.error(`   - ${v.identifier} (${v.length} chars, ${v.type})`)
      })
      process.exit(1)
    }

    console.log('✅ All identifiers pass length validation\n')

    // Generate migration content
    const migrationContent = generateIdentifierOptimizationMigration()

    // Generate timestamp for migration filename
    const timestamp =
      new Date().toISOString().replace(/[-:]/g, '').split('.')[0]?.replace('T', '_') || 'unknown'

    const migrationFilename = `${timestamp}_identifier_optimization.ts`
    const migrationPath = join(__dirname, migrationFilename)

    // Write migration file
    writeFileSync(migrationPath, migrationContent, 'utf8')

    console.log(`✅ Migration file generated: ${migrationFilename}`)
    console.log(`📁 Location: ${migrationPath}\n`)

    // Generate and display summary
    const summary = generateChangesSummary()
    console.log(summary)

    // Update migrations index
    await updateMigrationsIndex(migrationFilename.replace('.ts', ''))

    console.log('🎉 Migration generation complete!')
    console.log('\nNext steps:')
    console.log('1. Review the generated migration file')
    console.log('2. Test the migration on a development database')
    console.log('3. Run the migration: payload migrate')
  } catch (error) {
    console.error('❌ Error generating migration:', error)
    process.exit(1)
  }
}

/**
 * Update the migrations index file to include the new migration
 */
async function updateMigrationsIndex(migrationName: string) {
  try {
    const indexPath = join(__dirname, 'index.ts')

    // Read current index file
    let indexContent = ''
    try {
      const fs = await import('fs')
      indexContent = fs.readFileSync(indexPath, 'utf8')
    } catch {
      // Create new index file if it doesn't exist
      indexContent = `export const migrations = [];\n`
    }

    // Add import for new migration
    const importStatement = `import * as ${migrationName} from './${migrationName}';`

    // Add migration to exports array
    const migrationEntry = `  {\n    up: ${migrationName}.up,\n    down: ${migrationName}.down,\n    name: '${migrationName}'\n  },`

    // Update content
    if (!indexContent.includes(importStatement)) {
      // Add import at the top
      const lines = indexContent.split('\n')
      const importIndex = lines.findIndex((line) => line.startsWith('import'))
      if (importIndex >= 0) {
        lines.splice(importIndex, 0, importStatement)
      } else {
        lines.unshift(importStatement)
      }

      // Add to migrations array
      const arrayIndex = lines.findIndex((line) => line.includes('export const migrations'))
      if (arrayIndex >= 0) {
        // Find the closing bracket and add before it
        for (let i = arrayIndex + 1; i < lines.length; i++) {
          if (lines[i]?.includes('];')) {
            lines.splice(i, 0, migrationEntry)
            break
          }
        }
      }

      indexContent = lines.join('\n')
      writeFileSync(indexPath, indexContent, 'utf8')
      console.log('✅ Updated migrations index file')
    }
  } catch (error) {
    console.warn(
      '⚠️  Could not update migrations index:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
