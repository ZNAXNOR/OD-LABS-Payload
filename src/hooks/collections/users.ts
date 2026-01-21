import type {
  CollectionBeforeLoginHook,
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
} from 'payload'

/**
 * Update last login timestamp when user logs in
 * Maintains transaction safety by passing req
 */
export const updateLastLogin: CollectionBeforeLoginHook = async ({ req, user }) => {
  // Update last login timestamp
  if (user) {
    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: { lastLoginAt: new Date().toISOString() },
      req, // Maintain transaction context
    })
  }
}

/**
 * Reset login attempts on successful login
 * Clears failed login attempt counter
 */
export const resetLoginAttempts: CollectionBeforeLoginHook = async ({ req, user }) => {
  if (user && user.loginAttempts && user.loginAttempts > 0) {
    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        loginAttempts: 0,
        lockUntil: null,
      },
      req, // Maintain transaction context
    })
  }
}

/**
 * Auto-set author field for new content
 * Sets the current user as author when creating content
 */
export const setAuthor: CollectionBeforeChangeHook = ({ req, data, operation }) => {
  if (operation === 'create' && !data.author && req.user) {
    data.author = req.user.id
  }
  return data
}

/**
 * Validate user role changes
 * Ensures proper authorization for role modifications
 */
export const validateRoleChanges: CollectionBeforeChangeHook = ({
  req,
  data,
  operation,
  originalDoc,
}) => {
  // Only super-admins can modify roles
  if (operation === 'update' && originalDoc && data.roles !== originalDoc.roles) {
    if (!req.user?.roles?.includes('super-admin')) {
      throw new Error('Only super-admins can modify user roles')
    }
  }

  // Prevent users from removing their own super-admin role
  if (operation === 'update' && req.user?.id === originalDoc?.id) {
    if (originalDoc?.roles?.includes('super-admin') && !data.roles?.includes('super-admin')) {
      throw new Error('Cannot remove your own super-admin role')
    }
  }

  return data
}

/**
 * Log user operations for security audit
 */
export const logUserOperation: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  try {
    // Log significant changes
    if (operation === 'create') {
      req.payload.logger.info(`User created: ${doc.email} by ${req.user?.email || 'system'}`)
    } else if (operation === 'update' && previousDoc) {
      const changes = []
      if (previousDoc.roles !== doc.roles)
        changes.push(`roles: ${previousDoc.roles} → ${doc.roles}`)
      if (previousDoc.email !== doc.email)
        changes.push(`email: ${previousDoc.email} → ${doc.email}`)

      if (changes.length > 0) {
        req.payload.logger.info(
          `User updated: ${doc.email} - ${changes.join(', ')} by ${req.user?.email || 'system'}`,
        )
      }
    }
  } catch (error) {
    req.payload.logger.error(`User logging failed: ${error}`)
    // Don't throw - logging failure shouldn't break the operation
  }

  return doc
}

/**
 * Log user deletion for security audit
 */
export const logUserDeletion: CollectionBeforeDeleteHook = async ({ req, id }) => {
  try {
    // Get user info before deletion
    const userToDelete = await req.payload.findByID({
      collection: 'users',
      id: id as string,
      req,
    })

    req.payload.logger.info(`User deleted: ${userToDelete.email} by ${req.user?.email || 'system'}`)
  } catch (error) {
    req.payload.logger.error(`User deletion logging failed: ${error}`)
    // Don't throw - logging failure shouldn't break the operation
  }
}

/**
 * Prevent deletion of the last super-admin
 * Ensures system always has at least one super-admin
 */
export const preventLastSuperAdminDeletion: CollectionBeforeDeleteHook = async ({ req, id }) => {
  try {
    // Check if this is a super-admin being deleted
    const userToDelete = await req.payload.findByID({
      collection: 'users',
      id: id as string,
      req,
    })

    if (userToDelete.roles?.includes('super-admin')) {
      // Count remaining super-admins
      const { totalDocs } = await req.payload.count({
        collection: 'users',
        where: {
          and: [{ roles: { contains: 'super-admin' } }, { id: { not_equals: id } }],
        },
        req,
      })

      if (totalDocs === 0) {
        throw new Error('Cannot delete the last super-admin user')
      }
    }
  } catch (error) {
    req.payload.logger.error(`Super-admin deletion check failed: ${error}`)
    // Don't throw - check failure shouldn't break the operation
  }
}
