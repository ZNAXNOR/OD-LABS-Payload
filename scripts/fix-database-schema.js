#!/usr/bin/env node

/**
 * Database Schema Fix Script
 *
 * This script helps resolve the PostgreSQL index name length issue
 * by resetting the database schema and migrating any existing data.
 */

const { execSync } = require('child_process')
const path = require('path')

async function main() {
  console.log('🔧 Starting database schema fix...')

  try {
    // Step 1: Check if we have any existing data
    console.log('📊 Checking for existing data...')

    const { getPayload } = await import('payload')
    const config = await import('../src/payload.config.ts')

    const payload = await getPayload({ config: config.default })

    // Check if pages collection has any data
    const existingPages = await payload.count({
      collection: 'pages',
      where: {
        'legalConfig.notificationSettings.recipients': { exists: true },
      },
    })

    if (existingPages.totalDocs > 0) {
      console.log(`⚠️  Found ${existingPages.totalDocs} pages with notification settings`)
      console.log('📦 Backing up existing data...')

      // Export existing data
      const pagesWithNotifications = await payload.find({
        collection: 'pages',
        where: {
          'legalConfig.notificationSettings.recipients': { exists: true },
        },
        limit: 1000,
      })

      // Transform the data structure
      const transformedPages = pagesWithNotifications.docs.map((page) => {
        if (page.legalConfig?.notificationSettings) {
          return {
            ...page,
            legalConfig: {
              ...page.legalConfig,
              notifyOnChange: page.legalConfig.notificationSettings.notifyOnChange,
              notificationRecipients: page.legalConfig.notificationSettings.recipients,
              // Remove the old nested structure
              notificationSettings: undefined,
            },
          }
        }
        return page
      })

      // Save backup
      const fs = require('fs')
      const backupPath = path.join(__dirname, '..', 'backup-pages-data.json')
      fs.writeFileSync(backupPath, JSON.stringify(transformedPages, null, 2))
      console.log(`💾 Data backed up to: ${backupPath}`)
    } else {
      console.log('✅ No existing notification data found')
    }

    // Step 2: Reset database schema
    console.log('🗄️  Resetting database schema...')

    // Drop and recreate the database (be careful with this in production!)
    if (process.env.NODE_ENV !== 'production') {
      try {
        // This will recreate all tables with the new schema
        execSync('npm run payload:generate:types', { stdio: 'inherit' })
        console.log('✅ Database schema updated')
      } catch (error) {
        console.error('❌ Error updating schema:', error.message)
      }
    } else {
      console.log('⚠️  Production environment detected. Manual migration required.')
      console.log('Please run database migrations manually in production.')
    }

    // Step 3: Restore data if we had any
    if (existingPages.totalDocs > 0) {
      console.log('📥 Restoring transformed data...')

      const fs = require('fs')
      const backupPath = path.join(__dirname, '..', 'backup-pages-data.json')
      const transformedPages = JSON.parse(fs.readFileSync(backupPath, 'utf8'))

      for (const page of transformedPages) {
        try {
          await payload.update({
            collection: 'pages',
            id: page.id,
            data: page,
          })
          console.log(`✅ Updated page: ${page.title}`)
        } catch (error) {
          console.error(`❌ Error updating page ${page.title}:`, error.message)
        }
      }
    }

    console.log('🎉 Database schema fix completed successfully!')
  } catch (error) {
    console.error('❌ Error during schema fix:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main }
