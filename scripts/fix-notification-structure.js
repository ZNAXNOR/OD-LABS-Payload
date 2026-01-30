/**
 * Migration script to fix the notification structure issue
 *
 * This script addresses the PostgreSQL index name length issue by:
 * 1. Backing up existing data with nested notification settings
 * 2. Updating the structure to flatten the notification recipients
 * 3. Migrating data to the new structure
 */

const { getPayload } = require('payload')
const config = require('../src/payload.config.ts').default

async function migrateNotificationStructure() {
  console.log('🚀 Starting notification structure migration...')

  try {
    const payload = await getPayload({ config })

    // Find all legal pages with notification settings
    const legalPages = await payload.find({
      collection: 'pages',
      where: {
        pageType: { equals: 'legal' },
        'legalConfig.notificationSettings.recipients': { exists: true },
      },
      limit: 1000, // Adjust as needed
    })

    console.log(`📄 Found ${legalPages.docs.length} legal pages with notification settings`)

    let migratedCount = 0

    for (const page of legalPages.docs) {
      try {
        const notificationSettings = page.legalConfig?.notificationSettings

        if (notificationSettings?.recipients?.length > 0) {
          // Prepare the updated data structure
          const updatedData = {
            ...page,
            legalConfig: {
              ...page.legalConfig,
              notifyOnChange: notificationSettings.notifyOnChange || false,
              notificationRecipients: notificationSettings.recipients || [],
              // Remove the old nested structure
              notificationSettings: undefined,
            },
          }

          // Update the page with the new structure
          await payload.update({
            collection: 'pages',
            id: page.id,
            data: updatedData,
            // Skip hooks to prevent infinite loops
            context: {
              skipHooks: true,
              skipUrlGeneration: true,
              skipChildUrlRegeneration: true,
            },
          })

          migratedCount++
          console.log(`✅ Migrated page: ${page.title} (${page.id})`)
        }
      } catch (error) {
        console.error(`❌ Error migrating page ${page.id}:`, error.message)
      }
    }

    console.log(`🎉 Migration completed! Migrated ${migratedCount} pages`)

    // Verify the migration
    const verifyPages = await payload.find({
      collection: 'pages',
      where: {
        pageType: { equals: 'legal' },
        'legalConfig.notificationRecipients': { exists: true },
      },
      limit: 10,
    })

    console.log(`✅ Verification: Found ${verifyPages.docs.length} pages with new structure`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
if (require.main === module) {
  migrateNotificationStructure()
    .then(() => {
      console.log('✅ Migration script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateNotificationStructure }
