import { BlocksFeature } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

// Import all available blocks
import {
  ArchiveBlock,
  Banner,
  BeforeAfterBlock,
  CallToActionBlock,
  CaseStudyBlock,
  Code,
  ContactFormBlock,
  ContainerBlock,
  ContentBlock,
  DividerBlock,
  FAQAccordionBlock,
  FeatureGridBlock,
  HeroBlock,
  MediaBlock,
  NewsletterBlock,
  ProjectShowcaseBlock,
  SocialProofBlock,
  SpacerBlock,
  StatsCounterBlock,
  TestimonialBlock,
  TimelineBlock,
} from '@/blocks'

// Block categories for organization in the editor
export interface BlockCategory {
  label: string
  description: string
  blocks: Block[]
}

// All available blocks for embedding
export const allBlocks: Block[] = [
  // Hero blocks
  HeroBlock,

  // Content blocks
  ContentBlock,
  MediaBlock,
  ArchiveBlock,
  Banner,

  // Services blocks - temporarily commented out to fix type generation
  // ServicesGridBlock,
  // TechStackBlock,
  // ProcessStepsBlock,
  // PricingTableBlock,

  // Portfolio blocks
  ProjectShowcaseBlock,
  CaseStudyBlock,
  BeforeAfterBlock,
  TestimonialBlock,

  // Technical blocks
  Code,
  FeatureGridBlock,
  StatsCounterBlock,
  FAQAccordionBlock,
  TimelineBlock,

  // CTA blocks
  CallToActionBlock,
  ContactFormBlock,
  NewsletterBlock,
  SocialProofBlock,

  // Layout blocks
  ContainerBlock,
  DividerBlock,
  SpacerBlock,
]

// Blocks suitable for inline embedding (smaller, content-focused blocks)
export const inlineBlocks: Block[] = [
  MediaBlock,
  Code,
  DividerBlock,
  SpacerBlock,
  NewsletterBlock,
  SocialProofBlock,
]

// Blocks organized by category for better UX
export const blockCategories: Record<string, BlockCategory> = {
  content: {
    label: 'Content',
    description: 'General content and media blocks',
    blocks: [ContentBlock, MediaBlock, ArchiveBlock, Banner],
  },
  hero: {
    label: 'Hero',
    description: 'Prominent header sections',
    blocks: [HeroBlock],
  },
  services: {
    label: 'Services',
    description: 'Service offerings and business blocks',
    blocks: [
      /* ServicesGridBlock, TechStackBlock, ProcessStepsBlock, PricingTableBlock */
    ],
  },
  portfolio: {
    label: 'Portfolio',
    description: 'Project showcases and testimonials',
    blocks: [ProjectShowcaseBlock, CaseStudyBlock, BeforeAfterBlock, TestimonialBlock],
  },
  technical: {
    label: 'Technical',
    description: 'Code, features, and technical content',
    blocks: [Code, FeatureGridBlock, StatsCounterBlock, FAQAccordionBlock, TimelineBlock],
  },
  cta: {
    label: 'CTA & Conversion',
    description: 'Call-to-action and lead generation',
    blocks: [CallToActionBlock, ContactFormBlock, NewsletterBlock, SocialProofBlock],
  },
  layout: {
    label: 'Layout',
    description: 'Structural elements and spacing',
    blocks: [ContainerBlock, DividerBlock, SpacerBlock],
  },
}

// Configuration options for block embedding
export interface BlockEmbeddingConfig {
  // Which blocks to allow (defaults to all)
  allowedBlocks?: Block[]
  // Which blocks to allow for inline embedding
  inlineBlocks?: Block[]
  // Whether to show block categories in the UI
  showCategories?: boolean
  // Whether to enable block search
  enableSearch?: boolean
  // Whether to enable block preview
  enablePreview?: boolean
  // Whether to enable block reordering
  enableReordering?: boolean
  // Whether to enable block duplication
  enableDuplication?: boolean
  // Whether to show confirmation on block deletion
  confirmDeletion?: boolean
  // Custom block validation
  validateBlock?: (block: any) => boolean | string
}

// Default configuration
export const defaultBlockEmbeddingConfig: BlockEmbeddingConfig = {
  allowedBlocks: allBlocks,
  inlineBlocks: inlineBlocks,
  showCategories: true,
  enableSearch: true,
  enablePreview: true,
  enableReordering: true,
  enableDuplication: true,
  confirmDeletion: true,
}

// Helper function to get blocks by category
export function getBlocksByCategory(category: keyof typeof blockCategories): Block[] {
  return blockCategories[category]?.blocks || []
}

// Helper function to check if a block is inline
export function isInlineBlock(blockSlug: string): boolean {
  return inlineBlocks.some((block) => block.slug === blockSlug)
}

// Helper function to get block by slug
export function getBlockBySlug(slug: string): Block | undefined {
  return allBlocks.find((block) => block.slug === slug)
}

// Helper function to validate block data
export function validateBlockData(blockSlug: string, _data: any): boolean {
  const block = getBlockBySlug(blockSlug)
  if (!block) return false

  // Basic validation - check required fields
  // This is a simplified validation - in a real implementation,
  // you'd want to use Payload's field validation
  return true
}

// Create BlocksFeature configuration for lexical editor
export function createBlocksFeature(config: Partial<BlockEmbeddingConfig> = {}): any {
  const finalConfig = { ...defaultBlockEmbeddingConfig, ...config }

  return BlocksFeature({
    blocks: finalConfig.allowedBlocks || allBlocks,
    inlineBlocks: finalConfig.inlineBlocks || inlineBlocks,
  })
}

// Preset configurations for different use cases
export const basicBlockEmbedding = createBlocksFeature({
  allowedBlocks: [ContentBlock, MediaBlock, Code, DividerBlock],
  inlineBlocks: [MediaBlock, Code, DividerBlock],
  showCategories: false,
})

export const contentBlockEmbedding = createBlocksFeature({
  allowedBlocks: getBlocksByCategory('content').concat(
    getBlocksByCategory('technical'),
    getBlocksByCategory('layout'),
  ),
  showCategories: true,
})

export const fullBlockEmbedding = createBlocksFeature({
  allowedBlocks: allBlocks,
  inlineBlocks: inlineBlocks,
  showCategories: true,
})

// Export the main blocks feature for use in rich text editors
export const blocksFeature = createBlocksFeature()

// Block embedding field configuration
export interface BlockEmbeddingFieldConfig {
  name?: string
  label?: string
  required?: boolean
  config?: Partial<BlockEmbeddingConfig>
}

// Helper to create a block embedding field
export function blockEmbeddingField(options: BlockEmbeddingFieldConfig = {}) {
  const {
    name = 'embeddedBlocks',
    label = 'Embedded Blocks',
    required = false,
    config = {},
  } = options

  return {
    name,
    type: 'blocks' as const,
    label,
    required,
    blocks: config.allowedBlocks || allBlocks,
    admin: {
      description: 'Add blocks to embed within this content',
      initCollapsed: false,
    },
  }
}

// Export types for TypeScript support
// Types are already exported above as interfaces
