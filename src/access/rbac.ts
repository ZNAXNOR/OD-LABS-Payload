import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type UserRole = 'super-admin' | 'admin' | 'editor' | 'author' | 'user'

/**
 * Creates a role-based access control function that allows access only to users with specified roles
 * @param allowedRoles - Array of role names that should have access
 * @returns Access control function
 */
export const createRoleBasedAccess = (allowedRoles: UserRole[]): Access => {
  return ({ req: { user } }: AccessArgs<User>) => {
    if (!user) return false
    return allowedRoles.some((role) => user.roles?.includes(role)) || false
  }
}

/**
 * Creates an access control function that allows access to users with specified roles OR document owners
 * @param allowedRoles - Array of role names that should have access
 * @param ownerField - Name of the field that contains the owner reference (default: 'author')
 * @returns Access control function
 */
export const createOwnerOrRoleAccess = (
  allowedRoles: UserRole[],
  ownerField = 'author',
): Access => {
  return ({ req: { user } }: AccessArgs<User>) => {
    if (!user) return false

    // Check if user has required role
    if (allowedRoles.some((role) => user.roles?.includes(role))) {
      return true
    }

    // Check if user owns the document
    return { [ownerField]: { equals: user.id } }
  }
}

/**
 * Creates an access control function that allows authenticated users to see all content,
 * while public users only see published content
 * @returns Access control function
 */
export const createPublishedOrAuthenticatedAccess = (): Access => {
  return ({ req: { user } }: AccessArgs<User>) => {
    // Authenticated users see all content
    if (user) return true

    // Public users see only published content
    return { _status: { equals: 'published' } }
  }
}

/**
 * Access control function that allows only super-admin users
 */
export const superAdminOnly = createRoleBasedAccess(['super-admin'])

/**
 * Access control function that allows super-admin and admin users
 */
export const adminOnly = createRoleBasedAccess(['super-admin', 'admin'])

/**
 * Access control function that allows super-admin, admin, and editor users
 */
export const editorAccess = createRoleBasedAccess(['super-admin', 'admin', 'editor'])

/**
 * Access control function that allows super-admin, admin, editor, and author users
 */
export const authorAccess = createRoleBasedAccess(['super-admin', 'admin', 'editor', 'author'])
