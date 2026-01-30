/**
 * Tests for the validation system
 */

import { describe, expect, it } from 'vitest'
import {
  validateArrayField,
  validateDateField,
  validateNotificationSettings,
  validatePricingConfiguration,
  validateTextLength,
} from '../../../src/pages/shared/validation/fieldValidation'
import {
  validateBlogRequiredFields,
  validateBlogTags,
  validateContactRequiredFields,
  validateLegalRequiredFields,
  validateServiceRequiredFields,
} from '../../../src/pages/shared/validation/pageTypeValidation'

describe('Page Type Validation', () => {
  describe('validateBlogRequiredFields', () => {
    it('should pass for non-blog pages', () => {
      const result = validateBlogRequiredFields(null, {
        data: { pageType: 'page' },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })

    it('should require blogConfig for blog pages', () => {
      const result = validateBlogRequiredFields(null, {
        data: { pageType: 'blog' },
        siblingData: {},
      } as any)
      expect(result).toBe('Blog configuration is required for blog pages')
    })

    it('should require author for blog pages', () => {
      const result = validateBlogRequiredFields(null, {
        data: { pageType: 'blog', blogConfig: {} },
        siblingData: {},
      } as any)
      expect(result).toBe('Author is required for blog pages')
    })

    it('should require excerpt for blog pages', () => {
      const result = validateBlogRequiredFields(null, {
        data: { pageType: 'blog', blogConfig: { author: 'user123' } },
        siblingData: {},
      } as any)
      expect(result).toBe('Excerpt is required for blog pages and cannot be empty')
    })

    it('should validate excerpt length', () => {
      const longExcerpt = 'a'.repeat(301)
      const result = validateBlogRequiredFields(null, {
        data: {
          pageType: 'blog',
          blogConfig: {
            author: 'user123',
            excerpt: longExcerpt,
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe('Blog excerpt must be 300 characters or less')
    })

    it('should pass with valid blog configuration', () => {
      const result = validateBlogRequiredFields(null, {
        data: {
          pageType: 'blog',
          blogConfig: {
            author: 'user123',
            excerpt: 'Valid excerpt',
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('validateServiceRequiredFields', () => {
    it('should pass for non-service pages', () => {
      const result = validateServiceRequiredFields(null, {
        data: { pageType: 'page' },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })

    it('should require serviceConfig for service pages', () => {
      const result = validateServiceRequiredFields(null, {
        data: { pageType: 'service' },
        siblingData: {},
      } as any)
      expect(result).toBe('Service configuration is required for service pages')
    })

    it('should require serviceType for service pages', () => {
      const result = validateServiceRequiredFields(null, {
        data: { pageType: 'service', serviceConfig: {} },
        siblingData: {},
      } as any)
      expect(result).toBe('Service type is required for service pages')
    })

    it('should validate pricing configuration', () => {
      const result = validateServiceRequiredFields(null, {
        data: {
          pageType: 'service',
          serviceConfig: {
            serviceType: 'web-dev',
            pricing: { amount: -100 },
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe('Service pricing amount must be a non-negative number')
    })

    it('should pass with valid service configuration', () => {
      const result = validateServiceRequiredFields(null, {
        data: {
          pageType: 'service',
          serviceConfig: {
            serviceType: 'web-dev',
            pricing: {
              amount: 100,
              currency: 'USD',
              period: 'hourly',
            },
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('validateLegalRequiredFields', () => {
    it('should pass for non-legal pages', () => {
      const result = validateLegalRequiredFields(null, {
        data: { pageType: 'page' },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })

    it('should require legalConfig for legal pages', () => {
      const result = validateLegalRequiredFields(null, {
        data: { pageType: 'legal' },
        siblingData: {},
      } as any)
      expect(result).toBe('Legal configuration is required for legal pages')
    })

    it('should require documentType for legal pages', () => {
      const result = validateLegalRequiredFields(null, {
        data: { pageType: 'legal', legalConfig: {} },
        siblingData: {},
      } as any)
      expect(result).toBe('Document type is required for legal pages')
    })

    it('should validate notification settings', () => {
      const result = validateLegalRequiredFields(null, {
        data: {
          pageType: 'legal',
          legalConfig: {
            documentType: 'privacy',
            notificationSettings: {
              notifyOnChange: true,
              recipients: [],
            },
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe('At least one recipient email is required when notifications are enabled')
    })

    it('should pass with valid legal configuration', () => {
      const result = validateLegalRequiredFields(null, {
        data: {
          pageType: 'legal',
          legalConfig: {
            documentType: 'privacy',
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('validateContactRequiredFields', () => {
    it('should pass for non-contact pages', () => {
      const result = validateContactRequiredFields(null, {
        data: { pageType: 'page' },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })

    it('should require contactConfig for contact pages', () => {
      const result = validateContactRequiredFields(null, {
        data: { pageType: 'contact' },
        siblingData: {},
      } as any)
      expect(result).toBe('Contact configuration is required for contact pages')
    })

    it('should require purpose for contact pages', () => {
      const result = validateContactRequiredFields(null, {
        data: { pageType: 'contact', contactConfig: {} },
        siblingData: {},
      } as any)
      expect(result).toBe('Purpose is required for contact pages')
    })

    it('should pass with valid contact configuration', () => {
      const result = validateContactRequiredFields(null, {
        data: {
          pageType: 'contact',
          contactConfig: {
            purpose: 'general',
          },
        },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })
  })

  describe('validateBlogTags', () => {
    it('should pass for non-blog pages', () => {
      const result = validateBlogTags([{ tag: 'test' }], {
        data: { pageType: 'page' },
      } as any)
      expect(result).toBe(true)
    })

    it('should validate tag format', () => {
      const result = validateBlogTags([{ tag: '' }], {
        data: { pageType: 'blog' },
      } as any)
      expect(result).toBe('Tag 1 must be a non-empty string')
    })

    it('should validate tag length', () => {
      const longTag = 'a'.repeat(51)
      const result = validateBlogTags([{ tag: longTag }], {
        data: { pageType: 'blog' },
      } as any)
      expect(result).toBe('Tag 1 must be 50 characters or less')
    })

    it('should detect duplicate tags', () => {
      const result = validateBlogTags([{ tag: 'javascript' }, { tag: 'JavaScript' }], {
        data: { pageType: 'blog' },
      } as any)
      expect(result).toBe('Duplicate tag found: "javascript"')
    })

    it('should limit number of tags', () => {
      const manyTags = Array.from({ length: 11 }, (_, i) => ({ tag: `tag${i}` }))
      const result = validateBlogTags(manyTags, {
        data: { pageType: 'blog' },
      } as any)
      expect(result).toBe('Blog posts can have a maximum of 10 tags')
    })

    it('should pass with valid tags', () => {
      const result = validateBlogTags(
        [{ tag: 'javascript' }, { tag: 'typescript' }, { tag: 'react' }],
        {
          data: { pageType: 'blog' },
        } as any,
      )
      expect(result).toBe(true)
    })
  })
})

describe('Field Validation', () => {
  const mockValidationOptions = {
    blockData: {},
    data: {},
    path: ['test'],
    preferences: {
      fields: {},
    },
    req: {} as any,
    siblingData: {},
  }

  describe('validateTextLength', () => {
    const validator = validateTextLength('Test Field', {
      minLength: 5,
      maxLength: 20,
      required: true,
      allowEmpty: false,
    })

    it('should require field when required is true', () => {
      const result = validator('', mockValidationOptions)
      expect(result).toBe('Test Field is required')
    })

    it('should validate minimum length', () => {
      const result = validator('abc', mockValidationOptions)
      expect(result).toBe('Test Field must be at least 5 characters long')
    })

    it('should validate maximum length', () => {
      const result = validator('a'.repeat(25), mockValidationOptions)
      expect(result).toContain('Test Field must be 20 characters or less')
    })

    it('should pass with valid text', () => {
      const result = validator('Valid text', mockValidationOptions)
      expect(result).toBe(true)
    })
  })

  describe('validateArrayField', () => {
    const validator = validateArrayField<{ email: string }>('Recipients', {
      minItems: 1,
      maxItems: 3,
      required: true,
      itemValidator: (item) => {
        if (!item.email || !item.email.includes('@')) {
          return 'Invalid email format'
        }
        return true
      },
      uniqueBy: 'email',
    })

    it('should require array when required is true', () => {
      const result = validator(null, mockValidationOptions)
      expect(result).toBe('Recipients is required')
    })

    it('should validate minimum items', () => {
      const result = validator([], mockValidationOptions)
      expect(result).toBe('Recipients must have at least 1 item')
    })

    it('should validate maximum items', () => {
      const result = validator(
        [
          { email: 'a@test.com' },
          { email: 'b@test.com' },
          { email: 'c@test.com' },
          { email: 'd@test.com' },
        ],
        mockValidationOptions,
      )
      expect(result).toBe('Recipients can have at most 3 items')
    })

    it('should validate individual items', () => {
      const result = validator([{ email: 'invalid' }], mockValidationOptions)
      expect(result).toBe('Recipients item 1: Invalid email format')
    })

    it('should detect duplicates', () => {
      const result = validator(
        [{ email: 'test@example.com' }, { email: 'test@example.com' }],
        mockValidationOptions,
      )
      expect(result).toBe('Recipients contains duplicate values for email: test@example.com')
    })

    it('should pass with valid array', () => {
      const result = validator(
        [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
        mockValidationOptions,
      )
      expect(result).toBe(true)
    })
  })

  describe('validateDateField', () => {
    const validator = validateDateField('Test Date', {
      allowFuture: false,
      allowPast: true,
      required: true,
    })

    it('should require date when required is true', () => {
      const result = validator('', mockValidationOptions)
      expect(result).toBe('Test Date is required')
    })

    it('should validate date format', () => {
      const result = validator('invalid-date', mockValidationOptions)
      expect(result).toBe('Test Date must be a valid date')
    })

    it('should validate future dates when not allowed', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const result = validator(futureDate.toISOString(), mockValidationOptions)
      expect(result).toBe('Test Date cannot be in the future')
    })

    it('should pass with valid past date', () => {
      const pastDate = new Date()
      pastDate.setFullYear(pastDate.getFullYear() - 1)
      const result = validator(pastDate.toISOString(), mockValidationOptions)
      expect(result).toBe(true)
    })
  })
})

describe('Complex Field Validation', () => {
  describe('validatePricingConfiguration', () => {
    it('should pass for non-service pages', () => {
      const result = validatePricingConfiguration({ amount: 100 }, {
        data: { pageType: 'page' },
        siblingData: {},
      } as any)
      expect(result).toBe(true)
    })

    it('should validate negative amounts', () => {
      const result = validatePricingConfiguration({ amount: -100 }, {
        data: { pageType: 'service' },
        siblingData: {},
      } as any)
      expect(result).toBe('Pricing amount cannot be negative')
    })

    it('should require currency when amount is provided', () => {
      const result = validatePricingConfiguration({ amount: 100 }, {
        data: { pageType: 'service' },
        siblingData: {},
      } as any)
      expect(result).toBe('Currency is required when pricing amount is specified')
    })

    it('should validate currency values', () => {
      const result = validatePricingConfiguration(
        {
          amount: 100,
          currency: 'INVALID',
        },
        {
          data: { pageType: 'service' },
          siblingData: {},
        } as any,
      )
      expect(result).toBe('Invalid currency. Must be one of: USD, EUR, GBP, INR')
    })

    it('should pass with valid pricing configuration', () => {
      const result = validatePricingConfiguration(
        {
          amount: 100,
          currency: 'USD',
          period: 'hourly',
        },
        {
          data: { pageType: 'service' },
          siblingData: {},
        } as any,
      )
      expect(result).toBe(true)
    })
  })

  describe('validateNotificationSettings', () => {
    it('should pass for non-legal pages', () => {
      const result = validateNotificationSettings({ notifyOnChange: true }, {
        data: { pageType: 'page' },
      } as any)
      expect(result).toBe(true)
    })

    it('should require recipients when notifications are enabled', () => {
      const result = validateNotificationSettings(
        {
          notifyOnChange: true,
          recipients: [],
        },
        {
          data: { pageType: 'legal' },
        } as any,
      )
      expect(result).toBe('At least one recipient email is required when notifications are enabled')
    })

    it('should validate email format', () => {
      const result = validateNotificationSettings(
        {
          notifyOnChange: true,
          recipients: [{ email: 'invalid-email' }],
        },
        {
          data: { pageType: 'legal' },
        } as any,
      )
      expect(result).toBe('Invalid email format for recipient 1: invalid-email')
    })

    it('should detect duplicate emails', () => {
      const result = validateNotificationSettings(
        {
          notifyOnChange: true,
          recipients: [{ email: 'test@example.com' }, { email: 'test@example.com' }],
        },
        {
          data: { pageType: 'legal' },
        } as any,
      )
      expect(result).toBe('Duplicate email address found: test@example.com')
    })

    it('should limit number of recipients', () => {
      const manyRecipients = Array.from({ length: 21 }, (_, i) => ({
        email: `user${i}@example.com`,
      }))
      const result = validateNotificationSettings(
        {
          notifyOnChange: true,
          recipients: manyRecipients,
        },
        {
          data: { pageType: 'legal' },
        } as any,
      )
      expect(result).toBe('Maximum of 20 notification recipients allowed')
    })

    it('should pass with valid notification settings', () => {
      const result = validateNotificationSettings(
        {
          notifyOnChange: true,
          recipients: [{ email: 'admin@example.com' }, { email: 'legal@example.com' }],
        },
        {
          data: { pageType: 'legal' },
        } as any,
      )
      expect(result).toBe(true)
    })
  })
})
