import type { CollectionConfig } from 'payload'

// Import shared utilities and hooks
import { auditFields } from '@/pages/shared/fields/auditFields'
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'
import { createSlugGenerationHook, validateSlugFormat } from '@/utilities/slugGeneration'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import live preview utilities
import { generateLegalPagesPreviewUrl } from '@/utilities/livePreview'

// Import rich text features
import { standardRichText } from '@/fields/richTextFeatures'

export const LegalPages: CollectionConfig = {
  slug: 'legal',
  dbName: 'legal', // Explicit database naming
  timestamps: true, // Enable Payload's built-in timestamp management
  typescript: {
    interface: 'LegalPage',
  },
  labels: {
    singular: 'Legal Page',
    plural: 'Legal Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Pages',
    livePreview: {
      url: generateLegalPagesPreviewUrl,
    },
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('legal', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('legal')],
  },
  fields: [
    // Tab structure - must come BEFORE sidebar fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Legal document content with embedded blocks',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              minLength: 1,
              maxLength: 200,
              admin: {
                description: 'The main title of the legal document (1-200 characters)',
              },
              validate: (value: unknown) => {
                if (!value || typeof value !== 'string') {
                  return 'Title is required'
                }
                if (value.trim().length === 0) {
                  return 'Title cannot be empty or only whitespace'
                }
                if (value.length > 200) {
                  return 'Title must be 200 characters or less'
                }
                return true
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description: 'Legal document content with embedded blocks for enhanced formatting',
              },
              editor: standardRichText,
              validate: (value: unknown) => {
                if (!value) {
                  return 'Content is required for legal documents'
                }
                return true
              },
            },
          ],
        },
        // SEO tab is automatically added by the SEO plugin with tabbedUI: true
      ],
    },
    // Sidebar fields - must come AFTER tabs
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      maxLength: 100,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title, max 100 characters)',
      },
      validate: (value: unknown) => {
        if (!value) return true // Let required handle empty values

        if (typeof value !== 'string') {
          return 'Slug must be a string'
        }

        if (value.length > 100) {
          return 'Slug must be 100 characters or less'
        }

        const validation = validateSlugFormat(value)
        if (!validation.isValid) {
          return validation.errors.join(', ')
        }

        return true
      },
    },
    {
      name: 'documentType',
      type: 'select',
      dbName: 'doc_type', // Abbreviation for document type
      options: [
        { label: 'Privacy Policy', value: 'privacy' },
        { label: 'Terms of Service', value: 'terms' },
        { label: 'Cookie Policy', value: 'cookies' },
        { label: 'GDPR Compliance', value: 'gdpr' },
        { label: 'Disclaimer', value: 'disclaimer' },
        { label: 'License Agreement', value: 'license' },
        { label: 'Other', value: 'other' },
      ],
      index: true, // Add index for performance on filtered queries
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'effectiveDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When this legal document becomes effective',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Last modification date of this document',
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            // Auto-update lastUpdated on any change
            if (operation === 'update') {
              return new Date()
            }
            return undefined
          },
        ],
      },
    },
    // Spread shared audit trail fields with proper access control
    ...auditFields,
  ],
}
