import type { CollectionConfig } from 'payload'

// Import hooks
import { revalidateLegal } from './hooks/revalidateLegal'
import { generateSlug } from './hooks/generateSlug'
import { auditTrail } from './hooks/auditTrail'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import block configuration
import { getBlocksForCollection } from '@/blocks/config/blockAssignments'

// Get legal-specific blocks
const legalBlocks = getBlocksForCollection('legal')

export const LegalPages: CollectionConfig = {
  slug: 'legal',
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
    beforeValidate: [generateSlug],
    beforeChange: [auditTrail],
    afterChange: [revalidateLegal],
  },
  fields: [
    // Tab structure - must come BEFORE sidebar fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Legal document content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Layout',
          description: 'Add content blocks to build your legal page layout',
          fields: [
            {
              name: 'legacyBlockWarning',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: '@/components/LegacyBlockWarning',
                    clientProps: {
                      collectionType: 'legal',
                    },
                  },
                },
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Content Blocks',
              blocks: legalBlocks.layout,
              admin: {
                description:
                  'Build your legal page layout using document-focused blocks. Legal pages do not include hero sections.',
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
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title)',
      },
    },
    {
      name: 'documentType',
      type: 'select',
      options: [
        { label: 'Privacy Policy', value: 'privacy' },
        { label: 'Terms of Service', value: 'terms' },
        { label: 'Cookie Policy', value: 'cookies' },
        { label: 'GDPR Compliance', value: 'gdpr' },
        { label: 'Disclaimer', value: 'disclaimer' },
        { label: 'License Agreement', value: 'license' },
        { label: 'Other', value: 'other' },
      ],
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
    // Audit trail fields (hidden from admin)
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
    },
  ],
}
