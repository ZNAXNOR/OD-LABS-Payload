import type { Access } from 'payload'

/**
 * Anyone can access - completely public
 */
export const anyoneAccess: Access = () => true

/**
 * Authenticated users only
 */
export const authenticatedAccess: Access = ({ req: { user } }) => Boolean(user)

/**
 * Admin and super-admin access only
 */
export const adminAccess: Access = ({ req: { user } }) => {
  return user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) || false
}

/**
 * Super-admin access only
 */
export const superAdminAccess: Access = ({ req: { user } }) => {
  return user?.roles?.includes('super-admin') || false
}

/**
 * Editor and above access (editor, admin, super-admin)
 */
export const editorAccess: Access = ({ req: { user } }) => {
  return user?.roles?.some((role) => ['editor', 'admin', 'super-admin'].includes(role)) || false
}

/**
 * Author and above access (author, editor, admin, super-admin)
 */
export const authorAccess: Access = ({ req: { user } }) => {
  return (
    user?.roles?.some((role) => ['author', 'editor', 'admin', 'super-admin'].includes(role)) ||
    false
  )
}

/**
 * Published content access - authenticated users see all, public sees published only
 */
export const publishedOrAuthenticatedAccess: Access = ({ req: { user } }) => {
  // Authenticated users can see all content
  if (user) return true

  // Public users only see published content
  return { status: { equals: 'published' } }
}

/**
 * Draft content access - only authenticated users
 */
export const draftAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  return { status: { equals: 'draft' } }
}

/**
 * Owner or admin access - users can access their own content, admins can access all
 */
export const ownerOrAdminAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins can access all content
  if (user.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  // Users can only access content they created
  return { author: { equals: user.id } }
}

/**
 * Team-based access - users can access content from their team/organization
 * Note: Requires extending User type with organizationId field
 */
export const teamAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins can access all content
  if (user.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  // TODO: Implement organization-based access when User type is extended
  // For now, fallback to owner-only access
  return { author: { equals: user.id } }

  // Example implementation when organizationId is added to User type:
  // if ((user as any).organizationId) {
  //   return {
  //     or: [
  //       { author: { equals: user.id } }, // Own content
  //       { 'author.organizationId': { equals: (user as any).organizationId } }, // Team content
  //     ],
  //   }
  // }
}

/**
 * Time-based access - content is only accessible within a date range
 */
export const timeBasedAccess: Access = ({ req: { user } }) => {
  const now = new Date().toISOString()

  // Admins can access all content regardless of time
  if (user?.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  return {
    and: [
      {
        or: [{ publishDate: { exists: false } }, { publishDate: { less_than_equal: now } }],
      },
      {
        or: [{ expireDate: { exists: false } }, { expireDate: { greater_than: now } }],
      },
    ],
  }
}

/**
 * Visibility-based access - respects content visibility settings
 */
export const visibilityBasedAccess: Access = ({ req: { user } }) => {
  // Admins can see all content
  if (user?.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  if (user) {
    // Authenticated users can see public and members-only content
    return {
      visibility: { in: ['public', 'members'] },
    }
  }

  // Public users can only see public content
  return { visibility: { equals: 'public' } }
}

/**
 * Status-based access - only shows content with specific statuses
 */
export const statusBasedAccess = (allowedStatuses: string[]): Access => {
  return ({ req: { user } }) => {
    // Admins can see all content regardless of status
    if (user?.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
      return true
    }

    return { status: { in: allowedStatuses } }
  }
}

/**
 * Featured content access - only shows featured content to public
 */
export const featuredAccess: Access = ({ req: { user } }) => {
  // Authenticated users can see all content
  if (user) return true

  // Public users only see featured content
  return { featured: { equals: true } }
}

/**
 * Category-based access - filter by content categories
 */
export const categoryAccess = (allowedCategories: string[]): Access => {
  return ({ req: { user } }) => {
    // Admins can see all categories
    if (user?.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
      return true
    }

    return { category: { in: allowedCategories } }
  }
}
