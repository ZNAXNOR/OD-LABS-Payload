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

// Import hooks
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'
import { validateSlugFormat } from '@/utilities/slugGeneration'
import { generateSlug } from './hooks/generateSlug'

// Import shared fields
import { auditFields } from '@/pages/shared/fields/auditFields'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import live preview utilities
import { generateContactPagesPreviewUrl } from '@/utilities/livePreview'

// Import rich text features
import { minimalRichText } from '@/fields/richTextFeatures'

export const ContactPages: CollectionConfig = {
  slug: 'contacts',
  dbName: 'contacts', // Explicit database naming
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
    livePreview: {
      url: generateContactPagesPreviewUrl,
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
    beforeValidate: [generateSlug],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('contacts')],
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
          description: 'Optional hero section for the contact page',
          fields: [
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Block',
              blocks: [HeroBlock],
              maxRows: 1,
              admin: {
                description:
                  'Add an optional hero section at the top of your contact page. Leave empty for no hero.',
              },
            },
          ],
        },
        {
          label: 'Content',
          description: 'Contact page content with embedded blocks',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Contact Page Layout',
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
                description: 'Build your contact page layout using content blocks',
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
                  dbName: 'purpose', // Keep short name
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
                  admin: {
                    width: '50%',
                    description: 'Select the purpose of this contact page',
                  },
                  validate: (value: unknown) => {
                    if (!value) {
                      return 'Purpose is required - please select the type of contact page'
                    }
                    return true
                  },
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
                    description: 'Sidebar content with enhanced formatting options',
                  },
                  editor: minimalRichText,
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
        description: 'Author of this contact page (defaults to current user)',
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
    // Audit trail fields with proper access control
    ...auditFields,
  ],
}
