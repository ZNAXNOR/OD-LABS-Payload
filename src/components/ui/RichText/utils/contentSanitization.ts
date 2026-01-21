/**
 * Content sanitization utilities for RichText components
 * Provides comprehensive XSS prevention and content security
 */

import DOMPurify from 'isomorphic-dompurify'

// Sanitization configuration types
export interface SanitizationConfig {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  allowedSchemes?: string[]
  allowedSchemesByTag?: Record<string, string[]>
  stripTags?: boolean
  stripAttributes?: boolean
  maxLength?: number
  allowDataAttributes?: boolean
  allowAriaAttributes?: boolean
  customSanitizers?: Array<(content: string) => string>
}

// Default safe HTML tags for rich text content
const DEFAULT_ALLOWED_TAGS = [
  // Text formatting
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'mark',
  'small',
  'sub',
  'sup',

  // Headings
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',

  // Lists
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',

  // Links
  'a',

  // Quotes and code
  'blockquote',
  'q',
  'cite',
  'code',
  'pre',
  'kbd',
  'samp',
  'var',

  // Tables
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'colgroup',
  'col',

  // Media (with restrictions)
  'img',
  'figure',
  'figcaption',

  // Structural
  'div',
  'span',
  'section',
  'article',
  'aside',
  'header',
  'footer',
  'main',
  'nav',

  // Horizontal rule
  'hr',
]

// Default safe attributes
const DEFAULT_ALLOWED_ATTRIBUTES = {
  '*': ['class', 'id', 'title', 'lang', 'dir'],
  a: ['href', 'target', 'rel', 'download'],
  img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
  blockquote: ['cite'],
  q: ['cite'],
  table: ['summary'],
  th: ['scope', 'headers', 'rowspan', 'colspan'],
  td: ['headers', 'rowspan', 'colspan'],
  col: ['span'],
  colgroup: ['span'],
  ol: ['start', 'reversed', 'type'],
  li: ['value'],
}

// Safe URL schemes
const DEFAULT_ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel']

// Dangerous patterns to remove
const DANGEROUS_PATTERNS = [
  // JavaScript execution
  /javascript:/gi,
  /vbscript:/gi,
  /data:/gi,
  /livescript:/gi,

  // Event handlers
  /on\w+\s*=/gi,

  // Script tags and content
  /<script[\s\S]*?<\/script>/gi,
  /<style[\s\S]*?<\/style>/gi,

  // Meta and link tags that could be dangerous
  /<meta[\s\S]*?>/gi,
  /<link[\s\S]*?>/gi,

  // Form elements (unless explicitly allowed)
  /<form[\s\S]*?<\/form>/gi,
  /<input[\s\S]*?>/gi,
  /<textarea[\s\S]*?<\/textarea>/gi,
  /<select[\s\S]*?<\/select>/gi,
  /<button[\s\S]*?<\/button>/gi,

  // Iframe and embed
  /<iframe[\s\S]*?<\/iframe>/gi,
  /<embed[\s\S]*?>/gi,
  /<object[\s\S]*?<\/object>/gi,

  // Base tag
  /<base[\s\S]*?>/gi,
]

// Default sanitization configuration
export const DEFAULT_SANITIZATION_CONFIG: SanitizationConfig = {
  allowedTags: DEFAULT_ALLOWED_TAGS,
  allowedAttributes: DEFAULT_ALLOWED_ATTRIBUTES,
  allowedSchemes: DEFAULT_ALLOWED_SCHEMES,
  stripTags: false,
  stripAttributes: false,
  maxLength: 1000000, // 1MB limit
  allowDataAttributes: true,
  allowAriaAttributes: true,
  customSanitizers: [],
}

// Strict sanitization for user-generated content
export const STRICT_SANITIZATION_CONFIG: SanitizationConfig = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
  allowedAttributes: {
    '*': ['class'],
    a: ['href', 'rel'],
  },
  allowedSchemes: ['https', 'mailto'],
  stripTags: true,
  stripAttributes: true,
  maxLength: 10000, // 10KB limit
  allowDataAttributes: false,
  allowAriaAttributes: true,
  customSanitizers: [],
}

// Permissive sanitization for trusted content
export const PERMISSIVE_SANITIZATION_CONFIG: SanitizationConfig = {
  allowedTags: [
    ...DEFAULT_ALLOWED_TAGS,
    'video',
    'audio',
    'source',
    'track',
    'details',
    'summary',
    'time',
    'address',
  ],
  allowedAttributes: {
    ...DEFAULT_ALLOWED_ATTRIBUTES,
    video: ['src', 'poster', 'controls', 'autoplay', 'muted', 'loop', 'width', 'height'],
    audio: ['src', 'controls', 'autoplay', 'muted', 'loop'],
    source: ['src', 'type', 'media'],
    track: ['src', 'kind', 'srclang', 'label', 'default'],
    time: ['datetime'],
  },
  allowedSchemes: [...DEFAULT_ALLOWED_SCHEMES, 'ftp'],
  stripTags: false,
  stripAttributes: false,
  maxLength: 5000000, // 5MB limit
  allowDataAttributes: true,
  allowAriaAttributes: true,
  customSanitizers: [],
}

/**
 * Sanitize HTML content using DOMPurify
 */
export const sanitizeHtml = (
  content: string,
  config: SanitizationConfig = DEFAULT_SANITIZATION_CONFIG,
): string => {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // Check content length
  if (config.maxLength && content.length > config.maxLength) {
    console.warn(`Content exceeds maximum length of ${config.maxLength} characters`)
    content = content.substring(0, config.maxLength)
  }

  // Apply custom sanitizers first
  let sanitizedContent = content
  if (config.customSanitizers && config.customSanitizers.length > 0) {
    for (const sanitizer of config.customSanitizers) {
      try {
        sanitizedContent = sanitizer(sanitizedContent)
      } catch (error) {
        console.error('Custom sanitizer error:', error)
      }
    }
  }

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitizedContent = sanitizedContent.replace(pattern, '')
  }

  // Configure DOMPurify
  const domPurifyConfig: any = {
    ALLOWED_TAGS: config.allowedTags || DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: [],
    ALLOWED_URI_REGEXP: new RegExp(
      `^(?:(?:${(config.allowedSchemes || DEFAULT_ALLOWED_SCHEMES).join('|')}):)`,
      'i',
    ),
    KEEP_CONTENT: !config.stripTags,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: true,
    WHOLE_DOCUMENT: false,
    FORCE_BODY: false,
  }

  // Build allowed attributes list
  const allowedAttrs = new Set<string>()

  if (config.allowedAttributes) {
    Object.entries(config.allowedAttributes).forEach(([, attrs]) => {
      attrs.forEach((attr) => allowedAttrs.add(attr))
    })
  }

  // Add ARIA attributes if allowed
  if (config.allowAriaAttributes) {
    allowedAttrs.add('aria-*')
    allowedAttrs.add('role')
  }

  // Add data attributes if allowed
  if (config.allowDataAttributes) {
    allowedAttrs.add('data-*')
  }

  domPurifyConfig.ALLOWED_ATTR = Array.from(allowedAttrs)

  // Sanitize with DOMPurify
  try {
    sanitizedContent = DOMPurify.sanitize(sanitizedContent, domPurifyConfig) as unknown as string
  } catch (error) {
    console.error('DOMPurify sanitization error:', error)
    // Fallback to basic sanitization
    sanitizedContent = sanitizedContent
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
  }

  return sanitizedContent
}

/**
 * Sanitize text content (removes all HTML)
 */
export const sanitizeText = (content: string, maxLength?: number): string => {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // Remove all HTML tags
  let sanitized = content.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')

  // Trim whitespace
  sanitized = sanitized.trim()

  // Apply length limit
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim()
    // Try to break at word boundary
    const lastSpace = sanitized.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.8) {
      sanitized = sanitized.substring(0, lastSpace)
    }
    sanitized += '...'
  }

  return sanitized
}

/**
 * Sanitize URL for safe usage
 */
export const sanitizeUrl = (
  url: string,
  allowedSchemes: string[] = DEFAULT_ALLOWED_SCHEMES,
): string => {
  if (!url || typeof url !== 'string') {
    return ''
  }

  // Trim and normalize
  url = url.trim()

  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'vbscript:', 'data:', 'livescript:']
  for (const protocol of dangerousProtocols) {
    if (url.toLowerCase().startsWith(protocol)) {
      console.warn(`Blocked dangerous URL protocol: ${protocol}`)
      return ''
    }
  }

  // Check if URL has a valid scheme
  try {
    const urlObj = new URL(url)

    if (!allowedSchemes.includes(urlObj.protocol.replace(':', ''))) {
      console.warn(`URL scheme not allowed: ${urlObj.protocol}`)
      return ''
    }

    // Additional security checks
    if (urlObj.hostname) {
      // Block localhost and private IPs in production
      if (process.env.NODE_ENV === 'production') {
        const hostname = urlObj.hostname.toLowerCase()
        if (
          hostname === 'localhost' ||
          hostname.startsWith('127.') ||
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.startsWith('172.')
        ) {
          console.warn(`Blocked private/local URL: ${hostname}`)
          return ''
        }
      }
    }

    return urlObj.toString()
  } catch (error) {
    // If URL parsing fails, check if it's a relative URL
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return url
    }

    // Check if it's a mailto or tel link without protocol
    if (url.includes('@') && !url.includes('://')) {
      return `mailto:${url}`
    }

    if (/^\+?[\d\s\-\(\)]+$/.test(url)) {
      return `tel:${url.replace(/\s/g, '')}`
    }

    console.warn(`Invalid URL format: ${url}`)
    return ''
  }
}

/**
 * Sanitize CSS class names
 */
export const sanitizeClassName = (className: string): string => {
  if (!className || typeof className !== 'string') {
    return ''
  }

  // Remove potentially dangerous characters and patterns
  return className
    .replace(/[<>'"&]/g, '') // Remove HTML/JS injection chars
    .replace(/javascript:/gi, '') // Remove JS protocol
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .replace(/url\s*\(/gi, '') // Remove CSS url() functions
    .replace(/import/gi, '') // Remove CSS imports
    .trim()
}

/**
 * Sanitize data attributes
 */
export const sanitizeDataAttribute = (value: string): string => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  // Remove script-like content
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/expression\s*\(/gi, '')
    .trim()
}

/**
 * Create a custom sanitizer function
 */
export const createCustomSanitizer = (rules: {
  removePatterns?: RegExp[]
  replacePatterns?: Array<{ pattern: RegExp; replacement: string }>
  maxLength?: number
  allowedDomains?: string[]
}) => {
  return (content: string): string => {
    let sanitized = content

    // Remove patterns
    if (rules.removePatterns) {
      for (const pattern of rules.removePatterns) {
        sanitized = sanitized.replace(pattern, '')
      }
    }

    // Replace patterns
    if (rules.replacePatterns) {
      for (const { pattern, replacement } of rules.replacePatterns) {
        sanitized = sanitized.replace(pattern, replacement)
      }
    }

    // Apply length limit
    if (rules.maxLength && sanitized.length > rules.maxLength) {
      sanitized = sanitized.substring(0, rules.maxLength)
    }

    // Filter URLs by allowed domains
    if (rules.allowedDomains) {
      sanitized = sanitized.replace(/https?:\/\/([^\/\s]+)/gi, (match, domain) => {
        const isAllowed = rules.allowedDomains!.some((allowed) =>
          domain.toLowerCase().endsWith(allowed.toLowerCase()),
        )
        return isAllowed ? match : ''
      })
    }

    return sanitized
  }
}

/**
 * Sanitization presets for different use cases
 */
export const sanitizationPresets = {
  // For user comments and reviews
  userContent: (content: string) => sanitizeHtml(content, STRICT_SANITIZATION_CONFIG),

  // For admin/editor content
  editorContent: (content: string) => sanitizeHtml(content, DEFAULT_SANITIZATION_CONFIG),

  // For trusted content from CMS
  trustedContent: (content: string) => sanitizeHtml(content, PERMISSIVE_SANITIZATION_CONFIG),

  // For plain text extraction
  textOnly: (content: string) => sanitizeText(content),

  // For search snippets
  searchSnippet: (content: string) => sanitizeText(content, 200),

  // For meta descriptions
  metaDescription: (content: string) => sanitizeText(content, 160),

  // For social media sharing
  socialText: (content: string) => sanitizeText(content, 280),
}

/**
 * Validate sanitized content
 */
export const validateSanitizedContent = (
  original: string,
  sanitized: string,
): {
  isValid: boolean
  warnings: string[]
  removedContent: boolean
  lengthReduced: boolean
} => {
  const warnings: string[] = []

  const removedContent = original.length !== sanitized.length
  const lengthReduced = sanitized.length < original.length

  if (removedContent) {
    warnings.push('Content was modified during sanitization')
  }

  if (lengthReduced) {
    const reduction = ((original.length - sanitized.length) / original.length) * 100
    warnings.push(`Content length reduced by ${reduction.toFixed(1)}%`)
  }

  // Check for common sanitization issues
  if (original.includes('<script') && !sanitized.includes('<script')) {
    warnings.push('Script tags were removed')
  }

  if (original.includes('javascript:') && !sanitized.includes('javascript:')) {
    warnings.push('JavaScript URLs were removed')
  }

  if (original.includes('on') && original.match(/on\w+\s*=/)) {
    warnings.push('Event handlers were removed')
  }

  return {
    isValid: sanitized.length > 0,
    warnings,
    removedContent,
    lengthReduced,
  }
}

/**
 * Batch sanitize multiple content items
 */
export const batchSanitize = (
  items: Array<{ content: string; type?: 'html' | 'text' | 'url' }>,
  config?: SanitizationConfig,
): Array<{ original: string; sanitized: string; warnings: string[] }> => {
  return items.map(({ content, type = 'html' }) => {
    let sanitized: string

    switch (type) {
      case 'text':
        sanitized = sanitizeText(content)
        break
      case 'url':
        sanitized = sanitizeUrl(content)
        break
      default:
        sanitized = sanitizeHtml(content, config)
    }

    const validation = validateSanitizedContent(content, sanitized)

    return {
      original: content,
      sanitized,
      warnings: validation.warnings,
    }
  })
}
