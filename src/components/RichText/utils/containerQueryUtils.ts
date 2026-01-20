/**
 * Container Query Utilities for RichText Components
 *
 * Provides utilities for implementing container queries in RichText components,
 * allowing components to adapt based on their container size rather than viewport size.
 */

import React from 'react'
import { cn } from '@/utilities/ui'

// ============================================================================
// CONTAINER QUERY TYPES AND INTERFACES
// ============================================================================

export interface ContainerQueryConfig {
  name?: string
  type?: 'inline-size' | 'block-size' | 'size'
  breakpoints?: Record<string, number>
  className?: string
}

export interface ContainerBreakpoint {
  name: string
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

export interface ContainerQueryClasses {
  container: string
  queries: Record<string, string>
}

// ============================================================================
// CONTAINER QUERY BREAKPOINTS
// ============================================================================

/**
 * Default container query breakpoints for RichText components
 */
export const defaultContainerBreakpoints: Record<string, number> = {
  xs: 320,
  sm: 480,
  md: 640,
  lg: 768,
  xl: 1024,
  '2xl': 1280,
}

/**
 * RichText-specific container breakpoints
 */
export const richTextContainerBreakpoints: Record<string, number> = {
  narrow: 300,
  compact: 400,
  comfortable: 600,
  spacious: 800,
  wide: 1000,
}

/**
 * Block-specific container breakpoints
 */
export const blockContainerBreakpoints: Record<string, number> = {
  'block-xs': 200,
  'block-sm': 300,
  'block-md': 400,
  'block-lg': 600,
  'block-xl': 800,
}

// ============================================================================
// CONTAINER QUERY UTILITIES
// ============================================================================

/**
 * Generate container query classes for a component
 */
export const createContainerQueryClasses = (
  config?: ContainerQueryConfig,
): ContainerQueryClasses => {
  const {
    name = 'richtext',
    breakpoints = defaultContainerBreakpoints,
    className = '',
  } = config || {}

  const containerClass = cn(`@container/${name}`, className)

  const queries: Record<string, string> = {}

  Object.entries(breakpoints).forEach(([breakpoint]) => {
    queries[breakpoint] = `@${breakpoint}/${name}`
  })

  return {
    container: containerClass,
    queries,
  }
}

/**
 * Generate responsive container query classes
 */
export const createResponsiveContainerClasses = (
  breakpoints: Record<string, string>,
  containerName = 'richtext',
): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, classes]) => `@${breakpoint}/${containerName}:${classes}`)
    .join(' ')
}

/**
 * Create container-aware responsive classes
 */
export const createContainerAwareClasses = (config: {
  base?: string
  container?: Record<string, string>
  viewport?: Record<string, string>
  containerName?: string
}): string => {
  const { base = '', container = {}, viewport = {}, containerName = 'richtext' } = config

  const classes = [base]

  // Add viewport-based responsive classes
  Object.entries(viewport).forEach(([breakpoint, classNames]) => {
    classes.push(`${breakpoint}:${classNames}`)
  })

  // Add container-based responsive classes
  Object.entries(container).forEach(([breakpoint, classNames]) => {
    classes.push(`@${breakpoint}/${containerName}:${classNames}`)
  })

  return cn(...classes)
}

// ============================================================================
// CONTAINER QUERY HOOKS AND UTILITIES
// ============================================================================

/**
 * Generate container query CSS custom properties
 */
export const generateContainerQueryCSS = (
  breakpoints: Record<string, number>,
  containerName = 'richtext',
): string => {
  const cssRules = Object.entries(breakpoints)
    .map(([name, width]) => {
      return `
        @container ${containerName} (min-width: ${width}px) {
          .@${name}\\/${containerName}\\:block { display: block; }
          .@${name}\\/${containerName}\\:hidden { display: none; }
          .@${name}\\/${containerName}\\:flex { display: flex; }
          .@${name}\\/${containerName}\\:grid { display: grid; }
          .@${name}\\/${containerName}\\:inline { display: inline; }
          .@${name}\\/${containerName}\\:inline-block { display: inline-block; }
          
          .@${name}\\/${containerName}\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
          .@${name}\\/${containerName}\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .@${name}\\/${containerName}\\:text-base { font-size: 1rem; line-height: 1.5rem; }
          .@${name}\\/${containerName}\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .@${name}\\/${containerName}\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .@${name}\\/${containerName}\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
          
          .@${name}\\/${containerName}\\:p-1 { padding: 0.25rem; }
          .@${name}\\/${containerName}\\:p-2 { padding: 0.5rem; }
          .@${name}\\/${containerName}\\:p-3 { padding: 0.75rem; }
          .@${name}\\/${containerName}\\:p-4 { padding: 1rem; }
          .@${name}\\/${containerName}\\:p-6 { padding: 1.5rem; }
          .@${name}\\/${containerName}\\:p-8 { padding: 2rem; }
          
          .@${name}\\/${containerName}\\:m-1 { margin: 0.25rem; }
          .@${name}\\/${containerName}\\:m-2 { margin: 0.5rem; }
          .@${name}\\/${containerName}\\:m-3 { margin: 0.75rem; }
          .@${name}\\/${containerName}\\:m-4 { margin: 1rem; }
          .@${name}\\/${containerName}\\:m-6 { margin: 1.5rem; }
          .@${name}\\/${containerName}\\:m-8 { margin: 2rem; }
          
          .@${name}\\/${containerName}\\:gap-1 { gap: 0.25rem; }
          .@${name}\\/${containerName}\\:gap-2 { gap: 0.5rem; }
          .@${name}\\/${containerName}\\:gap-3 { gap: 0.75rem; }
          .@${name}\\/${containerName}\\:gap-4 { gap: 1rem; }
          .@${name}\\/${containerName}\\:gap-6 { gap: 1.5rem; }
          .@${name}\\/${containerName}\\:gap-8 { gap: 2rem; }
          
          .@${name}\\/${containerName}\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          .@${name}\\/${containerName}\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .@${name}\\/${containerName}\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .@${name}\\/${containerName}\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          
          .@${name}\\/${containerName}\\:w-full { width: 100%; }
          .@${name}\\/${containerName}\\:w-1\\/2 { width: 50%; }
          .@${name}\\/${containerName}\\:w-1\\/3 { width: 33.333333%; }
          .@${name}\\/${containerName}\\:w-2\\/3 { width: 66.666667%; }
          .@${name}\\/${containerName}\\:w-1\\/4 { width: 25%; }
          .@${name}\\/${containerName}\\:w-3\\/4 { width: 75%; }
        }
      `
    })
    .join('\n')

  return cssRules
}

// ============================================================================
// CONTAINER QUERY COMPONENT UTILITIES
// ============================================================================

/**
 * Create container query wrapper component props
 */
export const createContainerQueryWrapper = (config?: ContainerQueryConfig) => {
  const { container, queries } = createContainerQueryClasses(config)

  return {
    className: container,
    'data-container-queries': Object.keys(queries).join(','),
    style: {
      containerType: config?.type || 'inline-size',
      containerName: config?.name || 'richtext',
    } as React.CSSProperties,
  }
}

/**
 * Container query aware media classes
 */
export const createContainerAwareMediaClasses = (
  containerName = 'richtext',
): Record<string, string> => {
  return {
    // Image classes
    image: createContainerAwareClasses({
      base: 'w-full h-auto object-cover rounded-lg',
      container: {
        narrow: 'rounded-md',
        compact: 'rounded-lg',
        comfortable: 'rounded-xl',
        spacious: 'rounded-2xl',
      },
      containerName,
    }),

    // Video classes
    video: createContainerAwareClasses({
      base: 'w-full aspect-video object-cover rounded-lg',
      container: {
        narrow: 'aspect-square rounded-md',
        compact: 'aspect-video rounded-lg',
        comfortable: 'aspect-video rounded-xl',
        spacious: 'aspect-[21/9] rounded-2xl',
      },
      containerName,
    }),

    // Caption classes
    caption: createContainerAwareClasses({
      base: 'mt-2 text-sm text-gray-600 dark:text-gray-400',
      container: {
        narrow: 'text-xs mt-1',
        compact: 'text-sm mt-2',
        comfortable: 'text-base mt-3',
        spacious: 'text-lg mt-4',
      },
      containerName,
    }),

    // Gallery classes
    gallery: createContainerAwareClasses({
      base: 'grid gap-2',
      container: {
        narrow: 'grid-cols-1 gap-1',
        compact: 'grid-cols-2 gap-2',
        comfortable: 'grid-cols-3 gap-3',
        spacious: 'grid-cols-4 gap-4',
        wide: 'grid-cols-5 gap-6',
      },
      containerName,
    }),
  }
}

/**
 * Container query aware typography classes
 */
export const createContainerAwareTypographyClasses = (
  containerName = 'richtext',
): Record<string, string> => {
  return {
    // Heading classes
    h1: createContainerAwareClasses({
      base: 'text-2xl font-bold mb-4',
      container: {
        narrow: 'text-xl mb-2',
        compact: 'text-2xl mb-3',
        comfortable: 'text-3xl mb-4',
        spacious: 'text-4xl mb-6',
        wide: 'text-5xl mb-8',
      },
      containerName,
    }),

    h2: createContainerAwareClasses({
      base: 'text-xl font-bold mb-3',
      container: {
        narrow: 'text-lg mb-2',
        compact: 'text-xl mb-3',
        comfortable: 'text-2xl mb-4',
        spacious: 'text-3xl mb-5',
        wide: 'text-4xl mb-6',
      },
      containerName,
    }),

    h3: createContainerAwareClasses({
      base: 'text-lg font-bold mb-2',
      container: {
        narrow: 'text-base mb-1',
        compact: 'text-lg mb-2',
        comfortable: 'text-xl mb-3',
        spacious: 'text-2xl mb-4',
        wide: 'text-3xl mb-5',
      },
      containerName,
    }),

    // Paragraph classes
    p: createContainerAwareClasses({
      base: 'text-base mb-4 leading-relaxed',
      container: {
        narrow: 'text-sm mb-2 leading-normal',
        compact: 'text-base mb-3 leading-relaxed',
        comfortable: 'text-lg mb-4 leading-relaxed',
        spacious: 'text-xl mb-6 leading-loose',
      },
      containerName,
    }),

    // List classes
    ul: createContainerAwareClasses({
      base: 'list-disc list-inside mb-4 space-y-1',
      container: {
        narrow: 'mb-2 space-y-0.5 text-sm',
        compact: 'mb-3 space-y-1 text-base',
        comfortable: 'mb-4 space-y-2 text-lg',
        spacious: 'mb-6 space-y-3 text-xl',
      },
      containerName,
    }),

    ol: createContainerAwareClasses({
      base: 'list-decimal list-inside mb-4 space-y-1',
      container: {
        narrow: 'mb-2 space-y-0.5 text-sm',
        compact: 'mb-3 space-y-1 text-base',
        comfortable: 'mb-4 space-y-2 text-lg',
        spacious: 'mb-6 space-y-3 text-xl',
      },
      containerName,
    }),

    // Blockquote classes
    blockquote: createContainerAwareClasses({
      base: 'border-l-4 border-gray-300 pl-4 italic mb-4',
      container: {
        narrow: 'border-l-2 pl-2 text-sm mb-2',
        compact: 'border-l-3 pl-3 text-base mb-3',
        comfortable: 'border-l-4 pl-4 text-lg mb-4',
        spacious: 'border-l-6 pl-6 text-xl mb-6',
      },
      containerName,
    }),
  }
}

/**
 * Container query aware block classes
 */
export const createContainerAwareBlockClasses = (
  containerName = 'richtext',
): Record<string, string> => {
  return {
    // Generic block wrapper
    block: createContainerAwareClasses({
      base: 'mb-6',
      container: {
        narrow: 'mb-3',
        compact: 'mb-4',
        comfortable: 'mb-6',
        spacious: 'mb-8',
        wide: 'mb-12',
      },
      containerName,
    }),

    // Hero block
    hero: createContainerAwareClasses({
      base: 'py-8 px-4',
      container: {
        narrow: 'py-4 px-2',
        compact: 'py-6 px-3',
        comfortable: 'py-8 px-4',
        spacious: 'py-12 px-6',
        wide: 'py-16 px-8',
      },
      containerName,
    }),

    // Content block
    content: createContainerAwareClasses({
      base: 'prose max-w-none',
      container: {
        narrow: 'prose-sm',
        compact: 'prose',
        comfortable: 'prose-lg',
        spacious: 'prose-xl',
        wide: 'prose-2xl',
      },
      containerName,
    }),

    // Call-to-action block
    cta: createContainerAwareClasses({
      base: 'p-6 bg-gray-50 dark:bg-gray-800 rounded-lg',
      container: {
        narrow: 'p-3 rounded-md',
        compact: 'p-4 rounded-lg',
        comfortable: 'p-6 rounded-xl',
        spacious: 'p-8 rounded-2xl',
        wide: 'p-12 rounded-3xl',
      },
      containerName,
    }),
  }
}

// ============================================================================
// CONTAINER QUERY DETECTION UTILITIES
// ============================================================================

/**
 * Check if container queries are supported
 */
export const supportsContainerQueries = (): boolean => {
  if (typeof window === 'undefined') return false

  try {
    return CSS.supports('container-type', 'inline-size')
  } catch {
    return false
  }
}

/**
 * Fallback classes for browsers that don't support container queries
 */
export const createFallbackClasses = (
  containerClasses: string,
  viewportClasses: string,
): string => {
  if (supportsContainerQueries()) {
    return containerClasses
  }
  return viewportClasses
}

/**
 * Progressive enhancement for container queries
 */
export const createProgressiveContainerClasses = (config: {
  base: string
  container: Record<string, string>
  viewport: Record<string, string>
  containerName?: string
}): string => {
  const { base, container, viewport, containerName = 'richtext' } = config

  if (!supportsContainerQueries()) {
    // Fallback to viewport-based responsive classes
    return createContainerAwareClasses({
      base,
      viewport,
    })
  }

  // Use container queries
  return createContainerAwareClasses({
    base,
    container,
    containerName,
  })
}

// ============================================================================
// All functions are exported individually above
