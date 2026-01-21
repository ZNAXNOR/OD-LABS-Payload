// Specialized field configurations for specific use cases
import type { Field } from 'payload'
// import { lexicalEditor } from '@payloadcms/richtext-lexical' // Commented out - not currently used
import { basicRichText, comprehensiveRichText } from '../richTextFeatures'

// Media-specific fields
export const mediaFields = {
  alt: {
    name: 'alt',
    type: 'text',
    required: true,
    admin: {
      description: 'Alt text is required for accessibility compliance',
    },
  } as Field,

  caption: {
    name: 'caption',
    type: 'richText',
    editor: basicRichText,
    admin: {
      description: 'Optional caption for the media',
    },
  } as Field,

  focalPoint: {
    name: 'focalPoint',
    type: 'point',
    admin: {
      description: 'Click to set the focal point for responsive cropping',
    },
  } as Field,

  copyright: {
    name: 'copyright',
    type: 'text',
    admin: {
      description: 'Copyright information for the media',
    },
  } as Field,

  photographer: {
    name: 'photographer',
    type: 'text',
    admin: {
      description: 'Photographer or creator credit',
    },
  } as Field,
}

// User-specific fields
export const userFields = {
  firstName: {
    name: 'firstName',
    type: 'text',
    required: true,
  } as Field,

  lastName: {
    name: 'lastName',
    type: 'text',
    required: true,
  } as Field,

  roles: {
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
    saveToJWT: true,
    access: {
      read: ({ req: { user } }) => {
        if (user?.roles?.includes('admin') || user?.roles?.includes('super-admin')) {
          return true
        }
        return true // Users can see their own roles
      },
      update: ({ req: { user } }) => {
        return user?.roles?.includes('super-admin') || false
      },
    },
  } as Field,

  lastLoginAt: {
    name: 'lastLoginAt',
    type: 'date',
    admin: {
      readOnly: true,
      position: 'sidebar',
    },
  } as Field,

  loginAttempts: {
    name: 'loginAttempts',
    type: 'number',
    defaultValue: 0,
    admin: {
      readOnly: true,
      hidden: true,
    },
    access: {
      read: ({ req: { user } }) => {
        return user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || false
      },
      update: ({ req: { user } }) => {
        return user?.roles?.includes('super-admin') || false
      },
    },
  } as Field,

  lockUntil: {
    name: 'lockUntil',
    type: 'date',
    admin: {
      readOnly: true,
      hidden: true,
    },
    access: {
      read: ({ req: { user } }) => {
        return user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || false
      },
      update: ({ req: { user } }) => {
        return user?.roles?.includes('super-admin') || false
      },
    },
  } as Field,
}

// Page-specific fields
export const pageFields = {
  content: {
    name: 'content',
    type: 'richText',
    editor: comprehensiveRichText,
    required: true,
    admin: {
      description: 'Main content of the page',
    },
  } as Field,

  excerpt: {
    name: 'excerpt',
    type: 'textarea',
    admin: {
      description: 'Brief excerpt for listings and previews',
    },
  } as Field,

  layout: {
    name: 'layout',
    type: 'blocks',
    blocks: [], // Will be populated with actual blocks
    admin: {
      description: 'Page layout using blocks',
    },
  } as Field,

  breadcrumbs: {
    name: 'breadcrumbs',
    type: 'array',
    admin: {
      description: 'Custom breadcrumb navigation',
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'url',
        type: 'text',
        required: true,
      },
    ],
  } as Field,

  parent: {
    name: 'parent',
    type: 'relationship',
    relationTo: 'pages',
    admin: {
      description: 'Parent page for hierarchical organization',
    },
  } as Field,
}

// Blog-specific fields
export const blogFields = {
  readingTime: {
    name: 'readingTime',
    type: 'number',
    admin: {
      description: 'Estimated reading time in minutes',
      readOnly: true,
    },
    hooks: {
      beforeChange: [
        ({ siblingData }) => {
          if (siblingData?.content) {
            // Rough calculation: 200 words per minute
            const wordCount = siblingData.content.toString().split(/\s+/).length
            return Math.ceil(wordCount / 200)
          }
          return 5 // Default reading time
        },
      ],
    },
  } as Field,

  publishedAt: {
    name: 'publishedAt',
    type: 'date',
    admin: {
      description: 'Publication date and time',
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
  } as Field,

  categories: {
    name: 'categories',
    type: 'text',
    hasMany: true,
    admin: {
      description: 'Blog post categories (comma-separated)',
    },
  } as Field,

  relatedPosts: {
    name: 'relatedPosts',
    type: 'relationship',
    relationTo: 'blogs',
    hasMany: true,
    maxRows: 3,
    admin: {
      description: 'Related blog posts',
    },
  } as Field,
}

// Contact form fields
export const contactFields = {
  email: {
    name: 'email',
    type: 'email',
    required: true,
    admin: {
      description: 'Contact email address',
    },
  } as Field,

  phone: {
    name: 'phone',
    type: 'text',
    admin: {
      description: 'Contact phone number',
    },
    validate: (value: string) => {
      if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number'
      }
      return true
    },
  } as Field,

  address: {
    name: 'address',
    type: 'group',
    fields: [
      {
        name: 'street',
        type: 'text',
        admin: {
          description: 'Street address',
        },
      },
      {
        name: 'city',
        type: 'text',
        admin: {
          description: 'City',
        },
      },
      {
        name: 'state',
        type: 'text',
        admin: {
          description: 'State or province',
        },
      },
      {
        name: 'postalCode',
        type: 'text',
        admin: {
          description: 'Postal or ZIP code',
        },
      },
      {
        name: 'country',
        type: 'text',
        admin: {
          description: 'Country',
        },
      },
    ],
  } as Field,

  socialMedia: {
    name: 'socialMedia',
    type: 'group',
    fields: [
      {
        name: 'website',
        type: 'text',
        admin: {
          description: 'Website URL',
        },
        validate: (value: string) => {
          if (value) {
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL'
            }
          }
          return true
        },
      },
      {
        name: 'linkedin',
        type: 'text',
        admin: {
          description: 'LinkedIn profile URL',
        },
      },
      {
        name: 'twitter',
        type: 'text',
        admin: {
          description: 'Twitter/X profile URL',
        },
      },
      {
        name: 'facebook',
        type: 'text',
        admin: {
          description: 'Facebook profile URL',
        },
      },
    ],
  } as Field,
}

// Service-specific fields
export const serviceFields = {
  price: {
    name: 'price',
    type: 'group',
    fields: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        admin: {
          description: 'Service price amount',
        },
      },
      {
        name: 'currency',
        type: 'select',
        options: [
          { label: 'USD ($)', value: 'USD' },
          { label: 'EUR (€)', value: 'EUR' },
          { label: 'GBP (£)', value: 'GBP' },
        ],
        defaultValue: 'USD',
        required: true,
      },
      {
        name: 'period',
        type: 'select',
        options: [
          { label: 'One-time', value: 'once' },
          { label: 'Per hour', value: 'hour' },
          { label: 'Per day', value: 'day' },
          { label: 'Per week', value: 'week' },
          { label: 'Per month', value: 'month' },
          { label: 'Per year', value: 'year' },
        ],
        defaultValue: 'once',
      },
    ],
  } as Field,

  duration: {
    name: 'duration',
    type: 'group',
    fields: [
      {
        name: 'value',
        type: 'number',
        required: true,
        admin: {
          description: 'Duration value',
        },
      },
      {
        name: 'unit',
        type: 'select',
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' },
          { label: 'Months', value: 'months' },
        ],
        defaultValue: 'hours',
        required: true,
      },
    ],
  } as Field,

  features: {
    name: 'features',
    type: 'array',
    fields: [
      {
        name: 'feature',
        type: 'text',
        required: true,
      },
      {
        name: 'included',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
    admin: {
      description: 'Service features and inclusions',
    },
  } as Field,
}

// Export all specialized field collections
export const specializedFields = {
  media: mediaFields,
  user: userFields,
  page: pageFields,
  blog: blogFields,
  contact: contactFields,
  service: serviceFields,
}
