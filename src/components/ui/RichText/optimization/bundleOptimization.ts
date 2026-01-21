import React from 'react'
import type { BlockConverter } from '../types'

// ============================================================================
// BUNDLE SPLITTING STRATEGIES
// ============================================================================

/**
 * Block categories for bundle splitting
 */
export const BUNDLE_CATEGORIES = {
  CRITICAL: 'critical', // Essential blocks loaded immediately
  COMMON: 'common', // Frequently used blocks
  SPECIALIZED: 'specialized', // Less common, feature-specific blocks
  HEAVY: 'heavy', // Large blocks with heavy dependencies
} as const

type BundleCategory = (typeof BUNDLE_CATEGORIES)[keyof typeof BUNDLE_CATEGORIES]

/**
 * Block categorization for optimal bundle splitting
 */
export const BLOCK_CATEGORIES: Record<string, BundleCategory> = {
  // Critical blocks - always loaded
  content: BUNDLE_CATEGORIES.CRITICAL,
  banner: BUNDLE_CATEGORIES.CRITICAL,
  container: BUNDLE_CATEGORIES.CRITICAL,
  divider: BUNDLE_CATEGORIES.CRITICAL,
  spacer: BUNDLE_CATEGORIES.CRITICAL,

  // Common blocks - loaded on demand but prioritized
  hero: BUNDLE_CATEGORIES.COMMON,
  cta: BUNDLE_CATEGORIES.COMMON,
  mediaBlock: BUNDLE_CATEGORIES.COMMON,
  code: BUNDLE_CATEGORIES.COMMON,

  // Specialized blocks - loaded when needed
  servicesGrid: BUNDLE_CATEGORIES.SPECIALIZED,
  techStack: BUNDLE_CATEGORIES.SPECIALIZED,
  processSteps: BUNDLE_CATEGORIES.SPECIALIZED,
  pricingTable: BUNDLE_CATEGORIES.SPECIALIZED,
  featureGrid: BUNDLE_CATEGORIES.SPECIALIZED,
  faqAccordion: BUNDLE_CATEGORIES.SPECIALIZED,
  timeline: BUNDLE_CATEGORIES.SPECIALIZED,

  // Heavy blocks - loaded with lowest priority
  projectShowcase: BUNDLE_CATEGORIES.HEAVY,
  caseStudy: BUNDLE_CATEGORIES.HEAVY,
  beforeAfter: BUNDLE_CATEGORIES.HEAVY,
  testimonial: BUNDLE_CATEGORIES.HEAVY,
  statsCounter: BUNDLE_CATEGORIES.HEAVY,
  contactForm: BUNDLE_CATEGORIES.HEAVY,
  newsletter: BUNDLE_CATEGORIES.HEAVY,
  socialProof: BUNDLE_CATEGORIES.HEAVY,
}

/**
 * Get blocks by category for selective loading
 */
export const getBlocksByCategory = (category: BundleCategory): string[] => {
  return Object.entries(BLOCK_CATEGORIES)
    .filter(([, blockCategory]) => blockCategory === category)
    .map(([blockType]) => blockType)
}

// ============================================================================
// TREE SHAKING OPTIMIZATION
// ============================================================================

/**
 * Create tree-shakeable block imports
 * This ensures unused blocks are not included in the bundle
 */
export const createTreeShakeableImports = () => {
  // Use dynamic imports with webpack magic comments for better chunking
  const blockImports = {
    // Critical blocks - inline in main bundle
    content: () =>
      import(
        /* webpackChunkName: "richtext-critical" */
        /* webpackPreload: true */
        '@/components/blocks/content/Content'
      ).then((m) => ({ default: m.ContentBlock })),

    banner: () =>
      import(
        /* webpackChunkName: "richtext-critical" */
        /* webpackPreload: true */
        '@/blocks/Banner/Component'
      ),

    container: () =>
      import(
        /* webpackChunkName: "richtext-critical" */
        /* webpackPreload: true */
        '@/components/blocks/layout/Container'
      ).then((m) => ({ default: m.ContainerBlock })),

    divider: () =>
      import(
        /* webpackChunkName: "richtext-critical" */
        /* webpackPreload: true */
        '@/components/blocks/layout/Divider'
      ).then((m) => ({ default: m.DividerBlock })),

    spacer: () =>
      import(
        /* webpackChunkName: "richtext-critical" */
        /* webpackPreload: true */
        '@/components/blocks/layout/Spacer'
      ).then((m) => ({ default: m.SpacerBlock })),

    // Common blocks - separate chunk, prefetched
    hero: () =>
      import(
        /* webpackChunkName: "richtext-common" */
        /* webpackPrefetch: true */
        '@/components/blocks/hero/Hero'
      ).then((m) => ({ default: m.HeroBlock })),

    cta: () =>
      import(
        /* webpackChunkName: "richtext-common" */
        /* webpackPrefetch: true */
        '@/blocks/CallToAction/Component'
      ),

    mediaBlock: () =>
      import(
        /* webpackChunkName: "richtext-common" */
        /* webpackPrefetch: true */
        '@/blocks/MediaBlock/Component'
      ),

    code: () =>
      import(
        /* webpackChunkName: "richtext-common" */
        /* webpackPrefetch: true */
        '@/blocks/Code/Component'
      ),

    // Specialized blocks - individual chunks
    servicesGrid: () =>
      import(
        /* webpackChunkName: "richtext-services" */
        '@/components/blocks/services/ServicesGrid'
      ).then((m) => ({ default: m.ServicesGridBlock })),

    techStack: () =>
      import(
        /* webpackChunkName: "richtext-services" */
        '@/components/blocks/services/TechStack'
      ).then((m) => ({ default: m.TechStackBlock })),

    processSteps: () =>
      import(
        /* webpackChunkName: "richtext-services" */
        '@/components/blocks/services/ProcessSteps'
      ).then((m) => ({ default: m.ProcessStepsBlock })),

    pricingTable: () =>
      import(
        /* webpackChunkName: "richtext-services" */
        '@/components/blocks/services/PricingTable'
      ).then((m) => ({ default: m.PricingTableBlock })),

    featureGrid: () =>
      import(
        /* webpackChunkName: "richtext-technical" */
        '@/components/blocks/technical/FeatureGrid'
      ).then((m) => ({ default: m.FeatureGridBlock })),

    faqAccordion: () =>
      import(
        /* webpackChunkName: "richtext-technical" */
        '@/components/blocks/technical/FAQAccordion'
      ).then((m) => ({ default: m.FAQAccordionBlock })),

    timeline: () =>
      import(
        /* webpackChunkName: "richtext-technical" */
        '@/components/blocks/technical/Timeline'
      ).then((m) => ({ default: m.TimelineBlock })),

    statsCounter: () =>
      import(
        /* webpackChunkName: "richtext-technical" */
        '@/components/blocks/technical/StatsCounter'
      ).then((m) => ({ default: m.StatsCounterBlock })),

    // Heavy blocks - individual chunks, loaded on demand
    projectShowcase: () =>
      import(
        /* webpackChunkName: "richtext-portfolio-showcase" */
        '@/components/blocks/portfolio/ProjectShowcase'
      ).then((m) => ({ default: m.ProjectShowcaseBlock })),

    caseStudy: () =>
      import(
        /* webpackChunkName: "richtext-portfolio-case" */
        '@/components/blocks/portfolio/CaseStudy'
      ).then((m) => ({ default: m.CaseStudyBlock })),

    beforeAfter: () =>
      import(
        /* webpackChunkName: "richtext-portfolio-before-after" */
        '@/components/blocks/portfolio/BeforeAfter'
      ).then((m) => ({ default: m.BeforeAfterBlock })),

    testimonial: () =>
      import(
        /* webpackChunkName: "richtext-portfolio-testimonial" */
        '@/components/blocks/portfolio/Testimonial'
      ).then((m) => ({ default: m.TestimonialBlock })),

    contactForm: () =>
      import(
        /* webpackChunkName: "richtext-forms" */
        '@/components/blocks/cta/ContactForm'
      ).then((m) => ({ default: m.ContactFormBlock })),

    newsletter: () =>
      import(
        /* webpackChunkName: "richtext-forms" */
        '@/components/blocks/cta/Newsletter'
      ).then((m) => ({ default: m.NewsletterBlock })),

    socialProof: () =>
      import(
        /* webpackChunkName: "richtext-social" */
        '@/components/blocks/cta/SocialProof'
      ).then((m) => ({ default: m.SocialProofBlock })),
  }

  return blockImports
}

// ============================================================================
// SELECTIVE LOADING STRATEGIES
// ============================================================================

/**
 * Create a selective loader that only loads required blocks
 */
export const createSelectiveBlockLoader = (requiredBlocks: string[]) => {
  const treeShakeableImports = createTreeShakeableImports()

  // Filter imports to only include required blocks
  const selectiveImports = Object.fromEntries(
    Object.entries(treeShakeableImports).filter(([blockType]) =>
      requiredBlocks.includes(blockType),
    ),
  )

  return selectiveImports
}

/**
 * Analyze content to determine required blocks
 */
export const analyzeContentForRequiredBlocks = (content: any): string[] => {
  const requiredBlocks = new Set<string>()

  const analyzeNode = (node: any) => {
    if (!node || typeof node !== 'object') return

    // Check if this is a block node
    if (node.type === 'block' && node.fields) {
      const blockType = node.blockType || node.type
      if (blockType && typeof blockType === 'string') {
        requiredBlocks.add(blockType)
      }
    }

    // Recursively analyze children
    if (Array.isArray(node.children)) {
      node.children.forEach(analyzeNode)
    }

    // Handle other possible child properties
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(analyzeNode)
    }
  }

  // Start analysis from root
  if (content?.root?.children) {
    content.root.children.forEach(analyzeNode)
  }

  return Array.from(requiredBlocks)
}

/**
 * Create optimized converter registry based on content analysis
 */
export const createOptimizedConverterRegistry = async (
  content: any,
  fallbackConverters?: BlockConverter,
): Promise<BlockConverter> => {
  const requiredBlocks = analyzeContentForRequiredBlocks(content)

  if (requiredBlocks.length === 0) {
    // No blocks found, return minimal registry
    return {}
  }

  const selectiveImports = createSelectiveBlockLoader(requiredBlocks)
  const converters: BlockConverter = {}

  // Load only required converters
  await Promise.all(
    Object.entries(selectiveImports).map(async ([blockType, importFn]) => {
      try {
        const module = await importFn()
        // Create converter for this block type
        converters[blockType] = ({ node }) => {
          const Component = (module as any).default || module
          return React.createElement(Component, {
            block: node.fields,
            className: 'mb-8', // Default styling
          })
        }
      } catch (error) {
        console.warn(`Failed to load block ${blockType}:`, error)

        // Use fallback if available
        if (fallbackConverters?.[blockType]) {
          converters[blockType] = fallbackConverters[blockType]
        }
      }
    }),
  )

  return converters
}

// ============================================================================
// BUNDLE SIZE MONITORING
// ============================================================================

/**
 * Bundle size tracking for performance monitoring
 */
interface BundleMetrics {
  totalSize: number
  chunkSizes: Record<string, number>
  loadedChunks: string[]
  pendingChunks: string[]
}

let bundleMetrics: BundleMetrics = {
  totalSize: 0,
  chunkSizes: {},
  loadedChunks: [],
  pendingChunks: [],
}

/**
 * Track bundle loading for performance analysis
 */
export const trackBundleLoading = (chunkName: string, size?: number) => {
  if (!bundleMetrics.loadedChunks.includes(chunkName)) {
    bundleMetrics.loadedChunks.push(chunkName)

    if (size) {
      bundleMetrics.chunkSizes[chunkName] = size
      bundleMetrics.totalSize += size
    }

    // Remove from pending if it was there
    bundleMetrics.pendingChunks = bundleMetrics.pendingChunks.filter((chunk) => chunk !== chunkName)
  }
}

/**
 * Track pending bundle loads
 */
export const trackPendingBundle = (chunkName: string) => {
  if (
    !bundleMetrics.pendingChunks.includes(chunkName) &&
    !bundleMetrics.loadedChunks.includes(chunkName)
  ) {
    bundleMetrics.pendingChunks.push(chunkName)
  }
}

/**
 * Get current bundle metrics
 */
export const getBundleMetrics = (): BundleMetrics => ({
  ...bundleMetrics,
  loadedChunks: [...bundleMetrics.loadedChunks],
  pendingChunks: [...bundleMetrics.pendingChunks],
})

/**
 * Reset bundle metrics
 */
export const resetBundleMetrics = () => {
  bundleMetrics = {
    totalSize: 0,
    chunkSizes: {},
    loadedChunks: [],
    pendingChunks: [],
  }
}

// ============================================================================
// WEBPACK OPTIMIZATION HELPERS
// ============================================================================

/**
 * Generate webpack magic comments for optimal chunking
 */
export const generateWebpackComments = (blockType: string, category: BundleCategory): string => {
  const chunkName = getChunkNameForBlock(blockType, category)

  let comments = `/* webpackChunkName: "${chunkName}" */`

  // Add preload/prefetch hints based on category
  switch (category) {
    case BUNDLE_CATEGORIES.CRITICAL:
      comments += `\n/* webpackPreload: true */`
      break
    case BUNDLE_CATEGORIES.COMMON:
      comments += `\n/* webpackPrefetch: true */`
      break
    case BUNDLE_CATEGORIES.SPECIALIZED:
      // No preload/prefetch for specialized blocks
      break
    case BUNDLE_CATEGORIES.HEAVY:
      comments += `\n/* webpackPrefetch: 2 */` // Lower priority prefetch
      break
  }

  return comments
}

/**
 * Get chunk name for a block based on its category
 */
const getChunkNameForBlock = (blockType: string, category: BundleCategory): string => {
  switch (category) {
    case BUNDLE_CATEGORIES.CRITICAL:
      return 'richtext-critical'
    case BUNDLE_CATEGORIES.COMMON:
      return 'richtext-common'
    case BUNDLE_CATEGORIES.SPECIALIZED:
      // Group by block family
      if (['servicesGrid', 'techStack', 'processSteps', 'pricingTable'].includes(blockType)) {
        return 'richtext-services'
      }
      if (['featureGrid', 'faqAccordion', 'timeline', 'statsCounter'].includes(blockType)) {
        return 'richtext-technical'
      }
      return `richtext-${blockType}`
    case BUNDLE_CATEGORIES.HEAVY:
      // Individual chunks for heavy blocks
      return `richtext-${blockType}`
    default:
      return `richtext-${blockType}`
  }
}

// ============================================================================
// PERFORMANCE BUDGETS
// ============================================================================

/**
 * Performance budget configuration
 */
export const PERFORMANCE_BUDGETS = {
  CRITICAL_CHUNK_MAX_SIZE: 50 * 1024, // 50KB for critical chunks
  COMMON_CHUNK_MAX_SIZE: 100 * 1024, // 100KB for common chunks
  SPECIALIZED_CHUNK_MAX_SIZE: 150 * 1024, // 150KB for specialized chunks
  HEAVY_CHUNK_MAX_SIZE: 200 * 1024, // 200KB for heavy chunks
  TOTAL_RICHTEXT_MAX_SIZE: 500 * 1024, // 500KB total for all RichText chunks
} as const

/**
 * Check if bundle sizes are within performance budgets
 */
export const checkPerformanceBudgets = (
  metrics: BundleMetrics,
): {
  withinBudget: boolean
  violations: Array<{
    chunk: string
    actualSize: number
    budgetSize: number
    category: BundleCategory
  }>
} => {
  const violations: Array<{
    chunk: string
    actualSize: number
    budgetSize: number
    category: BundleCategory
  }> = []

  // Check individual chunk budgets
  for (const [chunkName, size] of Object.entries(metrics.chunkSizes)) {
    const category = getCategoryForChunk(chunkName)
    const budget = getBudgetForCategory(category)

    if (size > budget) {
      violations.push({
        chunk: chunkName,
        actualSize: size,
        budgetSize: budget,
        category,
      })
    }
  }

  // Check total budget
  if (metrics.totalSize > PERFORMANCE_BUDGETS.TOTAL_RICHTEXT_MAX_SIZE) {
    violations.push({
      chunk: 'TOTAL',
      actualSize: metrics.totalSize,
      budgetSize: PERFORMANCE_BUDGETS.TOTAL_RICHTEXT_MAX_SIZE,
      category: BUNDLE_CATEGORIES.CRITICAL, // Placeholder
    })
  }

  return {
    withinBudget: violations.length === 0,
    violations,
  }
}

/**
 * Get category for chunk name
 */
const getCategoryForChunk = (chunkName: string): BundleCategory => {
  if (chunkName.includes('critical')) return BUNDLE_CATEGORIES.CRITICAL
  if (chunkName.includes('common')) return BUNDLE_CATEGORIES.COMMON
  if (chunkName.includes('services') || chunkName.includes('technical')) {
    return BUNDLE_CATEGORIES.SPECIALIZED
  }
  return BUNDLE_CATEGORIES.HEAVY
}

/**
 * Get performance budget for category
 */
const getBudgetForCategory = (category: BundleCategory): number => {
  switch (category) {
    case BUNDLE_CATEGORIES.CRITICAL:
      return PERFORMANCE_BUDGETS.CRITICAL_CHUNK_MAX_SIZE
    case BUNDLE_CATEGORIES.COMMON:
      return PERFORMANCE_BUDGETS.COMMON_CHUNK_MAX_SIZE
    case BUNDLE_CATEGORIES.SPECIALIZED:
      return PERFORMANCE_BUDGETS.SPECIALIZED_CHUNK_MAX_SIZE
    case BUNDLE_CATEGORIES.HEAVY:
      return PERFORMANCE_BUDGETS.HEAVY_CHUNK_MAX_SIZE
    default:
      return PERFORMANCE_BUDGETS.SPECIALIZED_CHUNK_MAX_SIZE
  }
}

// Default export
export default {
  BUNDLE_CATEGORIES,
  BLOCK_CATEGORIES,
  PERFORMANCE_BUDGETS,
  getBlocksByCategory,
  createOptimizedConverterRegistry,
  getBundleMetrics,
  checkPerformanceBudgets,
}
