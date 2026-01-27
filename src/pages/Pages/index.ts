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
// import { ServicesGridBlock } from '@/blocks/services/ServicesGrid/config' // Temporarily disabled due to database relation issue
// import { TechStackBlock } from '@/blocks/services/TechStack/config' // Temporarily disabled due to database relation issue
// import { ProcessStepsBlock } from '@/blocks/services/ProcessSteps/config' // Temporarily disabled due to database relation issue
// import { PricingTableBlock } from '@/blocks/services/PricingTable/config' // Temporarily disabled due to database relation issue

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
import { createSlugGenerationHook, validateSlugFormat } from '@/utilities/slugGeneration'
import { populateBreadcrumbs } from './hooks/populateBreadcrumbs'
import { revalidatePage } from './hooks/revalidatePage'

// Import shared fields
import { auditFields } from '@/pages/shared/fields/auditFields'

// Import validation
import { createCircularReferenceValidator } from '@/pages/shared/validation/circularReference'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

// Import live preview utilities
import { generatePagesPreviewUrl } from '@/utilities/livePreview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  typescript: {
    interface: 'Page',
  },
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Pages',
    livePreview: {
      url: generatePagesPreviewUrl,
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
    maxPerDoc: 100,
  },
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('pages', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
        reservedSlugs: ['home', 'index'],
      }),
    ],
    beforeChange: [createAuditTrailHook(), populateBreadcrumbs],
    afterChange: [revalidatePage],
  },
  fields: [
    // Tab structure - must come BEFORE sidebar fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          description: 'Optional hero section for the page',
          fields: [
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Block',
              blocks: [HeroBlock],
              maxRows: 1,
              admin: {
                description:
                  'Add an optional hero section at the top of your page. Leave empty for no hero.',
              },
            },
          ],
        },
        {
          label: 'Content',
          description: 'Main page content and layout blocks',
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
              name: 'layout',
              type: 'blocks',
              label: 'Page Layout',
              blocks: [
                // Content blocks
                ContentBlock,
                CallToActionBlock,
                MediaBlock,
                ArchiveBlock,
                Banner,
                Code,
                // Services blocks
                // ServicesGridBlock, // Temporarily disabled due to database relation issue
                // TechStackBlock, // Temporarily disabled due to database relation issue
                // ProcessStepsBlock, // Temporarily disabled due to database relation issue
                // PricingTableBlock, // Temporarily disabled due to database relation issue
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
                description: 'Build your page layout using content blocks',
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description: 'Select a parent page to create a hierarchical structure',
      },
      validate: createCircularReferenceValidator('pages'),
      filterOptions: ({ id }) => {
        const filters: any = {}

        // Exclude self to prevent circular references
        if (id) {
          filters.id = { not_equals: id }
        }

        // Only show published pages as potential parents (optional)
        // filters._status = { equals: 'published' }

        return filters
      },
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      label: 'Breadcrumbs',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatically generated breadcrumb trail based on page hierarchy',
        components: {
          Cell: '@/components/BreadcrumbCell',
        },
      },
      fields: [
        {
          name: 'doc',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    // Audit trail fields (auto-populated by createAuditTrailHook)
    ...auditFields,
  ],
}
