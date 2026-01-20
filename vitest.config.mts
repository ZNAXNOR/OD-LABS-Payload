import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
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
})
