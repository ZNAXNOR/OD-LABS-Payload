/**
 * Accessibility utilities specifically for RichText components
 * Provides ARIA labels, roles, and other accessibility attributes
 */

import { generateAriaLabel } from '@/utilities/accessibility'

/**
 * ARIA roles for different RichText elements
 */
export const RICHTEXT_ARIA_ROLES = {
  // Main content roles
  main: 'main',
  article: 'article',
  section: 'region',

  // Navigation roles
  navigation: 'navigation',
  landmark: 'landmark',

  // Interactive roles
  button: 'button',
  link: 'link',
  tab: 'tab',
  tabpanel: 'tabpanel',
  tablist: 'tablist',

  // Content roles
  heading: 'heading',
  list: 'list',
  listitem: 'listitem',
  figure: 'figure',
  img: 'img',

  // Form roles
  form: 'form',
  group: 'group',
  textbox: 'textbox',

  // Status roles
  status: 'status',
  alert: 'alert',
  alertdialog: 'alertdialog',

  // Media roles
  application: 'application',
  document: 'document',
} as const

/**
 * Generate ARIA labels for RichText blocks
 */
export const generateBlockAriaLabel = (
  blockType: string,
  blockData?: Record<string, any>,
  context?: string,
): string => {
  const blockTypeLabels: Record<string, string> = {
    hero: 'Hero section',
    content: 'Content section',
    mediaBlock: 'Media content',
    banner: 'Banner',
    code: 'Code block',
    cta: 'Call to action',
    contactForm: 'Contact form',
    newsletter: 'Newsletter signup',
    socialProof: 'Social proof',
    servicesGrid: 'Services grid',
    techStack: 'Technology stack',
    processSteps: 'Process steps',
    pricingTable: 'Pricing table',
    projectShowcase: 'Project showcase',
    caseStudy: 'Case study',
    beforeAfter: 'Before and after comparison',
    testimonial: 'Testimonial',
    featureGrid: 'Features grid',
    statsCounter: 'Statistics counter',
    faqAccordion: 'Frequently asked questions',
    timeline: 'Timeline',
    container: 'Content container',
    divider: 'Section divider',
    spacer: 'Spacing element',
  }

  const baseLabel = blockTypeLabels[blockType] || `${blockType} block`

  // Add specific context if available
  if (blockData?.heading || blockData?.title) {
    return generateAriaLabel(baseLabel, blockData.heading || blockData.title, context)
  }

  if (blockData?.eyebrow) {
    return generateAriaLabel(baseLabel, blockData.eyebrow, context)
  }

  return generateAriaLabel(baseLabel, context)
}

/**
 * Generate ARIA attributes for interactive elements
 */
export const generateInteractiveAriaAttrs = (
  element: 'button' | 'link' | 'form' | 'input',
  label: string,
  options?: {
    describedBy?: string
    expanded?: boolean
    pressed?: boolean
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    controls?: string
    owns?: string
  },
) => {
  const baseAttrs: Record<string, any> = {
    'aria-label': label,
    role: element === 'input' ? 'textbox' : element,
  }

  if (options?.describedBy) {
    baseAttrs['aria-describedby'] = options.describedBy
  }

  if (options?.expanded !== undefined) {
    baseAttrs['aria-expanded'] = options.expanded
  }

  if (options?.pressed !== undefined) {
    baseAttrs['aria-pressed'] = options.pressed
  }

  if (options?.disabled) {
    baseAttrs['aria-disabled'] = true
  }

  if (options?.required) {
    baseAttrs['aria-required'] = true
  }

  if (options?.invalid) {
    baseAttrs['aria-invalid'] = true
  }

  if (options?.controls) {
    baseAttrs['aria-controls'] = options.controls
  }

  if (options?.owns) {
    baseAttrs['aria-owns'] = options.owns
  }

  return baseAttrs
}

/**
 * Generate ARIA attributes for media elements
 */
export const generateMediaAriaAttrs = (
  mediaType: 'image' | 'video' | 'audio',
  alt?: string,
  caption?: string,
  options?: {
    decorative?: boolean
    loading?: boolean
    hasControls?: boolean
    autoplay?: boolean
    muted?: boolean
  },
) => {
  const attrs: Record<string, any> = {}

  if (options?.decorative) {
    attrs['aria-hidden'] = 'true'
    attrs.role = 'presentation'
  } else {
    if (mediaType === 'image') {
      attrs.alt = alt || ''
      if (caption) {
        attrs['aria-describedby'] = `${mediaType}-caption`
      }
    } else {
      attrs['aria-label'] = alt || `${mediaType} content`
      if (caption) {
        attrs['aria-describedby'] = `${mediaType}-caption`
      }
    }
  }

  if (options?.loading) {
    attrs['aria-busy'] = 'true'
    attrs['aria-label'] = `Loading ${mediaType}...`
  }

  if (options?.hasControls) {
    attrs['aria-controls'] = `${mediaType}-controls`
  }

  if (options?.autoplay) {
    attrs['aria-live'] = 'polite'
  }

  if (options?.muted) {
    attrs['aria-label'] = `${attrs['aria-label'] || alt || `${mediaType} content`} (muted)`
  }

  return attrs
}

/**
 * Generate ARIA attributes for form elements
 */
export const generateFormAriaAttrs = (
  fieldType: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio',
  label: string,
  options?: {
    required?: boolean
    invalid?: boolean
    errorMessage?: string
    helpText?: string
    placeholder?: string
  },
) => {
  const attrs: Record<string, any> = {
    'aria-label': label,
  }

  if (options?.required) {
    attrs['aria-required'] = 'true'
  }

  if (options?.invalid) {
    attrs['aria-invalid'] = 'true'
    if (options.errorMessage) {
      attrs['aria-describedby'] = `${fieldType}-error`
    }
  }

  if (options?.helpText) {
    const describedBy = attrs['aria-describedby']
      ? `${attrs['aria-describedby']} ${fieldType}-help`
      : `${fieldType}-help`
    attrs['aria-describedby'] = describedBy
  }

  if (options?.placeholder) {
    attrs['aria-placeholder'] = options.placeholder
  }

  return attrs
}

/**
 * Generate ARIA attributes for navigation elements
 */
export const generateNavigationAriaAttrs = (
  navType: 'main' | 'breadcrumb' | 'pagination' | 'tabs' | 'menu',
  label: string,
  options?: {
    current?: boolean
    expanded?: boolean
    hasPopup?: boolean
    level?: number
    setSize?: number
    posInSet?: number
  },
) => {
  const attrs: Record<string, any> = {
    role: navType === 'main' ? 'navigation' : navType,
    'aria-label': label,
  }

  if (options?.current) {
    attrs['aria-current'] = navType === 'pagination' ? 'page' : 'true'
  }

  if (options?.expanded !== undefined) {
    attrs['aria-expanded'] = options.expanded
  }

  if (options?.hasPopup) {
    attrs['aria-haspopup'] = 'true'
  }

  if (options?.level) {
    attrs['aria-level'] = options.level
  }

  if (options?.setSize) {
    attrs['aria-setsize'] = options.setSize
  }

  if (options?.posInSet) {
    attrs['aria-posinset'] = options.posInSet
  }

  return attrs
}

/**
 * Generate ARIA attributes for content sections
 */
export const generateSectionAriaAttrs = (
  sectionType: 'main' | 'article' | 'section' | 'aside' | 'header' | 'footer',
  label?: string,
  options?: {
    landmark?: boolean
    level?: number
    expanded?: boolean
  },
) => {
  const attrs: Record<string, any> = {
    role: options?.landmark ? 'landmark' : sectionType,
  }

  if (label) {
    attrs['aria-label'] = label
  }

  if (options?.level) {
    attrs['aria-level'] = options.level
  }

  if (options?.expanded !== undefined) {
    attrs['aria-expanded'] = options.expanded
  }

  return attrs
}

/**
 * Generate ARIA live region attributes
 */
export const generateLiveRegionAttrs = (
  priority: 'polite' | 'assertive' | 'off' = 'polite',
  options?: {
    atomic?: boolean
    relevant?: 'additions' | 'removals' | 'text' | 'all'
    busy?: boolean
  },
) => {
  const attrs: Record<string, any> = {
    'aria-live': priority,
  }

  if (options?.atomic !== undefined) {
    attrs['aria-atomic'] = options.atomic
  }

  if (options?.relevant) {
    attrs['aria-relevant'] = options.relevant
  }

  if (options?.busy) {
    attrs['aria-busy'] = options.busy
  }

  return attrs
}

/**
 * Generate skip link attributes
 */
export const generateSkipLinkAttrs = (targetId: string, label: string) => {
  return {
    href: `#${targetId}`,
    'aria-label': `Skip to ${label}`,
    className:
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
    tabIndex: 0,
  }
}

/**
 * Generate heading attributes with proper hierarchy
 */
export const generateHeadingAttrs = (
  level: 1 | 2 | 3 | 4 | 5 | 6,
  text: string,
  options?: {
    id?: string
    className?: string
  },
) => {
  return {
    role: 'heading',
    'aria-level': level,
    id:
      options?.id ||
      text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    className: options?.className,
  }
}

/**
 * Generate table accessibility attributes
 */
export const generateTableAriaAttrs = (
  caption?: string,
  options?: {
    sortable?: boolean
    sortColumn?: number
    sortDirection?: 'ascending' | 'descending'
  },
) => {
  const attrs: Record<string, any> = {
    role: 'table',
  }

  if (caption) {
    attrs['aria-label'] = caption
  }

  if (options?.sortable) {
    attrs['aria-sort'] = options.sortDirection || 'none'
  }

  return attrs
}

/**
 * Generate accordion/collapsible attributes
 */
export const generateAccordionAttrs = (isExpanded: boolean, panelId: string, buttonId: string) => {
  return {
    button: {
      'aria-expanded': isExpanded,
      'aria-controls': panelId,
      id: buttonId,
      role: 'button',
    },
    panel: {
      'aria-labelledby': buttonId,
      id: panelId,
      role: 'region',
      hidden: !isExpanded,
    },
  }
}

/**
 * Generate modal/dialog attributes
 */
export const generateModalAriaAttrs = (
  title: string,
  options?: {
    describedBy?: string
    modal?: boolean
  },
) => {
  return {
    role: 'dialog',
    'aria-modal': options?.modal !== false,
    'aria-label': title,
    'aria-describedby': options?.describedBy,
    tabIndex: -1,
  }
}

/**
 * Accessibility validation helpers
 */
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const warnings: string[] = []

  // Check for missing alt text on images
  if (
    element.tagName === 'IMG' &&
    !element.getAttribute('alt') &&
    !element.getAttribute('aria-label')
  ) {
    warnings.push('Image missing alt text or aria-label')
  }

  // Check for interactive elements without labels
  if (['BUTTON', 'A', 'INPUT'].includes(element.tagName)) {
    const hasLabel =
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim()

    if (!hasLabel) {
      warnings.push(`Interactive element ${element.tagName} missing accessible label`)
    }
  }

  // Check for proper heading hierarchy
  if (element.tagName.match(/^H[1-6]$/)) {
    const level = parseInt(element.tagName.charAt(1))
    const prevHeading = element.previousElementSibling?.closest('h1, h2, h3, h4, h5, h6')

    if (prevHeading) {
      const prevLevel = parseInt(prevHeading.tagName.charAt(1))
      if (level > prevLevel + 1) {
        warnings.push(`Heading level ${level} skips levels (previous was ${prevLevel})`)
      }
    }
  }

  return warnings
}

/**
 * Generate comprehensive accessibility report for RichText content
 */
export const generateAccessibilityReport = (container: HTMLElement) => {
  const report = {
    warnings: [] as string[],
    errors: [] as string[],
    suggestions: [] as string[],
    score: 100,
  }

  // Check all elements in the container
  const allElements = container.querySelectorAll('*')

  allElements.forEach((element) => {
    const warnings = validateAriaAttributes(element as HTMLElement)
    report.warnings.push(...warnings)
  })

  // Calculate accessibility score
  const totalIssues = report.warnings.length + report.errors.length
  report.score = Math.max(0, 100 - totalIssues * 5)

  // Generate suggestions
  if (report.warnings.length > 0) {
    report.suggestions.push('Review and fix accessibility warnings')
  }

  if (report.score < 90) {
    report.suggestions.push('Consider running automated accessibility testing tools')
  }

  return report
}
