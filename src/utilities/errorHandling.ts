import type { PayloadRequest } from 'payload'

/**
 * Custom error class for Payload operations
 * Extends the standard Error class with additional context
 */
export class PayloadError extends Error {
  public statusCode: number
  public code: string
  public context?: Record<string, any>

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    context?: Record<string, any>,
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.context = context
    this.name = 'PayloadError'

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PayloadError)
    }
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    }
  }
}

/**
 * Specific error types for common scenarios
 */
export class ValidationError extends PayloadError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', context)
  }
}

export class AuthenticationError extends PayloadError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, 401, 'AUTHENTICATION_ERROR', context)
  }
}

export class AuthorizationError extends PayloadError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, any>) {
    super(message, 403, 'AUTHORIZATION_ERROR', context)
  }
}

export class NotFoundError extends PayloadError {
  constructor(message: string = 'Resource not found', context?: Record<string, any>) {
    super(message, 404, 'NOT_FOUND_ERROR', context)
  }
}

export class ConflictError extends PayloadError {
  constructor(message: string = 'Resource conflict', context?: Record<string, any>) {
    super(message, 409, 'CONFLICT_ERROR', context)
  }
}

export class RateLimitError extends PayloadError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_ERROR', context)
  }
}

/**
 * Wrapper function for handling async errors in hooks and operations
 * Provides consistent error logging and context preservation
 *
 * @param fn - The async function to wrap
 * @param context - Additional context for error reporting
 * @returns Wrapped function with error handling
 */
export const handleAsyncError = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: Record<string, any>,
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      // Find the request object in the arguments for logging
      const req = args.find((arg) => arg?.payload) as PayloadRequest | undefined

      // Log the error with context
      if (req?.payload?.logger) {
        req.payload.logger.error(
          `Error in ${fn.name}: ${error instanceof Error ? error.message : String(error)}`,
        )
      } else {
        console.error(`Error in ${fn.name}:`, error)
      }

      // Re-throw with additional context if it's not already a PayloadError
      if (error instanceof PayloadError) {
        throw error
      }

      throw new PayloadError(
        `Operation failed: ${error instanceof Error ? error.message : String(error)}`,
        500,
        'OPERATION_FAILED',
        { ...context, originalError: error instanceof Error ? error.message : String(error) },
      )
    }
  }
}

/**
 * Decorator for creating error boundaries around class methods
 * Useful for wrapping service methods or hook functions
 *
 * @param operation - Description of the operation for error context
 * @returns Method decorator
 */
export const createErrorBoundary = (operation: string) => {
  return (_target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value

    descriptor.value = handleAsyncError(method, { operation, method: propertyName })

    return descriptor
  }
}

/**
 * Utility function to safely parse JSON with error handling
 *
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export const safeJsonParse = <T = any>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.warn('Failed to parse JSON:', error)
    return fallback
  }
}

/**
 * Utility function to safely stringify objects with error handling
 *
 * @param obj - The object to stringify
 * @param fallback - Fallback string if stringification fails
 * @returns JSON string or fallback
 */
export const safeJsonStringify = (obj: any, fallback: string = '{}'): string => {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    console.warn('Failed to stringify object:', error)
    return fallback
  }
}

/**
 * Utility function to validate required fields
 * Throws ValidationError if any required fields are missing
 *
 * @param data - The data object to validate
 * @param requiredFields - Array of required field names
 * @param context - Additional context for the error
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[],
  context?: Record<string, any>,
): void => {
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === '',
  )

  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`, {
      ...context,
      missingFields,
      providedFields: Object.keys(data),
    })
  }
}

/**
 * Utility function to validate email format
 *
 * @param email - The email to validate
 * @param context - Additional context for the error
 */
export const validateEmail = (email: string, context?: Record<string, any>): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', { ...context, providedEmail: email })
  }
}

/**
 * Utility function to validate URL format
 *
 * @param url - The URL to validate
 * @param context - Additional context for the error
 */
export const validateUrl = (url: string, context?: Record<string, any>): void => {
  try {
    new URL(url)
  } catch (error) {
    throw new ValidationError('Invalid URL format', { ...context, providedUrl: url })
  }
}

/**
 * Utility function to handle database constraint errors
 * Converts common database errors to user-friendly messages
 *
 * @param error - The database error
 * @param context - Additional context
 * @returns PayloadError with user-friendly message
 */
export const handleDatabaseError = (error: any, context?: Record<string, any>): PayloadError => {
  const errorMessage = error?.message || String(error)

  // Handle common database constraint violations
  if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
    return new ConflictError('A record with this value already exists', {
      ...context,
      originalError: errorMessage,
    })
  }

  if (errorMessage.includes('foreign key constraint')) {
    return new ValidationError('Referenced record does not exist', {
      ...context,
      originalError: errorMessage,
    })
  }

  if (errorMessage.includes('not null constraint')) {
    return new ValidationError('Required field cannot be empty', {
      ...context,
      originalError: errorMessage,
    })
  }

  // Default to generic database error
  return new PayloadError('Database operation failed', 500, 'DATABASE_ERROR', {
    ...context,
    originalError: errorMessage,
  })
}

/**
 * Utility function to create a retry mechanism with exponential backoff
 *
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise that resolves with the function result or rejects with the last error
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // lastError is guaranteed to be defined here since we've had at least one error
  throw new PayloadError(
    `Operation failed after ${maxRetries + 1} attempts: ${lastError!.message}`,
    500,
    'RETRY_EXHAUSTED',
    { maxRetries, lastError: lastError!.message },
  )
}

/**
 * Global error handler configuration for Payload
 * This should be added to the payload config's onInit hook
 */
export const setupGlobalErrorHandling = (payload: any) => {
  // Set up global error handling for unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    payload.logger.error('Unhandled Rejection at:', promise, 'reason:', reason)

    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      console.error('Unhandled rejection in production, exiting...')
      process.exit(1)
    }
  })

  // Set up global error handling for uncaught exceptions
  process.on('uncaughtException', (error) => {
    payload.logger.error('Uncaught Exception:', error)

    // Always exit on uncaught exceptions
    process.exit(1)
  })

  // Set up graceful shutdown handlers
  const gracefulShutdown = (signal: string) => {
    payload.logger.info(`Received ${signal}. Shutting down gracefully...`)

    // Perform cleanup operations here
    // Close database connections, stop servers, etc.

    process.exit(0)
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

/**
 * Middleware function to handle errors in custom endpoints
 *
 * @param handler - The endpoint handler function
 * @returns Wrapped handler with error handling
 */
export const withErrorHandling = (handler: (req: any) => Promise<Response>) => {
  return async (req: any): Promise<Response> => {
    try {
      return await handler(req)
    } catch (error) {
      // Log the error
      if (req.payload?.logger) {
        req.payload.logger.error('Endpoint error:', error)
      }

      // Convert to PayloadError if needed
      const payloadError =
        error instanceof PayloadError
          ? error
          : new PayloadError(
              error instanceof Error ? error.message : 'Internal server error',
              500,
              'ENDPOINT_ERROR',
            )

      // Return error response
      return Response.json(
        {
          error: {
            message: payloadError.message,
            code: payloadError.code,
            ...(process.env.NODE_ENV === 'development' && {
              context: payloadError.context,
              stack: payloadError.stack,
            }),
          },
        },
        { status: payloadError.statusCode },
      )
    }
  }
}
