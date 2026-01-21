// Field validation utilities for consistent validation across collections
import type { Validate } from 'payload'

/**
 * URL validation function
 */
export const validateURL: Validate<string> = (value) => {
  if (!value) return true // Let required handle empty values

  try {
    new URL(value)
    return true
  } catch {
    // Check if it's a relative URL
    if (value.startsWith('/') || value.startsWith('#')) {
      return true
    }
    return 'Please enter a valid URL (e.g., https://example.com or /page)'
  }
}

/**
 * Email validation function (enhanced)
 */
export const validateEmail: Validate<string> = (value) => {
  if (!value) return true // Let required handle empty values

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address'
  }

  // Additional checks
  if (value.length > 254) {
    return 'Email address is too long'
  }

  return true
}

/**
 * Phone number validation function
 */
export const validatePhone: Validate<string> = (value) => {
  if (!value) return true // Let required handle empty values

  // Remove common formatting characters
  const cleaned = value.replace(/[\s\-\(\)\.]/g, '')

  // Check for valid phone number pattern
  if (!/^[\+]?[1-9][\d]{7,14}$/.test(cleaned)) {
    return 'Please enter a valid phone number'
  }

  return true
}

/**
 * Slug format validation function
 */
export const validateSlugFormat: Validate<string> = (value) => {
  if (!value) return true // Let required handle empty values

  // Check slug format: lowercase letters, numbers, and hyphens only
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'Slug must contain only lowercase letters, numbers, and hyphens'
  }

  // Check for reserved slugs
  const reservedSlugs = ['admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'index', 'home']
  if (reservedSlugs.includes(value)) {
    return `"${value}" is a reserved slug and cannot be used`
  }

  return true
}

/**
 * Password strength validation function
 */
export const validatePasswordStrength: Validate<string> = (value) => {
  if (!value) return true // Let required handle empty values

  if (value.length < 8) {
    return 'Password must be at least 8 characters long'
  }

  if (!/(?=.*[a-z])/.test(value)) {
    return 'Password must contain at least one lowercase letter'
  }

  if (!/(?=.*[A-Z])/.test(value)) {
    return 'Password must contain at least one uppercase letter'
  }

  if (!/(?=.*\d)/.test(value)) {
    return 'Password must contain at least one number'
  }

  if (!/(?=.*[@$!%*?&])/.test(value)) {
    return 'Password must contain at least one special character (@$!%*?&)'
  }

  return true
}

/**
 * Color hex validation function
 */
export const validateHexColor: Validate<string> = (value) => {
  if (!value) return true // Let required handle empty values

  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
    return 'Please enter a valid hex color (e.g., #FF0000 or #F00)'
  }

  return true
}

/**
 * Positive number validation function
 */
export const validatePositiveNumber: Validate<number> = (value) => {
  if (value === null || value === undefined) return true // Let required handle empty values

  if (typeof value !== 'number' || isNaN(value)) {
    return 'Please enter a valid number'
  }

  if (value < 0) {
    return 'Number must be positive'
  }

  return true
}

/**
 * Date range validation function factory
 */
export const createDateRangeValidator = (
  options: {
    minDate?: Date
    maxDate?: Date
    allowPast?: boolean
    allowFuture?: boolean
  } = {},
): Validate<string> => {
  const { minDate, maxDate, allowPast = true, allowFuture = true } = options

  return (value) => {
    if (!value) return true // Let required handle empty values

    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date'
    }

    const now = new Date()

    if (!allowPast && date < now) {
      return 'Date cannot be in the past'
    }

    if (!allowFuture && date > now) {
      return 'Date cannot be in the future'
    }

    if (minDate && date < minDate) {
      return `Date must be after ${minDate.toLocaleDateString()}`
    }

    if (maxDate && date > maxDate) {
      return `Date must be before ${maxDate.toLocaleDateString()}`
    }

    return true
  }
}

/**
 * Text length validation function factory
 */
export const createLengthValidator = (
  options: {
    min?: number
    max?: number
    trim?: boolean
  } = {},
): Validate<string> => {
  const { min, max, trim = true } = options

  return (value) => {
    if (!value) return true // Let required handle empty values

    const text = trim ? value.trim() : value
    const length = text.length

    if (min !== undefined && length < min) {
      return `Text must be at least ${min} characters long`
    }

    if (max !== undefined && length > max) {
      return `Text must be no more than ${max} characters long`
    }

    return true
  }
}

/**
 * Array length validation function factory
 */
export const createArrayLengthValidator = (
  options: {
    min?: number
    max?: number
  } = {},
): Validate<any[]> => {
  const { min, max } = options

  return (value) => {
    if (!value) return true // Let required handle empty values

    if (!Array.isArray(value)) {
      return 'Value must be an array'
    }

    const length = value.length

    if (min !== undefined && length < min) {
      return `Must have at least ${min} items`
    }

    if (max !== undefined && length > max) {
      return `Must have no more than ${max} items`
    }

    return true
  }
}

/**
 * Conditional validation function factory
 */
export const createConditionalValidator = (
  condition: (data: any, siblingData: any) => boolean,
  validator: Validate<any>,
): Validate<any> => {
  return (value, { data, siblingData }) => {
    if (condition(data, siblingData)) {
      return validator(value, { data, siblingData } as any)
    }
    return true
  }
}

// Export all validation functions
export const fieldValidators = {
  validateURL,
  validateEmail,
  validatePhone,
  validateSlugFormat,
  validatePasswordStrength,
  validateHexColor,
  validatePositiveNumber,
  createDateRangeValidator,
  createLengthValidator,
  createArrayLengthValidator,
  createConditionalValidator,
}
