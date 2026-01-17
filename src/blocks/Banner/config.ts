import type { Block } from 'payload'

export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  labels: {
    singular: 'Banner Block',
    plural: 'Banner Blocks',
  },
  admin: {
    group: 'Content',
  },
  // ✅ Added comprehensive access control to address critical security issue
  access: {
    // Only authenticated users can create banners
    create: ({ req: { user } }) => Boolean(user),

    // Public can read banners (they're used in published content)
    read: () => true,

    // Only editors and admins can update
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.some((role) => ['admin', 'editor'].includes(role)) || false
    },

    // Only admins can delete
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: false,
      required: true,
      // ✅ Added field-level access control for sensitive content
      access: {
        // Only editors and admins can modify content
        update: ({ req: { user } }) => {
          if (!user) return false
          return user.roles?.some((role) => ['admin', 'editor'].includes(role)) || false
        },
      },
    },
  ],
}
