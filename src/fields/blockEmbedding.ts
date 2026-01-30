// Note: BlocksFeature is not currently used in rich text configurations
// This file contains block definitions for regular block fields (type: 'blocks')
// not for embedding blocks within rich text content

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
  PricingTableBlock,
  ProcessStepsBlock,
  ProjectShowcaseBlock,
  ServicesGridBlock,
  SocialProofBlock,
  SpacerBlock,
  StatsCounterBlock,
  TechStackBlock,
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

// Remove the inlineBlocks array since it's not used without BlocksFeature
// Keeping the list as comments for reference
// Blocks suitable for inline embedding (smaller, content-focused blocks):
// MediaBlock, Code, DividerBlock, SpacerBlock, NewsletterBlock, SocialProofBlock

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
    blocks: [ServicesGridBlock, TechStackBlock, ProcessStepsBlock, PricingTableBlock],
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

// Configuration options for block fields (not rich text embedding)
export interface BlockEmbeddingConfig {
  // Which blocks to allow (defaults to all)
  allowedBlocks?: Block[]
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

// Default configuration for block fields
export const defaultBlockEmbeddingConfig: BlockEmbeddingConfig = {
  allowedBlocks: allBlocks,
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

// Helper function to check if a block is suitable for inline use
export function isInlineBlock(blockSlug: string): boolean {
  const inlineBlockSlugs = [
    'mediaBlock',
    'code',
    'dividerBlock',
    'spacerBlock',
    'newsletterBlock',
    'socialProofBlock',
  ]
  return inlineBlockSlugs.includes(blockSlug)
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

// Note: The following functions were for rich text BlocksFeature integration
// which is not currently used. Keeping for potential future use.

// Block field configuration (for regular block fields, not rich text embedding)
export interface BlockEmbeddingFieldConfig {
  name?: string
  label?: string
  required?: boolean
  config?: Partial<BlockEmbeddingConfig>
}

// Helper to create a block field (type: 'blocks')
export function blockEmbeddingField(options: BlockEmbeddingFieldConfig = {}) {
  const { name = 'blocks', label = 'Content Blocks', required = false, config = {} } = options

  return {
    name,
    type: 'blocks' as const,
    label,
    required,
    blocks: config.allowedBlocks || allBlocks,
    admin: {
      description: 'Add content blocks to build your page layout',
      initCollapsed: false,
    },
  }
}

// Export types for TypeScript support
// Types are already exported above as interfaces
