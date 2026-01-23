import React from 'react'

// ============================================================================
// HERO CATEGORY
// ============================================================================
import { HeroBlock } from './hero/Hero'

// ============================================================================
// CONTENT CATEGORY
// ============================================================================
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ContentBlock } from './content/Content'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'

// ============================================================================
// SERVICES CATEGORY
// Services blocks - temporarily disabled due to database relation issues
// import { ServicesGridBlock } from './services/ServicesGrid'
// import { TechStackBlock } from './services/TechStack'
// import { ProcessStepsBlock } from './services/ProcessSteps'
// import { PricingTableBlock } from './services/PricingTable'

// ============================================================================
// PORTFOLIO CATEGORY
// ============================================================================
import { BeforeAfterBlock } from './portfolio/BeforeAfter'
import { CaseStudyBlock } from './portfolio/CaseStudy'
import { ProjectShowcaseBlock } from './portfolio/ProjectShowcase'
import { TestimonialBlock } from './portfolio/Testimonial'

// ============================================================================
// TECHNICAL CATEGORY
// ============================================================================
import { FAQAccordionBlock } from './technical/FAQAccordion'
import { FeatureGridBlock } from './technical/FeatureGrid'
import { StatsCounterBlock } from './technical/StatsCounter'
import { TimelineBlock } from './technical/Timeline'

// ============================================================================
// CTA CATEGORY
// ============================================================================
import { ContactFormBlock } from './cta/ContactForm'
import { NewsletterBlock } from './cta/Newsletter'
import { SocialProofBlock } from './cta/SocialProof'

// ============================================================================
// LAYOUT CATEGORY
// ============================================================================
import { ContainerBlock } from './layout/Container'
import { DividerBlock } from './layout/Divider'
import { SpacerBlock } from './layout/Spacer'

/**
 * Generic block type with blockType discriminator
 */
interface BaseBlock {
  blockType: string
  id?: string | null
  [key: string]: any
}

/**
 * Mapping of block types to their corresponding React components
 *
 * This mapping includes ALL block types to ensure backward compatibility.
 * Legacy blocks that are no longer available for new additions will still
 * render correctly on existing pages.
 */
const BLOCK_COMPONENTS = {
  // Hero
  hero: HeroBlock,
  // Content
  content: ContentBlock,
  mediaBlock: MediaBlock,
  banner: BannerBlock,
  code: CodeBlock,
  cta: CallToActionBlock,
  // Services - temporarily disabled due to database relation issues
  // servicesGrid: ServicesGridBlock,
  // techStack: TechStackBlock,
  // processSteps: ProcessStepsBlock,
  // pricingTable: PricingTableBlock,
  // Portfolio
  projectShowcase: ProjectShowcaseBlock,
  caseStudy: CaseStudyBlock,
  beforeAfter: BeforeAfterBlock,
  testimonial: TestimonialBlock,
  // Technical
  featureGrid: FeatureGridBlock,
  statsCounter: StatsCounterBlock,
  faqAccordion: FAQAccordionBlock,
  timeline: TimelineBlock,
  // CTA
  contactForm: ContactFormBlock,
  newsletter: NewsletterBlock,
  socialProof: SocialProofBlock,
  // Layout
  container: ContainerBlock,
  divider: DividerBlock,
  spacer: SpacerBlock,
  // Note: archive block doesn't have a component yet
  // It will trigger a warning when encountered
} as const

type BlockComponentKey = keyof typeof BLOCK_COMPONENTS

/**
 * Props for the BlockRenderer component
 */
interface BlockRendererProps {
  /**
   * Array of blocks to render
   */
  blocks: BaseBlock[]
  /**
   * Optional CSS class name to apply to the container
   */
  className?: string
}

/**
 * BlockRenderer component
 *
 * Dynamically renders blocks based on their blockType property.
 * Handles missing components gracefully by logging a warning and skipping the block.
 *
 * BACKWARD COMPATIBILITY:
 * This component renders ALL block types, including legacy blocks that may no longer
 * be available for new additions in certain collections. This ensures that existing
 * pages with legacy blocks continue to render correctly.
 *
 * @param props - Component props
 * @returns Rendered blocks or null if no blocks provided
 *
 * @example
 * ```tsx
 * <BlockRenderer blocks={page.layout} />
 * ```
 */
export function BlockRenderer({
  blocks,
  className,
}: BlockRendererProps): React.ReactElement | null {
  // Return null if no blocks provided
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const blockType = block.blockType

        // Get the component for this block type
        const Component = BLOCK_COMPONENTS[blockType as BlockComponentKey]

        // Handle missing components
        // This ensures backward compatibility - blocks without components are skipped
        // but don't break the page rendering
        if (!Component) {
          console.warn(
            `[BlockRenderer] No component found for block type: ${blockType}. ` +
              `This block will be skipped but preserved in the data.`,
          )
          return null
        }

        // Render the block component
        // Using React.createElement to avoid TypeScript inference issues
        return React.createElement(Component as React.ComponentType<any>, {
          key: `${blockType}-${index}`,
          block: block,
        })
      })}
    </div>
  )
}

export default BlockRenderer
