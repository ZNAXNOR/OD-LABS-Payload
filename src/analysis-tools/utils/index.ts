/**
 * Shared utility functions for the analysis system
 */

/**
 * Generate a unique ID for issues, suggestions, and other entities
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calculate complexity score based on various metrics
 */
export function calculateComplexityScore(metrics: {
  fieldCount: number
  nestedDepth: number
  conditionalFields?: number
  validationRules?: number
}): number {
  const { fieldCount, nestedDepth, conditionalFields = 0, validationRules = 0 } = metrics

  // Simple complexity formula - can be refined
  const baseScore = fieldCount * 1
  const depthPenalty = nestedDepth * 5
  const conditionalPenalty = conditionalFields * 3
  const validationBonus = validationRules * -2 // Validation reduces complexity issues

  return Math.max(0, baseScore + depthPenalty + conditionalPenalty + validationBonus)
}

/**
 * Normalize file paths for consistent comparison
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/')
}

/**
 * Extract file name from path without extension
 */
export function getFileNameWithoutExtension(filePath: string): string {
  const normalized = normalizePath(filePath)
  const fileName = normalized.split('/').pop() || ''
  return fileName.replace(/\.[^.]+$/, '')
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase())
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * Check if a value is a plain object
 */
export function isPlainObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue as Partial<typeof targetValue>)
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as any
    }
  }

  return result
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    backoffFactor?: number
  } = {},
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000, backoffFactor = 2 } = options

  let lastError: Error
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay = Math.min(delay * backoffFactor, maxDelay)
      }
    }
  }

  throw lastError!
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`
  return `${(ms / 3600000).toFixed(2)}h`
}
