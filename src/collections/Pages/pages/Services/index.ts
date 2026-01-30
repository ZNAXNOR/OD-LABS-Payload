import type { CollectionConfig } from 'payload'

// Import blocks
import { ArchiveBlock } from '@/blocks/Archive/config'
import { Banner } from '@/blocks/Banner/config'
import { CallToActionBlock } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'
import { ContentBlock } from '@/blocks/Content/config'
import { HeroBlock } from '@/blocks/Hero/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

// Services blocks
import { ServicesGridBlock } from '@/blocks/services/ServicesGrid/config'
import { TechStackBlock } from '@/blocks/services/TechStack/config'
import { ProcessStepsBlock } from '@/blocks/services/ProcessSteps/config'
import { PricingTableBlock } from '@/blocks/services/PricingTable/config'

// Import portfolio blocks
import { BeforeAfterBlock } from '@/blocks/portfolio/BeforeAfter/config'
import { CaseStudyBlock } from '@/blocks/portfolio/CaseStudy/config'
import { ProjectShowcaseBlock } from '@/blocks/portfolio/ProjectShowcase/config'
import { TestimonialBlock } from '@/blocks/portfolio/Testimonial/config'

// Import technical blocks
import { FAQAccordionBlock } from '@/blocks/technical/FAQAccordion/config'
import { FeatureGridBlock } from '@/blocks/technical/FeatureGrid/config'
import { StatsCounterBlock } from '@/blocks/technical/StatsCounter/config'
import { TimelineBlock } from '@/blocks/technical/Timeline/config'

// Import CTA blocks
import { ContactFormBlock } from '@/blocks/cta/ContactForm/config'
import { NewsletterBlock } from '@/blocks/cta/Newsletter/config'
import { SocialProofBlock } from '@/blocks/cta/SocialProof/config'

// Import layout blocks
import { ContainerBlock } from '@/blocks/layout/Container/config'
import { DividerBlock } from '@/blocks/layout/Divider/config'
import { SpacerBlock } from '@/blocks/layout/Spacer/config'

// Import utilities
import { createSlugGenerationHook, validateSlugFormat } from '@/utilities/slugGeneration'

// Import shared hooks
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'

// Import shared fields
import { auditFields } from '@/pages/shared/fields/auditFields'

// Import hooks
import { revalidateService } from './hooks/revalidateService'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import live preview utilities
import { generateServicesPagesPreviewUrl } from '@/utilities/livePreview'

export const ServicesPages: CollectionConfig = {
  slug: 'services',
  dbName: 'services', // Explicit database naming
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
    livePreview: {
      url: ({ data, locale }) => {
        console.log('[Services Live Preview] URL generation called with:', { data, locale })
        return generateServicesPagesPreviewUrl(data, locale)
      },
    },
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  timestamps: true, // Enable Payload's built-in timestamp management
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
      createSlugGenerationHook('services', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [revalidateService],
  },
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
    // Tab structure - must come BEFORE sidebar fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          description: 'Optional hero section for the service page',
          fields: [
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Block',
              blocks: [HeroBlock],
              maxRows: 1,
              admin: {
                description:
                  'Add an optional hero section at the top of your service page. Leave empty for no hero.',
              },
            },
          ],
        },
        {
          label: 'Content',
          description: 'Service description with embedded blocks',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Service Layout',
              blocks: [
                // Content blocks
                ContentBlock,
                CallToActionBlock,
                MediaBlock,
                ArchiveBlock,
                Banner,
                Code,
                // Services blocks
                ServicesGridBlock,
                TechStackBlock,
                ProcessStepsBlock,
                PricingTableBlock,
                // Portfolio blocks
                ProjectShowcaseBlock,
                CaseStudyBlock,
                BeforeAfterBlock,
                TestimonialBlock,
                // Technical blocks
                FeatureGridBlock,
                StatsCounterBlock,
                FAQAccordionBlock,
                TimelineBlock,
                // CTA blocks
                ContactFormBlock,
                NewsletterBlock,
                SocialProofBlock,
                // Layout blocks
                ContainerBlock,
                DividerBlock,
                SpacerBlock,
              ],
              admin: {
                description: 'Build your service page layout using content blocks',
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
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Author of this service page (defaults to current user)',
      },
      hooks: {
        beforeChange: [
          ({ value, req, operation }) => {
            // Auto-populate on create if not provided
            if (operation === 'create' && !value && req.user) {
              req.payload.logger.info(`Auto-populated author: ${req.user.id}`)
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'serviceType',
      type: 'select',
      dbName: 'svc_type', // Abbreviation for service type
      options: [
        { label: 'Web Development', value: 'web-dev' },
        { label: 'Mobile Development', value: 'mobile-dev' },
        { label: 'UI/UX Design', value: 'design' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Maintenance & Support', value: 'support' },
        { label: 'Digital Marketing', value: 'marketing' },
        { label: 'Other', value: 'other' },
      ],
      index: true, // Index for filtering by service type
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true, // Index for filtering featured services
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
          dbName: 'currency', // Keep short name
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
          dbName: 'pricing_model', // Snake case for database
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
    // Audit trail fields (auto-populated, read-only)
    ...auditFields,
  ],
}
