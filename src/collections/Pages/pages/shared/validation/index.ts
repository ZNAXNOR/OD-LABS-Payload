/**
 * Validation utilities for the consolidated Pages collection
 *
 * This module exports all validation functions used throughout the Pages collection
 * to ensure data integrity and business rule compliance.
 */

// Circular reference validation
export * from './circularReference'

// Page type-specific validation
export * from './pageTypeValidation'

// Complex field validation
export * from './fieldValidation'

// Re-export commonly used validation patterns
export {
  generateSlugFromText,
  generateUniqueSlug,
  isSlugUnique,
  validateSlugFormat,
} from '../../../utilities/slugGeneration'
