#!/usr/bin/env node

import { getPayload } from 'payload'
import config from './src/payload.config.ts'

async function initDatabase() {
  console.log('Initializing database schema...')

  try {
    const payload = await getPayload({ config })
    console.log('✅ Database schema initialized successfully')

    // Try to count pages to verify the schema is working
    const result = await payload.count({
      collection: 'pages',
    })

    console.log(`✅ Pages collection is working. Current count: ${result.totalDocs}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message)
    process.exit(1)
  }
}

initDatabase()
