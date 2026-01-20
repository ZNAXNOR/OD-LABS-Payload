import React from 'react'
import { cn } from '@/utilities/ui'
import { getBlockMobileClasses, getMobilePerformanceClasses } from '../utils/responsiveUtils'
import { getBlockTouchClasses, getTouchA11yClasses } from '../utils/touchUtils'
import { generateBlockAriaLabel, generateSectionAriaAttrs } from '../utils/accessibilityUtils'
import { generateSemanticStructure } from '../utils/semanticHtml'

// ============================================================================
// BLOCK COMPONENT IMPORTS
// ============================================================================

// Hero blocks
import { HeroBlock } from '@/components/blocks/hero/Hero'

// Content blocks
import { ContentBlock } from '@/components/blocks/content/Content'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'

// CTA blocks
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactFormBlock } from '@/components/blocks/cta/ContactForm'
import { NewsletterBlock } from '@/components/blocks/cta/Newsletter'
import { SocialProofBlock } from '@/components/blocks/cta/SocialProof'

// Services blocks
import { ServicesGridBlock } from '@/components/blocks/services/ServicesGrid'
import { TechStackBlock } from '@/components/blocks/services/TechStack'
import { ProcessStepsBlock } from '@/components/blocks/services/ProcessSteps'
import { PricingTableBlock } from '@/components/blocks/services/PricingTable'

// Portfolio blocks
import { ProjectShowcaseBlock } from '@/components/blocks/portfolio/ProjectShowcase'
import { CaseStudyBlock } from '@/components/blocks/portfolio/CaseStudy'
import { BeforeAfterBlock } from '@/components/blocks/portfolio/BeforeAfter'
import { TestimonialBlock } from '@/components/blocks/portfolio/Testimonial'

// Technical blocks
import { FeatureGridBlock } from '@/components/blocks/technical/FeatureGrid'
import { StatsCounterBlock } from '@/components/blocks/technical/StatsCounter'
import { FAQAccordionBlock } from '@/components/blocks/technical/FAQAccordion'
import { TimelineBlock } from '@/components/blocks/technical/Timeline'

// Layout blocks
import { ContainerBlock } from '@/components/blocks/layout/Container'
import { DividerBlock } from '@/components/blocks/layout/Divider'
import { SpacerBlock } from '@/components/blocks/layout/Spacer'

import type { BlockConverter } from '../types'
import { createErrorBoundaryWrapper, DefaultBlockErrorFallback } from '../utils'

// ============================================================================
// RICH TEXT STYLING VARIANTS
// ============================================================================

/**
 * Rich text styling variants for different block contexts
 * These provide consistent styling when blocks are embedded in rich text
 * Now includes mobile-first responsive classes and container query support
 */
const richTextVariants = {
  // Compact variants for inline/embedded use
  compact: {
    hero: 'py-6 sm:py-8 md:py-12', // Mobile-first responsive padding
    content: 'py-4 sm:py-6 md:py-8',
    services: 'py-4 sm:py-6 md:py-8',
    portfolio: 'py-4 sm:py-6 md:py-8',
    technical: 'py-4 sm:py-6 md:py-8',
    cta: 'py-4 sm:py-6 md:py-8',
    layout: 'py-2 sm:py-4 md:py-6',
  },
  // Minimal variants for tight spaces
  minimal: {
    hero: 'py-3 sm:py-4 md:py-6',
    content: 'py-3 sm:py-4 md:py-6',
    services: 'py-3 sm:py-4 md:py-6',
    portfolio: 'py-3 sm:py-4 md:py-6',
    technical: 'py-3 sm:py-4 md:py-6',
    cta: 'py-3 sm:py-4 md:py-6',
    layout: 'py-2 sm:py-3 md:py-4',
  },
  // Full variants (same as standalone)
  full: {
    hero: 'py-12 sm:py-16 md:py-24',
    content: 'py-8 sm:py-12 md:py-16',
    services: 'py-8 sm:py-12 md:py-16',
    portfolio: 'py-8 sm:py-12 md:py-16',
    technical: 'py-8 sm:py-12 md:py-16',
    cta: 'py-8 sm:py-12 md:py-16',
    layout: 'py-4 sm:py-6 md:py-8',
  },
}

/**
 * Get rich text styling for a block category
 */
const getRichTextStyling = (
  category: keyof typeof richTextVariants.compact,
  variant: 'compact' | 'minimal' | 'full' = 'compact',
): string => {
  return richTextVariants[variant][category] || ''
}

// ============================================================================
// BLOCK CONVERTER FACTORY
// ============================================================================

/**
 * Creates a block converter with error boundary, rich text styling, and semantic HTML
 * Now includes mobile-optimized classes, performance optimizations, and accessibility attributes
 */
const createBlockConverter = <T extends Record<string, any>>(
  Component: React.ComponentType<{ block: T; className?: string }>,
  category: keyof typeof richTextVariants.compact,
  blockType?: string,
  defaultClassName?: string,
  errorFallback?: React.ComponentType<{ error: Error; blockType?: string }>,
) => {
  return ({ node }: { node: { fields: T } }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      Component,
      errorFallback || DefaultBlockErrorFallback,
    )

    const richTextClassName = getRichTextStyling(category)
    const mobileClassName = blockType ? getBlockMobileClasses(blockType) : ''
    const performanceClassName = getMobilePerformanceClasses()
    const touchClassName = blockType ? getBlockTouchClasses(blockType) : ''
    const a11yClassName = getTouchA11yClasses()

    // Generate semantic structure
    const semanticStructure = generateSemanticStructure(blockType || category, node.fields)
    const SemanticElement = semanticStructure.element as keyof React.JSX.IntrinsicElements

    // Generate accessibility attributes
    const ariaLabel = generateBlockAriaLabel(blockType || category, node.fields)
    const sectionAttrs = generateSectionAriaAttrs('section', ariaLabel)

    const combinedClassName = cn(
      richTextClassName,
      mobileClassName,
      performanceClassName,
      touchClassName,
      a11yClassName,
      defaultClassName,
      'w-full', // Ensure full width on all devices
      'overflow-hidden', // Prevent horizontal scroll
    )

    return React.createElement(
      SemanticElement as any,
      {
        ...sectionAttrs,
        ...semanticStructure.attributes,
      },
      React.createElement(WrappedComponent, {
        block: node.fields,
        className: combinedClassName,
      }),
    )
  }
}

/**
 * Creates a legacy block converter for blocks that don't follow the new pattern
 */
const createLegacyBlockConverter = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  defaultProps?: Partial<T>,
  errorFallback?: React.ComponentType<{ error: Error; blockType?: string }>,
) => {
  return ({ node }: { node: { fields: any } }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      Component,
      errorFallback || DefaultBlockErrorFallback,
    )

    return React.createElement(WrappedComponent, {
      ...defaultProps,
      ...node.fields,
    } as T)
  }
}

// ============================================================================
// DEFAULT BLOCK CONVERTERS
// ============================================================================

/**
 * Comprehensive block converter registry with error boundaries and rich text styling
 * All blocks are wrapped with error boundaries and optimized for rich text embedding
 */
export const defaultBlockConverters = {
  // ============================================================================
  // HERO BLOCKS
  // ============================================================================
  hero: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(HeroBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('hero')
    const mobileClassName = getBlockMobileClasses('hero')
    const performanceClassName = getMobilePerformanceClasses()

    // Generate accessibility attributes for hero section
    const ariaLabel = generateBlockAriaLabel('hero', node.fields, 'main hero section')
    const heroAttrs = generateSectionAriaAttrs('section', ariaLabel, { landmark: true })

    const combinedClassName = cn(
      richTextClassName,
      mobileClassName,
      performanceClassName,
      'mb-6 sm:mb-8',
      'w-full overflow-hidden',
    )

    return React.createElement(
      'section',
      {
        ...heroAttrs,
        role: 'banner', // Hero sections are typically banner landmarks
      },
      React.createElement(WrappedComponent, {
        block: node.fields as any, // Type assertion for compatibility
        className: combinedClassName,
      }),
    )
  },

  // ============================================================================
  // CONTENT BLOCKS
  // ============================================================================
  content: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(ContentBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('content')

    // Generate accessibility attributes for content section
    const ariaLabel = generateBlockAriaLabel('content', node.fields)
    const contentAttrs = generateSectionAriaAttrs('section', ariaLabel)

    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(
      'section',
      contentAttrs,
      React.createElement(WrappedComponent, {
        block: node.fields as any, // Type assertion for compatibility
        className: combinedClassName,
      }),
    )
  },

  // Legacy content blocks (using old pattern)
  mediaBlock: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(MediaBlock, DefaultBlockErrorFallback)

    // Generate accessibility attributes for media
    const ariaLabel = generateBlockAriaLabel('mediaBlock', node.fields)

    const defaultProps = {
      className: 'col-start-1 col-span-3 mb-6',
      imgClassName: 'm-0',
      captionClassName: 'mx-auto max-w-[48rem]',
      enableGutter: false,
      disableInnerContainer: true,
    }

    // Use semantic figure element for media blocks
    return React.createElement(
      'figure',
      {
        'aria-label': ariaLabel,
        role: 'figure',
      },
      React.createElement(WrappedComponent, {
        ...defaultProps,
        ...node.fields,
      }),
    )
  },

  banner: createLegacyBlockConverter(BannerBlock, {
    className: 'col-start-2 mb-4',
  }),

  code: createLegacyBlockConverter(CodeBlock, {
    className: 'col-start-2 mb-6',
  }),

  // ============================================================================
  // CTA BLOCKS
  // ============================================================================
  cta: createLegacyBlockConverter(CallToActionBlock),

  contactForm: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(ContactFormBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('cta')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  newsletter: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(NewsletterBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('cta')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  socialProof: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(SocialProofBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('cta')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  // ============================================================================
  // SERVICES BLOCKS
  // ============================================================================
  servicesGrid: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      ServicesGridBlock,
      DefaultBlockErrorFallback,
    )
    const richTextClassName = getRichTextStyling('services')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  techStack: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(TechStackBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('services')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  processSteps: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      ProcessStepsBlock,
      DefaultBlockErrorFallback,
    )
    const richTextClassName = getRichTextStyling('services')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  pricingTable: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      PricingTableBlock,
      DefaultBlockErrorFallback,
    )
    const richTextClassName = getRichTextStyling('services')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  // ============================================================================
  // PORTFOLIO BLOCKS
  // ============================================================================
  projectShowcase: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      ProjectShowcaseBlock,
      DefaultBlockErrorFallback,
    )
    const richTextClassName = getRichTextStyling('portfolio')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  caseStudy: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(CaseStudyBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('portfolio')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  beforeAfter: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(BeforeAfterBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('portfolio')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  testimonial: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(TestimonialBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('portfolio')

    // Generate accessibility attributes for testimonial
    const ariaLabel = generateBlockAriaLabel('testimonial', node.fields)

    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    // Use semantic blockquote element for testimonials
    return React.createElement(
      'blockquote',
      {
        'aria-label': ariaLabel,
        role: 'blockquote',
      },
      React.createElement(WrappedComponent, {
        block: node.fields as any, // Type assertion for compatibility
        className: combinedClassName,
      }),
    )
  },

  // ============================================================================
  // TECHNICAL BLOCKS
  // ============================================================================
  featureGrid: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(FeatureGridBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('technical')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  statsCounter: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      StatsCounterBlock,
      DefaultBlockErrorFallback,
    )
    const richTextClassName = getRichTextStyling('technical')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  faqAccordion: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      FAQAccordionBlock,
      DefaultBlockErrorFallback,
    )
    const richTextClassName = getRichTextStyling('technical')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  timeline: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(TimelineBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('technical')
    const combinedClassName = [richTextClassName, 'mb-8'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  // ============================================================================
  // LAYOUT BLOCKS
  // ============================================================================
  container: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(ContainerBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('layout')
    const combinedClassName = [richTextClassName, 'mb-6'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },

  divider: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(DividerBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('layout')

    // Generate accessibility attributes for divider
    const ariaLabel = generateBlockAriaLabel('divider', node.fields)

    const combinedClassName = [richTextClassName, 'mb-6'].filter(Boolean).join(' ')

    // Use semantic hr element for dividers
    return React.createElement(
      'div',
      {
        'aria-label': ariaLabel,
        role: 'separator',
      },
      React.createElement(WrappedComponent, {
        block: node.fields as any, // Type assertion for compatibility
        className: combinedClassName,
      }),
    )
  },

  spacer: ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(SpacerBlock, DefaultBlockErrorFallback)
    const richTextClassName = getRichTextStyling('layout')
    const combinedClassName = [richTextClassName, 'mb-4'].filter(Boolean).join(' ')

    return React.createElement(WrappedComponent, {
      block: node.fields as any, // Type assertion for compatibility
      className: combinedClassName,
    })
  },
}

// ============================================================================
// DYNAMIC LOADING UTILITIES
// ============================================================================

import { createDynamicBlockConverters, preloadCommonBlocks } from './dynamicLoader'

/**
 * Dynamic block loader with lazy loading support
 * Enables code splitting for better performance
 */
export const createDynamicBlockConverter = <T extends Record<string, any>>(
  componentLoader: () => Promise<{
    default: React.ComponentType<{ block: T; className?: string }>
  }>,
  category: keyof typeof richTextVariants.compact,
  defaultClassName?: string,
) => {
  // Create a lazy component
  const LazyComponent = React.lazy(componentLoader)

  return ({ node }: { node: { fields: T } }) => {
    const richTextClassName = getRichTextStyling(category)
    const combinedClassName = [richTextClassName, defaultClassName].filter(Boolean).join(' ')

    return React.createElement(
      React.Suspense,
      {
        fallback: React.createElement(
          'div',
          {
            className: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-32 mb-4',
          },
          'Loading block...',
        ),
      },
      React.createElement(LazyComponent, {
        block: node.fields,
        className: combinedClassName,
      }),
    )
  }
}

/**
 * Registry of dynamic block loaders for code splitting
 * These can be used instead of the default converters for better performance
 */
export const dynamicBlockConverters: Partial<BlockConverter> = createDynamicBlockConverters()

/**
 * Hybrid converter registry that combines static and dynamic loading
 * Critical blocks load immediately, others load dynamically
 */
export const hybridBlockConverters: BlockConverter = (() => {
  const converters: Record<string, any> = {}

  // Add critical blocks if they exist
  if (defaultBlockConverters.content) converters.content = defaultBlockConverters.content
  if (defaultBlockConverters.banner) converters.banner = defaultBlockConverters.banner
  if (defaultBlockConverters.mediaBlock) converters.mediaBlock = defaultBlockConverters.mediaBlock
  if (defaultBlockConverters.code) converters.code = defaultBlockConverters.code
  if (defaultBlockConverters.container) converters.container = defaultBlockConverters.container
  if (defaultBlockConverters.divider) converters.divider = defaultBlockConverters.divider
  if (defaultBlockConverters.spacer) converters.spacer = defaultBlockConverters.spacer

  // Add dynamic converters
  Object.entries(dynamicBlockConverters).forEach(([key, converter]) => {
    if (converter) converters[key] = converter
  })

  return converters as BlockConverter
})()

/**
 * Initialize dynamic loading system
 * Call this during app initialization for optimal performance
 */
export const initializeDynamicLoading = async (): Promise<void> => {
  try {
    await preloadCommonBlocks()
    console.log('[RichText] Dynamic loading system initialized')
  } catch (error) {
    console.warn('[RichText] Failed to initialize dynamic loading:', error)
  }
}

// ============================================================================
// CONVERTER UTILITIES
// ============================================================================

/**
 * Utility to merge custom block converters with defaults
 * Preserves error boundaries and rich text styling
 */
export const mergeBlockConverters = (
  customConverters?: Partial<BlockConverter>,
): BlockConverter => {
  return {
    ...defaultBlockConverters,
    ...customConverters,
  }
}

/**
 * Utility to create a custom block converter with error boundary
 * @deprecated Use createBlockConverter instead
 */
export const createCustomBlockConverter = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  defaultProps?: Partial<T>,
  errorFallback?: React.ComponentType<{ error: Error; blockType?: string }>,
) => {
  return ({ node }: { node: { fields: T } }) => {
    const WrappedComponent = createErrorBoundaryWrapper(
      Component,
      errorFallback || DefaultBlockErrorFallback,
    )
    return React.createElement(WrappedComponent, {
      ...defaultProps,
      ...node.fields,
    })
  }
}

// ============================================================================
// FALLBACK RENDERING
// ============================================================================

/**
 * Fallback converter for unknown block types
 * Provides graceful degradation when a block type is not recognized
 */
export const createFallbackConverter = (blockType: string) => {
  return ({ node }: { node: { fields: any } }) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[RichText] Unknown block type: ${blockType}`, node.fields)
    }

    return React.createElement(
      'div',
      {
        className: 'p-4 border border-yellow-200 bg-yellow-50 rounded-md mb-4',
      },
      [
        React.createElement(
          'h4',
          {
            key: 'title',
            className: 'text-yellow-800 font-medium mb-2',
          },
          'Unknown Block Type',
        ),
        React.createElement(
          'p',
          {
            key: 'blockType',
            className: 'text-yellow-600 text-sm mb-2',
          },
          `Block type: ${blockType}`,
        ),
        React.createElement(
          'details',
          {
            key: 'details',
            className: 'text-yellow-600 text-sm',
          },
          [
            React.createElement(
              'summary',
              {
                key: 'summary',
                className: 'cursor-pointer hover:text-yellow-800',
              },
              'Show block data',
            ),
            React.createElement(
              'pre',
              {
                key: 'data',
                className: 'mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto',
              },
              JSON.stringify(node.fields, null, 2),
            ),
          ],
        ),
      ],
    )
  }
}

/**
 * Enhanced block converter registry with fallback support
 * Automatically handles unknown block types gracefully
 */
export const createEnhancedBlockConverters = (
  customConverters?: Partial<BlockConverter>,
): BlockConverter => {
  const baseConverters = mergeBlockConverters(customConverters)

  // Import fallback system
  const { createFallbackAwareConverters } = require('./fallbackRenderer')

  // Create fallback-aware converters
  return createFallbackAwareConverters(baseConverters, {
    showInProduction: false, // Hide unknown blocks in production
    showDetails: process.env.NODE_ENV === 'development',
    allowDataInspection: process.env.NODE_ENV === 'development',
    reportUnknownBlocks: true,
  })
}

// ============================================================================
// BLOCK VALIDATION
// ============================================================================

/**
 * Validates if a block has the required structure for rendering
 */
export const validateBlockNode = (node: any): boolean => {
  if (!node || typeof node !== 'object') {
    return false
  }

  if (!node.fields || typeof node.fields !== 'object') {
    return false
  }

  return true
}

/**
 * Validates if a block type is supported
 */
export const isBlockTypeSupported = (blockType: string): boolean => {
  return blockType in defaultBlockConverters
}

/**
 * Gets all supported block types
 */
export const getSupportedBlockTypes = (): string[] => {
  return Object.keys(defaultBlockConverters)
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Memoized block converter for performance optimization
 */
export const createMemoizedConverter = <T extends Record<string, any>>(
  converter: ({ node }: { node: { fields: T } }) => React.ReactElement,
) => {
  const memoizedConverter = React.memo(
    ({ node }: { node: { fields: T } }) => converter({ node }),
    (prevProps, nextProps) => {
      // Deep comparison of node fields for memoization
      return JSON.stringify(prevProps.node.fields) === JSON.stringify(nextProps.node.fields)
    },
  )

  return ({ node }: { node: { fields: T } }) => React.createElement(memoizedConverter, { node })
}

/**
 * Performance-optimized block converters with memoization
 */
export const optimizedBlockConverters: BlockConverter = Object.fromEntries(
  Object.entries(defaultBlockConverters)
    .map(([key, converter]) => [
      key,
      converter ? createMemoizedConverter(converter as any) : converter,
    ])
    .filter(([_, converter]) => converter !== undefined),
) as BlockConverter

// ============================================================================
// EXPORTS
// ============================================================================

// Export the main converter registry
export default defaultBlockConverters

// Export utilities for external use
export { createBlockConverter, createLegacyBlockConverter, getRichTextStyling, richTextVariants }

// Example of how to create a custom converter
export const createHeroBlockConverter = (className?: string) =>
  createBlockConverter(HeroBlock, 'hero', className)

export const createContentBlockConverter = (className?: string) =>
  createBlockConverter(ContentBlock, 'content', className)
