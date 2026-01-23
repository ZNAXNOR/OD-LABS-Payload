/**
 * Mock CSS Loader for Validation
 *
 * This module provides mock implementations for CSS imports
 * that are not supported in Node.js validation environment.
 */

// Mock CSS imports by creating a module loader hook
const originalResolve = require.resolve

// Override require.resolve to handle CSS files
const mockResolve = function (this: any, id: string, options?: any) {
  if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
    // Return a mock path for CSS files
    return '/mock/css/file.css'
  }
  return originalResolve.call(this, id, options)
} as any

// Add the paths method
mockResolve.paths = function (request: string): string[] | null {
  return originalResolve.paths ? originalResolve.paths(request) : null
}

require.resolve = mockResolve

// Mock CSS module loader
const Module = require('module')
const originalLoad = Module._load

Module._load = function (request: string) {
  if (request.endsWith('.css') || request.endsWith('.scss') || request.endsWith('.sass')) {
    // Return empty object for CSS imports
    return {}
  }
  return originalLoad.apply(this, arguments)
}

export function setupCssMocking() {
  // Additional setup if needed
  console.log('🎭 CSS mocking enabled for validation')
}
