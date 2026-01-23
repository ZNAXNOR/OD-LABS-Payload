import type { Block } from 'payload'

// ============================================================================
// TREE-SHAKING OPTIMIZED EXPORTS
// ============================================================================

// Individual category exports for tree-shaking
export * from './Content'
export * from './cta'
export * from './Hero'
export * from './layout'
export * from './portfolio'
export * from './services'
export * from './technical'

// ============================================================================
// LAZY-LOADED BLOCK REGISTRY FOR OPTIMAL BUNDLE SPLITTING
// ============================================================================

export interface BlockCategory {
  label: string
  description: string
  blocks: () => Promise<Block[]>
}

// Lazy-loaded block categories for code splitting
export const blockCategories: Record<string, BlockCategory> = {
  hero: {
    label: 'Hero',
    description: 'Prominent header sections with multiple style variants',
    blocks: async () => {
      const { HeroBlock } = await import('./Hero/Hero/config')
      return [HeroBlock]
    },
  },
  content: {
    label: 'Content',
    description: 'General content and media blocks',
    blocks: async () => {
      const [{ ContentBlock }, { MediaBlock }, { ArchiveBlock }, { Banner }] = await Promise.all([
        import('./Content/Content/config'),
        import('./Content/MediaBlock/config'),
        import('./Content/Archive/config'),
        import('./Content/Banner/config'),
      ])
      return [ContentBlock, MediaBlock, ArchiveBlock, Banner]
    },
  },
  services: {
    label: 'Services',
    description: 'Service offerings, tech stack, and pricing blocks',
    blocks: async () => {
      // All services blocks temporarily disabled due to database relation issues
      // const [
      //   { ServicesGridBlock },
      //   { TechStackBlock },
      //   { ProcessStepsBlock },
      //   { PricingTableBlock },
      // ] = await Promise.all([
      //   import('./services/ServicesGrid/config'),
      //   import('./services/TechStack/config'),
      //   import('./services/ProcessSteps/config'),
      //   import('./services/PricingTable/config'),
      // ])
      return [
        /* ServicesGridBlock, TechStackBlock, ProcessStepsBlock, PricingTableBlock */
      ]
    },
  },
  portfolio: {
    label: 'Portfolio',
    description: 'Project showcases, case studies, and testimonials',
    blocks: async () => {
      const [
        { ProjectShowcaseBlock },
        { CaseStudyBlock },
        { BeforeAfterBlock },
        { TestimonialBlock },
      ] = await Promise.all([
        import('./portfolio/ProjectShowcase/config'),
        import('./portfolio/CaseStudy/config'),
        import('./portfolio/BeforeAfter/config'),
        import('./portfolio/Testimonial/config'),
      ])
      return [ProjectShowcaseBlock, CaseStudyBlock, BeforeAfterBlock, TestimonialBlock]
    },
  },
  technical: {
    label: 'Technical',
    description: 'Code, features, stats, and technical content',
    blocks: async () => {
      const [
        { Code },
        { FeatureGridBlock },
        { StatsCounterBlock },
        { FAQAccordionBlock },
        { TimelineBlock },
      ] = await Promise.all([
        import('./technical/Code/config'),
        import('./technical/FeatureGrid/config'),
        import('./technical/StatsCounter/config'),
        import('./technical/FAQAccordion/config'),
        import('./technical/Timeline/config'),
      ])
      return [Code, FeatureGridBlock, StatsCounterBlock, FAQAccordionBlock, TimelineBlock]
    },
  },
  cta: {
    label: 'CTA & Conversion',
    description: 'Call-to-action and lead generation blocks',
    blocks: async () => {
      const [
        { CallToActionBlock },
        { ContactFormBlock },
        { NewsletterBlock },
        { SocialProofBlock },
      ] = await Promise.all([
        import('./cta/CallToAction/config'),
        import('./cta/ContactForm/config'),
        import('./cta/Newsletter/config'),
        import('./cta/SocialProof/config'),
      ])
      return [CallToActionBlock, ContactFormBlock, NewsletterBlock, SocialProofBlock]
    },
  },
  layout: {
    label: 'Layout',
    description: 'Structural elements and spacing controls',
    blocks: async () => {
      const [{ ContainerBlock }, { DividerBlock }, { SpacerBlock }] = await Promise.all([
        import('./layout/Container/config'),
        import('./layout/Divider/config'),
        import('./layout/Spacer/config'),
      ])
      return [ContainerBlock, DividerBlock, SpacerBlock]
    },
  },
}

// Block registry for easy access and validation
export const blockRegistry = {
  // Hero
  hero: 'hero',

  // Content
  content: 'content',
  mediaBlock: 'mediaBlock',
  archive: 'archive',
  banner: 'banner',

  // Services
  servicesGrid: 'servicesGrid',
  techStack: 'techStack',
  processSteps: 'processSteps',
  pricingTable: 'pricingTable',

  // Portfolio
  projectShowcase: 'projectShowcase',
  caseStudy: 'caseStudy',
  beforeAfter: 'beforeAfter',
  testimonial: 'testimonial',

  // Technical
  code: 'code',
  featureGrid: 'featureGrid',
  statsCounter: 'statsCounter',
  faqAccordion: 'faqAccordion',
  timeline: 'timeline',

  // CTA
  cta: 'cta',
  contactForm: 'contactForm',
  newsletter: 'newsletter',
  socialProof: 'socialProof',

  // Layout
  container: 'container',
  divider: 'divider',
  spacer: 'spacer',
} as const

export type BlockSlug = (typeof blockRegistry)[keyof typeof blockRegistry]

// ============================================================================
// TREE-SHAKING OPTIMIZED HELPER FUNCTIONS
// ============================================================================

// Lazy-loaded all blocks array for when needed
export async function getAllBlocks(): Promise<Block[]> {
  const categoryPromises = Object.values(blockCategories).map((category) => category.blocks())
  const categoryBlocks = await Promise.all(categoryPromises)
  return categoryBlocks.flat()
}

// Helper function to get block by slug (lazy-loaded)
export async function getBlockBySlug(slug: BlockSlug): Promise<Block | undefined> {
  const allBlocks = await getAllBlocks()
  return allBlocks.find((block) => block.slug === slug)
}

// Helper function to get blocks by category (lazy-loaded)
export async function getBlocksByCategory(
  category: keyof typeof blockCategories,
): Promise<Block[]> {
  const categoryConfig = blockCategories[category]
  return categoryConfig ? await categoryConfig.blocks() : []
}

// Helper to validate if a slug is a valid block
export function isValidBlockSlug(slug: string): slug is BlockSlug {
  return Object.values(blockRegistry).includes(slug as BlockSlug)
}

// Helper to get category for a block slug
export function getCategoryForBlock(slug: BlockSlug): string | undefined {
  // This is synchronous since we only need to check the registry
  for (const [categoryKey] of Object.entries(blockCategories)) {
    // We can't check blocks here without loading them, so we use a mapping
    const categoryBlocks = getCategoryBlockSlugs(categoryKey)
    if (categoryBlocks.includes(slug)) {
      return categoryKey
    }
  }
  return undefined
}

// Helper to get block slugs for a category without loading blocks
function getCategoryBlockSlugs(category: string): BlockSlug[] {
  const categoryMap: Record<string, BlockSlug[]> = {
    hero: ['hero'],
    content: ['content', 'mediaBlock', 'archive', 'banner'],
    services: ['servicesGrid', 'techStack', 'processSteps', 'pricingTable'],
    portfolio: ['projectShowcase', 'caseStudy', 'beforeAfter', 'testimonial'],
    technical: ['code', 'featureGrid', 'statsCounter', 'faqAccordion', 'timeline'],
    cta: ['cta', 'contactForm', 'newsletter', 'socialProof'],
    layout: ['container', 'divider', 'spacer'],
  }
  return categoryMap[category] || []
}

// ============================================================================
// TREE-SHAKING FRIENDLY CATEGORY LOADERS
// ============================================================================

// Individual category loaders for optimal tree-shaking
export const loadHeroBlocks = () => blockCategories.hero?.blocks() || Promise.resolve([])
export const loadContentBlocks = () => blockCategories.content?.blocks() || Promise.resolve([])
export const loadServicesBlocks = () => blockCategories.services?.blocks() || Promise.resolve([])
export const loadPortfolioBlocks = () => blockCategories.portfolio?.blocks() || Promise.resolve([])
export const loadTechnicalBlocks = () => blockCategories.technical?.blocks() || Promise.resolve([])
export const loadCtaBlocks = () => blockCategories.cta?.blocks() || Promise.resolve([])
export const loadLayoutBlocks = () => blockCategories.layout?.blocks() || Promise.resolve([])
