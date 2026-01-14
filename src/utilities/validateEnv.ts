/**
 * Environment Variable Validation Utility
 *
 * Validates required environment variables and provides helpful error messages
 * for missing or invalid configuration.
 */

interface EnvConfig {
  required: string[]
  optional: string[]
}

const envConfig: EnvConfig = {
  required: ['DATABASE_URL', 'PAYLOAD_SECRET'],
  optional: [
    'NEXT_PUBLIC_SERVER_URL',
    'GA_PROPERTY_ID',
    'GA_CREDENTIALS_PATH',
    'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM_ADDRESS',
    'SMTP_FROM_NAME',
    'RESEND_API_KEY',
    'RESEND_FROM_ADDRESS',
    'RESEND_FROM_NAME',
    'S3_BUCKET',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_REGION',
    'S3_ENDPOINT',
    'BLOB_READ_WRITE_TOKEN',
    'NODE_ENV',
    'PAYLOAD_DISABLE_ADMIN',
    'PAYLOAD_PUBLIC_ADMIN_ROUTE',
    'NEXT_TELEMETRY_DISABLED',
    'CORS_ORIGINS',
    'RATE_LIMIT_MAX',
    'RATE_LIMIT_WINDOW',
    'LOG_LEVEL',
    'LOG_FORMAT',
  ],
}

/**
 * Validates that all required environment variables are present
 * @throws Error if required variables are missing
 */
export function validateEnv(): void {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const key of envConfig.required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((key) => `  - ${key}`).join('\n')}\n\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `See .env.example for reference.`,
    )
  }

  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      warnings.push('DATABASE_URL should start with postgresql:// or postgres://')
    }
  }

  // Validate PAYLOAD_SECRET length
  if (process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET.length < 32) {
    warnings.push(
      'PAYLOAD_SECRET should be at least 32 characters long for security. ' +
        'Generate a secure secret with: openssl rand -base64 32',
    )
  }

  // Check for development vs production configuration
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      warnings.push('NEXT_PUBLIC_SERVER_URL should be set in production')
    }
  }

  // Log warnings if any
  if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn('\n⚠️  Environment Configuration Warnings:')
    warnings.forEach((warning) => console.warn(`  - ${warning}`))
    console.warn('')
  }
}

/**
 * Gets an environment variable with a default value
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

/**
 * Gets an environment variable as a number
 */
export function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not set`)
  }
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got: ${value}`)
  }
  return parsed
}

/**
 * Gets an environment variable as a boolean
 */
export function getEnvBoolean(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value === 'true' || value === '1'
}

/**
 * Checks if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Checks if the application is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Checks if the application is running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}
