import type { BlockCategory } from './types'

/**
 * Block category constants
 * Used to organize blocks into logical groups
 */
export const BLOCK_CATEGORIES = {
  HERO: 'hero',
  CONTENT: 'content',
  SERVICES: 'services',
  PORTFOLIO: 'portfolio',
  TECHNICAL: 'technical',
  CTA: 'cta',
  LAYOUT: 'layout',
} as const

/**
 * Type representing valid block category keys
 */
export type BlockCategoryKey = (typeof BLOCK_CATEGORIES)[keyof typeof BLOCK_CATEGORIES]

/**
 * Block categories with metadata
 * Provides human-readable labels and descriptions for each category
 */
export const blockCategories: Record<BlockCategoryKey, Omit<BlockCategory, 'blocks'>> = {
  [BLOCK_CATEGORIES.HERO]: {
    label: 'Hero',
    description: 'Prominent header sections with multiple style variants',
  },
  [BLOCK_CATEGORIES.CONTENT]: {
    label: 'Content',
    description: 'General content and media blocks',
  },
  [BLOCK_CATEGORIES.SERVICES]: {
    label: 'Services',
    description: 'Service offerings, tech stack, and pricing blocks',
  },
  [BLOCK_CATEGORIES.PORTFOLIO]: {
    label: 'Portfolio',
    description: 'Project showcases, case studies, and testimonials',
  },
  [BLOCK_CATEGORIES.TECHNICAL]: {
    label: 'Technical',
    description: 'Code, features, stats, and technical content',
  },
  [BLOCK_CATEGORIES.CTA]: {
    label: 'CTA & Conversion',
    description: 'Call-to-action and lead generation blocks',
  },
  [BLOCK_CATEGORIES.LAYOUT]: {
    label: 'Layout',
    description: 'Structural elements and spacing controls',
  },
}
