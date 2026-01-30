#!/usr/bin/env node

/**
 * Simple Database Schema Reset
 *
 * This script drops and recreates the database schema to fix
 * the PostgreSQL index name length issue.
 *
 * ⚠️  WARNING: This will delete all existing data!
 * Only use in development environments.
 */

const { execSync } = require('child_process')
require('dotenv').config()

async function resetSchema() {
  console.log('🔧 Resetting database schema...')

  if (process.env.NODE_ENV === 'production') {
    console.error('❌ This script cannot be run in production!')
    console.error('Please use proper database migrations for production.')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required')
    process.exit(1)
  }

  try {
    console.log('📊 Connecting to database...')

    // Import payload dynamically
    const { getPayload } = await import('payload')
    const config = await import('../src/payload.config.ts')

    console.log('🗄️  Initializing Payload with new schema...')
    const payload = await getPayload({ config: config.default })

    console.log('✅ Database schema has been reset successfully!')
    console.log('🎉 The index name length issue should now be resolved.')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Create a new admin user if needed')
    console.log('3. Test creating pages with legal document notifications')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error resetting schema:', error.message)

    if (error.message.includes('index name too long')) {
      console.error('')
      console.error('The index name is still too long. This might be due to:')
      console.error('1. Existing database tables with the old schema')
      console.error('2. Need to manually drop the database')
      console.error('')
      console.error('Try running: npm run db:reset (if you have this script)')
      console.error('Or manually drop and recreate your database.')
    }

    process.exit(1)
  }
}

resetSchema().catch(console.error)
