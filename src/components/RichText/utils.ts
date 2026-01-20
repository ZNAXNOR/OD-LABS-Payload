import React from 'react'
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type {
  BlockTypeString,
  BlockCategory,
  BlockRegistry,
  ResponsiveOptions,
  EnhancedRichTextProps,
} from './types'
import { cn } from '@/utilities/ui'

// Block registry with metadata for all available blocks
export const blockRegistry: BlockRegistry = {
  // Hero blocks
  hero: {
    category: 'hero',
    description: 'Hero section with customizable variants',
    supportsRichText: true,
  },

  // Content blocks
  content: {
    category: 'content',
    description: 'Flexible content block with columns',
    supportsRichText: true,
  },
  archive: {
    category: 'content',
    description: 'Archive listing with filtering',
    supportsRichText: false,
  },
  code: {
    category: 'content',
    description: 'Code block with syntax highlighting',
    supportsRichText: false,
  },

  // Layout blocks
  container: {
    category: 'layout',
    description: 'Container wrapper with max-width options',
    supportsRichText: true,
  },
  divider: {
    category: 'layout',
    description: 'Visual divider with customizable styles',
    supportsRichText: false,
  },
  spacer: {
    category: 'layout',
    description: 'Spacing element with responsive heights',
    supportsRichText: false,
  },

  // CTA blocks
  cta: {
    category: 'cta',
    description: 'Call-to-action with multiple layout variants',
    supportsRichText: true,
  },
  banner: {
    category: 'cta',
    description: 'Notification banner with status styles',
    supportsRichText: true,
  },
  contactForm: {
    category: 'cta',
    description: 'Contact form with customizable fields',
    supportsRichText: false,
  },
  newsletter: {
    category: 'cta',
    description: 'Newsletter signup form',
    supportsRichText: true,
  },
  socialProof: {
    category: 'cta',
    description: 'Social proof elements (logos, testimonials)',
    supportsRichText: true,
  },

  // Portfolio blocks
  projectShowcase: {
    category: 'portfolio',
    description: 'Project showcase with media and details',
    supportsRichText: true,
  },
  caseStudy: {
    category: 'portfolio',
    description: 'Case study presentation',
    supportsRichText: true,
  },
  beforeAfter: {
    category: 'portfolio',
    description: 'Before/after comparison slider',
    supportsRichText: true,
  },
  testimonial: {
    category: 'portfolio',
    description: 'Customer testimonials',
    supportsRichText: true,
  },

  // Services blocks
  servicesGrid: {
    category: 'services',
    description: 'Grid of services with icons and descriptions',
    supportsRichText: true,
  },
  techStack: {
    category: 'services',
    description: 'Technology stack showcase',
    supportsRichText: true,
  },
  processSteps: {
    category: 'services',
    description: 'Step-by-step process visualization',
    supportsRichText: true,
  },
  pricingTable: {
    category: 'services',
    description: 'Pricing comparison table',
    supportsRichText: true,
  },

  // Technical blocks
  faqAccordion: {
    category: 'technical',
    description: 'FAQ accordion with expandable items',
    supportsRichText: true,
  },
  featureGrid: {
    category: 'technical',
    description: 'Feature grid with icons and descriptions',
    supportsRichText: true,
  },
  statsCounter: {
    category: 'technical',
    description: 'Statistics counter with animations',
    supportsRichText: true,
  },
  timeline: {
    category: 'technical',
    description: 'Timeline visualization',
    supportsRichText: true,
  },
  mediaBlock: {
    category: 'technical',
    description: 'Media display with captions',
    supportsRichText: false,
  },
}

// Utility functions for block management
export const getBlocksByCategory = (category: BlockCategory): BlockTypeString[] => {
  return Object.entries(blockRegistry)
    .filter(([, metadata]) => metadata.category === category)
    .map(([blockType]) => blockType as BlockTypeString)
}

export const getBlockMetadata = (blockType: BlockTypeString) => {
  return blockRegistry[blockType]
}

export const isBlockSupported = (blockType: string): blockType is BlockTypeString => {
  return blockType in blockRegistry
}

export const filterBlocksByWhitelist = (whitelist: string[]): BlockTypeString[] => {
  return whitelist.filter(isBlockSupported)
}

// Validate block whitelist and provide helpful warnings
export const validateBlockWhitelist = (
  whitelist: string[],
): {
  valid: BlockTypeString[]
  invalid: string[]
  warnings: string[]
} => {
  const valid: BlockTypeString[] = []
  const invalid: string[] = []
  const warnings: string[] = []

  whitelist.forEach((blockType) => {
    if (isBlockSupported(blockType)) {
      valid.push(blockType as BlockTypeString)
    } else {
      invalid.push(blockType)
      warnings.push(
        `Block type "${blockType}" is not supported. Available blocks: ${Object.keys(blockRegistry).join(', ')}`,
      )
    }
  })

  return { valid, invalid, warnings }
}

// Get available blocks for a specific category (useful for whitelisting)
export const getBlockWhitelistByCategory = (categories: BlockCategory[]): BlockTypeString[] => {
  return categories.flatMap((category) => getBlocksByCategory(category))
}

// Enhanced link utilities with validation and error handling
export const generateInternalHref = (value: any, relationTo: string): string => {
  if (typeof value !== 'object' || !value?.slug) {
    throw new Error('Expected value to be an object with slug property')
  }

  const slug = value.slug

  // Handle different collection types with enhanced routing
  switch (relationTo) {
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    case 'blogs':
      return `/blogs/${slug}`
    case 'services':
      return `/services/${slug}`
    case 'legal':
      return `/legal/${slug}`
    case 'contacts':
      return `/contacts/${slug}`
    default:
      // Log warning for unknown collection types
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown collection type for internal link: ${relationTo}`)
      }
      return `/${slug}`
  }
}

// Enhanced internal link resolution with validation
export const generateValidatedInternalHref = (
  value: any,
  relationTo: string,
  options: {
    validateSlug?: boolean
    allowedCollections?: string[]
    baseUrl?: string
  } = {},
): string => {
  const { validateSlug = true, allowedCollections, baseUrl = '' } = options

  // Validate input
  if (typeof value !== 'object' || !value) {
    throw new Error('Invalid link value: expected object')
  }

  if (!value.slug) {
    throw new Error('Invalid link value: missing slug property')
  }

  // Validate collection type
  if (allowedCollections && !allowedCollections.includes(relationTo)) {
    throw new Error(
      `Invalid collection type: ${relationTo}. Allowed: ${allowedCollections.join(', ')}`,
    )
  }

  // Validate slug format
  if (validateSlug && typeof value.slug !== 'string') {
    throw new Error('Invalid slug: must be a string')
  }

  if (validateSlug && !/^[a-z0-9-]+$/.test(value.slug) && value.slug !== 'home') {
    console.warn(`Potentially invalid slug format: ${value.slug}`)
  }

  // Generate the href
  const href = generateInternalHref(value, relationTo)

  // Add base URL if provided
  return baseUrl ? `${baseUrl}${href}` : href
}

// Check if internal link exists (would need to be implemented with actual data fetching)
export const validateInternalLinkExists = async (
  value: any,
  relationTo: string,
  payload?: any,
): Promise<boolean> => {
  if (!payload) {
    // If no payload instance available, assume link is valid
    return true
  }

  try {
    const doc = await payload.findByID({
      collection: relationTo,
      id: value.id,
      depth: 0,
    })
    return !!doc
  } catch (error) {
    console.warn(`Failed to validate internal link existence:`, error)
    return false
  }
}

// Enhanced external link props with security and validation
export const getExternalLinkProps = (linkNode: SerializedLinkNode) => {
  const props: Record<string, any> = {}

  // Handle "open in new tab" option (support both field names)
  if (linkNode.fields.newTab || linkNode.fields.openInNewTab) {
    props.target = '_blank'
    // Always add security attributes for external links
    props.rel = 'noopener noreferrer'
  }

  // Handle custom rel attributes
  if (linkNode.fields.rel) {
    const relValues = Array.isArray(linkNode.fields.rel)
      ? linkNode.fields.rel
      : [linkNode.fields.rel]

    // Merge with existing rel values
    const existingRel = props.rel ? props.rel.split(' ') : []
    const combinedRel = [...new Set([...existingRel, ...relValues])]
    props.rel = combinedRel.join(' ')
  }

  // Add security attributes for external links if not already present
  if (linkNode.fields.url && !props.rel) {
    props.rel = 'noopener'
  }

  return props
}

// Enhanced external link props with validation
export const getValidatedExternalLinkProps = (
  linkNode: SerializedLinkNode,
  validationRules: {
    requireHttps?: boolean
    allowedDomains?: string[]
    blockedDomains?: string[]
  } = {},
) => {
  const url = linkNode.fields.url
  const props = getExternalLinkProps(linkNode)

  if (!url) {
    return props
  }

  try {
    const urlObj = new URL(url)

    // Check HTTPS requirement
    if (validationRules.requireHttps && urlObj.protocol !== 'https:') {
      console.warn(`Non-HTTPS external link detected: ${url}`)
      props['data-insecure'] = 'true'
    }

    // Check allowed domains
    if (validationRules.allowedDomains && validationRules.allowedDomains.length > 0) {
      const isAllowed = validationRules.allowedDomains.some((domain) =>
        urlObj.hostname.endsWith(domain.toLowerCase()),
      )
      if (!isAllowed) {
        console.warn(`External link to non-allowed domain: ${urlObj.hostname}`)
        props['data-external-domain'] = 'restricted'
      }
    }

    // Check blocked domains
    if (validationRules.blockedDomains && validationRules.blockedDomains.length > 0) {
      const isBlocked = validationRules.blockedDomains.some((domain) =>
        urlObj.hostname.endsWith(domain.toLowerCase()),
      )
      if (isBlocked) {
        console.warn(`External link to blocked domain: ${urlObj.hostname}`)
        props['data-blocked'] = 'true'
        // Disable the link
        props.onClick = (e: React.MouseEvent) => {
          e.preventDefault()
          alert(`Link to ${urlObj.hostname} is blocked`)
        }
      }
    }

    // Add domain information for styling/analytics
    props['data-external-domain'] = urlObj.hostname
  } catch (error) {
    console.warn(`Invalid external URL: ${url}`)
    props['data-invalid-url'] = 'true'
  }

  return props
}

// Responsive utilities
export const getResponsiveClassName = (
  baseClassName: string,
  responsive?: ResponsiveOptions,
): string => {
  if (!responsive) return baseClassName

  const classes = [baseClassName]

  if (responsive.mobile?.className) {
    classes.push(responsive.mobile.className)
  }

  if (responsive.tablet?.className) {
    classes.push(`md:${responsive.tablet.className}`)
  }

  if (responsive.desktop?.className) {
    classes.push(`lg:${responsive.desktop.className}`)
  }

  return cn(...classes)
}

export const getResponsiveProps = (
  baseProps: Partial<EnhancedRichTextProps>,
  responsive?: ResponsiveOptions,
  currentBreakpoint?: 'mobile' | 'tablet' | 'desktop',
): Partial<EnhancedRichTextProps> => {
  if (!responsive) return baseProps

  // Determine current breakpoint if not provided
  const breakpoint = currentBreakpoint || getCurrentBreakpoint()

  // Merge responsive props based on current breakpoint
  const responsiveProps = responsive[breakpoint]
  if (!responsiveProps) return baseProps

  return {
    ...baseProps,
    enableGutter: responsiveProps.enableGutter ?? baseProps.enableGutter,
    enableProse: responsiveProps.enableProse ?? baseProps.enableProse,
    className: cn(baseProps.className, responsiveProps.className),
  }
}

// Utility to detect current breakpoint (client-side only)
export const getCurrentBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop' // SSR fallback

  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Hook for responsive breakpoint detection (would be used in client components)
export const useResponsiveBreakpoint = () => {
  if (typeof window === 'undefined') return 'desktop'

  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>(
    getCurrentBreakpoint(),
  )

  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Responsive container utilities
export const getResponsiveContainerClass = (
  enableGutter: boolean,
  responsive?: ResponsiveOptions,
): string => {
  const baseClass = enableGutter ? 'container' : 'max-w-none'

  if (!responsive) return baseClass

  const classes = [baseClass]

  // Add responsive container classes
  if (responsive.mobile?.enableGutter !== undefined) {
    classes.push(responsive.mobile.enableGutter ? 'container' : 'max-w-none')
  }

  if (responsive.tablet?.enableGutter !== undefined) {
    classes.push(responsive.tablet.enableGutter ? 'md:container' : 'md:max-w-none')
  }

  if (responsive.desktop?.enableGutter !== undefined) {
    classes.push(responsive.desktop.enableGutter ? 'lg:container' : 'lg:max-w-none')
  }

  return cn(...classes)
}

// Responsive prose utilities
export const getResponsiveProseClass = (
  enableProse: boolean,
  responsive?: ResponsiveOptions,
): string => {
  const baseClass = enableProse ? 'mx-auto prose md:prose-md dark:prose-invert' : ''

  if (!responsive) return baseClass

  const classes = []

  // Add base class if enabled
  if (enableProse) classes.push('mx-auto prose dark:prose-invert')

  // Add responsive prose classes
  if (responsive.mobile?.enableProse !== undefined) {
    if (responsive.mobile.enableProse) {
      classes.push('prose-sm')
    }
  }

  if (responsive.tablet?.enableProse !== undefined) {
    if (responsive.tablet.enableProse) {
      classes.push('md:prose-md')
    } else {
      classes.push('md:prose-none')
    }
  }

  if (responsive.desktop?.enableProse !== undefined) {
    if (responsive.desktop.enableProse) {
      classes.push('lg:prose-lg')
    } else {
      classes.push('lg:prose-none')
    }
  }

  return cn(...classes)
}

// Content validation utilities
export const validateRichTextData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false
  if (!data.root || typeof data.root !== 'object') return false
  if (!Array.isArray(data.root.children)) return false
  return true
}

export const hasBlocks = (data: any): boolean => {
  if (!validateRichTextData(data)) return false

  const findBlocks = (children: any[]): boolean => {
    return children.some((child) => {
      if (child.type === 'block') return true
      if (child.children && Array.isArray(child.children)) {
        return findBlocks(child.children)
      }
      return false
    })
  }

  return findBlocks(data.root.children)
}

// Performance utilities
export const memoizeConverter = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
): T => {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Error handling utilities
export const createErrorBoundaryWrapper = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error: Error }>,
) => {
  // Import the enhanced error boundary
  const { createBlockErrorBoundary, getErrorFallback } = require('./converters/errorBoundary')

  const errorFallback = fallback || getErrorFallback()

  return createBlockErrorBoundary(Component, {
    fallback: errorFallback,
    maxRetries: 2,
    onError: (error: Error, errorInfo: React.ErrorInfo) => {
      console.error('RichText block rendering error:', {
        error,
        errorInfo,
        component: Component.displayName || Component.name,
      })
    },
  })
}

// Default error fallback component
export const DefaultBlockErrorFallback: React.FC<{ error: Error; blockType?: string }> = ({
  error,
  blockType,
}) => {
  // Import the default fallback from error boundary
  const { DefaultErrorFallback } = require('./converters/errorBoundary')

  return React.createElement(DefaultErrorFallback, {
    error,
    blockType,
    retry: () => {}, // No-op for compatibility
    canRetry: false,
    retryCount: 0,
  })
}
