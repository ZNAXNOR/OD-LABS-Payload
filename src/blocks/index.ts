import type { Block } from 'payload'

// ============================================================================
// HERO BLOCKS
// ============================================================================
export { HeroBlock } from './Hero/config'

// ============================================================================
// CONTENT BLOCKS
// ============================================================================
export { ContentBlock } from './Content/config'
export { MediaBlock } from './MediaBlock/config'
export { ArchiveBlock } from './Archive/config'
export { Banner } from './Banner/config'

// ============================================================================
// SERVICES BLOCKS
// Technical service and offering presentation blocks
// ============================================================================
export { ServicesGridBlock } from './services/ServicesGrid/config'
export { TechStackBlock } from './services/TechStack/config'
export { ProcessStepsBlock } from './services/ProcessSteps/config'
export { PricingTableBlock } from './services/PricingTable/config'

// ============================================================================
// PORTFOLIO BLOCKS
// Project showcase and case study blocks
// ============================================================================
export { ProjectShowcaseBlock } from './portfolio/ProjectShowcase/config'
export { CaseStudyBlock } from './portfolio/CaseStudy/config'
export { BeforeAfterBlock } from './portfolio/BeforeAfter/config'
export { TestimonialBlock } from './portfolio/Testimonial/config'

// ============================================================================
// TECHNICAL CONTENT BLOCKS
// Code, features, stats, and technical documentation blocks
// ============================================================================
export { Code } from './Code/config'
export { FeatureGridBlock } from './technical/FeatureGrid/config'
export { StatsCounterBlock } from './technical/StatsCounter/config'
export { FAQAccordionBlock } from './technical/FAQAccordion/config'
export { TimelineBlock } from './technical/Timeline/config'

// ============================================================================
// CTA & CONVERSION BLOCKS
// Call-to-action and lead generation blocks
// ============================================================================
export { CallToActionBlock } from './CallToAction/config'
export { ContactFormBlock } from './cta/ContactForm/config'
export { NewsletterBlock } from './cta/Newsletter/config'
export { SocialProofBlock } from './cta/SocialProof/config'

// ============================================================================
// LAYOUT BLOCKS
// Structural and spacing blocks
// ============================================================================
export { ContainerBlock } from './layout/Container/config'
export { DividerBlock } from './layout/Divider/config'
export { SpacerBlock } from './layout/Spacer/config'

// ============================================================================
// BLOCK REGISTRY
// Organized collection of all available blocks by category
// ============================================================================

export interface BlockCategory {
  label: string
  description: string
  blocks: Block[]
}

export const blockCategories: Record<string, BlockCategory> = {
  hero: {
    label: 'Hero',
    description: 'Prominent header sections with multiple style variants',
    blocks: [],
  },
  content: {
    label: 'Content',
    description: 'General content and media blocks',
    blocks: [],
  },
  services: {
    label: 'Services',
    description: 'Service offerings, tech stack, and pricing blocks',
    blocks: [],
  },
  portfolio: {
    label: 'Portfolio',
    description: 'Project showcases, case studies, and testimonials',
    blocks: [],
  },
  technical: {
    label: 'Technical',
    description: 'Code, features, stats, and technical content',
    blocks: [],
  },
  cta: {
    label: 'CTA & Conversion',
    description: 'Call-to-action and lead generation blocks',
    blocks: [],
  },
  layout: {
    label: 'Layout',
    description: 'Structural elements and spacing controls',
    blocks: [],
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

// Export all block type definitions
export * from './types'

// Helper function to get block by slug
export function getBlockBySlug(slug: BlockSlug): Block | undefined {
  // This would need to be implemented based on your block imports
  // For now, it's a placeholder for type safety
  return undefined
}

// Helper function to get blocks by category
export function getBlocksByCategory(category: keyof typeof blockCategories): Block[] {
  return blockCategories[category]?.blocks || []
}

// Helper to validate if a slug is a valid block
export function isValidBlockSlug(slug: string): slug is BlockSlug {
  return Object.values(blockRegistry).includes(slug as BlockSlug)
}
