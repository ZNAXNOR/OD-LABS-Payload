/**
 * Example usage of Database Identifier Validation Utilities
 *
 * This example demonstrates how to use the identifier analysis and validation
 * utilities to detect and fix PostgreSQL identifier length violations.
 */

import type { CollectionConfig, GlobalConfig } from 'payload'
import { analyzeDatabaseName, generateDbNameSuggestions } from '../databaseNameGeneration'
import {
  analyzeCollectionConfig,
  analyzeGlobalConfig,
  POSTGRES_IDENTIFIER_LIMIT,
} from '../identifierAnalysis'
import { validateIdentifiers } from '../identifierValidationPipeline'

/**
 * Example 1: Analyze a problematic collection configuration
 */
export async function exampleProblematicCollection() {
  console.log('=== Example 1: Problematic Collection Analysis ===\n')

  const problematicCollection: CollectionConfig = {
    slug: 'navigation-header-configuration',
    fields: [
      {
        name: 'navigationItemsConfigurationArray',
        type: 'array',
        fields: [
          {
            name: 'featuredLinkConfigurationGroup',
            type: 'group',
            fields: [
              {
                name: 'descriptionLinksArrayConfiguration',
                type: 'array',
                fields: [
                  {
                    name: 'linkTypeSelectionConfiguration',
                    type: 'select',
                    options: ['internal', 'external', 'download'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  // Analyze the collection
  const analysis = analyzeCollectionConfig(problematicCollection)

  console.log(`Collection: ${analysis.name}`)
  console.log(`Violations found: ${analysis.violations.length}`)
  console.log(
    `Critical violations: ${analysis.violations.filter((v: any) => v.severity === 'error').length}`,
  )
  console.log(`Max nesting depth: ${analysis.maxDepth}`)
  console.log(`Suggestions:`)
  analysis.suggestions.forEach((suggestion: any, i: number) => {
    console.log(`  ${i + 1}. ${suggestion}`)
  })

  // Show specific violations
  console.log('\nViolations:')
  analysis.violations.forEach((violation: any, i: number) => {
    console.log(`  ${i + 1}. Field: ${violation.fieldPath}`)
    console.log(`     Identifier: ${violation.estimatedIdentifier} (${violation.length} chars)`)
    console.log(`     Severity: ${violation.severity}`)
    console.log(`     Exceeds limit by: ${violation.length - POSTGRES_IDENTIFIER_LIMIT} characters`)
  })

  console.log('\n')
}

/**
 * Example 2: Generate database name suggestions
 */
export async function exampleDatabaseNameGeneration() {
  console.log('=== Example 2: Database Name Generation ===\n')

  const problematicFieldNames = [
    'navigationItemsConfigurationArray',
    'featuredLinkConfigurationGroup',
    'descriptionLinksArrayConfiguration',
    'linkTypeSelectionConfiguration',
  ]

  for (const fieldName of problematicFieldNames) {
    console.log(`Field: ${fieldName} (${fieldName.length} chars)`)

    // Generate suggestions
    const suggestions = generateDbNameSuggestions(fieldName, 'navigation', 3)
    console.log('Suggestions:')

    suggestions.forEach((suggestion, i) => {
      const analysis = analyzeDatabaseName(suggestion, fieldName)
      console.log(`  ${i + 1}. ${suggestion} (${suggestion.length} chars)`)
      console.log(`     Quality Score: ${(analysis.qualityScore * 100).toFixed(1)}%`)
      console.log(`     Semantic Score: ${(analysis.semanticScore * 100).toFixed(1)}%`)
    })

    console.log('')
  }
}

/**
 * Example 3: Complete validation pipeline
 */
export async function exampleValidationPipeline() {
  console.log('=== Example 3: Complete Validation Pipeline ===\n')

  const testConfig = {
    collections: [
      {
        slug: 'problematic-collection',
        fields: [
          {
            name: 'veryLongFieldNameThatExceedsPostgreSQLIdentifierLimitsAndCausesProblems',
            type: 'text',
          },
          {
            name: 'navigationItemsConfigurationArray',
            type: 'array',
            fields: [
              {
                name: 'featuredLinkConfiguration',
                type: 'group',
                fields: [
                  {
                    name: 'linkTypeSelection',
                    type: 'select',
                    options: ['internal', 'external'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    globals: [
      {
        slug: 'header-navigation-configuration',
        fields: [
          {
            name: 'navigationConfigurationSettings',
            type: 'group',
            fields: [
              {
                name: 'dropdownConfigurationOptions',
                type: 'array',
                fields: [
                  {
                    name: 'itemConfigurationSettings',
                    type: 'text',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  // Run complete validation
  const result = await validateIdentifiers(testConfig as any, {
    generateSuggestions: true,
    includeMetrics: true,
  })

  console.log('Validation Results:')
  console.log(`Passed: ${result.passed}`)
  console.log(`Total configurations: ${result.analysis.summary.totalConfigurations}`)
  console.log(`Total violations: ${result.analysis.summary.totalViolations}`)
  console.log(`Critical violations: ${result.analysis.summary.criticalViolations}`)
  console.log(`Warning violations: ${result.analysis.summary.warningViolations}`)

  if (result.metrics) {
    console.log(`\nPerformance:`)
    console.log(`Total time: ${result.metrics.totalTime}ms`)
    console.log(`Analysis time: ${result.metrics.analysisTime}ms`)
    console.log(`Suggestion time: ${result.metrics.suggestionTime}ms`)
  }

  // Show fix suggestions
  if (result.suggestions.length > 0) {
    console.log('\nFix Suggestions:')
    result.suggestions.slice(0, 3).forEach((suggestion, i) => {
      console.log(`\n${i + 1}. ${suggestion.violation.configurationName}`)
      console.log(`   Field: ${suggestion.violation.fieldPath}`)
      console.log(
        `   Problem: ${suggestion.violation.estimatedIdentifier} (${suggestion.violation.length} chars)`,
      )
      console.log(`   Recommended fix: dbName: '${suggestion.recommendedDbName}'`)
      console.log(`   Code snippet:`)
      console.log(
        `   ${suggestion.codeSnippet
          .split('\n')
          .map((line) => '   ' + line)
          .join('\n')}`,
      )
    })
  }

  console.log('\n')
}

/**
 * Example 4: Real-world header configuration optimization
 */
export async function exampleHeaderOptimization() {
  console.log('=== Example 4: Header Configuration Optimization ===\n')

  // Before: Problematic header configuration
  const problematicHeader: GlobalConfig = {
    slug: 'header',
    fields: [
      {
        name: 'navigationTabs',
        type: 'array',
        fields: [
          {
            name: 'dropdownConfiguration',
            type: 'group',
            fields: [
              {
                name: 'navigationItems',
                type: 'array',
                fields: [
                  {
                    name: 'featuredLinkConfiguration',
                    type: 'group',
                    fields: [
                      {
                        name: 'descriptionLinks',
                        type: 'array',
                        fields: [
                          {
                            name: 'linkType',
                            type: 'select',
                            options: ['internal', 'external'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  console.log('BEFORE optimization:')
  const beforeAnalysis = analyzeGlobalConfig(problematicHeader)
  console.log(`Violations: ${beforeAnalysis.violations.length}`)
  console.log(
    `Critical violations: ${beforeAnalysis.violations.filter((v: any) => v.severity === 'error').length}`,
  )

  // After: Optimized header configuration with dbName properties
  const optimizedHeader: GlobalConfig = {
    slug: 'header',
    dbName: 'header', // Root level optimization
    fields: [
      {
        name: 'navigationTabs',
        type: 'array',
        dbName: 'nav_tabs', // Strategic interruption
        fields: [
          {
            name: 'dropdownConfiguration',
            type: 'group',
            fields: [
              {
                name: 'navigationItems',
                type: 'array',
                dbName: 'nav_items', // Snake case conversion
                fields: [
                  {
                    name: 'featuredLinkConfiguration',
                    type: 'group',
                    fields: [
                      {
                        name: 'descriptionLinks',
                        type: 'array',
                        // dbName: 'desc_links', // Removed - not supported on all field types
                        fields: [
                          {
                            name: 'linkType',
                            type: 'select',
                            dbName: 'type', // Keep short names as-is
                            options: ['internal', 'external'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  console.log('\nAFTER optimization:')
  const afterAnalysis = analyzeGlobalConfig(optimizedHeader)
  console.log(`Violations: ${afterAnalysis.violations.length}`)
  console.log(
    `Critical violations: ${afterAnalysis.violations.filter((v: any) => v.severity === 'error').length}`,
  )

  console.log('\nOptimization Summary:')
  console.log(
    `Violations reduced by: ${beforeAnalysis.violations.length - afterAnalysis.violations.length}`,
  )
  console.log(
    `Critical violations eliminated: ${beforeAnalysis.violations.filter((v: any) => v.severity === 'error').length}`,
  )

  console.log('\n')
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🔍 Database Identifier Validation Examples\n')
  console.log('='.repeat(60))

  await exampleProblematicCollection()
  await exampleDatabaseNameGeneration()
  await exampleValidationPipeline()
  await exampleHeaderOptimization()

  console.log('✅ All examples completed!')
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error)
}
