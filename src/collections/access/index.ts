// Collection access control exports
// This file will contain combined exports for all collection access control functions

// Re-export existing access functions for collections
export * from '../../access/anyone'
export * from '../../access/authenticated'
export * from '../../access/authenticatedOrPublished'

// Export RBAC functions with explicit names to avoid conflicts
export {
  createRoleBasedAccess,
  createOwnerOrRoleAccess,
  createPublishedOrAuthenticatedAccess,
  superAdminOnly,
  adminOnly,
} from '../../access/rbac'

// Rename conflicting exports from rbac to avoid conflicts with collections/shared
export {
  editorAccess as rbacEditorAccess,
  authorAccess as rbacAuthorAccess,
} from '../../access/rbac'

// Export organized collection access control
export * from '../../access/collections'

// Additional collection-specific access functions will be exported here
