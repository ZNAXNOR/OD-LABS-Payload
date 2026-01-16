import type { CollectionConfig } from 'payload'

// Import hooks
import { revalidateContact } from './hooks/revalidateContact'
import { generateSlug } from './hooks/generateSlug'
import { auditTrail } from './hooks/auditTrail'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import block configuration
import { getBlocksForCollection } from '@/blocks/config/blockAssignments'

// Get contact-specific blocks
const contactBlocks = getBlocksForCollection('contacts')

export const ContactPages: CollectionConfig = {
  slug: 'contacts',
  typescript: {
    interface: 'ContactPage',
  },
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Pages',
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
    afterChange: [revalidateContact],
  },
  fields: [
    // Tab structure - must come BEFORE sidebar fields
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
            },
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
        {
          label: 'Layout',
          description: 'Build your contact page layout using content blocks',
          fields: [
            {
              name: 'legacyBlockWarning',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: '@/components/LegacyBlockWarning',
                    clientProps: {
                      collectionType: 'contacts',
                    },
                  },
                },
              },
            },
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Section',
              blocks: contactBlocks.hero || [],
              maxRows: 1,
              admin: {
                description: 'Optional hero section for the contact page',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Content Blocks',
              blocks: contactBlocks.layout,
              admin: {
                description: 'Add contact-focused blocks to build your page layout',
              },
            },
          ],
        },
        {
          label: 'Contact Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'purpose',
                  type: 'select',
                  options: [
                    { label: 'General Inquiry', value: 'general' },
                    { label: 'Technical Support', value: 'technical' },
                    { label: 'Bug Report', value: 'bug' },
                    { label: 'Feature Request', value: 'feature' },
                    { label: 'Feedback', value: 'feedback' },
                    { label: 'Sales Inquiry', value: 'sales' },
                    { label: 'Partnership/Collaboration', value: 'partnership' },
                    { label: 'Media/Press', value: 'media' },
                    { label: 'Careers', value: 'careers' },
                    { label: 'Custom', value: 'custom' },
                  ],
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'form',
                  type: 'relationship',
                  relationTo: 'forms',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'displayContactInfo',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'showFormAboveContent',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'contactInfoSections',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'General Info', value: 'general' },
                { label: 'Office Locations', value: 'offices' },
                { label: 'Social Media', value: 'social' },
                { label: 'Business Hours', value: 'hours' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.displayContactInfo,
              },
            },
          ],
        },
        {
          label: 'Page Sidebar',
          description: 'Optional sidebar content for the contact page',
          fields: [
            {
              name: 'sidebar',
              type: 'group',
              fields: [
                {
                  name: 'enableSidebar',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'content',
                  type: 'richText',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enableSidebar,
                  },
                },
              ],
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
