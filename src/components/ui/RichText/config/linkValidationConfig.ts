import type { LinkValidationRules } from '../utils/linkValidation'

// Predefined validation rule sets for different use cases
export const linkValidationPresets = {
  // Strict security rules for enterprise environments
  enterprise: {
    requireHttps: true,
    maxUrlLength: 1024,
    validateInternalLinks: true,
    allowedProtocols: ['https:', 'mailto:'],
    checkMaliciousPatterns: true,
    allowedDomains: [
      // Common business domains
      'microsoft.com',
      'google.com',
      'github.com',
      'linkedin.com',
      'office.com',
      'sharepoint.com',
      'teams.microsoft.com',
    ],
    blockedDomains: [
      // Common spam/malicious domains
      'bit.ly',
      'tinyurl.com',
      'goo.gl',
      't.co',
    ],
  } as LinkValidationRules,

  // Moderate rules for general business use
  business: {
    requireHttps: false,
    maxUrlLength: 2048,
    validateInternalLinks: true,
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:'],
    checkMaliciousPatterns: true,
    blockedDomains: [
      // Known malicious domains
      'malware.com',
      'phishing.com',
      'spam.com',
    ],
  } as LinkValidationRules,

  // Permissive rules for content creation
  content: {
    requireHttps: false,
    maxUrlLength: 4096,
    validateInternalLinks: true,
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'],
    checkMaliciousPatterns: true,
  } as LinkValidationRules,

  // Educational/academic environment rules
  academic: {
    requireHttps: false,
    maxUrlLength: 2048,
    validateInternalLinks: true,
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'],
    checkMaliciousPatterns: true,
    allowedDomains: [
      // Academic domains
      'edu',
      'ac.uk',
      'edu.au',
      'scholar.google.com',
      'jstor.org',
      'pubmed.ncbi.nlm.nih.gov',
      'arxiv.org',
      'researchgate.net',
    ],
  } as LinkValidationRules,

  // News/media environment rules
  media: {
    requireHttps: false,
    maxUrlLength: 3072,
    validateInternalLinks: true,
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:'],
    checkMaliciousPatterns: true,
    allowedDomains: [
      // Major news sources
      'reuters.com',
      'ap.org',
      'bbc.com',
      'cnn.com',
      'nytimes.com',
      'washingtonpost.com',
      'theguardian.com',
      'wsj.com',
      'npr.org',
    ],
  } as LinkValidationRules,

  // Development/technical environment rules
  development: {
    requireHttps: false,
    maxUrlLength: 2048,
    validateInternalLinks: true,
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'ftp:', 'ssh:'],
    checkMaliciousPatterns: true,
    allowedDomains: [
      // Development domains
      'github.com',
      'gitlab.com',
      'bitbucket.org',
      'stackoverflow.com',
      'developer.mozilla.org',
      'w3.org',
      'npmjs.com',
      'pypi.org',
      'packagist.org',
      'docker.com',
      'kubernetes.io',
    ],
  } as LinkValidationRules,

  // No restrictions (for testing or very permissive environments)
  permissive: {
    requireHttps: false,
    maxUrlLength: 8192,
    validateInternalLinks: false,
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'ftp:', 'ssh:', 'file:'],
    checkMaliciousPatterns: false,
  } as LinkValidationRules,
} as const

// Helper function to get validation rules by preset name
export const getLinkValidationRules = (
  preset: keyof typeof linkValidationPresets,
  overrides?: Partial<LinkValidationRules>,
): LinkValidationRules => {
  const baseRules = linkValidationPresets[preset]
  return overrides ? { ...baseRules, ...overrides } : baseRules
}

// Helper function to create custom validation rules
export const createCustomLinkValidationRules = (
  basePreset: keyof typeof linkValidationPresets,
  customizations: {
    additionalAllowedDomains?: string[]
    additionalBlockedDomains?: string[]
    additionalAllowedProtocols?: string[]
    overrides?: Partial<LinkValidationRules>
  },
): LinkValidationRules => {
  const baseRules = linkValidationPresets[basePreset]

  return {
    ...baseRules,
    allowedDomains: [
      ...(baseRules.allowedDomains || []),
      ...(customizations.additionalAllowedDomains || []),
    ],
    blockedDomains: [
      ...(baseRules.blockedDomains || []),
      ...(customizations.additionalBlockedDomains || []),
    ],
    allowedProtocols: [
      ...(baseRules.allowedProtocols || []),
      ...(customizations.additionalAllowedProtocols || []),
    ],
    ...customizations.overrides,
  }
}

// Environment-specific rule generators
export const createEnvironmentRules = (environment: 'production' | 'staging' | 'development') => {
  switch (environment) {
    case 'production':
      return getLinkValidationRules('business', {
        requireHttps: true,
        checkMaliciousPatterns: true,
      })

    case 'staging':
      return getLinkValidationRules('content', {
        checkMaliciousPatterns: true,
      })

    case 'development':
      return getLinkValidationRules('permissive')

    default:
      return getLinkValidationRules('content')
  }
}

// Domain category helpers
export const domainCategories = {
  social: [
    'facebook.com',
    'twitter.com',
    'x.com',
    'instagram.com',
    'linkedin.com',
    'youtube.com',
    'tiktok.com',
    'snapchat.com',
    'pinterest.com',
    'reddit.com',
  ],

  tech: [
    'github.com',
    'gitlab.com',
    'stackoverflow.com',
    'developer.mozilla.org',
    'w3.org',
    'google.com',
    'microsoft.com',
    'apple.com',
    'amazon.com',
  ],

  news: [
    'reuters.com',
    'ap.org',
    'bbc.com',
    'cnn.com',
    'nytimes.com',
    'washingtonpost.com',
    'theguardian.com',
    'wsj.com',
    'npr.org',
  ],

  academic: [
    'scholar.google.com',
    'jstor.org',
    'pubmed.ncbi.nlm.nih.gov',
    'arxiv.org',
    'researchgate.net',
    'ieee.org',
    'acm.org',
  ],

  government: ['gov', 'gov.uk', 'gov.au', 'gov.ca', 'europa.eu', 'un.org', 'who.int'],
} as const

// Helper to create rules allowing specific domain categories
export const createCategoryBasedRules = (
  basePreset: keyof typeof linkValidationPresets,
  allowedCategories: (keyof typeof domainCategories)[],
): LinkValidationRules => {
  const baseRules = linkValidationPresets[basePreset]
  const allowedDomains = allowedCategories.flatMap((category) => domainCategories[category])

  return {
    ...baseRules,
    allowedDomains: [...(baseRules.allowedDomains || []), ...allowedDomains],
  }
}
