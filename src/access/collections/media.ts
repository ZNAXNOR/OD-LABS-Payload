import type { Access } from 'payload'

/**
 * Media read access - public for all media files
 * Allows public access to media files for website functionality
 */
export const mediaReadAccess: Access = () => true

/**
 * Media create access - authenticated users only
 * Only logged-in users can upload media
 */
export const mediaCreateAccess: Access = ({ req: { user } }) => Boolean(user)

/**
 * Media update access - authenticated users only
 * Only logged-in users can modify media metadata
 */
export const mediaUpdateAccess: Access = ({ req: { user } }) => Boolean(user)

/**
 * Media delete access - authenticated users only
 * Only logged-in users can delete media files
 */
export const mediaDeleteAccess: Access = ({ req: { user } }) => Boolean(user)

/**
 * Media admin access - editors and above
 * Controls who can see media in admin panel
 */
export const mediaAdminAccess: Access = ({ req: { user } }) => {
  return user?.roles?.some((role) => ['admin', 'super-admin', 'editor'].includes(role)) || false
}

/**
 * Sensitive media access - admins only
 * For media that should only be accessible to administrators
 */
export const sensitiveMediaAccess: Access = ({ req: { user } }) => {
  return user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) || false
}

/**
 * User-owned media access
 * Users can only access media they uploaded
 */
export const userOwnedMediaAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins can access all media
  if (user.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
    return true
  }

  // Users can only access their own uploads
  return {
    uploadedBy: { equals: user.id },
  }
}

/**
 * Published media access
 * Only shows media marked as published/public
 */
export const publishedMediaAccess: Access = ({ req: { user } }) => {
  // Authenticated users see all media
  if (user) return true

  // Public users only see published media
  return {
    status: { equals: 'published' },
  }
}
