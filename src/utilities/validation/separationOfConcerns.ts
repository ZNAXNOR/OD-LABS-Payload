/**
 * Separation of Concerns Validation Utility
 *
 * This utility helps ensure that frontend code doesn't import backend-only modules
 * and that shared code is accessible from both frontend and backend contexts.
 */

// Backend-only modules that should not be imported by frontend code
const BACKEND_ONLY_MODULES = [
  'payload',
  '@payloadcms/db-mongodb',
  '@payloadcms/db-postgres',
  '@payloadcms/db-sqlite',
  'fs',
  'path',
  'crypto',
  'os',
  'child_process',
  'cluster',
  'dgram',
  'dns',
  'http',
  'https',
  'net',
  'tls',
  'url',
  'querystring',
  'stream',
  'util',
  'zlib',
] as const

// Frontend-only modules that should not be imported by backend code
const FRONTEND_ONLY_MODULES = ['react-dom/client', 'next/navigation', 'next/router'] as const

// Shared modules that can be used by both frontend and backend
// Note: This is defined for future use in validation logic
// const SHARED_MODULES = [
//   'react',
//   'react/jsx-runtime',
//   'next/cache',
//   'next/headers',
//   'next/image',
//   'next/link',
// ] as const

export interface ValidationResult {
  isValid: boolean
  violations: string[]
  warnings: string[]
}

/**
 * Validates that a module import is appropriate for the given context
 */
export function validateImport(
  moduleName: string,
  context: 'frontend' | 'backend' | 'shared',
): ValidationResult {
  const violations: string[] = []
  const warnings: string[] = []

  // Check for backend-only modules in frontend context
  if (context === 'frontend' && BACKEND_ONLY_MODULES.includes(moduleName as any)) {
    violations.push(`Backend-only module '${moduleName}' cannot be imported in frontend context`)
  }

  // Check for frontend-only modules in backend context
  if (context === 'backend' && FRONTEND_ONLY_MODULES.includes(moduleName as any)) {
    violations.push(`Frontend-only module '${moduleName}' cannot be imported in backend context`)
  }

  // Check for Node.js built-in modules in frontend context
  if (context === 'frontend' && isNodeBuiltIn(moduleName)) {
    violations.push(`Node.js built-in module '${moduleName}' cannot be used in frontend context`)
  }

  return {
    isValid: violations.length === 0,
    violations,
    warnings,
  }
}

/**
 * Validates that shared code is accessible from both contexts
 */
export function validateSharedCodeAccessibility(
  filePath: string,
  imports: string[],
): ValidationResult {
  const violations: string[] = []
  const warnings: string[] = []

  // Check each import for compatibility with both contexts
  for (const importName of imports) {
    const frontendResult = validateImport(importName, 'frontend')
    const backendResult = validateImport(importName, 'backend')

    // If it fails in either context, it's not truly shared
    if (!frontendResult.isValid) {
      violations.push(
        `Shared file '${filePath}' imports '${importName}' which is not available in frontend context`,
      )
    }

    if (!backendResult.isValid) {
      violations.push(
        `Shared file '${filePath}' imports '${importName}' which is not available in backend context`,
      )
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    warnings,
  }
}

/**
 * Determines the context of a file based on its path
 */
export function determineFileContext(filePath: string): 'frontend' | 'backend' | 'shared' {
  // Frontend contexts
  if (
    filePath.includes('/app/(frontend)') ||
    filePath.includes('/components/') ||
    filePath.includes('/providers/') ||
    filePath.endsWith('.client.tsx') ||
    filePath.endsWith('.client.ts')
  ) {
    return 'frontend'
  }

  // Backend contexts
  if (
    filePath.includes('/app/(payload)') ||
    filePath.includes('/collections/') ||
    filePath.includes('/globals/') ||
    filePath.includes('/hooks/') ||
    filePath.includes('/access/') ||
    filePath.endsWith('.server.tsx') ||
    filePath.endsWith('.server.ts') ||
    filePath.includes('payload.config.ts')
  ) {
    return 'backend'
  }

  // Shared contexts (utilities, types, etc.)
  return 'shared'
}

/**
 * Checks if a module name is a Node.js built-in module
 */
function isNodeBuiltIn(moduleName: string): boolean {
  const nodeBuiltIns = [
    'assert',
    'buffer',
    'child_process',
    'cluster',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'punycode',
    'querystring',
    'readline',
    'stream',
    'string_decoder',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib',
  ]

  return nodeBuiltIns.includes(moduleName) || moduleName.startsWith('node:')
}

/**
 * Validates separation of concerns for a file and its imports
 */
export function validateFileSeparation(filePath: string, imports: string[]): ValidationResult {
  const context = determineFileContext(filePath)
  const violations: string[] = []
  const warnings: string[] = []

  // Validate each import for the file's context
  for (const importName of imports) {
    const result = validateImport(importName, context)
    violations.push(...result.violations)
    warnings.push(...result.warnings)
  }

  // Additional validation for shared files
  if (context === 'shared') {
    const sharedResult = validateSharedCodeAccessibility(filePath, imports)
    violations.push(...sharedResult.violations)
    warnings.push(...sharedResult.warnings)
  }

  return {
    isValid: violations.length === 0,
    violations,
    warnings,
  }
}
