#!/usr/bin/env node

// This is a simple JavaScript wrapper that imports the TypeScript CLI
// In a real deployment, this would be the compiled output from TypeScript

import('./index.ts').catch((err) => {
  console.error('Failed to load CLI:', err.message)
  process.exit(1)
})
