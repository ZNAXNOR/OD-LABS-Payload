// Field factory functions for creating reusable, type-safe field configurations
import type { Field, GroupField, ArrayField, SelectField } from 'payload'

/**
 * Factory for creating consistent slug fields with validation
 */
export const createSlugField = (
  options: {
    sourceField?: string
    maxLength?: number
    required?: boolean
    unique?: boolean
    index?: boolean
  } = {},
): Field => {
  const {
    sourceField = 'title',
    maxLength = 100,
    required = false,
    unique = true,
    index = true,
  } = options

  return {
    name: 'slug',
    type: 'text',
    unique,
    index,
    required,
    maxLength,
    admin: {
      position: 'sidebar',
      description: `URL-friendly identifier (auto-generated from ${sourceField}, max ${maxLength} characters)`,
    },
    validate: (value: unknown) => {
      if (!value && required) return 'Slug is required'
      if (!value) return true // Let required handle empty values

      if (typeof value !== 'string') {
        return 'Slug must be a string'
      }

      if (value.length > maxLength) {
        return `Slug must be ${maxLength} characters or less`
      }

      // Validate slug format
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return 'Slug must contain only lowercase letters, numbers, and hyphens'
      }

      return true
    },
  } as Field
}

/**
 * Factory for creating consistent status fields
 */
export const createStatusField = (
  options: {
    statuses?: Array<{ label: string; value: string }>
    defaultValue?: string
    required?: boolean
  } = {},
): SelectField => {
  const {
    statuses = [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived', value: 'archived' },
    ],
    defaultValue = 'draft',
    required = true,
  } = options

  return {
    name: 'status',
    type: 'select',
    options: statuses,
    defaultValue,
    required,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Publication status of the content',
    },
  }
}

/**
 * Factory for creating consistent author fields
 */
export const createAuthorField = (
  options: {
    relationTo?: string
    required?: boolean
    autoPopulate?: boolean
  } = {},
): Field => {
  const { relationTo = 'users', required = false, autoPopulate = true } = options

  return {
    name: 'author',
    type: 'relationship',
    relationTo,
    required,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Author of the content',
    },
    hooks: autoPopulate
      ? {
          beforeChange: [
            ({ req, value, operation }) => {
              if (operation === 'create' && !value && req.user) {
                return req.user.id
              }
              return value
            },
          ],
        }
      : undefined,
  } as Field
}

/**
 * Factory for creating consistent SEO field groups
 */
export const createSEOFields = (
  options: {
    titleMaxLength?: number
    descriptionMaxLength?: number
    includeKeywords?: boolean
    includeImage?: boolean
    includeNoIndex?: boolean
  } = {},
): GroupField => {
  const {
    titleMaxLength = 60,
    descriptionMaxLength = 160,
    includeKeywords = true,
    includeImage = true,
    includeNoIndex = true,
  } = options

  const fields: Field[] = [
    {
      name: 'title',
      type: 'text',
      maxLength: titleMaxLength,
      admin: {
        description: `SEO title (recommended: 50-${titleMaxLength} characters)`,
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > titleMaxLength) {
          return `SEO title should be ${titleMaxLength} characters or less for optimal display`
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: descriptionMaxLength,
      admin: {
        description: `SEO description (recommended: 150-${descriptionMaxLength} characters)`,
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > descriptionMaxLength) {
          return `SEO description should be ${descriptionMaxLength} characters or less for optimal display`
        }
        return true
      },
    },
  ]

  if (includeKeywords) {
    fields.push({
      name: 'keywords',
      type: 'text',
      admin: {
        description: 'Comma-separated keywords for SEO',
      },
    })
  }

  if (includeImage) {
    fields.push({
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Social media sharing image (recommended: 1200x630px)',
      },
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    })
  }

  if (includeNoIndex) {
    fields.push({
      name: 'noIndex',
      type: 'checkbox',
      label: 'Prevent indexing',
      admin: {
        description: 'Prevent search engines from indexing this page',
      },
    })
  }

  return {
    name: 'seo',
    type: 'group',
    label: 'SEO',
    admin: {
      description: 'Search engine optimization settings',
    },
    fields,
  }
}

/**
 * Factory for creating consistent date fields with auto-population
 */
export const createDateField = (
  options: {
    name: string
    label?: string
    required?: boolean
    autoPopulate?: boolean
    condition?: string
    index?: boolean
  } = { name: 'publishedDate' },
): Field => {
  const { name, label, required = false, autoPopulate = true, condition, index = true } = options

  return {
    name,
    type: 'date',
    label,
    required,
    index,
    admin: {
      position: 'sidebar',
      description: `Date when the content was ${name.replace('Date', '').toLowerCase()}`,
      condition: condition ? (data) => data?.[condition] === 'published' : undefined,
      date: {
        pickerAppearance: 'dayAndTime',
      },
    },
    hooks: autoPopulate
      ? {
          beforeChange: [
            ({ value, siblingData, operation, req }) => {
              if (operation === 'update' && siblingData._status === 'published' && !value) {
                const now = new Date()
                req.payload.logger.info(`Auto-set ${name}: ${now.toISOString()}`)
                return now
              }
              return value
            },
          ],
        }
      : undefined,
  } as Field
}

/**
 * Factory for creating consistent tag fields
 */
export const createTagsField = (
  options: {
    name?: string
    label?: string
    maxRows?: number
    predefinedTags?: string[]
  } = {},
): ArrayField => {
  const { name = 'tags', label = 'Tags', maxRows = 20, predefinedTags } = options

  if (predefinedTags) {
    // Use select field for predefined tags
    return {
      name,
      type: 'select',
      dbName: `${name}_select`, // Dynamic naming based on field name
      label,
      hasMany: true,
      options: predefinedTags.map((tag) => ({ label: tag, value: tag.toLowerCase() })),
      admin: {
        position: 'sidebar',
        description: `Select ${label.toLowerCase()} for categorizing content`,
      },
    } as any // Type assertion needed for select with hasMany
  }

  // Use array field for free-form tags
  return {
    name,
    type: 'array',
    dbName: `${name}_array`, // Dynamic naming based on field name
    label,
    maxRows,
    admin: {
      position: 'sidebar',
      description: `Add ${label.toLowerCase()} for categorizing content (max ${maxRows})`,
    },
    fields: [
      {
        name: 'tag',
        type: 'text',
        required: true,
        maxLength: 50,
        admin: {
          description: 'Tag name (max 50 characters)',
        },
      },
    ],
  }
}

/**
 * Factory for creating consistent priority fields
 */
export const createPriorityField = (
  options: {
    levels?: Array<{ label: string; value: string }>
    defaultValue?: string
  } = {},
): SelectField => {
  const {
    levels = [
      { label: 'Low', value: 'low' },
      { label: 'Normal', value: 'normal' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' },
    ],
    defaultValue = 'normal',
  } = options

  return {
    name: 'priority',
    type: 'select',
    options: levels,
    defaultValue,
    admin: {
      position: 'sidebar',
      description: 'Priority level for content ordering',
    },
  }
}

/**
 * Factory for creating consistent featured image fields
 */
export const createFeaturedImageField = (
  options: {
    name?: string
    label?: string
    required?: boolean
    relationTo?: string
  } = {},
): Field => {
  const {
    name = 'featuredImage',
    label = 'Featured Image',
    required = false,
    relationTo = 'media',
  } = options

  return {
    name,
    type: 'upload',
    label,
    relationTo,
    required,
    admin: {
      description: 'Main image for the content',
    },
    filterOptions: {
      mimeType: { contains: 'image' },
    },
  } as Field
}

/**
 * Factory for creating consistent excerpt fields
 */
export const createExcerptField = (
  options: {
    maxLength?: number
    required?: boolean
  } = {},
): Field => {
  const { maxLength = 300, required = false } = options

  return {
    name: 'excerpt',
    type: 'textarea',
    required,
    maxLength,
    admin: {
      description: `Brief description for previews and SEO (max ${maxLength} characters)`,
    },
    validate: (value: unknown) => {
      if (value && typeof value === 'string' && value.length > maxLength) {
        return `Excerpt must be ${maxLength} characters or less`
      }
      return true
    },
  } as Field
}

// Export all factory functions
export const fieldFactories = {
  createSlugField,
  createStatusField,
  createAuthorField,
  createSEOFields,
  createDateField,
  createTagsField,
  createPriorityField,
  createFeaturedImageField,
  createExcerptField,
}
