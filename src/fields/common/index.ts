// Common field patterns that are reused across collections
import type { Field } from 'payload'

// Basic text fields
export const titleField: Field = {
  name: 'title',
  type: 'text',
  required: true,
  admin: {
    description: 'The title of the content',
  },
}

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    description: 'URL-friendly version of the title',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (!value && data?.title) {
          // Auto-generate slug from title
          return data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return value
      },
    ],
  },
}

export const descriptionField: Field = {
  name: 'description',
  type: 'textarea',
  admin: {
    description: 'Brief description of the content',
  },
}

// Status and publishing fields
export const statusField: Field = {
  name: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
  defaultValue: 'draft',
  required: true,
  admin: {
    description: 'Publication status of the content',
  },
}

export const publishedDateField: Field = {
  name: 'publishedDate',
  type: 'date',
  admin: {
    description: 'Date when the content was published',
    condition: (data) => data?.status === 'published',
  },
  hooks: {
    beforeChange: [
      ({ value, siblingData, operation }) => {
        if (operation === 'create' && siblingData?.status === 'published' && !value) {
          return new Date().toISOString()
        }
        return value
      },
    ],
  },
}

// Author and ownership fields
export const authorField: Field = {
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  admin: {
    description: 'Author of the content',
  },
  hooks: {
    beforeChange: [
      ({ req, value, operation }) => {
        if (operation === 'create' && !value && req.user) {
          return req.user.id
        }
        return value
      },
    ],
  },
}

// SEO fields group
export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Search engine optimization settings',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'SEO title (recommended: 50-60 characters)',
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > 60) {
          return 'SEO title should be 60 characters or less for optimal display'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'SEO description (recommended: 150-160 characters)',
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > 160) {
          return 'SEO description should be 160 characters or less for optimal display'
        }
        return true
      },
    },
    {
      name: 'keywords',
      type: 'text',
      admin: {
        description: 'Comma-separated keywords for SEO',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Social media sharing image (recommended: 1200x630px)',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Prevent indexing',
      admin: {
        description: 'Prevent search engines from indexing this page',
      },
    },
  ],
}

// Featured image field
export const featuredImageField: Field = {
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Main image for the content',
  },
}

// Category field (generic)
export const categoryField: Field = {
  name: 'category',
  type: 'text',
  admin: {
    description: 'Category for organizing content',
  },
}

// Tags field
export const tagsField: Field = {
  name: 'tags',
  type: 'text',
  hasMany: true,
  admin: {
    description: 'Tags for categorizing content',
  },
}

// Priority field
export const priorityField: Field = {
  name: 'priority',
  type: 'select',
  options: [
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ],
  defaultValue: 'normal',
  admin: {
    description: 'Priority level for content ordering',
  },
}

// Featured flag
export const featuredField: Field = {
  name: 'featured',
  type: 'checkbox',
  label: 'Featured Content',
  admin: {
    description: 'Mark this content as featured',
  },
}

// Sort order field
export const sortOrderField: Field = {
  name: 'sortOrder',
  type: 'number',
  admin: {
    description: 'Custom sort order (lower numbers appear first)',
  },
}

// Visibility field
export const visibilityField: Field = {
  name: 'visibility',
  type: 'select',
  options: [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Members Only', value: 'members' },
  ],
  defaultValue: 'public',
  admin: {
    description: 'Who can view this content',
  },
}

// Archive date field
export const archiveDateField: Field = {
  name: 'archiveDate',
  type: 'date',
  admin: {
    description: 'Date when content should be automatically archived',
  },
}

// Export all common fields as a collection for easy access
export const commonFields = {
  title: titleField,
  slug: slugField,
  description: descriptionField,
  status: statusField,
  publishedDate: publishedDateField,
  author: authorField,
  seo: seoFields,
  featuredImage: featuredImageField,
  category: categoryField,
  tags: tagsField,
  priority: priorityField,
  featured: featuredField,
  sortOrder: sortOrderField,
  visibility: visibilityField,
  archiveDate: archiveDateField,
}
