#!/usr/bin/env node

/**
 * Database Schema Reset Script
 *
 * This script helps reset the database schema when there are conflicts
 * during development, particularly when changing field structures.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function resetDatabaseSchema() {
  console.log('🔄 Starting database schema reset...')

  try {
    const payload = await getPayload({ config })

    console.log('📋 Current database adapter:', payload.db.name)

    // For PostgreSQL, we need to handle the schema conflicts
    if (payload.db.name === 'postgres') {
      console.log('🗃️  Detected PostgreSQL database')

      // Drop problematic constraints and tables if they exist
      const queries = [
        // Drop foreign key constraints that are causing issues
        'ALTER TABLE IF EXISTS "links" DROP CONSTRAINT IF EXISTS "links_parent_id_fk";',
        'ALTER TABLE IF EXISTS "_links_v" DROP CONSTRAINT IF EXISTS "_links_v_parent_id_fk";',

        // Drop the problematic tables to allow clean recreation
        'DROP TABLE IF EXISTS "links" CASCADE;',
        'DROP TABLE IF EXISTS "_links_v" CASCADE;',

        // Drop social media related tables if they exist from previous attempts
        'DROP TABLE IF EXISTS "social_media" CASCADE;',
        'DROP TABLE IF EXISTS "_social_media_v" CASCADE;',
      ]

      for (const query of queries) {
        try {
          await payload.db.drizzle.execute(query)
          console.log(`✅ Executed: ${query.substring(0, 50)}...`)
        } catch (error) {
          console.log(`⚠️  Query failed (this is often expected): ${query.substring(0, 50)}...`)
        }
      }
    }

    console.log('✅ Database schema reset completed')
    console.log('🚀 You can now restart your development server')
  } catch (error) {
    console.error('❌ Error during database reset:', error)
    process.exit(1)
  }

  process.exit(0)
}

resetDatabaseSchema()
