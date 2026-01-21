// Collection hooks exports
// This file will contain combined exports for all collection hooks

// Export specific hook from revalidateMedia to avoid conflicts
export { revalidateMedia as mediaRevalidateHook } from './revalidateMedia'

// Export organized collection hooks (which also has revalidateMedia)
export * from '../../hooks/collections'

// Additional collection hooks will be exported here
