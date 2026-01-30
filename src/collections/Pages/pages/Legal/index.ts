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
          description: 'Optional hero section for the legal page',
          fields: [
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Block',
              blocks: [HeroBlock],
              maxRows: 1,
              admin: {
                description:
                  'Add an optional hero section at the top of your legal page. Leave empty for no hero.',
              },
            },
          ],
        },
        {
          label: 'Content',
          description: 'Legal document content with embedded blocks',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Legal Document Layout',
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
                description: 'Build your legal document layout using content blocks',
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
