#!/usr/bin/env node

/**
 * Simple Database Table Inspector using Payload's database connection
 *
 * This script uses Payload's existing database connection to inspect tables
 * and understand the current database schema.
 */

import dotenv from 'dotenv'
import { promises as fs } from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

async function inspectDatabase() {
  try {
    console.log('🔍 Inspecting database tables using Payload connection...\n')

    // Import Payload config and get database connection
    const { default: config } = await import('../src/payload.config.ts')
    const { getPayload } = await import('payload')

    console.log('✅ Loading Payload configuration...')
    const payload = await getPayload({ config })
    console.log('✅ Connected to database\n')

    // Query to get all tables in the public schema
    const tablesQuery = `
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `

    console.log('📋 Querying database tables...\n')
    const tablesResult = await payload.db.drizzle.execute(tablesQuery)

    console.log('Raw result:', tablesResult)
    console.log('Result type:', typeof tablesResult)
    console.log('Is array:', Array.isArray(tablesResult))

    // Handle different result formats
    let tableRows = []
    if (Array.isArray(tablesResult)) {
      tableRows = tablesResult
    } else if (tablesResult && tablesResult.rows) {
      tableRows = tablesResult.rows
    } else if (tablesResult && typeof tablesResult === 'object') {
      // Try to find the actual data
      const keys = Object.keys(tablesResult)
      console.log('Result keys:', keys)
      tableRows = tablesResult[keys[0]] || []
    }

    console.log(`Found ${tableRows.length} tables in the database:\n`)

    // Filter header-related tables
    const allTables = tableRows.map((row) => row.table_name)
    const headerTables = allTables.filter(
      (table) =>
        table.includes('header') ||
        table.includes('nav') ||
        table.includes('dropdown') ||
        table.includes('menu'),
    )

    console.log('🏷️  All Tables:')
    allTables.forEach((table) => {
      const isHeaderRelated = headerTables.includes(table)
      console.log(`   ${isHeaderRelated ? '🔗' : '  '} ${table}`)
    })

    console.log('\n🎯 Header-Related Tables:')
    if (headerTables.length === 0) {
      console.log('   ❌ No header-related tables found')
    } else {
      headerTables.forEach((table) => {
        console.log(`   ✅ ${table}`)
      })
    }

    // Get detailed information about header-related tables
    if (headerTables.length > 0) {
      console.log('\n📊 Detailed Header Table Information:\n')

      for (const tableName of headerTables) {
        const columnsQuery = `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = '${tableName}'
          ORDER BY ordinal_position;
        `

        const columnsResult = await payload.db.drizzle.execute(columnsQuery)

        // Handle different result formats for columns
        let columnRows = []
        if (Array.isArray(columnsResult)) {
          columnRows = columnsResult
        } else if (columnsResult && columnsResult.rows) {
          columnRows = columnsResult.rows
        } else if (columnsResult && typeof columnsResult === 'object') {
          const keys = Object.keys(columnsResult)
          columnRows = columnsResult[keys[0]] || []
        }

        console.log(`### ${tableName}`)
        console.log(`Columns: ${columnRows.length}`)

        columnRows.forEach((col) => {
          console.log(
            `  - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`,
          )
        })
        console.log('')
      }
    }

    // Expected vs Actual Analysis
    console.log('🔍 Expected vs Actual Table Analysis:\n')

    const expectedTables = [
      'header',
      'header_tabs',
      'header_tabs_dropdown_description_links',
      'header_tabs_dropdown_nav_items',
      'header_tabs_dropdown_nav_items_featured_link_links',
      'header_tabs_dropdown_nav_items_list_links_links',
    ]

    console.log('Expected Tables vs Actual Tables:')
    expectedTables.forEach((expected) => {
      const found = allTables.includes(expected)
      console.log(`  ${found ? '✅' : '❌'} ${expected}${found ? '' : ' (MISSING)'}`)
    })

    // Look for similar tables that might be the actual ones
    console.log('\n🔍 Potential Matches for Missing Tables:')
    expectedTables.forEach((expected) => {
      if (!allTables.includes(expected)) {
        const similarTables = allTables.filter((actual) => {
          const expectedParts = expected.split('_')
          const actualParts = actual.split('_')

          // Check if there's significant overlap in parts
          const commonParts = expectedParts.filter((part) =>
            actualParts.some(
              (actualPart) => actualPart.includes(part) || part.includes(actualPart),
            ),
          )

          return commonParts.length >= Math.min(2, expectedParts.length - 1)
        })

        if (similarTables.length > 0) {
          console.log(`  ${expected} might be:`)
          similarTables.forEach((similar) => {
            console.log(`    - ${similar}`)
          })
        }
      }
    })

    // Generate report
    const report = generateReport(allTables, headerTables, expectedTables)

    // Save report
    const reportsDir = path.resolve('./validation-reports')
    await fs.mkdir(reportsDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(reportsDir, `database-tables-inspection-${timestamp}.md`)

    await fs.writeFile(reportPath, report, 'utf8')

    console.log(`\n📄 Report saved to: ${reportPath}`)
  } catch (error) {
    console.error('💥 Database inspection failed:', error)

    if (error?.message?.includes('DATABASE_URL')) {
      console.error('\n💡 Database connection failed. Check your DATABASE_URL.')
    } else if (error?.code === 'ECONNREFUSED') {
      console.error('\n💡 Database refused connection. Is the database running?')
    }

    process.exit(1)
  }
}

function generateReport(allTables, headerTables, expectedTables) {
  let report = '# Database Tables Inspection Report\n\n'
  report += `Generated: ${new Date().toISOString()}\n\n`

  report += '## Summary\n\n'
  report += `- Total tables: ${allTables.length}\n`
  report += `- Header-related tables: ${headerTables.length}\n`
  report += `- Expected header tables: ${expectedTables.length}\n\n`

  report += '## All Tables\n\n'
  allTables.forEach((table) => {
    const isHeaderRelated = headerTables.includes(table)
    report += `- ${table}${isHeaderRelated ? ' (header-related)' : ''}\n`
  })

  report += '\n## Header-Related Tables\n\n'
  if (headerTables.length === 0) {
    report += 'No header-related tables found.\n'
  } else {
    headerTables.forEach((table) => {
      report += `- ${table}\n`
    })
  }

  report += '\n## Expected vs Actual\n\n'
  report += '| Expected Table | Found | Status |\n'
  report += '|---|---|---|\n'

  expectedTables.forEach((expected) => {
    const found = allTables.includes(expected)
    report += `| ${expected} | ${found ? 'Yes' : 'No'} | ${found ? '✅ Found' : '❌ Missing'} |\n`
  })

  return report
}

// Run the inspection
inspectDatabase().catch((error) => {
  console.error('💥 Script failed:', error)
  process.exit(1)
})
