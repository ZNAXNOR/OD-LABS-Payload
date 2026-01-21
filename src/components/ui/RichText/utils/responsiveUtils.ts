import { cn } from '@/utilities/ui'
import type { ResponsiveOptions } from '../types'

// Mobile-first responsive breakpoints
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// Device detection utilities
export const getDeviceType = (): Breakpoint => {
  if (typeof window === 'undefined') return 'desktop' // SSR fallback

  const width = window.innerWidth
  if (width < BREAKPOINTS.tablet) return 'mobile'
  if (width < BREAKPOINTS.desktop) return 'tablet'
  if (width < BREAKPOINTS.wide) return 'desktop'
  return 'wide'
}

// Touch device detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Mobile-specific utilities
export const getMobileOptimizedClassName = (baseClass: string): string => {
  return cn(
    baseClass,
    // Mobile-first responsive adjustments
    'text-sm sm:text-base', // Smaller text on mobile
    'px-4 sm:px-6 lg:px-8', // Progressive padding
    'py-3 sm:py-4 lg:py-6', // Progressive vertical spacing
    'leading-relaxed sm:leading-normal', // Better line height on mobile
  )
}

// Block-specific mobile optimizations
export const getBlockMobileClasses = (blockType: string): string => {
  const baseClasses = 'w-full'

  switch (blockType) {
    case 'hero':
      return cn(
        baseClasses,
        'min-h-[60vh] sm:min-h-[75vh] lg:min-h-screen', // Progressive height
        'px-4 sm:px-6 lg:px-8', // Progressive padding
        'py-8 sm:py-12 lg:py-16', // Progressive vertical spacing
      )

    case 'content':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'space-y-4 sm:space-y-6 lg:space-y-8',
      )

    case 'mediaBlock':
      return cn(
        baseClasses,
        'px-2 sm:px-4 lg:px-6', // Tighter padding for media
        'py-4 sm:py-6 lg:py-8',
      )

    case 'cta':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-8 sm:py-10 lg:py-12',
        'text-center sm:text-left lg:text-center', // Responsive text alignment
      )

    case 'testimonial':
      return cn(
        baseClasses,
        'px-6 sm:px-8 lg:px-10',
        'py-6 sm:py-8 lg:py-10',
        'text-center', // Always centered for testimonials
      )

    case 'servicesGrid':
    case 'featureGrid':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
      )

    case 'pricingTable':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
      )

    case 'timeline':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'space-y-6 sm:space-y-8 lg:space-y-10',
      )

    case 'faqAccordion':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'space-y-2 sm:space-y-3 lg:space-y-4',
      )

    case 'statsCounter':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-8 sm:py-10 lg:py-12',
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
      )

    case 'contactForm':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'max-w-md sm:max-w-lg lg:max-w-2xl mx-auto',
      )

    case 'newsletter':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-10',
        'max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center',
      )

    case 'banner':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-3 sm:py-4 lg:py-5',
        'text-center sm:text-left',
      )

    case 'code':
      return cn(
        baseClasses,
        'px-2 sm:px-4 lg:px-6', // Tighter padding for code
        'py-4 sm:py-6 lg:py-8',
        'overflow-x-auto', // Horizontal scroll on mobile
      )

    case 'archive':
      return cn(
        baseClasses,
        'px-4 sm:px-6 lg:px-8',
        'py-6 sm:py-8 lg:py-12',
        'space-y-4 sm:space-y-6 lg:space-y-8',
      )

    default:
      return cn(baseClasses, 'px-4 sm:px-6 lg:px-8', 'py-6 sm:py-8 lg:py-12')
  }
}

// Typography scaling for mobile
export const getMobileTypographyClasses = (
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small',
): string => {
  switch (element) {
    case 'h1':
      return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'
    case 'h2':
      return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight'
    case 'h3':
      return 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight'
    case 'h4':
      return 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold leading-tight'
    case 'h5':
      return 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium leading-tight'
    case 'h6':
      return 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium leading-tight'
    case 'p':
      return 'text-sm sm:text-base md:text-lg leading-relaxed'
    case 'small':
      return 'text-xs sm:text-sm leading-relaxed'
    default:
      return 'text-sm sm:text-base leading-relaxed'
  }
}

// Button sizing for mobile
export const getMobileButtonClasses = (size: 'sm' | 'md' | 'lg' = 'md'): string => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'

  switch (size) {
    case 'sm':
      return cn(baseClasses, 'h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm')
    case 'md':
      return cn(baseClasses, 'h-9 px-4 text-sm sm:h-10 sm:px-6 sm:text-base')
    case 'lg':
      return cn(baseClasses, 'h-10 px-6 text-base sm:h-11 sm:px-8 sm:text-lg')
    default:
      return cn(baseClasses, 'h-9 px-4 text-sm sm:h-10 sm:px-6 sm:text-base')
  }
}

// Touch-friendly interaction classes
export const getTouchFriendlyClasses = (): string => {
  return cn(
    'min-h-[44px]', // Minimum touch target size (44px)
    'touch-manipulation', // Optimize for touch
    'select-none', // Prevent text selection on touch
    'active:scale-95', // Touch feedback
    'transition-transform duration-150 ease-out',
  )
}

// Responsive spacing utilities
export const getResponsiveSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): string => {
  switch (size) {
    case 'xs':
      return 'space-y-2 sm:space-y-3 lg:space-y-4'
    case 'sm':
      return 'space-y-3 sm:space-y-4 lg:space-y-6'
    case 'md':
      return 'space-y-4 sm:space-y-6 lg:space-y-8'
    case 'lg':
      return 'space-y-6 sm:space-y-8 lg:space-y-12'
    case 'xl':
      return 'space-y-8 sm:space-y-12 lg:space-y-16'
    default:
      return 'space-y-4 sm:space-y-6 lg:space-y-8'
  }
}

// Responsive grid utilities
export const getResponsiveGrid = (
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3,
  wide: number = 4,
): string => {
  return cn(
    'grid gap-4 sm:gap-6 lg:gap-8',
    `grid-cols-${mobile}`,
    `sm:grid-cols-${tablet}`,
    `lg:grid-cols-${desktop}`,
    `xl:grid-cols-${wide}`,
  )
}

// Container query support detection
export const supportsContainerQueries = (): boolean => {
  if (typeof window === 'undefined') return false
  return CSS.supports('container-type: inline-size')
}

// Container query classes
export const getContainerQueryClasses = (containerName?: string): string => {
  if (!supportsContainerQueries()) {
    // Fallback to regular responsive classes
    return 'w-full'
  }

  const containerClass = containerName ? `@container/${containerName}` : '@container'

  return cn(
    containerClass,
    'w-full',
    // Container query responsive classes
    '@xs:px-4 @sm:px-6 @md:px-8 @lg:px-10',
    '@xs:py-3 @sm:py-4 @md:py-6 @lg:py-8',
  )
}

// Responsive image sizing
export const getResponsiveImageSizes = (
  mobile: string = '100vw',
  tablet: string = '50vw',
  desktop: string = '33vw',
): string => {
  return `(max-width: 768px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`
}

// Video responsive utilities
export const getResponsiveVideoClasses = (): string => {
  return cn(
    'w-full h-auto',
    'aspect-video', // 16:9 aspect ratio
    'object-cover',
    'rounded-lg sm:rounded-xl lg:rounded-2xl', // Progressive border radius
  )
}

// Form responsive utilities
export const getResponsiveFormClasses = (): string => {
  return cn(
    'w-full',
    'space-y-3 sm:space-y-4 lg:space-y-6',
    'px-4 sm:px-6 lg:px-8',
    'py-6 sm:py-8 lg:py-10',
  )
}

// Navigation responsive utilities
export const getResponsiveNavClasses = (): string => {
  return cn(
    'flex flex-col sm:flex-row',
    'space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6',
    'items-start sm:items-center',
  )
}

// Card responsive utilities
export const getResponsiveCardClasses = (): string => {
  return cn(
    'rounded-lg sm:rounded-xl lg:rounded-2xl',
    'p-4 sm:p-6 lg:p-8',
    'shadow-sm sm:shadow-md lg:shadow-lg',
    'border border-gray-200 dark:border-gray-800',
  )
}

// Responsive utilities for RichText component
export const getRichTextResponsiveClasses = (responsive?: ResponsiveOptions): string => {
  if (!responsive) {
    return cn(
      'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl',
      'max-w-none sm:max-w-prose lg:max-w-4xl',
      'mx-auto',
    )
  }

  const classes = ['prose dark:prose-invert max-w-none']

  // Mobile classes
  if (responsive.mobile) {
    if (responsive.mobile.enableProse !== false) {
      classes.push('prose-sm')
    }
    if (responsive.mobile.className) {
      classes.push(responsive.mobile.className)
    }
  }

  // Tablet classes
  if (responsive.tablet) {
    if (responsive.tablet.enableProse !== false) {
      classes.push('sm:prose-base')
    }
    if (responsive.tablet.className) {
      classes.push(`sm:${responsive.tablet.className}`)
    }
  }

  // Desktop classes
  if (responsive.desktop) {
    if (responsive.desktop.enableProse !== false) {
      classes.push('lg:prose-lg')
    }
    if (responsive.desktop.className) {
      classes.push(`lg:${responsive.desktop.className}`)
    }
  }

  return cn(...classes)
}

// Performance optimization for mobile
export const getMobilePerformanceClasses = (): string => {
  return cn(
    'will-change-transform', // Optimize for animations
    'backface-visibility-hidden', // Prevent flickering
    'transform-gpu', // Use GPU acceleration
  )
}

// Accessibility improvements for mobile
export const getMobileA11yClasses = (): string => {
  return cn(
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    'active:outline-none', // Remove outline on touch
  )
}

// Export all utilities
export const responsiveUtils = {
  getDeviceType,
  isTouchDevice,
  getMobileOptimizedClassName,
  getBlockMobileClasses,
  getMobileTypographyClasses,
  getMobileButtonClasses,
  getTouchFriendlyClasses,
  getResponsiveSpacing,
  getResponsiveGrid,
  supportsContainerQueries,
  getContainerQueryClasses,
  getResponsiveImageSizes,
  getResponsiveVideoClasses,
  getResponsiveFormClasses,
  getResponsiveNavClasses,
  getResponsiveCardClasses,
  getRichTextResponsiveClasses,
  getMobilePerformanceClasses,
  getMobileA11yClasses,
}
