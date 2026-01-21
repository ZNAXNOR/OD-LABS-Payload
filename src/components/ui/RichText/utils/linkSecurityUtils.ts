/**
 * Advanced link security utilities for RichText components
 * Provides comprehensive security validation for links
 */

import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { validateLinkNode, type LinkValidationRules } from './linkValidation'
import { detectXSSPatterns } from './xssPreventionUtils'

// Security threat levels
export type SecurityThreatLevel = 'none' | 'low' | 'medium' | 'high' | 'critical'

// Link security assessment result
export interface LinkSecurityAssessment {
  isSecure: boolean
  threatLevel: SecurityThreatLevel
  threats: Array<{
    type: string
    severity: SecurityThreatLevel
    description: string
    recommendation: string
  }>
  sanitizedUrl?: string
  blockedReasons: string[]
  warnings: string[]
}

// Advanced security configuration
export interface LinkSecurityConfig {
  // Basic validation
  enableBasicValidation?: boolean
  enableXSSPrevention?: boolean
  enablePhishingDetection?: boolean
  enableMalwareDetection?: boolean

  // Domain security
  allowedDomains?: string[]
  blockedDomains?: string[]
  trustedDomains?: string[]
  suspiciousTlds?: string[]

  // URL analysis
  maxUrlLength?: number
  maxRedirects?: number
  checkUrlShorteners?: boolean
  analyzeUrlStructure?: boolean

  // Content security
  requireHttps?: boolean
  allowDataUris?: boolean
  allowJavaScriptUrls?: boolean
  allowFileUrls?: boolean

  // Behavioral analysis
  checkReputationServices?: boolean
  enableRealTimeScanning?: boolean
  cacheResults?: boolean

  // Response configuration
  blockOnThreat?: boolean
  logSecurityEvents?: boolean
  notifyOnThreat?: boolean
}

// Default security configuration
export const DEFAULT_LINK_SECURITY_CONFIG: LinkSecurityConfig = {
  enableBasicValidation: true,
  enableXSSPrevention: true,
  enablePhishingDetection: true,
  enableMalwareDetection: false, // Requires external services

  allowedDomains: [],
  blockedDomains: [],
  trustedDomains: ['github.com', 'stackoverflow.com', 'developer.mozilla.org'],
  suspiciousTlds: ['.tk', '.ml', '.ga', '.cf', '.click', '.download'],

  maxUrlLength: 2048,
  maxRedirects: 3,
  checkUrlShorteners: true,
  analyzeUrlStructure: true,

  requireHttps: false,
  allowDataUris: false,
  allowJavaScriptUrls: false,
  allowFileUrls: false,

  checkReputationServices: false,
  enableRealTimeScanning: false,
  cacheResults: true,

  blockOnThreat: true,
  logSecurityEvents: true,
  notifyOnThreat: false,
}

// Strict security configuration for high-security environments
export const STRICT_LINK_SECURITY_CONFIG: LinkSecurityConfig = {
  ...DEFAULT_LINK_SECURITY_CONFIG,
  requireHttps: true,
  allowDataUris: false,
  allowJavaScriptUrls: false,
  allowFileUrls: false,
  blockOnThreat: true,
  enablePhishingDetection: true,
  checkUrlShorteners: true,
  maxUrlLength: 1024,
}

// Known URL shortener domains
const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  'short.link',
  'ow.ly',
  'buff.ly',
  'is.gd',
  'goo.gl',
  't.co',
  'tiny.cc',
  'rb.gy',
  'cutt.ly',
  'short.io',
  'rebrand.ly',
  'clickmeter.com',
]

// Known phishing indicators
const PHISHING_INDICATORS = [
  // Suspicious keywords
  /urgent|immediate|verify|suspend|click.*here|act.*now/i,
  /security.*alert|account.*locked|payment.*failed/i,
  /winner|congratulations|prize|lottery|inheritance/i,

  // Suspicious patterns
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
  /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.(tk|ml|ga|cf)/, // Suspicious domain patterns
  /[a-z]{20,}\.com/, // Very long domain names
]

// Suspicious URL patterns
const SUSPICIOUS_URL_PATTERNS = [
  // Multiple subdomains
  /^https?:\/\/[^\/]*\.[^\/]*\.[^\/]*\.[^\/]*\//,

  // URL encoding abuse
  /%[0-9a-f]{2}/gi,

  // Suspicious parameters
  /[?&](redirect|url|link|goto|target)=/i,

  // Homograph attacks (similar looking characters)
  /[а-я]/, // Cyrillic characters that look like Latin
  /[αβγδεζηθικλμνξοπρστυφχψω]/, // Greek characters
]

/**
 * Assess the security of a URL
 */
export const assessUrlSecurity = async (
  url: string,
  config: LinkSecurityConfig = DEFAULT_LINK_SECURITY_CONFIG,
): Promise<LinkSecurityAssessment> => {
  const threats: LinkSecurityAssessment['threats'] = []
  const warnings: string[] = []
  const blockedReasons: string[] = []
  let threatLevel: SecurityThreatLevel = 'none'

  if (!url || typeof url !== 'string') {
    return {
      isSecure: false,
      threatLevel: 'high',
      threats: [
        {
          type: 'invalid_url',
          severity: 'high',
          description: 'Invalid or empty URL',
          recommendation: 'Provide a valid URL',
        },
      ],
      blockedReasons: ['Invalid URL'],
      warnings: [],
    }
  }

  // Basic XSS prevention
  if (config.enableXSSPrevention) {
    const xssResult = detectXSSPatterns(url)
    if (!xssResult.isClean) {
      xssResult.threats.forEach((threat) => {
        threats.push({
          type: 'xss_pattern',
          severity: threat.severity,
          description: `XSS pattern detected: ${threat.description}`,
          recommendation: 'Remove or encode dangerous patterns',
        })

        if (threat.severity === 'critical' || threat.severity === 'high') {
          threatLevel = 'critical'
          blockedReasons.push('XSS pattern detected')
        }
      })
    }
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch (error) {
    // Check if it's a relative URL
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return {
        isSecure: true,
        threatLevel: 'none',
        threats: [],
        blockedReasons: [],
        warnings: ['Relative URL - security assessment limited'],
      }
    }

    return {
      isSecure: false,
      threatLevel: 'medium',
      threats: [
        {
          type: 'malformed_url',
          severity: 'medium',
          description: 'URL format is invalid',
          recommendation: 'Check URL syntax and format',
        },
      ],
      blockedReasons: ['Malformed URL'],
      warnings: [],
    }
  }

  // Protocol security checks
  const protocol = parsedUrl.protocol.toLowerCase()

  if (protocol === 'javascript:' && !config.allowJavaScriptUrls) {
    threats.push({
      type: 'dangerous_protocol',
      severity: 'critical',
      description: 'JavaScript protocol detected - potential code execution',
      recommendation: 'Use safe protocols like https: or mailto:',
    })
    threatLevel = 'critical'
    blockedReasons.push('Dangerous protocol')
  }

  if (protocol === 'data:' && !config.allowDataUris) {
    threats.push({
      type: 'data_uri',
      severity: 'medium',
      description: 'Data URI detected - potential content injection',
      recommendation: 'Use external resources instead of data URIs',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    warnings.push('Data URI detected')
  }

  if (protocol === 'file:' && !config.allowFileUrls) {
    threats.push({
      type: 'file_protocol',
      severity: 'high',
      description: 'File protocol detected - potential local file access',
      recommendation: 'Use web protocols (http/https) instead',
    })
    if (threatLevel === 'none' || threatLevel === 'medium') threatLevel = 'high'
    blockedReasons.push('File protocol not allowed')
  }

  // HTTPS requirement
  if (
    config.requireHttps &&
    protocol !== 'https:' &&
    protocol !== 'mailto:' &&
    protocol !== 'tel:'
  ) {
    threats.push({
      type: 'insecure_protocol',
      severity: 'medium',
      description: 'Non-HTTPS protocol used',
      recommendation: 'Use HTTPS for secure communication',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    warnings.push('Non-HTTPS protocol')
  }

  // URL length check
  if (config.maxUrlLength && url.length > config.maxUrlLength) {
    threats.push({
      type: 'excessive_length',
      severity: 'low',
      description: `URL exceeds maximum length (${url.length}/${config.maxUrlLength})`,
      recommendation: 'Use shorter URLs or URL shorteners',
    })
    if (threatLevel === 'none') threatLevel = 'low'
    warnings.push('URL too long')
  }

  // Domain security checks
  const hostname = parsedUrl.hostname.toLowerCase()

  // Check blocked domains
  if (config.blockedDomains?.some((domain) => hostname.endsWith(domain.toLowerCase()))) {
    threats.push({
      type: 'blocked_domain',
      severity: 'high',
      description: `Domain is in blocked list: ${hostname}`,
      recommendation: 'Use an allowed domain',
    })
    if (threatLevel !== 'critical' && threatLevel !== 'high') threatLevel = 'high'
    blockedReasons.push('Blocked domain')
  }

  // Check allowed domains (if specified)
  if (
    config.allowedDomains?.length &&
    !config.allowedDomains.some((domain) => hostname.endsWith(domain.toLowerCase()))
  ) {
    threats.push({
      type: 'domain_not_allowed',
      severity: 'medium',
      description: `Domain not in allowed list: ${hostname}`,
      recommendation: 'Use an allowed domain',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    blockedReasons.push('Domain not allowed')
  }

  // Check suspicious TLDs
  if (config.suspiciousTlds?.some((tld) => hostname.endsWith(tld))) {
    threats.push({
      type: 'suspicious_tld',
      severity: 'medium',
      description: `Suspicious top-level domain: ${hostname}`,
      recommendation: 'Verify the legitimacy of this domain',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    warnings.push('Suspicious TLD')
  }

  // Check for URL shorteners
  if (
    config.checkUrlShorteners &&
    URL_SHORTENERS.some((shortener) => hostname.includes(shortener))
  ) {
    threats.push({
      type: 'url_shortener',
      severity: 'low',
      description: 'URL shortener detected - destination unknown',
      recommendation: 'Expand shortened URLs to verify destination',
    })
    if (threatLevel === 'none') threatLevel = 'low'
    warnings.push('URL shortener detected')
  }

  // Phishing detection
  if (config.enablePhishingDetection) {
    const fullUrl = url.toLowerCase()

    for (const pattern of PHISHING_INDICATORS) {
      if (pattern.test(fullUrl)) {
        threats.push({
          type: 'phishing_indicator',
          severity: 'high',
          description: 'URL contains phishing indicators',
          recommendation: 'Verify the legitimacy of this link',
        })
        if (threatLevel === 'none' || threatLevel === 'low' || threatLevel === 'medium') {
          threatLevel = 'high'
        }
        warnings.push('Potential phishing link')
        break
      }
    }
  }

  // URL structure analysis
  if (config.analyzeUrlStructure) {
    for (const pattern of SUSPICIOUS_URL_PATTERNS) {
      if (pattern.test(url)) {
        threats.push({
          type: 'suspicious_structure',
          severity: 'low',
          description: 'URL has suspicious structure',
          recommendation: 'Review URL structure for legitimacy',
        })
        if (threatLevel === 'none') threatLevel = 'low'
        warnings.push('Suspicious URL structure')
        break
      }
    }

    // Check for excessive URL encoding
    const encodedChars = (url.match(/%[0-9a-f]{2}/gi) || []).length
    if (encodedChars > 5) {
      threats.push({
        type: 'excessive_encoding',
        severity: 'medium',
        description: 'URL contains excessive encoding',
        recommendation: 'Verify the URL is not obfuscated',
      })
      if (threatLevel === 'none') threatLevel = 'medium'
      warnings.push('Excessive URL encoding')
    }
  }

  // IP address detection
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    threats.push({
      type: 'ip_address',
      severity: 'medium',
      description: 'URL uses IP address instead of domain name',
      recommendation: 'Use domain names for better security and user experience',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    warnings.push('IP address used')
  }

  // Determine if URL is secure
  const isSecure = threatLevel === 'none' || (threatLevel === 'low' && !config.blockOnThreat)

  // Log security events
  if (config.logSecurityEvents && threats.length > 0) {
    console.warn('Link security assessment:', {
      url: url.substring(0, 100) + (url.length > 100 ? '...' : ''),
      threatLevel,
      threatCount: threats.length,
      isSecure,
    })
  }

  return {
    isSecure,
    threatLevel,
    threats,
    sanitizedUrl: isSecure ? url : undefined,
    blockedReasons,
    warnings,
  }
}

/**
 * Assess the security of a link node
 */
export const assessLinkSecurity = async (
  linkNode: SerializedLinkNode,
  config: LinkSecurityConfig = DEFAULT_LINK_SECURITY_CONFIG,
): Promise<LinkSecurityAssessment> => {
  // Check if it's an external link
  if (linkNode.fields.url) {
    return assessUrlSecurity(linkNode.fields.url, config)
  }

  // Check if it's an internal link
  if (linkNode.fields.doc) {
    // Internal links are generally safe, but we can still validate them
    const validationRules: LinkValidationRules = {
      validateInternalLinks: true,
    }

    const validation = validateLinkNode(linkNode, validationRules)

    if (!validation.isValid) {
      return {
        isSecure: false,
        threatLevel: 'medium',
        threats: [
          {
            type: 'invalid_internal_link',
            severity: 'medium',
            description: validation.error || 'Internal link validation failed',
            recommendation: 'Fix the internal link reference',
          },
        ],
        blockedReasons: ['Invalid internal link'],
        warnings: [],
      }
    }

    return {
      isSecure: true,
      threatLevel: 'none',
      threats: [],
      blockedReasons: [],
      warnings: [],
    }
  }

  // No URL or doc reference
  return {
    isSecure: false,
    threatLevel: 'medium',
    threats: [
      {
        type: 'missing_reference',
        severity: 'medium',
        description: 'Link has no URL or document reference',
        recommendation: 'Add a valid URL or document reference',
      },
    ],
    blockedReasons: ['Missing link reference'],
    warnings: [],
  }
}

/**
 * Batch assess multiple links
 */
export const batchAssessLinkSecurity = async (
  links: Array<{ url?: string; linkNode?: SerializedLinkNode }>,
  config: LinkSecurityConfig = DEFAULT_LINK_SECURITY_CONFIG,
): Promise<Array<LinkSecurityAssessment & { index: number }>> => {
  const assessments = await Promise.all(
    links.map(async (link, index) => {
      let assessment: LinkSecurityAssessment

      if (link.linkNode) {
        assessment = await assessLinkSecurity(link.linkNode, config)
      } else if (link.url) {
        assessment = await assessUrlSecurity(link.url, config)
      } else {
        assessment = {
          isSecure: false,
          threatLevel: 'medium',
          threats: [
            {
              type: 'no_link_data',
              severity: 'medium',
              description: 'No link data provided',
              recommendation: 'Provide URL or link node',
            },
          ],
          blockedReasons: ['No link data'],
          warnings: [],
        }
      }

      return { ...assessment, index }
    }),
  )

  return assessments
}

/**
 * Create a security-aware link validator
 */
export const createSecureLinkValidator = (
  config: LinkSecurityConfig = DEFAULT_LINK_SECURITY_CONFIG,
) => {
  return async (
    linkNode: SerializedLinkNode,
  ): Promise<{
    isValid: boolean
    isSecure: boolean
    errors: string[]
    warnings: string[]
  }> => {
    const assessment = await assessLinkSecurity(linkNode, config)

    return {
      isValid: assessment.isSecure,
      isSecure: assessment.isSecure,
      errors: assessment.blockedReasons,
      warnings: assessment.warnings,
    }
  }
}

/**
 * Security middleware for link processing
 */
export const createLinkSecurityMiddleware = (
  config: LinkSecurityConfig = DEFAULT_LINK_SECURITY_CONFIG,
) => {
  return async (linkNode: SerializedLinkNode): Promise<SerializedLinkNode | null> => {
    const assessment = await assessLinkSecurity(linkNode, config)

    if (!assessment.isSecure && config.blockOnThreat) {
      if (config.logSecurityEvents) {
        console.warn('Link blocked by security middleware:', {
          url: linkNode.fields.url,
          threats: assessment.threats.map((t) => t.type),
          threatLevel: assessment.threatLevel,
        })
      }
      return null // Block the link
    }

    // Return the original link node if secure
    return linkNode
  }
}

/**
 * Get security recommendations for a URL
 */
export const getSecurityRecommendations = (assessment: LinkSecurityAssessment): string[] => {
  const recommendations: string[] = []

  if (assessment.threatLevel === 'none') {
    recommendations.push('Link appears to be secure')
    return recommendations
  }

  // General recommendations based on threat level
  switch (assessment.threatLevel) {
    case 'critical':
      recommendations.push('DO NOT click this link - it poses a critical security risk')
      recommendations.push('Report this link to security team')
      break
    case 'high':
      recommendations.push('Exercise extreme caution with this link')
      recommendations.push('Verify the source before clicking')
      break
    case 'medium':
      recommendations.push('Be cautious with this link')
      recommendations.push('Verify the destination is legitimate')
      break
    case 'low':
      recommendations.push('Minor security concerns detected')
      recommendations.push('Consider verifying the link destination')
      break
  }

  // Specific recommendations from threats
  assessment.threats.forEach((threat) => {
    if (!recommendations.includes(threat.recommendation)) {
      recommendations.push(threat.recommendation)
    }
  })

  return recommendations
}

/**
 * Generate security report for multiple links
 */
export const generateSecurityReport = (
  assessments: LinkSecurityAssessment[],
): {
  summary: {
    total: number
    secure: number
    insecure: number
    critical: number
    high: number
    medium: number
    low: number
  }
  recommendations: string[]
  mostCommonThreats: Array<{ type: string; count: number }>
} => {
  const summary = {
    total: assessments.length,
    secure: assessments.filter((a) => a.isSecure).length,
    insecure: assessments.filter((a) => !a.isSecure).length,
    critical: assessments.filter((a) => a.threatLevel === 'critical').length,
    high: assessments.filter((a) => a.threatLevel === 'high').length,
    medium: assessments.filter((a) => a.threatLevel === 'medium').length,
    low: assessments.filter((a) => a.threatLevel === 'low').length,
  }

  const threatCounts = new Map<string, number>()
  const allRecommendations = new Set<string>()

  assessments.forEach((assessment) => {
    assessment.threats.forEach((threat) => {
      threatCounts.set(threat.type, (threatCounts.get(threat.type) || 0) + 1)
      allRecommendations.add(threat.recommendation)
    })
  })

  const mostCommonThreats = Array.from(threatCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    summary,
    recommendations: Array.from(allRecommendations),
    mostCommonThreats,
  }
}
