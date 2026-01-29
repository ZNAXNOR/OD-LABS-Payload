// ============================================================================
// TREE-SHAKING OPTIMIZED UTILITY EXPORTS
// ============================================================================

// Individual category exports for tree-shaking
export * from './accessibility'
export * from './api'
export * from './cms'
export * from './dbname-cleanup'
export * from './formatting'
export * from './media'
export * from './ui'
// Export validation utilities explicitly to avoid ValidationError conflict
export * from './validateEnv'
export * from './validation/buildTimeValidator'
export * from './validation/databaseNameGeneration'
export * from './validation/identifierAnalysis'
export {
  generateFixSuggestions,
  validateIdentifiers,
  validateIdentifiersCLI,
} from './validation/identifierValidationPipeline'
export type {
  FixSuggestion,
  ValidationResult as IdentifierValidationResult,
  ValidationPipelineConfig,
} from './validation/identifierValidationPipeline'
export * from './validation/separationConfig'
export * from './validation/separationOfConcerns'
export * from './validation/validateProject'
// Export error handling utilities with specific exports to avoid ValidationError conflict
export {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  createErrorBoundary,
  handleAsyncError,
  handleDatabaseError,
  NotFoundError,
  PayloadError,
  RateLimitError,
  safeJsonParse,
  safeJsonStringify,
  setupGlobalErrorHandling,
  validateEmail as validateEmailUtil,
  validateRequiredFields,
  validateUrl,
  withErrorHandling,
  withRetry,
} from './errorHandling'
// Export field validation utilities
export {
  createArrayLengthValidator,
  createConditionalValidator,
  createDateRangeValidator,
  createLengthValidator,
  fieldValidators,
  validateEmail,
  validateHexColor,
  validatePasswordStrength,
  validatePhone,
  validatePositiveNumber,
  validateSlugFormat,
  validateURL,
} from '../fields/validation'

// ============================================================================
// LAZY-LOADED UTILITY CATEGORIES FOR CODE SPLITTING
// ============================================================================

// Lazy-loaded utility categories for optimal bundle splitting
export const utilityCategories = {
  api: () => import('./api'),
  validation: () => import('./validation'),
  formatting: () => import('./formatting'),
  media: () => import('./media'),
  cms: () => import('./cms'),
  ui: () => import('./ui'),
  accessibility: () => import('./accessibility'),
  dbnameCleanup: () => import('./dbname-cleanup'),
} as const

// Type definitions for utility categories
export type UtilityCategory = keyof typeof utilityCategories

// ============================================================================
// TREE-SHAKING FRIENDLY CATEGORY LOADERS
// ============================================================================

// Individual category loaders for optimal tree-shaking
export const loadAPIUtilities = () => import('./api')
export const loadValidationUtilities = () => import('./validation')
export const loadFormattingUtilities = () => import('./formatting')
export const loadMediaUtilities = () => import('./media')
export const loadCMSUtilities = () => import('./cms')
export const loadUIUtilities = () => import('./ui')
export const loadAccessibilityUtilities = () => import('./accessibility')
export const loadDbNameCleanupUtilities = () => import('./dbname-cleanup')

// ============================================================================
// UTILITY REGISTRY FOR DYNAMIC LOADING
// ============================================================================

export interface UtilityInfo {
  category: UtilityCategory
  loader: () => Promise<any>
}

// Registry for dynamic utility loading
export const utilityRegistry: Record<string, UtilityInfo> = {
  // API Utilities
  graphql: { category: 'api', loader: () => import('./graphql') },
  getGlobals: { category: 'api', loader: () => import('./getGlobals') },
  revalidation: { category: 'api', loader: () => import('./revalidation') },

  // Validation Utilities
  validateEnv: { category: 'validation', loader: () => import('./validateEnv') },
  errorHandling: { category: 'validation', loader: () => import('./errorHandling') },
  configValidation: { category: 'validation', loader: () => import('./configValidation') },

  // Formatting Utilities
  slugGeneration: { category: 'formatting', loader: () => import('./slugGeneration') },

  // Media Utilities
  getMediaUrl: { category: 'media', loader: () => import('./getMediaUrl') },

  // CMS Utilities
  pageHierarchy: { category: 'cms', loader: () => import('./pageHierarchy') },
  legacyBlocks: { category: 'cms', loader: () => import('./legacyBlocks') },

  // UI Utilities
  ui: { category: 'ui', loader: () => import('./ui') },
  canUseDOM: { category: 'ui', loader: () => import('./canUseDOM') },
  deepMerge: { category: 'ui', loader: () => import('./deepMerge') },

  // Accessibility Utilities
  accessibility: { category: 'accessibility', loader: () => import('./accessibility') },

  // DbName Cleanup Utilities
  dbnameCleanup: { category: 'dbnameCleanup', loader: () => import('./dbname-cleanup') },
}

// Helper to load utility dynamically
export async function loadUtility(utilityName: string) {
  const utilityInfo = utilityRegistry[utilityName]
  if (!utilityInfo) {
    throw new Error(`Utility "${utilityName}" not found in registry`)
  }
  return await utilityInfo.loader()
}

// Helper to get utilities by category
export function getUtilitiesByCategory(category: UtilityCategory): string[] {
  return Object.entries(utilityRegistry)
    .filter(([, info]) => info.category === category)
    .map(([name]) => name)
}
