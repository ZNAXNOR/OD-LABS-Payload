import type { Validate } from 'payload'

/**
 * Page type-specific validation rules
 *
 * This module provides validation functions that ensure fields are properly
 * configured based on the selected pageType. It implements cross-field validation
 * logic to maintain data integrity across the consolidated Pages collection.
 */

/**
 * Validate that required fields for blog pages are present
 */
export const validateBlogRequiredFields: Validate = ({ data, siblingData }) => {
  // Only validate if this is a blog page
  if (data?.pageType !== 'blog') {
    return true
  }

  // Check if blogConfig exists and has required fields
  const blogConfig = data?.blogConfig || siblingData?.blogConfig

  if (!blogConfig) {
    return 'Blog configuration is required for blog pages'
  }

  // Validate author field
  if (!blogConfig.author) {
    return 'Author is required for blog pages'
  }

  // Validate excerpt field
  if (
    !blogConfig.excerpt ||
    typeof blogConfig.excerpt !== 'string' ||
    blogConfig.excerpt.trim().length === 0
  ) {
    return 'Excerpt is required for blog pages and cannot be empty'
  }

  // Validate excerpt length
  if (blogConfig.excerpt.length > 300) {
    return 'Blog excerpt must be 300 characters or less'
  }

  return true
}

/**
 * Validate that required fields for service pages are present
 */
export const validateServiceRequiredFields: Validate = ({ data, siblingData }) => {
  // Only validate if this is a service page
  if (data?.pageType !== 'service') {
    return true
  }

  // Check if serviceConfig exists and has required fields
  const serviceConfig = data?.serviceConfig || siblingData?.serviceConfig

  if (!serviceConfig) {
    return 'Service configuration is required for service pages'
  }

  // Validate serviceType field
  if (!serviceConfig.serviceType) {
    return 'Service type is required for service pages'
  }

  // Validate pricing configuration if provided
  if (serviceConfig.pricing) {
    const { amount, currency, period } = serviceConfig.pricing

    // If amount is provided, currency and period are required
    if (amount !== undefined && amount !== null) {
      if (typeof amount !== 'number' || amount < 0) {
        return 'Service pricing amount must be a non-negative number'
      }

      if (!currency) {
        return 'Currency is required when pricing amount is specified'
      }

      if (!period) {
        return 'Pricing period is required when pricing amount is specified'
      }
    }
  }

  return true
}

/**
 * Validate that required fields for legal pages are present
 */
export const validateLegalRequiredFields: Validate = ({ data, siblingData }) => {
  // Only validate if this is a legal page
  if (data?.pageType !== 'legal') {
    return true
  }

  // Check if legalConfig exists and has required fields
  const legalConfig = data?.legalConfig || siblingData?.legalConfig

  if (!legalConfig) {
    return 'Legal configuration is required for legal pages'
  }

  // Validate documentType field
  if (!legalConfig.documentType) {
    return 'Document type is required for legal pages'
  }

  // Validate effective date if provided
  if (legalConfig.effectiveDate) {
    const effectiveDate = new Date(legalConfig.effectiveDate)
    if (isNaN(effectiveDate.getTime())) {
      return 'Effective date must be a valid date'
    }
  }

  // Validate notification settings if provided
  if (
    legalConfig.notificationSettings?.notifyOnChange &&
    legalConfig.notificationSettings?.recipients
  ) {
    const recipients = legalConfig.notificationSettings.recipients

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return 'At least one recipient email is required when notifications are enabled'
    }

    // Validate each recipient email
    for (const recipient of recipients) {
      if (!recipient.email || typeof recipient.email !== 'string') {
        return 'All recipient emails must be valid email addresses'
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(recipient.email)) {
        return `Invalid email address: ${recipient.email}`
      }
    }
  }

  return true
}

/**
 * Validate that required fields for contact pages are present
 */
export const validateContactRequiredFields: Validate = ({ data, siblingData }) => {
  // Only validate if this is a contact page
  if (data?.pageType !== 'contact') {
    return true
  }

  // Check if contactConfig exists and has required fields
  const contactConfig = data?.contactConfig || siblingData?.contactConfig

  if (!contactConfig) {
    return 'Contact configuration is required for contact pages'
  }

  // Validate purpose field
  if (!contactConfig.purpose) {
    return 'Purpose is required for contact pages'
  }

  return true
}

/**
 * Validate that layout blocks are appropriate for the page type
 */
export const validatePageTypeBlocks: Validate = (value, { data }) => {
  if (!data?.pageType || !value || !Array.isArray(value)) {
    return true
  }

  const blocks = value as Array<{ blockType: string }>

  // Define block restrictions per page type
  const blockRestrictions: Record<string, { forbidden?: string[]; required?: string[] }> = {
    legal: {
      // Legal pages should not have marketing-focused blocks
      forbidden: ['CallToAction', 'Newsletter', 'Testimonial', 'PricingTable'],
    },
    contact: {
      // Contact pages should have at least some form of contact information
      // This is more of a recommendation than a hard requirement
    },
    blog: {
      // Blog pages should focus on content
      forbidden: ['PricingTable', 'ServicesGrid'],
    },
    service: {
      // Service pages can have most blocks
    },
    page: {
      // Regular pages have no restrictions
    },
  }

  const restrictions = blockRestrictions[data.pageType]
  if (!restrictions) {
    return true
  }

  // Check for forbidden blocks
  if (restrictions.forbidden) {
    for (const block of blocks) {
      if (restrictions.forbidden.includes(block.blockType)) {
        return `Block type "${block.blockType}" is not recommended for ${data.pageType} pages`
      }
    }
  }

  // Check for required blocks (if any)
  if (restrictions.required) {
    const presentBlockTypes = blocks.map((block) => block.blockType)
    for (const requiredBlock of restrictions.required) {
      if (!presentBlockTypes.includes(requiredBlock)) {
        return `Block type "${requiredBlock}" is required for ${data.pageType} pages`
      }
    }
  }

  return true
}

/**
 * Validate that the page has appropriate content for its type
 */
export const validatePageContentCompleteness: Validate = ({ data }) => {
  if (!data?.pageType) {
    return true
  }

  // Check if the page has any content blocks
  const hasBlocks = data.layout && Array.isArray(data.layout) && data.layout.length > 0

  // Different page types have different content requirements
  switch (data.pageType) {
    case 'blog':
      if (!hasBlocks) {
        return 'Blog pages should have at least one content block'
      }
      break

    case 'service':
      if (!hasBlocks) {
        return 'Service pages should have at least one content block to describe the service'
      }
      break

    case 'legal':
      if (!hasBlocks) {
        return 'Legal pages should have at least one content block with the legal text'
      }
      break

    case 'contact':
      if (!hasBlocks) {
        return 'Contact pages should have at least one content block with contact information'
      }
      break

    default:
      // Regular pages don't have strict content requirements
      break
  }

  return true
}

/**
 * Cross-field validation for publish date and status
 */
export const validatePublishDateConsistency: Validate = ({ data, siblingData, operation }) => {
  // Only validate for blog pages
  if (data?.pageType !== 'blog') {
    return true
  }

  const status = data?._status || siblingData?._status
  const blogConfig = data?.blogConfig || siblingData?.blogConfig
  const publishedDate = blogConfig?.publishedDate

  // If the page is being published and it's a blog post, ensure publishedDate is set
  if (status === 'published' && !publishedDate && operation === 'update') {
    return 'Published date is required when publishing a blog post'
  }

  // If publishedDate is set, it should not be in the future
  if (publishedDate) {
    const pubDate = new Date(publishedDate)
    const now = new Date()

    if (pubDate > now) {
      return 'Published date cannot be in the future'
    }
  }

  return true
}

/**
 * Validate that hierarchical structure makes sense for the page type
 */
export const validatePageTypeHierarchy: Validate = (value, { data }) => {
  if (!data?.pageType || !value) {
    return true
  }

  // Some page types should not have parents (they should be top-level)
  const topLevelPageTypes = ['contact']

  if (topLevelPageTypes.includes(data.pageType) && value) {
    return `${data.pageType} pages should typically be top-level pages without a parent`
  }

  return true
}

/**
 * Validate email addresses in various fields
 */
export const validateEmailFormat = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false
  }

  // More comprehensive email validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  return emailRegex.test(email)
}

/**
 * Validate that tags are properly formatted
 */
export const validateBlogTags: Validate = (value, { data }) => {
  // Only validate for blog pages
  if (data?.pageType !== 'blog') {
    return true
  }

  if (!value || !Array.isArray(value)) {
    return true
  }

  const tags = value as Array<{ tag: string }>

  // Check each tag
  for (let i = 0; i < tags.length; i++) {
    const tagItem = tags[i]!

    if (!tagItem.tag || typeof tagItem.tag !== 'string') {
      return `Tag ${i + 1} must be a non-empty string`
    }

    const tag = tagItem.tag.trim()

    if (tag.length === 0) {
      return `Tag ${i + 1} cannot be empty`
    }

    if (tag.length > 50) {
      return `Tag ${i + 1} must be 50 characters or less`
    }

    // Check for duplicate tags
    const duplicateIndex = tags.findIndex(
      (t, idx) => idx !== i && t.tag?.trim().toLowerCase() === tag.toLowerCase(),
    )
    if (duplicateIndex !== -1) {
      return `Duplicate tag found: "${tag}"`
    }
  }

  // Limit total number of tags
  if (tags.length > 10) {
    return 'Blog posts can have a maximum of 10 tags'
  }

  return true
}

/**
 * Factory function to create page type-specific validation
 */
export function createPageTypeValidator(pageType: string): Validate {
  return (value, args) => {
    switch (pageType) {
      case 'blog':
        return validateBlogRequiredFields(value, args)
      case 'service':
        return validateServiceRequiredFields(value, args)
      case 'legal':
        return validateLegalRequiredFields(value, args)
      case 'contact':
        return validateContactRequiredFields(value, args)
      default:
        return true
    }
  }
}
