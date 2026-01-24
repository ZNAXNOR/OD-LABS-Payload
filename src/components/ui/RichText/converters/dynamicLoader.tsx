import React from 'react'
import type { BlockConverter } from '../types'

// ============================================================================
// DYNAMIC IMPORT DEFINITIONS
// ============================================================================

/**
 * Dynamic import functions for all block components
 * These enable code splitting and lazy loading for better performance
 */
const blockImports = {
  // Hero blocks
  hero: () => import('@/components/blocks/hero/Hero').then((m) => ({ default: m.HeroBlock })),

  // Content blocks
  content: () =>
    import('@/components/blocks/content/Content').then((m) => ({ default: m.ContentBlock })),
  mediaBlock: () => import('@/blocks/MediaBlock/Component'),
  banner: () => import('@/blocks/Banner/Component'),
  code: () => import('@/blocks/Code/Component'),

  // CTA blocks
  cta: () => import('@/blocks/CallToAction/Component'),
  contactForm: () =>
    import('@/components/blocks/cta/ContactForm').then((m) => ({ default: m.ContactFormBlock })),
  newsletter: () =>
    import('@/components/blocks/cta/Newsletter').then((m) => ({ default: m.NewsletterBlock })),
  socialProof: () =>
    import('@/components/blocks/cta/SocialProof').then((m) => ({ default: m.SocialProofBlock })),

  // Services blocks
  servicesGrid: () =>
    import('@/components/blocks/services/ServicesGrid').then((m) => ({
      default: m.ServicesGridBlock,
    })),
  techStack: () =>
    import('@/components/blocks/services/TechStack').then((m) => ({ default: m.TechStackBlock })),
  processSteps: () =>
    import('@/components/blocks/services/ProcessSteps').then((m) => ({
      default: m.ProcessStepsBlock,
    })),
  pricingTable: () =>
    import('@/components/blocks/services/PricingTable').then((m) => ({
      default: m.PricingTableBlock,
    })),

  // Portfolio blocks
  projectShowcase: () =>
    import('@/components/blocks/portfolio/ProjectShowcase').then((m) => ({
      default: m.ProjectShowcaseBlock,
    })),
  caseStudy: () =>
    import('@/components/blocks/portfolio/CaseStudy').then((m) => ({ default: m.CaseStudyBlock })),
  beforeAfter: () =>
    import('@/components/blocks/portfolio/BeforeAfter').then((m) => ({
      default: m.BeforeAfterBlock,
    })),
  testimonial: () =>
    import('@/components/blocks/portfolio/Testimonial').then((m) => ({
      default: m.TestimonialBlock,
    })),

  // Technical blocks
  featureGrid: () =>
    import('@/components/blocks/technical/FeatureGrid').then((m) => ({
      default: m.FeatureGridBlock,
    })),
  statsCounter: () =>
    import('@/components/blocks/technical/StatsCounter').then((m) => ({
      default: m.StatsCounterBlock,
    })),
  faqAccordion: () =>
    import('@/components/blocks/technical/FAQAccordion').then((m) => ({
      default: m.FAQAccordionBlock,
    })),
  timeline: () =>
    import('@/components/blocks/technical/Timeline').then((m) => ({ default: m.TimelineBlock })),

  // Layout blocks
  container: () =>
    import('@/components/blocks/layout/Container').then((m) => ({ default: m.ContainerBlock })),
  divider: () =>
    import('@/components/blocks/layout/Divider').then((m) => ({ default: m.DividerBlock })),
  spacer: () =>
    import('@/components/blocks/layout/Spacer').then((m) => ({ default: m.SpacerBlock })),
} as const

// ============================================================================
// LOADING STATES AND ERROR HANDLING
// ============================================================================

/**
 * Loading fallback component for dynamic imports
 */
const LoadingFallback: React.FC<{ blockType?: string; className?: string }> = ({
  blockType,
  className = '',
}) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 mb-4 ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
    {process.env.NODE_ENV === 'development' && blockType && (
      <div className="text-xs text-gray-500 mt-2">Loading {blockType} block...</div>
    )}
  </div>
)

/**
 * Error fallback component for failed dynamic imports
 */
const ErrorFallback: React.FC<{
  error: Error
  blockType?: string
  retry?: () => void
  className?: string
}> = ({ error, blockType, retry, className = '' }) => (
  <div
    className={`border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4 ${className}`}
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
          Failed to load {blockType || 'block'}
        </h4>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error.message}</p>
        )}
        {retry && (
          <button
            onClick={retry}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  </div>
)

// ============================================================================
// DYNAMIC CONVERTER CREATION
// ============================================================================

/**
 * Creates a dynamic converter with lazy loading and error handling
 */
const createDynamicConverter = <T extends Record<string, any>>(
  blockType: keyof typeof blockImports,
  category: 'hero' | 'content' | 'cta' | 'services' | 'portfolio' | 'technical' | 'layout',
  defaultClassName?: string,
) => {
  // Create lazy component with error boundary
  const LazyComponent = React.lazy(() =>
    (blockImports[blockType]() as Promise<{ default: React.FC<any> }>).catch((error) => {
      console.error(`Failed to load ${blockType} block:`, error)
      // Return a fallback component that shows the error
      return {
        default: ({ className }: { className?: string }) => (
          <ErrorFallback error={error} blockType={blockType} className={className} />
        ),
      }
    }),
  )

  // Set display name for debugging
  Object.defineProperty(LazyComponent, 'displayName', {
    value: `Lazy${blockType.charAt(0).toUpperCase() + blockType.slice(1)}Block`,
    writable: false,
  })

  return ({ node }: { node: { fields: T } }) => {
    // Get rich text styling based on category
    const richTextClassName = getRichTextStyling(category)
    const combinedClassName = [richTextClassName, defaultClassName].filter(Boolean).join(' ')

    return React.createElement(
      React.Suspense,
      {
        fallback: React.createElement(LoadingFallback, {
          blockType,
          className: combinedClassName,
        }),
      },
      React.createElement(LazyComponent, {
        block: node.fields as any,
        className: combinedClassName,
      } as any),
    )
  }
}

// Helper function to get rich text styling (imported from utils)
const getRichTextStyling = (
  category: 'hero' | 'content' | 'cta' | 'services' | 'portfolio' | 'technical' | 'layout',
  variant: 'compact' | 'minimal' | 'full' = 'compact',
): string => {
  const richTextVariants = {
    compact: {
      hero: 'py-8 md:py-12',
      content: 'py-6 md:py-8',
      services: 'py-6 md:py-8',
      portfolio: 'py-6 md:py-8',
      technical: 'py-6 md:py-8',
      cta: 'py-6 md:py-8',
      layout: 'py-4 md:py-6',
    },
    minimal: {
      hero: 'py-4 md:py-6',
      content: 'py-4 md:py-6',
      services: 'py-4 md:py-6',
      portfolio: 'py-4 md:py-6',
      technical: 'py-4 md:py-6',
      cta: 'py-4 md:py-6',
      layout: 'py-2 md:py-4',
    },
    full: {
      hero: 'py-16 md:py-24',
      content: 'py-16',
      services: 'py-16',
      portfolio: 'py-16',
      technical: 'py-16',
      cta: 'py-16',
      layout: 'py-8',
    },
  }

  return richTextVariants[variant][category] || ''
}

// ============================================================================
// DYNAMIC BLOCK CONVERTERS REGISTRY
// ============================================================================

/**
 * Creates the complete dynamic block converters registry
 */
export const createDynamicBlockConverters = (): Partial<BlockConverter> => ({
  // Hero blocks
  hero: createDynamicConverter('hero', 'hero', 'mb-8'),

  // Content blocks
  content: createDynamicConverter('content', 'content', 'mb-8'),
  mediaBlock: createDynamicConverter('mediaBlock', 'content', 'col-start-1 col-span-3 mb-6'),
  banner: createDynamicConverter('banner', 'cta', 'col-start-2 mb-4'),
  code: createDynamicConverter('code', 'content', 'col-start-2 mb-6'),

  // CTA blocks
  cta: createDynamicConverter('cta', 'cta', 'mb-8'),
  contactForm: createDynamicConverter('contactForm', 'cta', 'mb-8'),
  newsletter: createDynamicConverter('newsletter', 'cta', 'mb-8'),
  socialProof: createDynamicConverter('socialProof', 'cta', 'mb-8'),

  // Services blocks
  servicesGrid: createDynamicConverter('servicesGrid', 'services', 'mb-8'),
  techStack: createDynamicConverter('techStack', 'services', 'mb-8'),
  processSteps: createDynamicConverter('processSteps', 'services', 'mb-8'),
  pricingTable: createDynamicConverter('pricingTable', 'services', 'mb-8'),

  // Portfolio blocks
  projectShowcase: createDynamicConverter('projectShowcase', 'portfolio', 'mb-8'),
  caseStudy: createDynamicConverter('caseStudy', 'portfolio', 'mb-8'),
  beforeAfter: createDynamicConverter('beforeAfter', 'portfolio', 'mb-8'),
  testimonial: createDynamicConverter('testimonial', 'portfolio', 'mb-8'),

  // Technical blocks
  featureGrid: createDynamicConverter('featureGrid', 'technical', 'mb-8'),
  statsCounter: createDynamicConverter('statsCounter', 'technical', 'mb-8'),
  faqAccordion: createDynamicConverter('faqAccordion', 'technical', 'mb-8'),
  timeline: createDynamicConverter('timeline', 'technical', 'mb-8'),

  // Layout blocks
  container: createDynamicConverter('container', 'layout', 'mb-6'),
  divider: createDynamicConverter('divider', 'layout', 'mb-6'),
  spacer: createDynamicConverter('spacer', 'layout', 'mb-4'),
})

// ============================================================================
// PRELOADING STRATEGIES
// ============================================================================

/**
 * Critical blocks that should be preloaded for better performance
 */
const CRITICAL_BLOCKS = ['content', 'hero', 'banner', 'mediaBlock'] as const

/**
 * Common blocks that are frequently used and should be preloaded on interaction
 */
const COMMON_BLOCKS = ['cta', 'servicesGrid', 'featureGrid', 'testimonial'] as const

/**
 * Preload critical blocks immediately
 */
export const preloadCriticalBlocks = async (): Promise<void> => {
  const preloadPromises = CRITICAL_BLOCKS.map(async (blockType) => {
    try {
      await blockImports[blockType]()
      console.log(`[RichText] Preloaded critical block: ${blockType}`)
    } catch (error) {
      console.warn(`[RichText] Failed to preload critical block ${blockType}:`, error)
    }
  })

  await Promise.allSettled(preloadPromises)
}

/**
 * Preload common blocks with lower priority
 */
export const preloadCommonBlocks = async (): Promise<void> => {
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePreload = (callback: () => void) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 5000 })
    } else {
      setTimeout(callback, 100)
    }
  }

  COMMON_BLOCKS.forEach((blockType) => {
    schedulePreload(async () => {
      try {
        await blockImports[blockType]()
        console.log(`[RichText] Preloaded common block: ${blockType}`)
      } catch (error) {
        console.warn(`[RichText] Failed to preload common block ${blockType}:`, error)
      }
    })
  })
}

/**
 * Preload specific blocks based on usage patterns
 */
export const preloadBlocksByUsage = async (blockTypes: string[]): Promise<void> => {
  const validBlockTypes = blockTypes.filter(
    (blockType): blockType is keyof typeof blockImports => blockType in blockImports,
  )

  const preloadPromises = validBlockTypes.map(async (blockType) => {
    try {
      await blockImports[blockType]()
      console.log(`[RichText] Preloaded block by usage: ${blockType}`)
    } catch (error) {
      console.warn(`[RichText] Failed to preload block ${blockType}:`, error)
    }
  })

  await Promise.allSettled(preloadPromises)
}

/**
 * Preload blocks based on viewport intersection (for blocks visible soon)
 */
export const createIntersectionPreloader = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return { observe: () => {}, disconnect: () => {} }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const blockType = entry.target.getAttribute('data-block-type')
          if (blockType && blockType in blockImports) {
            blockImports[blockType as keyof typeof blockImports]()
              .then(() => {
                console.log(`[RichText] Preloaded block on intersection: ${blockType}`)
              })
              .catch((error) => {
                console.warn(`[RichText] Failed to preload block ${blockType}:`, error)
              })
          }
          observer.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '200px', // Start loading 200px before the element comes into view
      threshold: 0.1,
    },
  )

  return observer
}

// ============================================================================
// BUNDLE ANALYSIS UTILITIES
// ============================================================================

/**
 * Get information about loaded blocks for bundle analysis
 */
export const getLoadedBlocks = (): string[] => {
  // This would need to be implemented with actual module tracking
  // For now, return empty array as placeholder
  return []
}

/**
 * Get bundle size information for blocks
 */
export const getBlockBundleSizes = async (): Promise<Record<string, number>> => {
  // This would need to be implemented with actual bundle analysis
  // For now, return empty object as placeholder
  return {}
}

/**
 * Performance monitoring for dynamic imports
 */
export const monitorDynamicImports = () => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return
  }

  // Monitor dynamic import performance
  console.log('[RichText] Dynamic import monitoring initialized')
}

// ============================================================================
// EXPORTS
// ============================================================================

export { COMMON_BLOCKS, createDynamicConverter, CRITICAL_BLOCKS, ErrorFallback, LoadingFallback }

// Default export
export default createDynamicBlockConverters
