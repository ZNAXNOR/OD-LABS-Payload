import type { PageCollectionBlocks } from './types'

// ============================================================================
// HERO BLOCKS
// ============================================================================
import { HeroBlock } from '@/blocks/Hero/config'

// ============================================================================
// CONTENT BLOCKS
// ============================================================================
import { ContentBlock } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { ArchiveBlock } from '@/blocks/Archive/config'
import { Banner } from '@/blocks/Banner/config'

// ============================================================================
// SERVICES BLOCKS
// ============================================================================
import { ServicesGridBlock } from '@/blocks/services/ServicesGrid/config'
import { TechStackBlock } from '@/blocks/services/TechStack/config'
import { ProcessStepsBlock } from '@/blocks/services/ProcessSteps/config'
import { PricingTableBlock } from '@/blocks/services/PricingTable/config'

// ============================================================================
// PORTFOLIO BLOCKS
// ============================================================================
import { ProjectShowcaseBlock } from '@/blocks/portfolio/ProjectShowcase/config'
import { CaseStudyBlock } from '@/blocks/portfolio/CaseStudy/config'
import { BeforeAfterBlock } from '@/blocks/portfolio/BeforeAfter/config'
import { TestimonialBlock } from '@/blocks/portfolio/Testimonial/config'

// ============================================================================
// TECHNICAL BLOCKS
// ============================================================================
import { Code } from '@/blocks/Code/config'
import { FeatureGridBlock } from '@/blocks/technical/FeatureGrid/config'
import { StatsCounterBlock } from '@/blocks/technical/StatsCounter/config'
import { FAQAccordionBlock } from '@/blocks/technical/FAQAccordion/config'
import { TimelineBlock } from '@/blocks/technical/Timeline/config'

// ============================================================================
// CTA & CONVERSION BLOCKS
// ============================================================================
import { CallToActionBlock } from '@/blocks/CallToAction/config'
import { ContactFormBlock } from '@/blocks/cta/ContactForm/config'
import { NewsletterBlock } from '@/blocks/cta/Newsletter/config'
import { SocialProofBlock } from '@/blocks/cta/SocialProof/config'

// ============================================================================
// LAYOUT BLOCKS
// ============================================================================
import { ContainerBlock } from '@/blocks/layout/Container/config'
import { DividerBlock } from '@/blocks/layout/Divider/config'
import { SpacerBlock } from '@/blocks/layout/Spacer/config'

/**
 * Centralized block assignments for all page collections
 *
 * This configuration defines which blocks are available for each page collection type.
 * Each collection has a hero array (optional hero blocks) and a layout array (content blocks).
 *
 * Block Assignment Strategy:
 * - Blogs: Content-focused blocks for articles and posts
 * - Services: Service presentation blocks with pricing and tech stack
 * - Contacts: Minimal contact-focused blocks with forms
 * - Legal: Document-focused blocks for legal content
 * - Pages: All blocks for maximum flexibility
 */
export const BLOCK_ASSIGNMENTS = {
  /**
   * Blog Pages - Content-focused blocks for articles
   * Total: 14 blocks (1 hero + 13 layout)
   */
  blogs: {
    hero: [HeroBlock],
    layout: [
      // Content blocks
      ContentBlock,
      MediaBlock,
      ArchiveBlock,
      Banner,
      Code,
      // Technical blocks
      FeatureGridBlock,
      StatsCounterBlock,
      FAQAccordionBlock,
      TimelineBlock,
      // CTA blocks
      CallToActionBlock,
      NewsletterBlock,
      SocialProofBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },

  /**
   * Service Pages - Service presentation blocks
   * Total: 17 blocks (1 hero + 16 layout)
   */
  services: {
    hero: [HeroBlock],
    layout: [
      // Content blocks
      ContentBlock,
      MediaBlock,
      CallToActionBlock,
      // Services blocks
      ServicesGridBlock,
      TechStackBlock,
      ProcessStepsBlock,
      PricingTableBlock,
      // Portfolio blocks (testimonial only)
      TestimonialBlock,
      // Technical blocks
      FeatureGridBlock,
      StatsCounterBlock,
      FAQAccordionBlock,
      // CTA blocks
      ContactFormBlock,
      NewsletterBlock,
      SocialProofBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },

  /**
   * Contact Pages - Minimal contact-focused blocks
   * Total: 8 blocks (1 hero + 7 layout)
   */
  contacts: {
    hero: [HeroBlock],
    layout: [
      // Content blocks
      ContentBlock,
      MediaBlock,
      // CTA blocks
      ContactFormBlock,
      SocialProofBlock,
      // Technical blocks
      FAQAccordionBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },

  /**
   * Legal Pages - Document-focused blocks
   * Total: 5 blocks (0 hero + 5 layout)
   * Note: No hero section for legal pages
   */
  legal: {
    hero: [],
    layout: [
      // Content blocks
      ContentBlock,
      Banner,
      // Technical blocks
      FAQAccordionBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },

  /**
   * General Pages - All blocks for maximum flexibility
   * Total: 27+ blocks (1 hero + 26+ layout)
   */
  pages: {
    hero: [HeroBlock],
    layout: [
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
  },
} as const

/**
 * Type representing valid page collection types
 */
export type PageCollectionType = keyof typeof BLOCK_ASSIGNMENTS

/**
 * Helper function to get blocks for a specific collection
 *
 * This function includes runtime validation to ensure all returned blocks are properly defined.
 * If any undefined or null blocks are found, it throws a descriptive error with context.
 *
 * @param collection - The page collection type
 * @returns Object containing hero and layout blocks for the collection
 * @throws {Error} If any block in the configuration is undefined or null
 *
 * @example
 * ```typescript
 * const blogBlocks = getBlocksForCollection('blogs')
 * // Returns: { hero: [HeroBlock], layout: [...] }
 * ```
 */
export function getBlocksForCollection(collection: PageCollectionType): PageCollectionBlocks {
  const blocks = BLOCK_ASSIGNMENTS[collection]

  // Validate hero blocks if they exist
  if (blocks.hero && blocks.hero.length > 0) {
    blocks.hero.forEach((block, index) => {
      if (!block) {
        throw new Error(
          `Invalid hero block at index ${index} for collection "${collection}": Block is undefined or null. ` +
            `Please check the block imports in blockAssignments.ts.`,
        )
      }
      if (!block.slug) {
        throw new Error(
          `Invalid hero block at index ${index} for collection "${collection}": Block is missing required 'slug' property. ` +
            `Block type: ${typeof block}`,
        )
      }
    })
  }

  // Validate layout blocks
  blocks.layout.forEach((block, index) => {
    if (!block) {
      throw new Error(
        `Invalid layout block at index ${index} for collection "${collection}": Block is undefined or null. ` +
          `Please check the block imports in blockAssignments.ts.`,
      )
    }
    if (!block.slug) {
      throw new Error(
        `Invalid layout block at index ${index} for collection "${collection}": Block is missing required 'slug' property. ` +
          `Block type: ${typeof block}`,
      )
    }
  })

  return {
    hero: blocks.hero ? [...blocks.hero] : undefined,
    layout: [...blocks.layout],
  }
}
