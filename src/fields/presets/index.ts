// Field configuration presets for common use cases
import type { Field } from 'payload'
import { fieldFactories } from '../factories'
import { fieldValidators } from '../validation'

/**
 * Standard page field preset
 */
export const pageFieldPreset: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Content',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 200,
            admin: {
              description: 'The main title of the page (1-200 characters)',
            },
            validate: fieldValidators.createLengthValidator({ min: 1, max: 200 }),
          },
          fieldFactories.createExcerptField({ maxLength: 300 }),
          {
            name: 'content',
            type: 'richText',
            required: true,
            admin: {
              description: 'Main page content',
            },
          },
        ],
      },
      {
        label: 'SEO',
        fields: [
          fieldFactories.createSEOFields({
            titleMaxLength: 60,
            descriptionMaxLength: 160,
            includeKeywords: true,
            includeImage: true,
            includeNoIndex: true,
          }),
        ],
      },
    ],
  },
  // Sidebar fields
  fieldFactories.createSlugField({ sourceField: 'title', maxLength: 100 }),
  fieldFactories.createStatusField(),
  fieldFactories.createAuthorField({ autoPopulate: true }),
  fieldFactories.createDateField({ name: 'publishedDate', autoPopulate: true }),
  fieldFactories.createFeaturedImageField(),
  fieldFactories.createTagsField({ maxRows: 10 }),
]

/**
 * Blog post field preset
 */
export const blogFieldPreset: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Content',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 200,
            admin: {
              description: 'The main title of the blog post (1-200 characters)',
            },
            validate: fieldValidators.createLengthValidator({ min: 1, max: 200 }),
          },
          fieldFactories.createExcerptField({ maxLength: 300, required: false }),
          {
            name: 'content',
            type: 'richText',
            required: true,
            admin: {
              description: 'Main blog post content',
            },
          },
        ],
      },
      {
        label: 'SEO',
        fields: [
          fieldFactories.createSEOFields({
            titleMaxLength: 60,
            descriptionMaxLength: 160,
            includeKeywords: true,
            includeImage: true,
            includeNoIndex: true,
          }),
        ],
      },
    ],
  },
  // Sidebar fields
  fieldFactories.createSlugField({ sourceField: 'title', maxLength: 100 }),
  fieldFactories.createStatusField(),
  fieldFactories.createAuthorField({ autoPopulate: true }),
  fieldFactories.createDateField({ name: 'publishedDate', autoPopulate: true }),
  fieldFactories.createFeaturedImageField(),
  {
    name: 'categories',
    type: 'select',
    hasMany: true,
    options: [
      { label: 'Technology', value: 'technology' },
      { label: 'Business', value: 'business' },
      { label: 'Design', value: 'design' },
      { label: 'Development', value: 'development' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'News', value: 'news' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Blog post categories',
    },
  } as Field,
  fieldFactories.createTagsField({ maxRows: 15 }),
  {
    name: 'readingTime',
    type: 'number',
    admin: {
      position: 'sidebar',
      description: 'Estimated reading time in minutes (auto-calculated)',
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
]

/**
 * Service page field preset
 */
export const serviceFieldPreset: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Service Details',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 200,
            admin: {
              description: 'Service name (1-200 characters)',
            },
            validate: fieldValidators.createLengthValidator({ min: 1, max: 200 }),
          },
          fieldFactories.createExcerptField({ maxLength: 300 }),
          {
            name: 'description',
            type: 'richText',
            required: true,
            admin: {
              description: 'Detailed service description',
            },
          },
          {
            name: 'pricing',
            type: 'group',
            admin: {
              description: 'Service pricing information',
            },
            fields: [
              {
                name: 'startingPrice',
                type: 'number',
                admin: {
                  description: 'Starting price (optional)',
                },
                validate: fieldValidators.validatePositiveNumber,
              },
              {
                name: 'currency',
                type: 'select',
                dbName: 'price_currency', // Prefixed to avoid conflicts
                options: [
                  { label: 'USD ($)', value: 'USD' },
                  { label: 'EUR (€)', value: 'EUR' },
                  { label: 'GBP (£)', value: 'GBP' },
                ],
                defaultValue: 'USD',
              },
              {
                name: 'pricingModel',
                type: 'select',
                dbName: 'pricing_model', // Snake case conversion
                options: [
                  { label: 'Fixed Price', value: 'fixed' },
                  { label: 'Hourly Rate', value: 'hourly' },
                  { label: 'Project-based', value: 'project' },
                  { label: 'Subscription', value: 'subscription' },
                  { label: 'Custom Quote', value: 'custom' },
                ],
                defaultValue: 'fixed',
              },
            ],
          },
        ],
      },
      {
        label: 'Features',
        fields: [
          {
            name: 'features',
            type: 'array',
            dbName: 'service_features', // Explicit database naming
            admin: {
              description: 'Service features and benefits',
            },
            fields: [
              {
                name: 'feature',
                type: 'text',
                required: true,
                admin: {
                  description: 'Feature description',
                },
              },
              {
                name: 'included',
                type: 'checkbox',
                defaultValue: true,
                admin: {
                  description: 'Is this feature included?',
                },
              },
            ],
          },
        ],
      },
      {
        label: 'SEO',
        fields: [
          fieldFactories.createSEOFields({
            titleMaxLength: 60,
            descriptionMaxLength: 160,
            includeKeywords: true,
            includeImage: true,
            includeNoIndex: true,
          }),
        ],
      },
    ],
  },
  // Sidebar fields
  fieldFactories.createSlugField({ sourceField: 'title', maxLength: 100 }),
  fieldFactories.createStatusField(),
  fieldFactories.createFeaturedImageField(),
  {
    name: 'serviceCategory',
    type: 'select',
    options: [
      { label: 'Web Development', value: 'web-development' },
      { label: 'Mobile Development', value: 'mobile-development' },
      { label: 'Design', value: 'design' },
      { label: 'Consulting', value: 'consulting' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Other', value: 'other' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Service category',
    },
  } as Field,
  fieldFactories.createPriorityField(),
]

/**
 * Contact form field preset
 */
export const contactFormPreset: Field[] = [
  {
    name: 'name',
    type: 'text',
    required: true,
    admin: {
      description: 'Full name',
    },
    validate: fieldValidators.createLengthValidator({ min: 2, max: 100 }),
  },
  {
    name: 'email',
    type: 'email',
    required: true,
    admin: {
      description: 'Email address',
    },
    validate: fieldValidators.validateEmail,
  },
  {
    name: 'phone',
    type: 'text',
    admin: {
      description: 'Phone number (optional)',
    },
    validate: fieldValidators.validatePhone,
  },
  {
    name: 'company',
    type: 'text',
    admin: {
      description: 'Company name (optional)',
    },
  },
  {
    name: 'subject',
    type: 'text',
    required: true,
    admin: {
      description: 'Message subject',
    },
    validate: fieldValidators.createLengthValidator({ min: 5, max: 200 }),
  },
  {
    name: 'message',
    type: 'textarea',
    required: true,
    admin: {
      description: 'Message content',
    },
    validate: fieldValidators.createLengthValidator({ min: 10, max: 2000 }),
  },
  {
    name: 'inquiryType',
    type: 'select',
    options: [
      { label: 'General Inquiry', value: 'general' },
      { label: 'Project Quote', value: 'quote' },
      { label: 'Support', value: 'support' },
      { label: 'Partnership', value: 'partnership' },
      { label: 'Other', value: 'other' },
    ],
    defaultValue: 'general',
    admin: {
      description: 'Type of inquiry',
    },
  } as Field,
]

/**
 * Media upload field preset
 */
export const mediaFieldPreset: Field[] = [
  {
    name: 'alt',
    type: 'text',
    required: true,
    admin: {
      description: 'Alt text is required for accessibility compliance',
    },
    validate: fieldValidators.createLengthValidator({ min: 1, max: 200 }),
  },
  {
    name: 'caption',
    type: 'textarea',
    admin: {
      description: 'Optional caption for the media',
    },
    validate: fieldValidators.createLengthValidator({ max: 500 }),
  },
  {
    name: 'copyright',
    type: 'text',
    admin: {
      description: 'Copyright information',
    },
  },
  {
    name: 'photographer',
    type: 'text',
    admin: {
      description: 'Photographer or creator credit',
    },
  },
  {
    name: 'tags',
    type: 'select',
    hasMany: true,
    options: [
      { label: 'Hero Image', value: 'hero' },
      { label: 'Blog Image', value: 'blog' },
      { label: 'Product Image', value: 'product' },
      { label: 'Team Photo', value: 'team' },
      { label: 'Logo', value: 'logo' },
      { label: 'Icon', value: 'icon' },
      { label: 'Background', value: 'background' },
    ],
    admin: {
      description: 'Media tags for organization',
    },
  } as Field,
]

// Export all presets
export const fieldPresets = {
  pageFieldPreset,
  blogFieldPreset,
  serviceFieldPreset,
  contactFormPreset,
  mediaFieldPreset,
}
