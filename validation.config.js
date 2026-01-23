/**
 * Database Identifier Validation Configuration
 *
 * This file configures build-time validation settings for database identifiers.
 * It can be used to customize validation behavior across different environments.
 */

module.exports = {
  // Default configuration for all environments
  default: {
    configPath: './src/payload.config.ts',
    failOnWarnings: false,
    outputDir: './validation-reports',
    generateReports: true,
    reportFormats: ['json', 'markdown'],
    verbose: false,

    // Validation rules
    rules: {
      maxIdentifierLength: 63,
      enforceSnakeCase: true,
      requireDbNameForNesting: true,
      warnOnLongPaths: true,
    },

    // Paths to exclude from validation
    excludePaths: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],

    // Collections to prioritize in validation
    priorityCollections: ['users', 'media', 'pages', 'blogs', 'services'],
  },

  // Development environment overrides
  development: {
    verbose: true,
    failOnWarnings: false,
    generateReports: false,
  },

  // Production environment overrides
  production: {
    failOnWarnings: true,
    generateReports: true,
    reportFormats: ['json', 'markdown', 'html'],
    verbose: false,
  },

  // CI/CD environment overrides
  ci: {
    failOnWarnings: true,
    generateReports: true,
    reportFormats: ['json'],
    verbose: true,
    outputDir: './ci-reports',
  },

  // Test environment overrides
  test: {
    failOnWarnings: false,
    generateReports: false,
    verbose: false,
  },
}
