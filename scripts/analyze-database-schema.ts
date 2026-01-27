#!/usr/bin/env node

/**
 * Database Schema Analysis Script
 *
 * This script analyzes the current PostgreSQL database to identify existing
 * header-related tables and their naming patterns. It helps understand the
 * mismatch between configured dbName properties and actual database schema.
 *
 * Usage: npm run analyze:database-schema
 */

import { promises as fs } from 'fs'
import path from 'path'
import {
  generateDatabaseSchemaReport,
  runDatabaseSchemaAnalysis,
} from '../src/utilities/validation/databaseSchemaAnalyzer'

async function main() {
  try {
    console.log('🔍 Starting database schema analysis...\n')

    // Check environment variables
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    console.log('✅ DATABASE_URL is configured')
    console.log('🔗 Connecting to database...\n')

    // Generate the analysis report
    const report = await generateDatabaseSchemaReport()

    // Create reports directory if it doesn't exist
    const reportsDir = path.resolve('./validation-reports')
    await fs.mkdir(reportsDir, { recursive: true })

    // Save the report to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(reportsDir, `database-schema-analysis-${timestamp}.md`)

    await fs.writeFile(reportPath, report, 'utf8')

    console.log('📄 Database schema analysis report generated:')
    console.log(`   ${reportPath}\n`)

    // Also run the CLI analysis for immediate feedback
    await runDatabaseSchemaAnalysis()
  } catch (error: any) {
    console.error('💥 Database schema analysis failed:', error)

    // Provide helpful error messages
    if (error?.message?.includes('Database connection not available')) {
      console.error('\n💡 Troubleshooting tips:')
      console.error('   1. Ensure DATABASE_URL is set in your .env file')
      console.error('   2. Verify the database is running and accessible')
      console.error('   3. Check that the database contains Payload tables')
      console.error('   4. Try running: npm run payload migrate')
    } else if (error?.message?.includes('getPayload')) {
      console.error('\n💡 This might be a Payload initialization issue.')
      console.error('   Try running the analysis after the application has started once.')
    }

    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: any) => {
    console.error('💥 Script execution failed:', error)
    process.exit(2)
  })
}

export { main as analyzeDatabaseSchema }
