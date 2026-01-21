/**
 * Separation of Concerns Configuration
 *
 * This file defines the rules and patterns for maintaining proper separation
 * between frontend, backend, and shared code in the PayloadCMS project.
 */

export interface SeparationConfig {
  frontend: {
    allowedPaths: string[]
    allowedModules: string[]
    forbiddenModules: string[]
  }
  backend: {
    allowedPaths: string[]
    allowedModules: string[]
    forbiddenModules: string[]
  }
  shared: {
    allowedPaths: string[]
    allowedModules: string[]
    forbiddenModules: string[]
  }
}

export const DEFAULT_SEPARATION_CONFIG: SeparationConfig = {
  frontend: {
    allowedPaths: [
      '/src/app/(frontend)/**',
      '/src/components/**',
      '/src/providers/**',
      '/src/utilities/ui.ts',
      '/src/utilities/accessibility.ts',
      '/src/utilities/canUseDOM.ts',
      '/src/utilities/formatting/**',
      '/src/types/**',
      '**/*.client.ts',
      '**/*.client.tsx',
    ],
    allowedModules: [
      'react',
      'react-dom',
      'react-dom/client',
      'next/image',
      'next/link',
      'next/navigation',
      'next/router',
      '@payloadcms/ui',
      '@payloadcms/richtext-lexical',
    ],
    forbiddenModules: [
      'payload',
      '@payloadcms/db-*',
      'fs',
      'path',
      'crypto',
      'os',
      'child_process',
      'http',
      'https',
      'net',
    ],
  },
  backend: {
    allowedPaths: [
      '/src/app/(payload)/**',
      '/src/collections/**',
      '/src/globals/**',
      '/src/hooks/**',
      '/src/access/**',
      '/src/migrations/**',
      '/src/plugins/**',
      '/payload.config.ts',
      '**/*.server.ts',
      '**/*.server.tsx',
    ],
    allowedModules: [
      'payload',
      '@payloadcms/db-mongodb',
      '@payloadcms/db-postgres',
      '@payloadcms/db-sqlite',
      '@payloadcms/richtext-lexical',
      'fs',
      'path',
      'crypto',
      'os',
      'next/cache',
      'next/headers',
    ],
    forbiddenModules: [
      'react-dom/client',
      'next/navigation',
      'next/router',
      'window',
      'document',
      'localStorage',
      'sessionStorage',
    ],
  },
  shared: {
    allowedPaths: ['/src/utilities/**', '/src/types/**', '/src/fields/**', '/src/icons/**'],
    allowedModules: [
      'react',
      'react/jsx-runtime',
      'next/cache',
      'next/headers',
      'next/image',
      'next/link',
    ],
    forbiddenModules: [
      // Modules that would break in either frontend or backend
      'react-dom/client', // Frontend only
      'next/navigation', // Frontend only
      'fs', // Backend only
      'crypto', // Backend only (Node.js version)
      'os', // Backend only
    ],
  },
}

/**
 * Validates if a module is allowed in a specific context
 */
export function isModuleAllowed(
  moduleName: string,
  context: keyof SeparationConfig,
  config: SeparationConfig = DEFAULT_SEPARATION_CONFIG,
): boolean {
  const contextConfig = config[context]

  // Check if explicitly allowed
  if (
    contextConfig.allowedModules.some(
      (allowed) =>
        allowed === moduleName ||
        (allowed.endsWith('*') && moduleName.startsWith(allowed.slice(0, -1))),
    )
  ) {
    return true
  }

  // Check if explicitly forbidden
  if (
    contextConfig.forbiddenModules.some(
      (forbidden) =>
        forbidden === moduleName ||
        (forbidden.endsWith('*') && moduleName.startsWith(forbidden.slice(0, -1))),
    )
  ) {
    return false
  }

  // Default to allowed for unlisted modules (with warning)
  return true
}

/**
 * Validates if a file path belongs to a specific context
 */
export function isPathInContext(
  filePath: string,
  context: keyof SeparationConfig,
  config: SeparationConfig = DEFAULT_SEPARATION_CONFIG,
): boolean {
  const contextConfig = config[context]

  return contextConfig.allowedPaths.some((pattern) => {
    // Simple glob pattern matching
    if (pattern.endsWith('/**')) {
      const basePath = pattern.slice(0, -3)
      return filePath.startsWith(basePath)
    }
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return regex.test(filePath)
    }
    return filePath === pattern
  })
}
