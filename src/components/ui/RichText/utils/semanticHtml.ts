/**
 * Semantic HTML utilities for RichText components
 * Ensures proper HTML structure and semantic meaning
 */

/**
 * Semantic HTML element mapping for different content types
 */
export const SEMANTIC_ELEMENTS = {
  // Main content structure
  main: 'main',
  article: 'article',
  section: 'section',
  aside: 'aside',
  header: 'header',
  footer: 'footer',
  nav: 'nav',

  // Content grouping
  div: 'div',
  p: 'p',
  blockquote: 'blockquote',
  figure: 'figure',
  figcaption: 'figcaption',

  // Headings
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',

  // Lists
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  dl: 'dl',
  dt: 'dt',
  dd: 'dd',

  // Text semantics
  strong: 'strong',
  em: 'em',
  mark: 'mark',
  small: 'small',
  del: 'del',
  ins: 'ins',
  sub: 'sub',
  sup: 'sup',

  // Interactive elements
  a: 'a',
  button: 'button',

  // Media
  img: 'img',
  video: 'video',
  audio: 'audio',
  source: 'source',

  // Tables
  table: 'table',
  thead: 'thead',
  tbody: 'tbody',
  tfoot: 'tfoot',
  tr: 'tr',
  th: 'th',
  td: 'td',
  caption: 'caption',

  // Forms
  form: 'form',
  fieldset: 'fieldset',
  legend: 'legend',
  label: 'label',
  input: 'input',
  textarea: 'textarea',
  select: 'select',
  option: 'option',

  // Code
  code: 'code',
  pre: 'pre',
  kbd: 'kbd',
  samp: 'samp',
  var: 'var',
} as const

/**
 * Block type to semantic element mapping
 */
export const BLOCK_SEMANTIC_MAPPING = {
  hero: 'section',
  content: 'section',
  mediaBlock: 'figure',
  banner: 'section',
  code: 'section',
  cta: 'section',
  contactForm: 'section',
  newsletter: 'section',
  socialProof: 'section',
  servicesGrid: 'section',
  techStack: 'section',
  processSteps: 'section',
  pricingTable: 'section',
  projectShowcase: 'section',
  caseStudy: 'article',
  beforeAfter: 'figure',
  testimonial: 'blockquote',
  featureGrid: 'section',
  statsCounter: 'section',
  faqAccordion: 'section',
  timeline: 'section',
  container: 'div',
  divider: 'hr',
  spacer: 'div',
} as const

/**
 * Content type to semantic element mapping
 */
export const CONTENT_SEMANTIC_MAPPING = {
  paragraph: 'p',
  heading: 'h2', // Default, should be overridden with proper level
  list: 'ul',
  listItem: 'li',
  quote: 'blockquote',
  code: 'code',
  codeBlock: 'pre',
  link: 'a',
  image: 'img',
  video: 'video',
  table: 'table',
  tableRow: 'tr',
  tableCell: 'td',
  tableHeader: 'th',
} as const

/**
 * Get semantic element for block type
 */
export const getSemanticElement = (
  blockType: keyof typeof BLOCK_SEMANTIC_MAPPING,
  context?: 'main' | 'article' | 'aside',
): keyof typeof SEMANTIC_ELEMENTS => {
  const baseElement = BLOCK_SEMANTIC_MAPPING[blockType] || 'div'

  // Adjust based on context
  if (context === 'main' && baseElement === 'section') {
    return 'section'
  }

  if (context === 'article' && baseElement === 'section') {
    return 'section'
  }

  return baseElement as keyof typeof SEMANTIC_ELEMENTS
}

/**
 * Generate proper heading level based on context
 */
export const getHeadingLevel = (
  currentLevel: number,
  context: {
    parentLevel?: number
    maxLevel?: number
    minLevel?: number
  } = {},
): 1 | 2 | 3 | 4 | 5 | 6 => {
  const { parentLevel = 0, maxLevel = 6, minLevel = 1 } = context

  // Calculate appropriate level
  let level = Math.max(parentLevel + 1, currentLevel, minLevel)
  level = Math.min(level, maxLevel)

  return level as 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Generate heading element name
 */
export const getHeadingElement = (level: 1 | 2 | 3 | 4 | 5 | 6): keyof typeof SEMANTIC_ELEMENTS => {
  return `h${level}` as keyof typeof SEMANTIC_ELEMENTS
}

/**
 * Validate heading hierarchy
 */
export const validateHeadingHierarchy = (
  headings: Array<{ level: number; text: string }>,
): string[] => {
  const warnings: string[] = []

  for (let i = 0; i < headings.length; i++) {
    const current = headings[i]
    const previous = headings[i - 1]

    if (previous && current && current.level > previous.level + 1) {
      warnings.push(
        `Heading "${current.text}" (h${current.level}) skips levels after "${previous.text}" (h${previous.level})`,
      )
    }
  }

  return warnings
}

/**
 * Generate semantic attributes for elements
 */
export const generateSemanticAttrs = (
  elementType: keyof typeof SEMANTIC_ELEMENTS,
  content?: {
    text?: string
    alt?: string
    caption?: string
    title?: string
  },
  context?: {
    isDecorative?: boolean
    isInteractive?: boolean
    hasChildren?: boolean
  },
) => {
  const attrs: Record<string, any> = {}

  // Add semantic attributes based on element type
  switch (elementType) {
    case 'img':
      if (context?.isDecorative) {
        attrs.alt = ''
        attrs.role = 'presentation'
      } else {
        attrs.alt = content?.alt || content?.text || ''
      }
      break

    case 'figure':
      if (content?.caption) {
        attrs['aria-labelledby'] = 'figure-caption'
      }
      break

    case 'blockquote':
      if (content?.title) {
        attrs.cite = content.title
      }
      break

    case 'table':
      if (content?.caption) {
        attrs['aria-labelledby'] = 'table-caption'
      }
      break

    case 'button':
      if (!content?.text) {
        attrs['aria-label'] = 'Button'
      }
      break

    case 'a':
      if (context?.isInteractive && !content?.text) {
        attrs['aria-label'] = 'Link'
      }
      break
  }

  return attrs
}

/**
 * List structure utilities
 */
export const listStructure = {
  /**
   * Determine appropriate list type
   */
  getListType: (items: Array<{ ordered?: boolean; nested?: boolean }>): 'ul' | 'ol' => {
    const hasOrdered = items.some((item) => item.ordered)
    return hasOrdered ? 'ol' : 'ul'
  },

  /**
   * Generate list attributes
   */
  getListAttrs: (type: 'ul' | 'ol', options?: { start?: number; reversed?: boolean }) => {
    const attrs: Record<string, any> = {}

    if (type === 'ol') {
      if (options?.start && options.start !== 1) {
        attrs.start = options.start
      }
      if (options?.reversed) {
        attrs.reversed = true
      }
    }

    return attrs
  },
}

/**
 * Table structure utilities
 */
export const tableStructure = {
  /**
   * Generate table structure attributes
   */
  getTableAttrs: (options?: { caption?: string; summary?: string; sortable?: boolean }) => {
    const attrs: Record<string, any> = {
      role: 'table',
    }

    if (options?.summary) {
      attrs['aria-describedby'] = 'table-summary'
    }

    if (options?.sortable) {
      attrs['aria-sort'] = 'none'
    }

    return attrs
  },

  /**
   * Generate table header attributes
   */
  getHeaderAttrs: (options?: {
    scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'
    sortable?: boolean
    sorted?: 'ascending' | 'descending'
  }) => {
    const attrs: Record<string, any> = {
      role: 'columnheader',
    }

    if (options?.scope) {
      attrs.scope = options.scope
    }

    if (options?.sortable) {
      attrs['aria-sort'] = options.sorted || 'none'
      attrs.tabIndex = 0
      attrs.role = 'button'
    }

    return attrs
  },

  /**
   * Generate table cell attributes
   */
  getCellAttrs: (options?: { headers?: string[]; rowspan?: number; colspan?: number }) => {
    const attrs: Record<string, any> = {}

    if (options?.headers?.length) {
      attrs.headers = options.headers.join(' ')
    }

    if (options?.rowspan && options.rowspan > 1) {
      attrs.rowspan = options.rowspan
    }

    if (options?.colspan && options.colspan > 1) {
      attrs.colspan = options.colspan
    }

    return attrs
  },
}

/**
 * Form structure utilities
 */
export const formStructure = {
  /**
   * Generate form field attributes
   */
  getFieldAttrs: (
    _fieldType: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio',
    options?: {
      required?: boolean
      invalid?: boolean
      describedBy?: string[]
      labelledBy?: string
    },
  ) => {
    const attrs: Record<string, any> = {}

    if (options?.required) {
      attrs.required = true
      attrs['aria-required'] = 'true'
    }

    if (options?.invalid) {
      attrs['aria-invalid'] = 'true'
    }

    if (options?.describedBy?.length) {
      attrs['aria-describedby'] = options.describedBy.join(' ')
    }

    if (options?.labelledBy) {
      attrs['aria-labelledby'] = options.labelledBy
    }

    return attrs
  },

  /**
   * Generate fieldset attributes
   */
  getFieldsetAttrs: (legend?: string) => {
    const attrs: Record<string, any> = {}

    if (legend) {
      attrs['aria-labelledby'] = 'fieldset-legend'
    }

    return attrs
  },
}

/**
 * Media structure utilities
 */
export const mediaStructure = {
  /**
   * Generate figure attributes
   */
  getFigureAttrs: (options?: { caption?: string; alt?: string }) => {
    const attrs: Record<string, any> = {}

    if (options?.caption) {
      attrs['aria-labelledby'] = 'figure-caption'
    } else if (options?.alt) {
      attrs['aria-label'] = options.alt
    }

    return attrs
  },

  /**
   * Generate video attributes
   */
  getVideoAttrs: (options?: {
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    loop?: boolean
    poster?: string
  }) => {
    const attrs: Record<string, any> = {}

    if (options?.autoplay) {
      attrs.autoPlay = true
      // Autoplay videos should be muted for accessibility
      if (!options.muted) {
        console.warn('Autoplay videos should be muted for accessibility')
      }
    }

    if (options?.muted) {
      attrs.muted = true
    }

    if (options?.controls !== false) {
      attrs.controls = true
    }

    if (options?.loop) {
      attrs.loop = true
    }

    if (options?.poster) {
      attrs.poster = options.poster
    }

    return attrs
  },
}

/**
 * Content structure validation
 */
export const validateContentStructure = (element: HTMLElement): string[] => {
  const warnings: string[] = []

  // Check for proper heading hierarchy
  const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => ({
    level: parseInt(h.tagName.charAt(1)),
    text: h.textContent || '',
  }))

  warnings.push(...validateHeadingHierarchy(headings))

  // Check for images without alt text
  const images = element.querySelectorAll('img:not([alt])')
  if (images.length > 0) {
    warnings.push(`${images.length} images missing alt text`)
  }

  // Check for empty links
  const emptyLinks = element.querySelectorAll('a:empty, a:not([aria-label]):not([aria-labelledby])')
  if (emptyLinks.length > 0) {
    warnings.push(`${emptyLinks.length} links without accessible text`)
  }

  // Check for tables without captions or summaries
  const tables = element.querySelectorAll('table:not([aria-label]):not([aria-labelledby])')
  const tablesWithoutCaptions = Array.from(tables).filter(
    (table) => !table.querySelector('caption'),
  )
  if (tablesWithoutCaptions.length > 0) {
    warnings.push(`${tablesWithoutCaptions.length} tables without captions or labels`)
  }

  // Check for form inputs without labels
  const unlabeledInputs = element.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby])',
  ).length
  if (unlabeledInputs > 0) {
    warnings.push(`${unlabeledInputs} form inputs without labels`)
  }

  return warnings
}

/**
 * Generate semantic HTML structure for RichText content
 */
export const generateSemanticStructure = (
  blockType: string,
  content: any,
  context?: {
    parentElement?: keyof typeof SEMANTIC_ELEMENTS
    headingLevel?: number
    isNested?: boolean
  },
) => {
  const semanticElement = getSemanticElement(
    blockType as keyof typeof BLOCK_SEMANTIC_MAPPING,
    context?.parentElement as any,
  )

  const semanticAttrs = generateSemanticAttrs(semanticElement, content, {
    hasChildren: true,
  })

  return {
    element: semanticElement,
    attributes: semanticAttrs,
    headingLevel: context?.headingLevel ? getHeadingLevel(context.headingLevel + 1) : 2,
  }
}

/**
 * Landmark utilities for page structure
 */
export const landmarks = {
  /**
   * Generate main landmark
   */
  getMainAttrs: (label?: string) => ({
    role: 'main',
    'aria-label': label || 'Main content',
  }),

  /**
   * Generate navigation landmark
   */
  getNavAttrs: (label: string) => ({
    role: 'navigation',
    'aria-label': label,
  }),

  /**
   * Generate complementary landmark
   */
  getAsideAttrs: (label?: string) => ({
    role: 'complementary',
    'aria-label': label || 'Sidebar content',
  }),

  /**
   * Generate banner landmark
   */
  getBannerAttrs: (label?: string) => ({
    role: 'banner',
    'aria-label': label || 'Site header',
  }),

  /**
   * Generate contentinfo landmark
   */
  getFooterAttrs: (label?: string) => ({
    role: 'contentinfo',
    'aria-label': label || 'Site footer',
  }),
}
