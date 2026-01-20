import { cn } from '@/utilities/ui'

// Typography scale configuration
export const TYPOGRAPHY_SCALE = {
  // Base font sizes (mobile-first)
  base: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// Responsive typography utilities
export interface TypographyConfig {
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small' | 'caption' | 'lead'
  mobile?: {
    size?: keyof typeof TYPOGRAPHY_SCALE.base
    lineHeight?: keyof typeof TYPOGRAPHY_SCALE.lineHeight
    letterSpacing?: keyof typeof TYPOGRAPHY_SCALE.letterSpacing
    weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  }
  tablet?: {
    size?: keyof typeof TYPOGRAPHY_SCALE.base
    lineHeight?: keyof typeof TYPOGRAPHY_SCALE.lineHeight
    letterSpacing?: keyof typeof TYPOGRAPHY_SCALE.letterSpacing
    weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  }
  desktop?: {
    size?: keyof typeof TYPOGRAPHY_SCALE.base
    lineHeight?: keyof typeof TYPOGRAPHY_SCALE.lineHeight
    letterSpacing?: keyof typeof TYPOGRAPHY_SCALE.letterSpacing
    weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  }
}

// Default typography configurations for each element
export const DEFAULT_TYPOGRAPHY_CONFIGS: Record<TypographyConfig['element'], TypographyConfig> = {
  h1: {
    element: 'h1',
    mobile: { size: '2xl', lineHeight: 'tight', weight: 'bold' },
    tablet: { size: '4xl', lineHeight: 'tight', weight: 'bold' },
    desktop: { size: '6xl', lineHeight: 'tight', weight: 'bold' },
  },
  h2: {
    element: 'h2',
    mobile: { size: 'xl', lineHeight: 'tight', weight: 'bold' },
    tablet: { size: '3xl', lineHeight: 'tight', weight: 'bold' },
    desktop: { size: '5xl', lineHeight: 'tight', weight: 'bold' },
  },
  h3: {
    element: 'h3',
    mobile: { size: 'lg', lineHeight: 'snug', weight: 'semibold' },
    tablet: { size: '2xl', lineHeight: 'snug', weight: 'semibold' },
    desktop: { size: '4xl', lineHeight: 'snug', weight: 'semibold' },
  },
  h4: {
    element: 'h4',
    mobile: { size: 'base', lineHeight: 'snug', weight: 'semibold' },
    tablet: { size: 'xl', lineHeight: 'snug', weight: 'semibold' },
    desktop: { size: '3xl', lineHeight: 'snug', weight: 'semibold' },
  },
  h5: {
    element: 'h5',
    mobile: { size: 'sm', lineHeight: 'snug', weight: 'medium' },
    tablet: { size: 'lg', lineHeight: 'snug', weight: 'medium' },
    desktop: { size: '2xl', lineHeight: 'snug', weight: 'medium' },
  },
  h6: {
    element: 'h6',
    mobile: { size: 'xs', lineHeight: 'snug', weight: 'medium' },
    tablet: { size: 'base', lineHeight: 'snug', weight: 'medium' },
    desktop: { size: 'xl', lineHeight: 'snug', weight: 'medium' },
  },
  p: {
    element: 'p',
    mobile: { size: 'sm', lineHeight: 'relaxed', weight: 'normal' },
    tablet: { size: 'base', lineHeight: 'relaxed', weight: 'normal' },
    desktop: { size: 'lg', lineHeight: 'relaxed', weight: 'normal' },
  },
  small: {
    element: 'small',
    mobile: { size: 'xs', lineHeight: 'normal', weight: 'normal' },
    tablet: { size: 'sm', lineHeight: 'normal', weight: 'normal' },
    desktop: { size: 'base', lineHeight: 'normal', weight: 'normal' },
  },
  caption: {
    element: 'caption',
    mobile: { size: 'xs', lineHeight: 'tight', weight: 'medium', letterSpacing: 'wide' },
    tablet: { size: 'sm', lineHeight: 'tight', weight: 'medium', letterSpacing: 'wide' },
    desktop: { size: 'sm', lineHeight: 'tight', weight: 'medium', letterSpacing: 'wide' },
  },
  lead: {
    element: 'lead',
    mobile: { size: 'base', lineHeight: 'relaxed', weight: 'normal' },
    tablet: { size: 'lg', lineHeight: 'relaxed', weight: 'normal' },
    desktop: { size: 'xl', lineHeight: 'relaxed', weight: 'normal' },
  },
}

// Generate responsive typography classes
export const getResponsiveTypographyClasses = (
  element: TypographyConfig['element'],
  customConfig?: Partial<TypographyConfig>,
): string => {
  const config = customConfig
    ? { ...DEFAULT_TYPOGRAPHY_CONFIGS[element], ...customConfig }
    : DEFAULT_TYPOGRAPHY_CONFIGS[element]

  const classes: string[] = []

  // Mobile classes (base)
  if (config.mobile) {
    if (config.mobile.size) classes.push(`text-${config.mobile.size}`)
    if (config.mobile.lineHeight) classes.push(`leading-${config.mobile.lineHeight}`)
    if (config.mobile.letterSpacing) classes.push(`tracking-${config.mobile.letterSpacing}`)
    if (config.mobile.weight) classes.push(`font-${config.mobile.weight}`)
  }

  // Tablet classes (sm: prefix)
  if (config.tablet) {
    if (config.tablet.size) classes.push(`sm:text-${config.tablet.size}`)
    if (config.tablet.lineHeight) classes.push(`sm:leading-${config.tablet.lineHeight}`)
    if (config.tablet.letterSpacing) classes.push(`sm:tracking-${config.tablet.letterSpacing}`)
    if (config.tablet.weight) classes.push(`sm:font-${config.tablet.weight}`)
  }

  // Desktop classes (lg: prefix)
  if (config.desktop) {
    if (config.desktop.size) classes.push(`lg:text-${config.desktop.size}`)
    if (config.desktop.lineHeight) classes.push(`lg:leading-${config.desktop.lineHeight}`)
    if (config.desktop.letterSpacing) classes.push(`lg:tracking-${config.desktop.letterSpacing}`)
    if (config.desktop.weight) classes.push(`lg:font-${config.desktop.weight}`)
  }

  return cn(...classes)
}

// Predefined responsive typography classes for common use cases
export const RESPONSIVE_TYPOGRAPHY_CLASSES = {
  // Headings
  'heading-hero': getResponsiveTypographyClasses('h1', {
    mobile: { size: '3xl', lineHeight: 'tight', weight: 'bold' },
    tablet: { size: '5xl', lineHeight: 'tight', weight: 'bold' },
    desktop: { size: '7xl', lineHeight: 'tight', weight: 'bold' },
  }),
  'heading-section': getResponsiveTypographyClasses('h2'),
  'heading-subsection': getResponsiveTypographyClasses('h3'),
  'heading-card': getResponsiveTypographyClasses('h4'),
  'heading-small': getResponsiveTypographyClasses('h5'),
  'heading-tiny': getResponsiveTypographyClasses('h6'),

  // Body text
  'body-large': getResponsiveTypographyClasses('lead'),
  'body-normal': getResponsiveTypographyClasses('p'),
  'body-small': getResponsiveTypographyClasses('small'),
  'body-caption': getResponsiveTypographyClasses('caption'),

  // Special cases
  'display-large': getResponsiveTypographyClasses('h1', {
    mobile: { size: '4xl', lineHeight: 'none', weight: 'black' },
    tablet: { size: '6xl', lineHeight: 'none', weight: 'black' },
    desktop: { size: '9xl', lineHeight: 'none', weight: 'black' },
  }),
  'display-medium': getResponsiveTypographyClasses('h1', {
    mobile: { size: '3xl', lineHeight: 'tight', weight: 'extrabold' },
    tablet: { size: '5xl', lineHeight: 'tight', weight: 'extrabold' },
    desktop: { size: '7xl', lineHeight: 'tight', weight: 'extrabold' },
  }),
  'display-small': getResponsiveTypographyClasses('h2', {
    mobile: { size: '2xl', lineHeight: 'tight', weight: 'bold' },
    tablet: { size: '4xl', lineHeight: 'tight', weight: 'bold' },
    desktop: { size: '6xl', lineHeight: 'tight', weight: 'bold' },
  }),
} as const

// Typography utilities for specific contexts
export const getBlockTypographyClasses = (blockType: string): Record<string, string> => {
  switch (blockType) {
    case 'hero':
      return {
        heading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-hero'],
        subheading: RESPONSIVE_TYPOGRAPHY_CLASSES['body-large'],
        eyebrow: getResponsiveTypographyClasses('caption', {
          mobile: { size: 'xs', weight: 'medium', letterSpacing: 'widest' },
          tablet: { size: 'sm', weight: 'medium', letterSpacing: 'widest' },
          desktop: { size: 'sm', weight: 'medium', letterSpacing: 'widest' },
        }),
      }

    case 'content':
      return {
        heading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-section'],
        subheading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-subsection'],
        body: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
        caption: RESPONSIVE_TYPOGRAPHY_CLASSES['body-caption'],
      }

    case 'cta':
      return {
        heading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-section'],
        description: RESPONSIVE_TYPOGRAPHY_CLASSES['body-large'],
        button: getResponsiveTypographyClasses('p', {
          mobile: { size: 'sm', weight: 'medium' },
          tablet: { size: 'base', weight: 'medium' },
          desktop: { size: 'lg', weight: 'medium' },
        }),
      }

    case 'testimonial':
      return {
        quote: getResponsiveTypographyClasses('p', {
          mobile: { size: 'base', lineHeight: 'relaxed', weight: 'normal' },
          tablet: { size: 'lg', lineHeight: 'relaxed', weight: 'normal' },
          desktop: { size: 'xl', lineHeight: 'relaxed', weight: 'normal' },
        }),
        author: getResponsiveTypographyClasses('p', {
          mobile: { size: 'sm', weight: 'medium' },
          tablet: { size: 'base', weight: 'medium' },
          desktop: { size: 'base', weight: 'medium' },
        }),
        role: RESPONSIVE_TYPOGRAPHY_CLASSES['body-small'],
      }

    case 'banner':
      return {
        message: getResponsiveTypographyClasses('p', {
          mobile: { size: 'sm', weight: 'medium' },
          tablet: { size: 'base', weight: 'medium' },
          desktop: { size: 'base', weight: 'medium' },
        }),
      }

    case 'statsCounter':
      return {
        number: getResponsiveTypographyClasses('h1', {
          mobile: { size: '2xl', lineHeight: 'none', weight: 'bold' },
          tablet: { size: '4xl', lineHeight: 'none', weight: 'bold' },
          desktop: { size: '5xl', lineHeight: 'none', weight: 'bold' },
        }),
        label: RESPONSIVE_TYPOGRAPHY_CLASSES['body-small'],
      }

    case 'pricingTable':
      return {
        price: getResponsiveTypographyClasses('h2', {
          mobile: { size: '2xl', lineHeight: 'tight', weight: 'bold' },
          tablet: { size: '3xl', lineHeight: 'tight', weight: 'bold' },
          desktop: { size: '4xl', lineHeight: 'tight', weight: 'bold' },
        }),
        period: RESPONSIVE_TYPOGRAPHY_CLASSES['body-small'],
        feature: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
        planName: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-card'],
      }

    case 'faqAccordion':
      return {
        question: getResponsiveTypographyClasses('h4', {
          mobile: { size: 'base', weight: 'medium' },
          tablet: { size: 'lg', weight: 'medium' },
          desktop: { size: 'xl', weight: 'medium' },
        }),
        answer: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
      }

    case 'timeline':
      return {
        date: getResponsiveTypographyClasses('caption', {
          mobile: { size: 'xs', weight: 'medium', letterSpacing: 'wide' },
          tablet: { size: 'sm', weight: 'medium', letterSpacing: 'wide' },
          desktop: { size: 'sm', weight: 'medium', letterSpacing: 'wide' },
        }),
        title: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-card'],
        description: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
      }

    case 'servicesGrid':
    case 'featureGrid':
      return {
        title: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-card'],
        description: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
        label: RESPONSIVE_TYPOGRAPHY_CLASSES['body-small'],
      }

    case 'contactForm':
    case 'newsletter':
      return {
        heading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-subsection'],
        description: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
        label: getResponsiveTypographyClasses('small', {
          mobile: { size: 'xs', weight: 'medium' },
          tablet: { size: 'sm', weight: 'medium' },
          desktop: { size: 'sm', weight: 'medium' },
        }),
        input: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
        button: getResponsiveTypographyClasses('p', {
          mobile: { size: 'sm', weight: 'medium' },
          tablet: { size: 'base', weight: 'medium' },
          desktop: { size: 'base', weight: 'medium' },
        }),
      }

    case 'code':
      return {
        code: getResponsiveTypographyClasses('p', {
          mobile: { size: 'xs', lineHeight: 'snug' },
          tablet: { size: 'sm', lineHeight: 'snug' },
          desktop: { size: 'sm', lineHeight: 'snug' },
        }),
        filename: RESPONSIVE_TYPOGRAPHY_CLASSES['body-caption'],
      }

    default:
      return {
        heading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-section'],
        subheading: RESPONSIVE_TYPOGRAPHY_CLASSES['heading-subsection'],
        body: RESPONSIVE_TYPOGRAPHY_CLASSES['body-normal'],
        small: RESPONSIVE_TYPOGRAPHY_CLASSES['body-small'],
      }
  }
}

// Prose typography scaling for rich text content
export const getProseTypographyClasses = (): string => {
  return cn(
    // Base prose styles
    'prose dark:prose-invert max-w-none',

    // Mobile typography
    'prose-sm',
    'prose-headings:text-sm prose-headings:sm:text-base prose-headings:lg:text-lg',
    'prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl',
    'prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl',
    'prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl',
    'prose-p:text-sm prose-p:sm:text-base prose-p:lg:text-lg',
    'prose-li:text-sm prose-li:sm:text-base prose-li:lg:text-lg',
    'prose-blockquote:text-sm prose-blockquote:sm:text-base prose-blockquote:lg:text-lg',

    // Line heights
    'prose-headings:leading-tight',
    'prose-p:leading-relaxed',
    'prose-li:leading-relaxed',

    // Spacing
    'prose-headings:mb-2 prose-headings:sm:mb-3 prose-headings:lg:mb-4',
    'prose-p:mb-3 prose-p:sm:mb-4 prose-p:lg:mb-6',
    'prose-li:mb-1 prose-li:sm:mb-2',
  )
}

// Accessibility typography utilities
export const getA11yTypographyClasses = (): string => {
  return cn(
    // Minimum font sizes for readability
    'text-sm sm:text-base', // Never smaller than 14px on mobile, 16px on desktop

    // Good line height for readability
    'leading-relaxed',

    // Sufficient color contrast (handled by theme)
    'text-foreground',

    // Focus styles for keyboard navigation
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  )
}

// Performance-optimized typography classes
export const getOptimizedTypographyClasses = (): string => {
  return cn(
    // Font display optimization
    'font-display-swap',

    // Text rendering optimization
    'text-rendering-optimizeLegibility',
    'antialiased',

    // Prevent layout shift
    'font-feature-settings-normal',
  )
}

// Export all utilities
export const typographyUtils = {
  TYPOGRAPHY_SCALE,
  DEFAULT_TYPOGRAPHY_CONFIGS,
  RESPONSIVE_TYPOGRAPHY_CLASSES,
  getResponsiveTypographyClasses,
  getBlockTypographyClasses,
  getProseTypographyClasses,
  getA11yTypographyClasses,
  getOptimizedTypographyClasses,
}
