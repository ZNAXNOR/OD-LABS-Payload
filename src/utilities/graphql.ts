import type { GraphQLError } from 'graphql'
import type { Payload } from 'payload'

/**
 * GraphQL Error Handler
 * Provides comprehensive error handling and logging for GraphQL operations
 */
export const createGraphQLErrorHandler = (payload: Payload) => {
  return (error: GraphQLError) => {
    // Log error with appropriate severity
    if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      payload.logger.error('GraphQL Internal Error: ' + error.message)
    } else if (error.extensions?.code === 'BAD_USER_INPUT') {
      payload.logger.warn('GraphQL Bad Input: ' + error.message)
    } else {
      payload.logger.info('GraphQL Error: ' + error.message)
    }

    // Return sanitized error to client
    const sanitizedError: any = {
      message: error.message,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    }

    // Include additional details in development
    if (process.env.NODE_ENV === 'development') {
      sanitizedError.path = error.path
      sanitizedError.locations = error.locations
    }

    return sanitizedError
  }
}

/**
 * Query Complexity Calculator
 * Calculates the complexity score of a GraphQL query
 */
export interface ComplexityConfig {
  maxDepth?: number
  maxComplexity?: number
  scalarCost?: number
  objectCost?: number
  listMultiplier?: number
}

export const defaultComplexityConfig: ComplexityConfig = {
  maxDepth: 10,
  maxComplexity: 1000,
  scalarCost: 1,
  objectCost: 2,
  listMultiplier: 10,
}

/**
 * Validates query depth to prevent deeply nested queries
 */
export const validateQueryDepth = (
  query: any,
  maxDepth: number = 10,
  currentDepth: number = 0,
): boolean => {
  if (currentDepth > maxDepth) {
    return false
  }

  if (!query || typeof query !== 'object') {
    return true
  }

  // Check all nested selections
  if (query.selectionSet?.selections) {
    for (const selection of query.selectionSet.selections) {
      if (!validateQueryDepth(selection, maxDepth, currentDepth + 1)) {
        return false
      }
    }
  }

  return true
}

/**
 * GraphQL Performance Monitor
 * Tracks query performance metrics
 */
export class GraphQLPerformanceMonitor {
  private metrics: Map<string, { count: number; totalTime: number; avgTime: number }>

  constructor() {
    this.metrics = new Map()
  }

  recordQuery(operationName: string, executionTime: number): void {
    const existing = this.metrics.get(operationName) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
    }

    existing.count += 1
    existing.totalTime += executionTime
    existing.avgTime = existing.totalTime / existing.count

    this.metrics.set(operationName, existing)
  }

  getMetrics(operationName?: string) {
    if (operationName) {
      return this.metrics.get(operationName)
    }
    return Object.fromEntries(this.metrics)
  }

  reset(): void {
    this.metrics.clear()
  }
}

/**
 * Rate Limiter for GraphQL operations
 */
export class GraphQLRateLimiter {
  private requests: Map<string, number[]>
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.requests = new Map()
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []

    // Remove old requests outside the window
    const recentRequests = userRequests.filter((timestamp) => now - timestamp < this.windowMs)

    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    const recentRequests = userRequests.filter((timestamp) => now - timestamp < this.windowMs)

    return Math.max(0, this.maxRequests - recentRequests.length)
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier)
    } else {
      this.requests.clear()
    }
  }
}

/**
 * GraphQL Query Optimizer
 * Provides optimization suggestions for queries
 */
export const analyzeQuery = (
  query: string,
): {
  depth: number
  fieldCount: number
  hasFragments: boolean
  suggestions: string[]
} => {
  const suggestions: string[] = []
  let depth = 0
  let fieldCount = 0
  const hasFragments = query.includes('fragment')

  // Simple depth calculation (count nested braces)
  let currentDepth = 0
  let maxDepth = 0
  for (const char of query) {
    if (char === '{') {
      currentDepth++
      maxDepth = Math.max(maxDepth, currentDepth)
    } else if (char === '}') {
      currentDepth--
    }
  }
  depth = maxDepth

  // Count fields (approximate)
  fieldCount = (query.match(/\w+\s*{/g) || []).length

  // Generate suggestions
  if (depth > 5) {
    suggestions.push('Consider reducing query depth to improve performance')
  }

  if (fieldCount > 20) {
    suggestions.push('Consider splitting into multiple queries or using fragments')
  }

  if (!hasFragments && fieldCount > 10) {
    suggestions.push('Consider using fragments to reduce duplication')
  }

  if (!query.includes('limit:')) {
    suggestions.push('Consider adding pagination limits to list queries')
  }

  return {
    depth,
    fieldCount,
    hasFragments,
    suggestions,
  }
}
