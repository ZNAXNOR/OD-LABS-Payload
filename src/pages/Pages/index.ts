import type { CollectionConfig } from 'payload'

// Import blocks
import { HeroBlock } from '@/blocks/Hero/config'
import { ContentBlock } from '@/blocks/Content/config'
import { CallToActionBlock } from '@/blocks/CallToAction/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { ArchiveBlock } from '@/blocks/Archive/config'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'

// Import services blocks
import { ServicesGridBlock } from '@/blocks/services/ServicesGrid/config'
import { TechStackBlock } from '@/blocks/services/TechStack/config'
import { ProcessStepsBlock } from '@/blocks/services/ProcessSteps/config'
import { PricingTableBlock } from '@/blocks/services/PricingTable/config'

// Import portfolio blocks
import { ProjectShowcaseBlock } from '@/blocks/portfolio/ProjectShowcase/config'
import { CaseStudyBlock } from '@/blocks/portfolio/CaseStudy/config'
import { BeforeAfterBlock } from '@/blocks/portfolio/BeforeAfter/config'
import { TestimonialBlock } from '@/blocks/portfolio/Testimonial/config'

// Import technical blocks
import { FeatureGridBlock } from '@/blocks/technical/FeatureGrid/config'
import { StatsCounterBlock } from '@/blocks/technical/StatsCounter/config'
import { FAQAccordionBlock } from '@/blocks/technical/FAQAccordion/config'
import { TimelineBlock } from '@/blocks/technical/Timeline/config'

// Import hooks
import { revalidatePage } from './hooks/revalidatePage'
import { populateBreadcrumbs } from './hooks/populateBreadcrumbs'
import { createSlugGenerationHook } from '@/utilities/slugGeneration'

// Import access control functions
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

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
    beforeChange: [populateBreadcrumbs],
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
              admin: {
                description: 'The main title of the page',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Page Layout',
              blocks: [
                ContentBlock,
                CallToActionBlock,
                MediaBlock,
                ArchiveBlock,
                Banner,
                Code,
                ServicesGridBlock,
                TechStackBlock,
                ProcessStepsBlock,
                PricingTableBlock,
                ProjectShowcaseBlock,
                CaseStudyBlock,
                BeforeAfterBlock,
                TestimonialBlock,
                FeatureGridBlock,
                StatsCounterBlock,
                FAQAccordionBlock,
                TimelineBlock,
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
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title)',
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
      validate: (value: any, { data, siblingData }: any) => {
        // Prevent self-reference
        if (value && (value === data?.id || value === siblingData?.id)) {
          return 'A page cannot be its own parent'
        }
        return true
      },
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
          Cell: '/src/components/BreadcrumbCell',
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
  ],
}
