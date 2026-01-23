import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Custom plugin to handle SCSS imports from PayloadCMS UI
const mockScssPlugin = () => ({
  name: 'mock-scss',
  resolveId(id: string) {
    // Mock any SCSS imports from @payloadcms/ui
    if (id.includes('@payloadcms/ui') && (id.endsWith('.scss') || id.endsWith('.css'))) {
      return id
    }
    return null
  },
  load(id: string) {
    // Return empty object for SCSS imports from @payloadcms/ui
    if (id.includes('@payloadcms/ui') && (id.endsWith('.scss') || id.endsWith('.css'))) {
      return 'export default {}'
    }
    return null
  },
})

export default defineConfig({
  plugins: [tsconfigPaths(), react(), mockScssPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: [
      'tests/int/**/*.int.spec.ts',
      'tests/int/**/*.int.spec.tsx',
      'tests/unit/**/*.unit.spec.ts',
      'tests/unit/**/*.unit.spec.tsx',
      'tests/pbt/**/*.pbt.spec.ts',
      'tests/performance/**/*.perf.spec.ts',
    ],
    // Add timeouts to prevent hanging tests
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    // Mock CSS/SCSS imports
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
  // Handle CSS/SCSS imports in tests
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  // Configure how to handle different file types
  resolve: {
    alias: {
      // Mock SCSS files to return empty objects
      '\\.(css|scss|sass|less)$': new URL('./tests/utils/styleMock.js', import.meta.url).pathname,
    },
  },
})
