import type { Access } from 'payload'

/**
 * User create access - admins only
 * Only administrators can create new user accounts
 */
export const userCreateAccess: Access = ({ req: { user } }) => {
  return user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) || false
}

/**
 * User read access - self or admin
 * Users can read their own profile, admins can read all
 */
export const userReadAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins can read all users
  if (user.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  // Users can only read their own profile
  return { id: { equals: user.id } }
}

/**
 * User update access - self or admin
 * Users can update their own profile, admins can update all
 */
export const userUpdateAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins can update all users
  if (user.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  // Users can only update their own profile
  return { id: { equals: user.id } }
}

/**
 * User delete access - super-admins only
 * Only super-admins can delete user accounts
 */
export const userDeleteAccess: Access = ({ req: { user } }) => {
  return user?.roles?.includes('super-admin') || false
}

/**
 * User admin access - admins and above
 * Controls who can see users in admin panel
 */
export const userAdminAccess: Access = ({ req: { user } }) => {
  return user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) || false
}

/**
 * Public user profile access
 * For public-facing user profiles (limited fields)
 * Note: Requires extending User type with profileVisibility and status fields
 */
export const publicUserAccess: Access = () => {
  // TODO: Implement when User type is extended with profileVisibility and status
  // For now, return basic access
  return true

  // Example implementation when fields are added to User type:
  // return {
  //   and: [{ profileVisibility: { equals: 'public' } }, { status: { equals: 'active' } }],
  // }
}

/**
 * Team member access
 * Users can see other users in their team/organization
 * Note: Requires extending User type with organizationId field
 */
export const teamMemberAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins can see all users
  if (user.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  // TODO: Implement organization-based access when User type is extended
  // For now, fallback to self-only access
  return { id: { equals: user.id } }

  // Example implementation when organizationId is added to User type:
  // if ((user as any).organizationId) {
  //   return {
  //     organizationId: { equals: (user as any).organizationId },
  //   }
  // }
}

/**
 * Active users access
 * Only shows users with active status
 * Note: Requires extending User type with status and lockUntil fields
 */
export const activeUsersAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // TODO: Implement when User type is extended with status and lockUntil
  // For now, return basic authenticated access
  return true

  // Example implementation when fields are added to User type:
  // return {
  //   and: [{ status: { equals: 'active' } }, { lockUntil: { exists: false } }],
  // }
}

/**
 * Role-based user access
 * Filter users by minimum role level
 */
export const roleBasedUserAccess = (minRole: string): Access => {
  const roleHierarchy = ['user', 'author', 'editor', 'admin', 'super-admin']
  const minRoleIndex = roleHierarchy.indexOf(minRole)

  return ({ req: { user } }) => {
    if (!user) return false

    // Check if user has sufficient role to see other users
    const userMaxRoleIndex = Math.max(...user.roles.map((role) => roleHierarchy.indexOf(role)))

    if (userMaxRoleIndex < minRoleIndex) {
      return { id: { equals: user.id } } // Can only see self
    }

    return true // Can see all users
  }
}
