import { createRevalidationHook } from '@/hooks/transactionSafe'

/**
 * Revalidation hook for Legal collection
 * Uses the transaction-safe revalidation utility with proper Next.js cache invalidation
 */
export const revalidateLegal = createRevalidationHook((doc) => {
  return `/legal/${doc.slug}`
})
