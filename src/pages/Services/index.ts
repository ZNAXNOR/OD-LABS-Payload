import type { CollectionConfig } from 'payload'

// Import hooks
import { revalidateService } from './hooks/revalidateService'
import { generateSlug } from './hooks/generateSlug'
import { auditTrail } from './hooks/auditTrail'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const ServicesPages: CollectionConfig = {
  slug: 'services',
  typescript: {
    interface: 'ServicePage',
  },
  labels: {
    singular: 'Service Page',
    plural: 'Service Pages',
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
    afterChange: [revalidateService],
  },
  fields: [
    // Tab structure - must come BEFORE sidebar fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Service description and details',
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
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Web Development', value: 'web-dev' },
        { label: 'Mobile Development', value: 'mobile-dev' },
        { label: 'UI/UX Design', value: 'design' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Maintenance & Support', value: 'support' },
        { label: 'Digital Marketing', value: 'marketing' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this service on the homepage',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'startingPrice',
          type: 'number',
          admin: {
            description: 'Starting price for this service',
          },
        },
        {
          name: 'currency',
          type: 'select',
          options: [
            { label: 'USD ($)', value: 'USD' },
            { label: 'EUR (€)', value: 'EUR' },
            { label: 'GBP (£)', value: 'GBP' },
            { label: 'INR (₹)', value: 'INR' },
          ],
          defaultValue: 'USD',
        },
        {
          name: 'pricingModel',
          type: 'select',
          options: [
            { label: 'Fixed Price', value: 'fixed' },
            { label: 'Hourly Rate', value: 'hourly' },
            { label: 'Monthly Retainer', value: 'monthly' },
            { label: 'Custom Quote', value: 'custom' },
          ],
          defaultValue: 'custom',
        },
      ],
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
