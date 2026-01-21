import React from 'react'
import { LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { LinkConverterConfig } from '../types'
import { generateInternalHref } from '../utils'
import { sanitizeUrlWithXSSPrevention, type XSSPreventionConfig } from '../utils/xssPreventionUtils'

// Link validation types
export interface LinkValidationResult {
  isValid: boolean
  error?: string
  warning?: string
}

export interface LinkValidationRules {
  allowedDomains?: string[]
  blockedDomains?: string[]
  requireHttps?: boolean
  maxUrlLength?: number
  validateInternalLinks?: boolean
}

export interface EnhancedLinkConverterConfig extends LinkConverterConfig {
  validationRules?: LinkValidationRules
  xssPreventionConfig?: XSSPreventionConfig
  enablePreview?: boolean
  enableAnalytics?: boolean
  onLinkClick?: (url: string, type: 'internal' | 'external') => void
  onValidationError?: (error: string, linkNode: SerializedLinkNode) => void
  onXSSAttempt?: (url: string, threats: string[]) => void
}

// Link validation utilities with XSS prevention
export const validateExternalUrl = (
  url: string,
  rules: LinkValidationRules = {},
  xssConfig?: XSSPreventionConfig,
): LinkValidationResult => {
  // First check for XSS patterns
  if (xssConfig) {
    const xssResult = sanitizeUrlWithXSSPrevention(url, xssConfig)
    if (!xssResult.isValid) {
      return {
        isValid: false,
        error: `URL contains potential XSS patterns: ${xssResult.warnings.join(', ')}`,
      }
    }
    // Use the sanitized URL for further validation
    url = xssResult.sanitized
  }

  try {
    const urlObj = new URL(url)

    // Check HTTPS requirement
    if (rules.requireHttps && urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'HTTPS is required for external links',
      }
    }

    // Check URL length
    if (rules.maxUrlLength && url.length > rules.maxUrlLength) {
      return {
        isValid: false,
        error: `URL exceeds maximum length of ${rules.maxUrlLength} characters`,
      }
    }

    // Check allowed domains
    if (rules.allowedDomains && rules.allowedDomains.length > 0) {
      const isAllowed = rules.allowedDomains.some((domain) =>
        urlObj.hostname.endsWith(domain.toLowerCase()),
      )
      if (!isAllowed) {
        return {
          isValid: false,
          error: `Domain ${urlObj.hostname} is not in the allowed domains list`,
        }
      }
    }

    // Check blocked domains
    if (rules.blockedDomains && rules.blockedDomains.length > 0) {
      const isBlocked = rules.blockedDomains.some((domain) =>
        urlObj.hostname.endsWith(domain.toLowerCase()),
      )
      if (isBlocked) {
        return {
          isValid: false,
          error: `Domain ${urlObj.hostname} is blocked`,
        }
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
    }
  }
}

export const validateInternalLink = (
  linkNode: SerializedLinkNode,
  rules: LinkValidationRules = {},
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
    }
  }

  return { isValid: true }
}

// Enhanced internal link resolver with validation
export const createValidatedInternalDocToHref = (config: EnhancedLinkConverterConfig = {}) => {
  return ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    // Validate internal link if rules are provided
    if (config.validationRules) {
      const validation = validateInternalLink(linkNode, config.validationRules)
      if (!validation.isValid) {
        config.onValidationError?.(validation.error!, linkNode)
        console.warn('Invalid internal link:', validation.error)
        // Return a fallback URL or empty string
        return '#invalid-link'
      }
    }

    try {
      const { value, relationTo } = linkNode.fields.doc!
      if (typeof value !== 'object') {
        throw new Error('Expected value to be an object')
      }
      return generateInternalHref(value, relationTo)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      config.onValidationError?.(errorMessage, linkNode)
      console.error('Error generating internal link:', error)
      return '#error-generating-link'
    }
  }
}

// Enhanced external link props with validation and security
export const createValidatedExternalLinkProps = (config: EnhancedLinkConverterConfig = {}) => {
  return (linkNode: SerializedLinkNode) => {
    const props: Record<string, any> = {}
    let url = linkNode.fields.url

    // Apply XSS prevention first
    if (config.xssPreventionConfig && url) {
      const xssResult = sanitizeUrlWithXSSPrevention(url, config.xssPreventionConfig)
      if (!xssResult.isValid) {
        config.onXSSAttempt?.(url, xssResult.warnings)
        console.warn('XSS attempt detected in link URL:', xssResult.warnings)
        // Return props that disable the link
        return {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault()
            alert(`Link blocked for security reasons: ${xssResult.warnings.join(', ')}`)
          },
          style: { color: 'red', textDecoration: 'line-through' },
          title: `Security blocked: ${xssResult.warnings.join(', ')}`,
          'data-security-blocked': 'true',
        }
      }
      // Use sanitized URL
      url = xssResult.sanitized
    }

    // Validate external URL if rules are provided
    if (config.validationRules && url) {
      const validation = validateExternalUrl(
        url,
        config.validationRules,
        config.xssPreventionConfig,
      )
      if (!validation.isValid) {
        config.onValidationError?.(validation.error!, linkNode)
        console.warn('Invalid external link:', validation.error)
        // Return props that disable the link
        return {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault()
            alert(`Link blocked: ${validation.error}`)
          },
          style: { color: 'red', textDecoration: 'line-through' },
          title: `Blocked: ${validation.error}`,
          'data-validation-blocked': 'true',
        }
      }
    }

    // Handle "open in new tab" option (support multiple field names for compatibility)
    if (linkNode.fields.newTab || linkNode.fields.openInNewTab) {
      props.target = '_blank'
      // Always add noopener and noreferrer for security
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

    // Handle download attribute
    if (linkNode.fields.download) {
      props.download = true
    }

    // Handle title attribute (tooltip)
    if (linkNode.fields.title) {
      props.title = linkNode.fields.title
    }

    // Handle hreflang attribute
    if (linkNode.fields.hreflang) {
      props.hrefLang = linkNode.fields.hreflang
    }

    // Add analytics tracking
    if (config.enableAnalytics && config.onLinkClick) {
      const originalOnClick = props.onClick
      props.onClick = (e: React.MouseEvent) => {
        config.onLinkClick!(url || linkNode.fields.url || '', 'external')
        originalOnClick?.(e)
      }
    }

    // Add link preview data attributes
    if (config.enablePreview && url) {
      props['data-link-preview'] = url
      props['data-link-type'] = 'external'
    }

    // Add security attributes for external links if not already present
    if (url && !props.rel) {
      props.rel = 'noopener'
    }

    // Add security indicators
    if (config.xssPreventionConfig) {
      props['data-xss-protected'] = 'true'
    }

    return props
  }
}

// Link preview component (for future enhancement)
export const LinkPreview: React.FC<{
  url: string
  onClose: () => void
}> = ({ url, onClose }) => {
  const [previewData, setPreviewData] = React.useState<{
    title?: string
    description?: string
    image?: string
    loading: boolean
  }>({ loading: true })

  React.useEffect(() => {
    // In a real implementation, this would fetch preview data
    // For now, we'll just show the URL
    setTimeout(() => {
      setPreviewData({
        title: url,
        description: 'External link',
        loading: false,
      })
    }, 500)
  }, [url])

  if (previewData.loading) {
    return React.createElement(
      'div',
      {
        className: 'absolute z-10 p-2 bg-white border border-gray-300 rounded shadow-lg',
      },
      React.createElement(
        'div',
        {
          className: 'text-sm text-gray-500',
        },
        'Loading preview...',
      ),
    )
  }

  return React.createElement(
    'div',
    {
      className: 'absolute z-10 p-3 bg-white border border-gray-300 rounded shadow-lg max-w-sm',
    },
    [
      React.createElement(
        'button',
        {
          key: 'close',
          onClick: onClose,
          className: 'absolute top-1 right-1 text-gray-400 hover:text-gray-600',
          'aria-label': 'Close preview',
        },
        '×',
      ),
      React.createElement(
        'div',
        {
          key: 'title',
          className: 'text-sm font-medium',
        },
        previewData.title,
      ),
      previewData.description &&
        React.createElement(
          'div',
          {
            key: 'description',
            className: 'text-xs text-gray-600 mt-1',
          },
          previewData.description,
        ),
      React.createElement(
        'div',
        {
          key: 'url',
          className: 'text-xs text-blue-600 mt-1 break-all',
        },
        url,
      ),
    ].filter(Boolean),
  )
}

// Enhanced link converter with all features
export const createEnhancedLinkConverter = (config: EnhancedLinkConverterConfig = {}) => {
  const internalDocToHref = config.internalDocToHref || createValidatedInternalDocToHref(config)

  return LinkJSXConverter({
    internalDocToHref,
  })
}

// Utility to create custom link converters with validation
export const createCustomLinkConverter = (
  internalResolver?: (linkNode: SerializedLinkNode) => string,
  validationRules?: LinkValidationRules,
) => {
  return createEnhancedLinkConverter({
    internalDocToHref: internalResolver ? ({ linkNode }) => internalResolver(linkNode) : undefined,
    validationRules,
  })
}

// Analytics-enabled link converter
export const createAnalyticsLinkConverter = (
  trackingFunction?: (url: string, type: 'internal' | 'external') => void,
  validationRules?: LinkValidationRules,
) => {
  return createEnhancedLinkConverter({
    enableAnalytics: true,
    onLinkClick: trackingFunction,
    validationRules,
  })
}

// Security-focused link converter with XSS prevention
export const createSecureLinkConverter = (
  allowedDomains?: string[],
  blockedDomains?: string[],
  enableXSSPrevention: boolean = true,
) => {
  return createEnhancedLinkConverter({
    validationRules: {
      allowedDomains,
      blockedDomains,
      requireHttps: true,
      validateInternalLinks: true,
    },
    xssPreventionConfig: enableXSSPrevention
      ? {
          enableScriptBlocking: true,
          enableAttributeFiltering: true,
          enableUrlValidation: true,
          logAttempts: true,
          strictMode: true,
        }
      : undefined,
    onValidationError: (error, linkNode) => {
      console.warn('Link security validation failed:', error, linkNode)
    },
    onXSSAttempt: (url, threats) => {
      console.error('XSS attempt detected in link:', { url, threats })
    },
  })
}

// Preview-enabled link converter
export const createPreviewLinkConverter = (config: EnhancedLinkConverterConfig = {}) => {
  return createEnhancedLinkConverter({
    ...config,
    enablePreview: true,
  })
}

// Default enhanced link converter with sensible defaults and XSS prevention
export const defaultEnhancedLinkConverter = createEnhancedLinkConverter({
  validationRules: {
    requireHttps: false, // Don't require HTTPS by default for flexibility
    maxUrlLength: 2048,
    validateInternalLinks: true,
  },
  xssPreventionConfig: {
    enableScriptBlocking: true,
    enableAttributeFiltering: true,
    enableUrlValidation: true,
    logAttempts: process.env.NODE_ENV === 'development',
    strictMode: false,
  },
  onValidationError: (error, linkNode) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Link validation error:', error, linkNode)
    }
  },
  onXSSAttempt: (url, threats) => {
    console.warn('XSS attempt detected in link URL:', { url, threats })
  },
})

// Backward compatibility exports
export const defaultInternalDocToHref = createValidatedInternalDocToHref()
export { createEnhancedLinkConverter as createLinkConverter }
