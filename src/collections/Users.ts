import type { CollectionConfig } from 'payload'
import { superAdminOnly } from '@/access/rbac'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'lastLoginAt', 'createdAt'],
  },
  auth: true,
  access: {
    // Only admins can create users
    create: ({ req: { user } }) => {
      return user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) || false
    },
    // Users can read their own profile, admins can read all
    read: ({ req: { user } }) => {
      if (user?.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
        return true
      }
      return { id: { equals: user?.id } }
    },
    // Users can update their own profile, admins can update all
    update: ({ req: { user } }) => {
      if (user?.roles?.some((role) => ['admin', 'super-admin'].includes(role))) {
        return true
      }
      return { id: { equals: user?.id } }
    },
    // Only super-admins can delete users
    delete: superAdminOnly,
  },
  fields: [
    // Email added by default
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        read: ({ req: { user } }) => {
          // Users can read their own roles, admins can read all
          if (user?.roles?.includes('admin') || user?.roles?.includes('super-admin')) {
            return true
          }
          return true // Users can see their own roles
        },
        update: ({ req: { user } }) => {
          // Only super-admins can modify roles
          return user?.roles?.includes('super-admin') || false
        },
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'loginAttempts',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        hidden: true,
      },
      access: {
        read: ({ req: { user } }) => {
          // Only admins can read login attempts
          return user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || false
        },
        update: ({ req: { user } }) => {
          // Only system can update (via hooks)
          return user?.roles?.includes('super-admin') || false
        },
      },
    },
    {
      name: 'lockUntil',
      type: 'date',
      admin: {
        readOnly: true,
        hidden: true,
      },
      access: {
        read: ({ req: { user } }) => {
          // Only admins can read lock status
          return user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || false
        },
        update: ({ req: { user } }) => {
          // Only system can update (via hooks)
          return user?.roles?.includes('super-admin') || false
        },
      },
    },
  ],
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        // Update last login timestamp
        if (user) {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: { lastLoginAt: new Date().toISOString() },
            req, // Maintain transaction context
          })
        }
      },
    ],
  },
}
