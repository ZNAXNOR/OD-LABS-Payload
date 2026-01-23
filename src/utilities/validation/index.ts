// Validation utilities exports
// This file will contain combined exports for all validation utilities

export * from '../errorHandling'
export * from '../validateEnv'
export * from './separationConfig'
export * from './separationOfConcerns'
export * from './validateProject'

// Database identifier validation utilities
export * from './buildTimeValidator'
export * from './databaseNameGeneration'
export * from './identifierAnalysis'
export {
  generateFixSuggestions,
  validateIdentifiers,
  validateIdentifiersCLI,
} from './identifierValidationPipeline'
export type {
  FixSuggestion,
  ValidationResult as IdentifierValidationResult,
  ValidationPipelineConfig,
} from './identifierValidationPipeline'

// Additional validation utilities will be exported here
