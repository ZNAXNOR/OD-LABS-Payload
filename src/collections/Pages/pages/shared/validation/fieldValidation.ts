import type { Validate } from 'payload'

/**
 * Complex field validation utilities
 *
 * This module provides validation functions for complex field types and
 * cross-field validation scenarios in the consolidated Pages collection.
 */

/**
 * Validate pricing configuration for service pages
 */
export const validatePricingConfiguration: Validate = (value, { data }) => {
  // Only validate if this is a service page
  if (data?.pageType !== 'service') {
    return true
  }

  if (!value || typeof value !== 'object') {
    return true // Pricing is optional
  }

  const pricing = value as {
    amount?: number
    currency?: string
    period?: string
  }

  // If any pricing field is provided, validate the configuration
  const hasAnyPricingField = pricing.amount !== undefined || pricing.currency || pricing.period

  if (hasAnyPricingField) {
    // Amount validation
    if (pricing.amount !== undefined) {
      if (typeof pricing.amount !== 'number') {
        return 'Pricing amount must be a number'
      }

      if (pricing.amount < 0) {
        return 'Pricing amount cannot be negative'
      }

      if (pricing.amount > 1000000) {
        return 'Pricing amount cannot exceed 1,000,000'
      }
    }

    // Currency validation - check this before requiring period
    if (pricing.currency) {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'INR']
      if (!validCurrencies.includes(pricing.currency)) {
        return `Invalid currency. Must be one of: ${validCurrencies.join(', ')}`
      }
    }

    // Period validation
    if (pricing.period) {
      const validPeriods = ['fixed', 'hourly', 'monthly', 'custom']
      if (!validPeriods.includes(pricing.period)) {
        return `Invalid pricing period. Must be one of: ${validPeriods.join(', ')}`
      }
    }

    // If amount is provided, currency and period are required
    if (pricing.amount !== undefined) {
      if (!pricing.currency) {
        return 'Currency is required when pricing amount is specified'
      }

      if (!pricing.period) {
        return 'Pricing period is required when pricing amount is specified'
      }
    }
  }

  return true
}

/**
 * Validate notification settings for legal pages
 */
export const validateNotificationSettings: Validate = (value, { data }) => {
  // Only validate if this is a legal page
  if (data?.pageType !== 'legal') {
    return true
  }

  // Check if notifications are enabled
  const notifyOnChange = data?.legalConfig?.notifyOnChange

  if (!notifyOnChange) {
    return true // No validation needed if notifications are disabled
  }

  // If notifications are enabled, recipients are required
  if (!value || !Array.isArray(value) || value.length === 0) {
    return 'At least one recipient email is required when notifications are enabled'
  }

  const recipients = value as Array<{ email: string }>

  // Validate recipient emails
  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]

    if (!recipient?.email || typeof recipient.email !== 'string') {
      return `Recipient ${i + 1} must have a valid email address`
    }

    // Email format validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegex.test(recipient.email)) {
      return `Invalid email format for recipient ${i + 1}: ${recipient.email}`
    }

    // Check for duplicate emails
    const duplicateIndex = recipients.findIndex(
      (r, idx) => idx !== i && r.email?.toLowerCase() === recipient.email.toLowerCase(),
    )

    if (duplicateIndex !== -1) {
      return `Duplicate email address found: ${recipient.email}`
    }
  }

  // Limit number of recipients
  if (recipients.length > 20) {
    return 'Maximum of 20 notification recipients allowed'
  }

  return true
}

/**
 * Validate form relations for contact pages
 */
export const validateFormRelations: Validate = (value, { data }) => {
  // Only validate if this is a contact page
  if (data?.pageType !== 'contact') {
    return true
  }

  if (!value || !Array.isArray(value)) {
    return true // Form relations are optional
  }

  const formRelations = value as Array<{ form: string }>

  // Check each form relation
  for (let i = 0; i < formRelations.length; i++) {
    const relation = formRelations[i]

    if (!relation?.form || typeof relation.form !== 'string') {
      return `Form relation ${i + 1} must reference a valid form`
    }

    // Check for duplicate form references
    const duplicateIndex = formRelations.findIndex(
      (r, idx) => idx !== i && r.form === relation.form,
    )

    if (duplicateIndex !== -1) {
      return `Duplicate form reference found at position ${i + 1}`
    }
  }

  // Limit number of form relations
  if (formRelations.length > 5) {
    return 'Maximum of 5 form relations allowed per contact page'
  }

  return true
}

/**
 * Validate date fields with business logic
 */
export const validateDateField = (
  fieldName: string,
  options: {
    allowFuture?: boolean
    allowPast?: boolean
    minDate?: Date
    maxDate?: Date
    required?: boolean
  } = {},
): Validate => {
  const { allowFuture = true, allowPast = true, minDate, maxDate, required = false } = options

  return (value, _context) => {
    if (!value) {
      return required ? `${fieldName} is required` : true
    }

    if (typeof value !== 'string') {
      return `${fieldName} must be a valid date`
    }

    const date = new Date(value)

    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`
    }

    const now = new Date()

    // Check future/past restrictions
    if (!allowFuture && date > now) {
      return `${fieldName} cannot be in the future`
    }

    if (!allowPast && date < now) {
      return `${fieldName} cannot be in the past`
    }

    // Check min/max date restrictions
    if (minDate && date < minDate) {
      return `${fieldName} cannot be earlier than ${minDate.toLocaleDateString()}`
    }

    if (maxDate && date > maxDate) {
      return `${fieldName} cannot be later than ${maxDate.toLocaleDateString()}`
    }

    return true
  }
}

/**
 * Validate text field length with smart truncation suggestions
 */
export const validateTextLength = (
  fieldName: string,
  options: {
    minLength?: number
    maxLength?: number
    required?: boolean
    allowEmpty?: boolean
  } = {},
): Validate => {
  const { minLength = 0, maxLength = Infinity, required = false, allowEmpty = true } = options

  return (value) => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      if (required) {
        return `${fieldName} is required`
      }
      if (!allowEmpty && value === '') {
        return `${fieldName} cannot be empty`
      }
      return true
    }

    if (typeof value !== 'string') {
      return `${fieldName} must be text`
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`
    }

    if (trimmedValue.length > maxLength) {
      const truncated = trimmedValue.substring(0, maxLength)
      return `${fieldName} must be ${maxLength} characters or less. Consider: "${truncated}..."`
    }

    return true
  }
}

/**
 * Validate array fields with custom item validation
 */
export const validateArrayField = <T>(
  fieldName: string,
  options: {
    minItems?: number
    maxItems?: number
    required?: boolean
    itemValidator?: (item: T, index: number) => string | true
    uniqueBy?: keyof T
  } = {},
): Validate => {
  const { minItems = 0, maxItems = Infinity, required = false, itemValidator, uniqueBy } = options

  return (value) => {
    if (!value || !Array.isArray(value)) {
      return required ? `${fieldName} is required` : true
    }

    const items = value as T[]

    if (items.length < minItems) {
      return `${fieldName} must have at least ${minItems} item${minItems === 1 ? '' : 's'}`
    }

    if (items.length > maxItems) {
      return `${fieldName} can have at most ${maxItems} item${maxItems === 1 ? '' : 's'}`
    }

    // Validate each item
    if (itemValidator) {
      for (let i = 0; i < items.length; i++) {
        const result = itemValidator(items[i]!, i)
        if (result !== true) {
          return `${fieldName} item ${i + 1}: ${result}`
        }
      }
    }

    // Check for uniqueness
    if (uniqueBy) {
      const seen = new Set()
      for (let i = 0; i < items.length; i++) {
        const item = items[i]!
        const key = item[uniqueBy]

        if (seen.has(key)) {
          return `${fieldName} contains duplicate values for ${String(uniqueBy)}: ${String(key)}`
        }

        seen.add(key)
      }
    }

    return true
  }
}

/**
 * Validate URL fields
 */
export const validateUrl: Validate = (value) => {
  if (!value || typeof value !== 'string') {
    return true
  }

  const url = value.trim()

  if (url.length === 0) {
    return true
  }

  // Basic URL validation
  try {
    new URL(url)
  } catch {
    return 'Invalid URL format'
  }

  // Check for allowed protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']
  const urlObj = new URL(url)

  if (!allowedProtocols.includes(urlObj.protocol)) {
    return `URL protocol must be one of: ${allowedProtocols.join(', ')}`
  }

  return true
}

/**
 * Validate slug uniqueness across page types
 */
export const validateSlugUniqueness: Validate = async (value, { req, operation, data }) => {
  if (!value || typeof value !== 'string') {
    return true
  }

  const slug = value.trim()

  if (slug.length === 0) {
    return true
  }

  try {
    const query: any = { slug: { equals: slug } }

    // Exclude current document if updating
    if (operation === 'update' && data?.id) {
      query.id = { not_equals: data.id }
    }

    const result = await req.payload.count({
      collection: 'pages',
      where: query,
      req, // Maintain transaction context
    })

    if (result.totalDocs > 0) {
      return `Slug "${slug}" is already in use by another page`
    }

    return true
  } catch (error) {
    req.payload.logger.error(`Error checking slug uniqueness: ${error}`)
    return 'Unable to verify slug uniqueness'
  }
}

/**
 * Validate that required blocks are present for specific page types
 */
export const validateRequiredBlocks = (requiredBlocks: string[]): Validate => {
  return (value, { data }) => {
    if (!data?.pageType || !value || !Array.isArray(value)) {
      return true
    }

    const blocks = value as Array<{ blockType: string }>
    const presentBlockTypes = blocks.map((block) => block.blockType)

    for (const requiredBlock of requiredBlocks) {
      if (!presentBlockTypes.includes(requiredBlock)) {
        return `${data.pageType} pages must include a ${requiredBlock} block`
      }
    }

    return true
  }
}

/**
 * Cross-field validation for related fields
 */
export const validateRelatedFields = (
  fieldRelations: Array<{
    field: string
    dependsOn: string
    condition: (dependentValue: any, fieldValue: any) => boolean
    message: string
  }>,
): Validate => {
  return ({ data, siblingData }) => {
    const allData = { ...siblingData, ...data }

    for (const relation of fieldRelations) {
      const dependentValue = allData[relation.dependsOn]
      const fieldValue = allData[relation.field]

      if (!relation.condition(dependentValue, fieldValue)) {
        return relation.message
      }
    }

    return true
  }
}
