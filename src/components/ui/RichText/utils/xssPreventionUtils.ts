/**
 * XSS Prevention utilities for RichText components
 * Comprehensive protection against Cross-Site Scripting attacks
 */

import { sanitizeHtml, sanitizeUrl, sanitizeText } from './contentSanitization'
import type { SanitizationConfig } from './contentSanitization'

// XSS attack patterns to detect and prevent
const XSS_PATTERNS = {
  // Script injection patterns
  scriptTags: /<script[\s\S]*?<\/script>/gi,
  scriptAttributes: /on\w+\s*=\s*["'][^"']*["']/gi,
  scriptUrls: /javascript\s*:/gi,

  // Data URI attacks
  dataUris: /data\s*:\s*[^;]*;[^,]*,/gi,

  // CSS expression attacks
  cssExpressions: /expression\s*\(/gi,
  cssImports: /@import\s+/gi,

  // HTML injection
  htmlComments: /<!--[\s\S]*?-->/g,
  metaTags: /<meta[\s\S]*?>/gi,
  linkTags: /<link[\s\S]*?>/gi,
  styleTags: /<style[\s\S]*?<\/style>/gi,

  // Form injection
  formTags: /<form[\s\S]*?<\/form>/gi,
  inputTags: /<input[\s\S]*?>/gi,

  // Object/embed injection
  objectTags: /<object[\s\S]*?<\/object>/gi,
  embedTags: /<embed[\s\S]*?>/gi,
  iframeTags: /<iframe[\s\S]*?<\/iframe>/gi,

  // Base tag attacks
  baseTags: /<base[\s\S]*?>/gi,

  // SVG-based attacks
  svgTags: /<svg[\s\S]*?<\/svg>/gi,

  // XML processing instructions
  xmlProcessing: /<\?[\s\S]*?\?>/g,

  // CDATA sections
  cdataSections: /<!\[CDATA\[[\s\S]*?\]\]>/g,
}

// Dangerous HTML attributes that can execute JavaScript
// Note: This list is commented out as it's not currently used
// const DANGEROUS_ATTRIBUTES = [
//   // Event handlers
//   'onabort',
//   'onactivate',
//   'onafterprint',
//   'onafterscriptexecute',
//   'onanimationcancel',
//   'onanimationend',
//   'onanimationiteration',
//   'onanimationstart',
//   'onauxclick',
//   'onbeforeactivate',
//   'onbeforecopy',
//   'onbeforecut',
//   'onbeforedeactivate',
//   'onbeforepaste',
//   'onbeforeprint',
//   'onbeforescriptexecute',
//   'onbeforeunload',
//   'onbegin',
//   'onblur',
//   'onbounce',
//   'oncanplay',
//   'oncanplaythrough',
//   'onchange',
//   'onclick',
//   'onclose',
//   'oncontextmenu',
//   'oncopy',
//   'oncuechange',
//   'oncut',
//   'ondblclick',
//   'ondeactivate',
//   'ondrag',
//   'ondragend',
//   'ondragenter',
//   'ondragleave',
//   'ondragover',
//   'ondragstart',
//   'ondrop',
//   'ondurationchange',
//   'onemptied',
//   'onend',
//   'onended',
//   'onerror',
//   'onfocus',
//   'onfocusin',
//   'onfocusout',
//   'onformchange',
//   'onforminput',
//   'onhashchange',
//   'oninput',
//   'oninvalid',
//   'onkeydown',
//   'onkeypress',
//   'onkeyup',
//   'onload',
//   'onloadeddata',
//   'onloadedmetadata',
//   'onloadstart',
//   'onmessage',
//   'onmousedown',
//   'onmouseenter',
//   'onmouseleave',
//   'onmousemove',
//   'onmouseout',
//   'onmouseover',
//   'onmouseup',
//   'onmousewheel',
//   'onoffline',
//   'ononline',
//   'onpagehide',
//   'onpageshow',
//   'onpaste',
//   'onpause',
//   'onplay',
//   'onplaying',
//   'onpopstate',
//   'onprogress',
//   'onratechange',
//   'onreadystatechange',
//   'onredo',
//   'onrepeat',
//   'onreset',
//   'onresize',
//   'onscroll',
//   'onseeked',
//   'onseeking',
//   'onselect',
//   'onshow',
//   'onstalled',
//   'onstorage',
//   'onsubmit',
//   'onsuspend',
//   'ontimeupdate',
//   'ontoggle',
//   'onundo',
//   'onunload',
//   'onvolumechange',
//   'onwaiting',
//   'onwheel',
//   // Other dangerous attributes
//   'srcdoc',
//   'sandbox',
//   'allowfullscreen',
//   'allowpaymentrequest',
// ]

// Content Security Policy directives for XSS prevention
export const CSP_DIRECTIVES = {
  strict: {
    'default-src': "'self'",
    'script-src': "'self'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: https:",
    'font-src': "'self' https:",
    'connect-src': "'self'",
    'media-src': "'self'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'frame-ancestors': "'none'",
    'upgrade-insecure-requests': '',
  },
  moderate: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: https:",
    'font-src': "'self' https:",
    'connect-src': "'self' https:",
    'media-src': "'self' https:",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'frame-ancestors': "'self'",
  },
  permissive: {
    'default-src': "'self' 'unsafe-inline' 'unsafe-eval'",
    'img-src': "'self' data: https: http:",
    'media-src': "'self' https: http:",
    'object-src': "'none'",
    'base-uri': "'self'",
  },
}

/**
 * XSS Prevention configuration
 */
export interface XSSPreventionConfig {
  enableScriptBlocking?: boolean
  enableAttributeFiltering?: boolean
  enableUrlValidation?: boolean
  enableCSSProtection?: boolean
  enableHTMLFiltering?: boolean
  logAttempts?: boolean
  strictMode?: boolean
  allowedDomains?: string[]
  blockedPatterns?: RegExp[]
  customValidators?: Array<(content: string) => { isValid: boolean; reason?: string }>
}

export const DEFAULT_XSS_CONFIG: XSSPreventionConfig = {
  enableScriptBlocking: true,
  enableAttributeFiltering: true,
  enableUrlValidation: true,
  enableCSSProtection: true,
  enableHTMLFiltering: true,
  logAttempts: true,
  strictMode: false,
  allowedDomains: [],
  blockedPatterns: [],
  customValidators: [],
}

/**
 * XSS Detection result
 */
export interface XSSDetectionResult {
  isClean: boolean
  threats: Array<{
    type: string
    pattern: string
    location: number
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
  }>
  sanitizedContent?: string
  recommendations: string[]
}

/**
 * Detect XSS patterns in content
 */
export const detectXSSPatterns = (
  content: string,
  config: XSSPreventionConfig = DEFAULT_XSS_CONFIG,
): XSSDetectionResult => {
  const threats: XSSDetectionResult['threats'] = []
  const recommendations: string[] = []

  if (!content || typeof content !== 'string') {
    return { isClean: true, threats: [], recommendations: [] }
  }

  // Check for script tags
  if (config.enableScriptBlocking) {
    const scriptMatches = content.matchAll(XSS_PATTERNS.scriptTags)
    for (const match of scriptMatches) {
      threats.push({
        type: 'script_injection',
        pattern: match[0].substring(0, 50) + '...',
        location: match.index || 0,
        severity: 'critical',
        description: 'Script tag detected - potential JavaScript execution',
      })
    }

    // Check for JavaScript URLs
    const jsUrlMatches = content.matchAll(XSS_PATTERNS.scriptUrls)
    for (const match of jsUrlMatches) {
      threats.push({
        type: 'javascript_url',
        pattern: match[0],
        location: match.index || 0,
        severity: 'high',
        description: 'JavaScript URL detected - potential code execution',
      })
    }
  }

  // Check for dangerous attributes
  if (config.enableAttributeFiltering) {
    const attrMatches = content.matchAll(XSS_PATTERNS.scriptAttributes)
    for (const match of attrMatches) {
      threats.push({
        type: 'event_handler',
        pattern: match[0],
        location: match.index || 0,
        severity: 'high',
        description: 'Event handler attribute detected - potential JavaScript execution',
      })
    }
  }

  // Check for data URIs
  if (config.enableUrlValidation) {
    const dataUriMatches = content.matchAll(XSS_PATTERNS.dataUris)
    for (const match of dataUriMatches) {
      threats.push({
        type: 'data_uri',
        pattern: match[0].substring(0, 50) + '...',
        location: match.index || 0,
        severity: 'medium',
        description: 'Data URI detected - potential content injection',
      })
    }
  }

  // Check for CSS expressions
  if (config.enableCSSProtection) {
    const cssExprMatches = content.matchAll(XSS_PATTERNS.cssExpressions)
    for (const match of cssExprMatches) {
      threats.push({
        type: 'css_expression',
        pattern: match[0],
        location: match.index || 0,
        severity: 'high',
        description: 'CSS expression detected - potential JavaScript execution',
      })
    }
  }

  // Check for dangerous HTML tags
  if (config.enableHTMLFiltering) {
    const dangerousTags = [
      { pattern: XSS_PATTERNS.objectTags, type: 'object_tag', severity: 'high' as const },
      { pattern: XSS_PATTERNS.embedTags, type: 'embed_tag', severity: 'high' as const },
      { pattern: XSS_PATTERNS.iframeTags, type: 'iframe_tag', severity: 'medium' as const },
      { pattern: XSS_PATTERNS.formTags, type: 'form_tag', severity: 'medium' as const },
      { pattern: XSS_PATTERNS.baseTags, type: 'base_tag', severity: 'high' as const },
    ]

    for (const { pattern, type, severity } of dangerousTags) {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        threats.push({
          type,
          pattern: match[0].substring(0, 50) + '...',
          location: match.index || 0,
          severity,
          description: `Potentially dangerous ${type.replace('_', ' ')} detected`,
        })
      }
    }
  }

  // Check custom blocked patterns
  if (config.blockedPatterns) {
    for (const pattern of config.blockedPatterns) {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        threats.push({
          type: 'custom_pattern',
          pattern: match[0],
          location: match.index || 0,
          severity: 'medium',
          description: 'Content matches blocked pattern',
        })
      }
    }
  }

  // Run custom validators
  if (config.customValidators) {
    for (const validator of config.customValidators) {
      try {
        const result = validator(content)
        if (!result.isValid) {
          threats.push({
            type: 'custom_validation',
            pattern: 'Custom validation failed',
            location: 0,
            severity: 'medium',
            description: result.reason || 'Custom validation failed',
          })
        }
      } catch (error) {
        console.error('Custom XSS validator error:', error)
      }
    }
  }

  // Generate recommendations
  if (threats.length > 0) {
    recommendations.push('Content contains potential XSS threats')

    if (threats.some((t) => t.type === 'script_injection')) {
      recommendations.push('Remove or encode script tags')
    }

    if (threats.some((t) => t.type === 'event_handler')) {
      recommendations.push('Remove event handler attributes')
    }

    if (threats.some((t) => t.type === 'javascript_url')) {
      recommendations.push('Replace javascript: URLs with safe alternatives')
    }

    recommendations.push('Use content sanitization before rendering')
  }

  // Log attempts if enabled
  if (config.logAttempts && threats.length > 0) {
    console.warn('XSS attempt detected:', {
      threatCount: threats.length,
      threats: threats.map((t) => ({ type: t.type, severity: t.severity })),
      content: content.substring(0, 100) + '...',
    })
  }

  return {
    isClean: threats.length === 0,
    threats,
    recommendations,
  }
}

/**
 * Sanitize content with XSS prevention
 */
export const sanitizeWithXSSPrevention = (
  content: string,
  config: XSSPreventionConfig = DEFAULT_XSS_CONFIG,
  sanitizationConfig?: SanitizationConfig,
): { sanitized: string; detection: XSSDetectionResult } => {
  // First detect XSS patterns
  const detection = detectXSSPatterns(content, config)

  // Apply sanitization
  let sanitized = content

  if (!detection.isClean || config.strictMode) {
    // Use strict sanitization if threats detected or in strict mode
    const strictConfig: SanitizationConfig = {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: {
        '*': ['class'],
        a: ['href', 'rel'],
      },
      allowedSchemes: ['https', 'mailto'],
      stripTags: true,
      stripAttributes: true,
      maxLength: 10000,
      allowDataAttributes: false,
      allowAriaAttributes: true,
      customSanitizers: [],
    }

    sanitized = sanitizeHtml(content, sanitizationConfig || strictConfig)
  } else {
    // Use normal sanitization
    sanitized = sanitizeHtml(content, sanitizationConfig)
  }

  return {
    sanitized,
    detection: {
      ...detection,
      sanitizedContent: sanitized,
    },
  }
}

/**
 * Validate and sanitize URLs with XSS prevention
 */
export const sanitizeUrlWithXSSPrevention = (
  url: string,
  config: XSSPreventionConfig = DEFAULT_XSS_CONFIG,
): { sanitized: string; isValid: boolean; warnings: string[] } => {
  const warnings: string[] = []

  if (!url || typeof url !== 'string') {
    return { sanitized: '', isValid: false, warnings: ['Invalid URL'] }
  }

  // Check for XSS patterns in URL
  const detection = detectXSSPatterns(url, config)

  if (!detection.isClean) {
    warnings.push('URL contains potential XSS patterns')

    // Log the attempt
    if (config.logAttempts) {
      console.warn('XSS attempt in URL:', {
        url: url.substring(0, 100),
        threats: detection.threats.map((t) => t.type),
      })
    }

    return { sanitized: '', isValid: false, warnings }
  }

  // Sanitize the URL
  const sanitized = sanitizeUrl(url, ['https', 'http', 'mailto', 'tel'])

  // Additional domain validation
  if (config.allowedDomains && config.allowedDomains.length > 0) {
    try {
      const urlObj = new URL(sanitized)
      const isAllowed = config.allowedDomains.some((domain) =>
        urlObj.hostname.toLowerCase().endsWith(domain.toLowerCase()),
      )

      if (!isAllowed) {
        warnings.push(`Domain not in allowed list: ${urlObj.hostname}`)
        return { sanitized: '', isValid: false, warnings }
      }
    } catch (error) {
      // If URL parsing fails, it might be a relative URL
      if (!sanitized.startsWith('/') && !sanitized.startsWith('#')) {
        warnings.push('Invalid URL format')
        return { sanitized: '', isValid: false, warnings }
      }
    }
  }

  return {
    sanitized,
    isValid: sanitized.length > 0,
    warnings,
  }
}

/**
 * Create Content Security Policy header value
 */
export const generateCSPHeader = (
  level: 'strict' | 'moderate' | 'permissive' = 'moderate',
  customDirectives?: Record<string, string>,
): string => {
  const directives = { ...CSP_DIRECTIVES[level], ...customDirectives }

  return Object.entries(directives)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ')
}

/**
 * XSS prevention middleware for content processing
 */
export const createXSSPreventionMiddleware = (config: XSSPreventionConfig = DEFAULT_XSS_CONFIG) => {
  return (content: string): string => {
    const result = sanitizeWithXSSPrevention(content, config)

    if (!result.detection.isClean) {
      // Log security event
      console.warn('XSS prevention middleware blocked content:', {
        threatCount: result.detection.threats.length,
        threats: result.detection.threats.map((t) => t.type),
      })
    }

    return result.sanitized
  }
}

/**
 * Batch XSS prevention for multiple content items
 */
export const batchXSSPrevention = (
  items: Array<{ content: string; type?: 'html' | 'url' | 'text' }>,
  config: XSSPreventionConfig = DEFAULT_XSS_CONFIG,
): Array<{
  original: string
  sanitized: string
  isClean: boolean
  threats: number
  warnings: string[]
}> => {
  return items.map(({ content, type = 'html' }) => {
    if (type === 'url') {
      const result = sanitizeUrlWithXSSPrevention(content, config)
      return {
        original: content,
        sanitized: result.sanitized,
        isClean: result.isValid,
        threats: result.isValid ? 0 : 1,
        warnings: result.warnings,
      }
    } else if (type === 'text') {
      const sanitized = sanitizeText(content)
      return {
        original: content,
        sanitized,
        isClean: true,
        threats: 0,
        warnings: [],
      }
    } else {
      const result = sanitizeWithXSSPrevention(content, config)
      return {
        original: content,
        sanitized: result.sanitized,
        isClean: result.detection.isClean,
        threats: result.detection.threats.length,
        warnings: result.detection.recommendations,
      }
    }
  })
}

/**
 * XSS prevention hooks for React components
 */
export const useXSSPrevention = (
  content: string,
  config: XSSPreventionConfig = DEFAULT_XSS_CONFIG,
) => {
  const result = sanitizeWithXSSPrevention(content, config)

  return {
    sanitizedContent: result.sanitized,
    isClean: result.detection.isClean,
    threats: result.detection.threats,
    recommendations: result.detection.recommendations,
  }
}

/**
 * Security headers for XSS prevention
 */
export const getSecurityHeaders = (level: 'strict' | 'moderate' | 'permissive' = 'moderate') => {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }

  // Add CSP header
  headers['Content-Security-Policy'] = generateCSPHeader(level)

  // Adjust based on security level
  if (level === 'strict') {
    headers['X-Frame-Options'] = 'DENY'
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  } else if (level === 'moderate') {
    headers['X-Frame-Options'] = 'SAMEORIGIN'
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  } else {
    headers['X-Frame-Options'] = 'SAMEORIGIN'
  }

  return headers
}
