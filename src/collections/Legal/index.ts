import type { CollectionConfig } from 'payload'

// Import hooks
import { revalidateLegal } from './hooks/revalidateLegal'
import { generateSlug } from './hooks/generateSlug'
import { auditTrail } from './hooks/auditTrail'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

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
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
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
    {
      name: 'content',
      type: 'richText',
      required: true,
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
