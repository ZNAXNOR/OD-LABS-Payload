export { HeroBlock, default as HeroBlockDefault } from './hero/Hero'

// Services Blocks
// Services blocks - temporarily disabled due to database relation issues
// export { ServicesGridBlock } from './services/ServicesGrid'
// export { default as ServicesGridBlockDefault } from './services/ServicesGrid'
// export { TechStackBlock } from './services/TechStack'
// export { default as TechStackBlockDefault } from './services/TechStack'
// export { ProcessStepsBlock } from './services/ProcessSteps'
// export { default as ProcessStepsBlockDefault } from './services/ProcessSteps'
// export { PricingTableBlock } from './services/PricingTable'
// export { default as PricingTableBlockDefault } from './services/PricingTable'

// Portfolio Blocks
export { BeforeAfterBlock, default as BeforeAfterBlockDefault } from './portfolio/BeforeAfter'
export { CaseStudyBlock, default as CaseStudyBlockDefault } from './portfolio/CaseStudy'
export {
  ProjectShowcaseBlock,
  default as ProjectShowcaseBlockDefault,
} from './portfolio/ProjectShowcase'
export { TestimonialBlock, default as TestimonialBlockDefault } from './portfolio/Testimonial'

// Technical Blocks
export {
  FAQAccordionBlock,
  FAQAccordionBlock as FAQAccordionBlockDefault,
} from './technical/FAQAccordion'
export {
  FeatureGridBlock,
  FeatureGridBlock as FeatureGridBlockDefault,
} from './technical/FeatureGrid'
export {
  StatsCounterBlock,
  StatsCounterBlock as StatsCounterBlockDefault,
} from './technical/StatsCounter'
export { TimelineBlock, TimelineBlock as TimelineBlockDefault } from './technical/Timeline'

// CTA Blocks
export { ContactFormBlock, ContactFormBlock as ContactFormBlockDefault } from './cta/ContactForm'
export { NewsletterBlock, NewsletterBlock as NewsletterBlockDefault } from './cta/Newsletter'
export { SocialProofBlock, SocialProofBlock as SocialProofBlockDefault } from './cta/SocialProof'

// Layout Blocks
export { ContentBlock, default as ContentBlockDefault } from './content/Content'
export { ContainerBlock, default as ContainerBlockDefault } from './layout/Container'
export { DividerBlock, default as DividerBlockDefault } from './layout/Divider'
export { SpacerBlock, default as SpacerBlockDefault } from './layout/Spacer'

// Category-based exports for tree-shaking
export const blockCategories = {
  hero: () => import('./hero/Hero'),
  services: {
    ServicesGrid: () => import('./services/ServicesGrid'),
    TechStack: () => import('./services/TechStack'),
    ProcessSteps: () => import('./services/ProcessSteps'),
    PricingTable: () => import('./services/PricingTable'),
  },
  portfolio: {
    ProjectShowcase: () => import('./portfolio/ProjectShowcase'),
    CaseStudy: () => import('./portfolio/CaseStudy'),
    BeforeAfter: () => import('./portfolio/BeforeAfter'),
    Testimonial: () => import('./portfolio/Testimonial'),
  },
  technical: {
    FeatureGrid: () => import('./technical/FeatureGrid'),
    StatsCounter: () => import('./technical/StatsCounter'),
    FAQAccordion: () => import('./technical/FAQAccordion'),
    Timeline: () => import('./technical/Timeline'),
  },
  cta: {
    ContactForm: () => import('./cta/ContactForm'),
    Newsletter: () => import('./cta/Newsletter'),
    SocialProof: () => import('./cta/SocialProof'),
  },
  content: () => import('./content/Content'),
  layout: {
    Container: () => import('./layout/Container'),
    Divider: () => import('./layout/Divider'),
    Spacer: () => import('./layout/Spacer'),
  },
} as const

// Type definitions
export type BlockCategory = keyof typeof blockCategories
