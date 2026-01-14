import { createRevalidationHook } from '@/hooks/transactionSafe'

/**
 * Revalidation hook for Contacts collection
 * Uses the transaction-safe revalidation utility with proper Next.js cache invalidation
 */
export const revalidateContact = createRevalidationHook((doc) => {
  return `/contacts/${doc.slug}`
})
