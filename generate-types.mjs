#!/usr/bin/env node

/**
 * Generate Payload Types Script
 *
 * This script generates TypeScript types for Payload CMS
 * without loading CSS/SCSS files that cause issues in Node.js
 */

import { execSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Mock CSS imports for Node.js
const mockCssLoader = `
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
    return {};
  }
  return originalRequire.apply(this, arguments);
};

// Also mock ES module imports
const originalResolve = require.resolve;
require.resolve = function(id, options) {
  if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
    return '/mock/css/file.css';
  }
  return originalResolve.call(this, id, options);
};
`

try {
  console.log('🔧 Setting up CSS mocking...')

  // Create a temporary loader file
  const fs = await import('fs')
  const loaderPath = resolve(__dirname, 'temp-css-loader.js')
  fs.writeFileSync(loaderPath, mockCssLoader)

  console.log('📦 Generating Payload types...')

  // Run payload generate:types with the CSS loader
  execSync(`node -r ./temp-css-loader.js ./node_modules/.bin/payload generate:types`, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_OPTIONS: '--no-deprecation',
    },
  })

  console.log('✅ Types generated successfully!')

  // Clean up
  fs.unlinkSync(loaderPath)
} catch (error) {
  console.error('❌ Failed to generate types:', error.message)
  process.exit(1)
}
