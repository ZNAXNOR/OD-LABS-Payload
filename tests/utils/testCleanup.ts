import type { Payload } from 'payload'

/**
 * Utility function to properly cleanup Payload instance and close database connections
 * This prevents tests from hanging due to open database connections
 */
export async function cleanupPayload(payload: Payload): Promise<void> {
  try {
    // Close database connections to prevent hanging
    if (payload && payload.db) {
      // For different database adapters, we need to handle cleanup differently
      if (typeof payload.db.destroy === 'function') {
        await payload.db.destroy()
      } else if (typeof (payload.db as any).close === 'function') {
        await (payload.db as any).close()
      } else if ((payload.db as any).pool && typeof (payload.db as any).pool.end === 'function') {
        await (payload.db as any).pool.end()
      }
    }
  } catch (error) {
    // Ignore cleanup errors to prevent test failures
    console.warn('Error during payload cleanup:', error)
  }
}

/**
 * Utility function to cleanup test documents from multiple collections
 */
export async function cleanupDocuments(
  payload: Payload,
  collections: string[],
  documentIds: (string | number)[],
): Promise<void> {
  for (const collection of collections) {
    for (const id of documentIds) {
      try {
        await payload.delete({
          collection: collection as any,
          id,
        })
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  }
}

/**
 * Utility function to cleanup a test user
 */
export async function cleanupTestUser(payload: Payload, userId: string | number): Promise<void> {
  if (userId) {
    try {
      await payload.delete({
        collection: 'users',
        id: userId,
      })
    } catch (error) {
      // Ignore errors during cleanup
    }
  }
}
