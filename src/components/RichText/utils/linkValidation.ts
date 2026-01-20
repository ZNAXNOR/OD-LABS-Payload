import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'

// Link validation types
export interface LinkValidationResult {
  isValid: boolean
  error?: string
  warning?: string
  suggestions?: string[]
}

export interface LinkValidationRules {
  allowedDomains?: string[]
  blockedDomains?: string[]
  requireHttps?: boolean
  maxUrlLength?: number
  validateInternalLinks?: boolean
  allowedProtocols?: string[]
  checkMaliciousPatterns?: boolean
}

// Default validation rules
export const defaultValidationRules: LinkValidationRules = {
  requireHttps: false,
  maxUrlLength: 2048,
  validateInternalLinks: true,
  allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'],
  checkMaliciousPatterns: true,
}

// Malicious URL patterns to check for
const maliciousPatterns = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /onload=/i,
  /onerror=/i,
  /onclick=/i,
  /<script/i,
  /eval\(/i,
]

// Common typos in domain names
const commonDomainTypos: Record<string, string> = {
  'gooogle.com': 'google.com',
  'yahooo.com': 'yahoo.com',
  'facebok.com': 'facebook.com',
  'twiter.com': 'twitter.com',
  'githb.com': 'github.com',
  'stackoverfow.com': 'stackoverflow.com',
}

/**
 * Validates an external URL against the provided rules
 */
export const validateExternalUrl = (
  url: string,
  rules: LinkValidationRules = defaultValidationRules,
): LinkValidationResult => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL is required and must be a string',
    }
  }

  // Trim whitespace
  url = url.trim()

  if (!url) {
    return {
      isValid: false,
      error: 'URL cannot be empty',
    }
  }

  try {
    const urlObj = new URL(url)

    // Check for malicious patterns
    if (rules.checkMaliciousPatterns) {
      const maliciousPattern = maliciousPatterns.find((pattern) => pattern.test(url))
      if (maliciousPattern) {
        return {
          isValid: false,
          error: 'URL contains potentially malicious content',
        }
      }
    }

    // Check allowed protocols
    if (rules.allowedProtocols && !rules.allowedProtocols.includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: `Protocol ${urlObj.protocol} is not allowed. Allowed protocols: ${rules.allowedProtocols.join(', ')}`,
        suggestions: rules.allowedProtocols.map(
          (protocol) =>
            `${protocol}//${urlObj.hostname}${urlObj.pathname}${urlObj.search}${urlObj.hash}`,
        ),
      }
    }

    // Check HTTPS requirement
    if (rules.requireHttps && urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'HTTPS is required for external links',
        suggestions: [`https://${urlObj.hostname}${urlObj.pathname}${urlObj.search}${urlObj.hash}`],
      }
    }

    // Check URL length
    if (rules.maxUrlLength && url.length > rules.maxUrlLength) {
      return {
        isValid: false,
        error: `URL exceeds maximum length of ${rules.maxUrlLength} characters (current: ${url.length})`,
      }
    }

    // Check allowed domains
    if (rules.allowedDomains && rules.allowedDomains.length > 0) {
      const isAllowed = rules.allowedDomains.some((domain) =>
        urlObj.hostname.toLowerCase().endsWith(domain.toLowerCase()),
      )
      if (!isAllowed) {
        return {
          isValid: false,
          error: `Domain ${urlObj.hostname} is not in the allowed domains list`,
          suggestions: rules.allowedDomains.map((domain) => `https://${domain}`),
        }
      }
    }

    // Check blocked domains
    if (rules.blockedDomains && rules.blockedDomains.length > 0) {
      const isBlocked = rules.blockedDomains.some((domain) =>
        urlObj.hostname.toLowerCase().endsWith(domain.toLowerCase()),
      )
      if (isBlocked) {
        return {
          isValid: false,
          error: `Domain ${urlObj.hostname} is blocked`,
        }
      }
    }

    // Check for common domain typos
    const correctedDomain = commonDomainTypos[urlObj.hostname.toLowerCase()]
    if (correctedDomain) {
      return {
        isValid: true,
        warning: `Did you mean ${correctedDomain}?`,
        suggestions: [
          `${urlObj.protocol}//${correctedDomain}${urlObj.pathname}${urlObj.search}${urlObj.hash}`,
        ],
      }
    }

    // Additional checks for suspicious patterns
    const warnings: string[] = []

    // Check for suspicious TLDs
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf']
    if (suspiciousTlds.some((tld) => urlObj.hostname.endsWith(tld))) {
      warnings.push('This domain uses a TLD that is commonly associated with spam')
    }

    // Check for IP addresses
    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      warnings.push('Linking to IP addresses may not be user-friendly')
    }

    // Check for very long domains
    if (urlObj.hostname.length > 50) {
      warnings.push('This domain name is unusually long')
    }

    return {
      isValid: true,
      warning: warnings.length > 0 ? warnings.join('; ') : undefined,
    }
  } catch (error) {
    // Check if it might be a relative URL
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return {
        isValid: true,
        warning: 'This appears to be a relative URL',
      }
    }

    // Check if it's missing protocol
    if (!url.includes('://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
      return {
        isValid: false,
        error: 'Invalid URL format',
        suggestions: [`https://${url}`, `http://${url}`],
      }
    }

    return {
      isValid: false,
      error: 'Invalid URL format',
    }
  }
}

/**
 * Validates an internal link node
 */
export const validateInternalLink = (
  linkNode: SerializedLinkNode,
  rules: LinkValidationRules = defaultValidationRules,
): LinkValidationResult => {
  if (!rules.validateInternalLinks) {
    return { isValid: true }
  }

  const { value, relationTo } = linkNode.fields.doc || {}

  if (!value || !relationTo) {
    return {
      isValid: false,
      error: 'Internal link is missing document reference',
    }
  }

  if (typeof value !== 'object' || !value.slug) {
    return {
      isValid: false,
      error: 'Internal link document is missing slug',
    }
  }

  // Check if the collection is valid
  const validCollections = ['pages', 'blogs', 'services', 'legal', 'contacts']
  if (!validCollections.includes(relationTo)) {
    return {
      isValid: false,
      error: `Invalid collection type: ${relationTo}`,
      suggestions: validCollections,
    }
  }

  // Validate slug format
  const slug = value.slug
  if (typeof slug !== 'string') {
    return {
      isValid: false,
      error: 'Slug must be a string',
    }
  }

  // Check slug format (allow 'home' as special case)
  if (slug !== 'home' && !/^[a-z0-9-]+$/.test(slug)) {
    return {
      isValid: false,
      error: 'Slug contains invalid characters. Use only lowercase letters, numbers, and hyphens.',
      suggestions: [
        slug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-'),
      ],
    }
  }

  return { isValid: true }
}

/**
 * Validates any link node (internal or external)
 */
export const validateLinkNode = (
  linkNode: SerializedLinkNode,
  rules: LinkValidationRules = defaultValidationRules,
): LinkValidationResult => {
  // Check if it's an internal link
  if (linkNode.fields.doc) {
    return validateInternalLink(linkNode, rules)
  }

  // Check if it's an external link
  if (linkNode.fields.url) {
    return validateExternalUrl(linkNode.fields.url, rules)
  }

  return {
    isValid: false,
    error: 'Link must have either a document reference or URL',
  }
}

/**
 * Batch validate multiple links
 */
export const validateLinks = (
  linkNodes: SerializedLinkNode[],
  rules: LinkValidationRules = defaultValidationRules,
): {
  results: Array<LinkValidationResult & { index: number }>
  summary: {
    total: number
    valid: number
    invalid: number
    warnings: number
  }
} => {
  const results = linkNodes.map((linkNode, index) => ({
    ...validateLinkNode(linkNode, rules),
    index,
  }))

  const summary = {
    total: results.length,
    valid: results.filter((r) => r.isValid).length,
    invalid: results.filter((r) => !r.isValid).length,
    warnings: results.filter((r) => r.warning).length,
  }

  return { results, summary }
}

/**
 * Get validation rules for different security levels
 */
export const getValidationRulesBySecurityLevel = (
  level: 'strict' | 'moderate' | 'permissive',
): LinkValidationRules => {
  switch (level) {
    case 'strict':
      return {
        requireHttps: true,
        maxUrlLength: 1024,
        validateInternalLinks: true,
        allowedProtocols: ['https:', 'mailto:'],
        checkMaliciousPatterns: true,
      }

    case 'moderate':
      return {
        requireHttps: false,
        maxUrlLength: 2048,
        validateInternalLinks: true,
        allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:'],
        checkMaliciousPatterns: true,
      }

    case 'permissive':
      return {
        requireHttps: false,
        maxUrlLength: 4096,
        validateInternalLinks: false,
        allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'],
        checkMaliciousPatterns: false,
      }

    default:
      return defaultValidationRules
  }
}

/**
 * Create validation rules for specific use cases
 */
export const createValidationRules = (options: {
  securityLevel?: 'strict' | 'moderate' | 'permissive'
  allowedDomains?: string[]
  blockedDomains?: string[]
  customRules?: Partial<LinkValidationRules>
}): LinkValidationRules => {
  const baseRules = options.securityLevel
    ? getValidationRulesBySecurityLevel(options.securityLevel)
    : defaultValidationRules

  return {
    ...baseRules,
    allowedDomains: options.allowedDomains,
    blockedDomains: options.blockedDomains,
    ...options.customRules,
  }
}
