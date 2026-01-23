/**
 * Tests for Database Identifier Validation Utilities
 */

import type { CollectionConfig, Field, GlobalConfig } from 'payload'
import { describe, expect, it } from 'vitest'
import {
  analyzeDatabaseName,
  applyAbbreviations,
  convertToSnakeCase,
  generateDatabaseName,
  generateDbNameSuggestions,
} from '../databaseNameGeneration'
import {
  analyzeCollectionConfig,
  analyzeGlobalConfig,
  analyzePayloadConfig,
  generateEstimatedIdentifier,
  POSTGRES_IDENTIFIER_LIMIT,
} from '../identifierAnalysis'
import { generateFixSuggestions, validateIdentifiers } from '../identifierValidationPipeline'

describe('Database Identifier Analysis', () => {
  it('should detect identifier length violations', () => {
    const testCollection: CollectionConfig = {
      slug: 'test-collection',
      fields: [
        {
          name: 'veryLongFieldNameThatWillCauseProblemsWithPostgreSQLIdentifierLimits',
          type: 'text',
        },
      ],
    }

    const analysis = analyzeCollectionConfig(testCollection)

    expect(analysis.violations.length).toBeGreaterThan(0)
    expect(analysis.hasCriticalViolations).toBe(true)
    expect(analysis.violations[0]?.severity).toBe('error')
  })

  it('should handle nested field structures', () => {
    const testCollection: CollectionConfig = {
      slug: 'navigation-header',
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
                  name: 'descriptionLinksArray',
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
    }

    const analysis = analyzeCollectionConfig(testCollection)

    // Should detect violations in deeply nested structures
    expect(analysis.violations.length).toBeGreaterThan(0)
    expect(analysis.maxDepth).toBeGreaterThan(2)
  })

  it('should generate correct estimated identifiers', () => {
    const identifier = generateEstimatedIdentifier('navigationItems.featuredLink.links.type', {
      parentSlug: 'header',
      fieldType: 'select',
      isEnum: true,
    })

    expect(identifier).toBe('enum_header_navigation_items_featured_link_links_type')
    expect(identifier.length).toBeGreaterThan(POSTGRES_IDENTIFIER_LIMIT)
  })
})

describe('Database Name Generation', () => {
  it('should convert camelCase to snake_case', () => {
    expect(convertToSnakeCase('navigationItems')).toBe('navigation_items')
    expect(convertToSnakeCase('featuredLinkConfiguration')).toBe('featured_link_configuration')
    expect(convertToSnakeCase('HTMLParser')).toBe('html_parser')
    expect(convertToSnakeCase('XMLHttpRequest')).toBe('xml_http_request')
  })

  it('should apply standard abbreviations', () => {
    const abbreviated = applyAbbreviations('navigation_items_description_information')

    expect(abbreviated).toContain('nav')
    expect(abbreviated).toContain('desc')
    expect(abbreviated).toContain('info')
  })

  it('should generate valid database names within limits', () => {
    const longFieldName = 'navigationItemsFeaturedLinkDescriptionConfiguration'
    const dbName = generateDatabaseName(longFieldName)

    expect(dbName.length).toBeLessThanOrEqual(POSTGRES_IDENTIFIER_LIMIT)
    expect(dbName).toMatch(/^[a-z][a-z0-9_]*$/)
    expect(dbName).not.toMatch(/_$/)
  })

  it('should generate multiple suggestions with different strategies', () => {
    const suggestions = generateDbNameSuggestions('navigationItemsConfiguration', 'navigation', 3)

    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.length).toBeLessThanOrEqual(3)

    // All suggestions should be valid and within limits
    suggestions.forEach((suggestion) => {
      expect(suggestion.length).toBeLessThanOrEqual(POSTGRES_IDENTIFIER_LIMIT)
      expect(suggestion).toMatch(/^[a-z][a-z0-9_]*$/)
    })
  })

  it('should analyze database name quality', () => {
    const analysis = analyzeDatabaseName('nav_items', 'navigationItems')

    expect(analysis.isValid).toBe(true)
    expect(analysis.length).toBe(9)
    expect(analysis.semanticScore).toBeGreaterThan(0)
    expect(analysis.qualityScore).toBeGreaterThan(0)
  })
})

describe('Validation Pipeline', () => {
  it('should validate entire payload configuration', async () => {
    const testConfig = {
      collections: [
        {
          slug: 'test-collection',
          fields: [
            {
              name: 'shortField',
              type: 'text',
            },
            {
              name: 'veryLongFieldNameThatExceedsPostgreSQLLimits',
              type: 'text',
            },
          ],
        },
      ],
      globals: [
        {
          slug: 'test-global',
          fields: [
            {
              name: 'anotherVeryLongFieldNameThatWillCauseIssues',
              type: 'text',
            },
          ],
        },
      ],
    }

    const result = await validateIdentifiers(testConfig as any)

    expect(result.analysis).toBeDefined()
    expect(result.analysis.summary.totalConfigurations).toBe(2)
    expect(result.analysis.summary.criticalViolations).toBeGreaterThan(0)
    expect(result.suggestions.length).toBeGreaterThan(0)
  })

  it('should generate actionable fix suggestions', async () => {
    const testConfig = {
      collections: [
        {
          slug: 'problematic-collection',
          fields: [
            {
              name: 'fieldWithVeryLongNameThatExceedsLimits',
              type: 'text',
            },
          ],
        },
      ],
    }

    const analysis = analyzePayloadConfig(testConfig as any)
    const suggestions = await generateFixSuggestions(analysis)

    expect(suggestions.length).toBeGreaterThan(0)

    const suggestion = suggestions[0]
    expect(suggestion?.recommendedDbName).toBeDefined()
    expect(suggestion?.recommendedDbName.length).toBeLessThanOrEqual(POSTGRES_IDENTIFIER_LIMIT)
    expect(suggestion?.codeSnippet).toContain('dbName:')
    expect(suggestion?.explanation).toContain('PostgreSQL')
  })
})

describe('Edge Cases and Error Handling', () => {
  it('should handle empty configurations gracefully', () => {
    const emptyConfig = {
      collections: [],
      globals: [],
    }

    const analysis = analyzePayloadConfig(emptyConfig as any)

    expect(analysis.configurations).toHaveLength(0)
    expect(analysis.summary.totalViolations).toBe(0)
  })

  it('should handle fields without names', () => {
    const testCollection: CollectionConfig = {
      slug: 'test',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'validField',
              type: 'text',
            },
          ],
        },
      ],
    }

    expect(() => analyzeCollectionConfig(testCollection)).not.toThrow()
  })

  it('should validate database name format strictly', () => {
    expect(() => generateDatabaseName('')).toThrow()
    expect(() => generateDatabaseName('123invalid')).toThrow()

    // Valid names should not throw
    expect(() => generateDatabaseName('validName')).not.toThrow()
    expect(() => generateDatabaseName('valid_name_123')).not.toThrow()
  })

  it('should handle very deep nesting without infinite recursion', () => {
    // Create a deeply nested structure
    let deepField: Field = {
      name: 'deepestField',
      type: 'text',
    }

    for (let i = 0; i < 15; i++) {
      deepField = {
        name: `level${i}Group`,
        type: 'group',
        fields: [deepField],
      }
    }

    const testCollection: CollectionConfig = {
      slug: 'deep-test',
      fields: [deepField],
    }

    // Should not cause stack overflow
    expect(() => analyzeCollectionConfig(testCollection)).not.toThrow()
  })
})

describe('Real-world Scenarios', () => {
  it('should handle typical header navigation structure', () => {
    const headerGlobal: GlobalConfig = {
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

    const analysis = analyzeGlobalConfig(headerGlobal)

    expect(analysis.violations.length).toBeGreaterThan(0)
    expect(analysis.suggestions).toContain('Add dbName properties to')
  })

  it('should provide meaningful suggestions for common patterns', () => {
    const suggestions = generateDbNameSuggestions('navigationItemsConfiguration', 'navigation')

    // Should include abbreviated versions
    expect(suggestions.some((s) => s.includes('nav'))).toBe(true)
    expect(suggestions.some((s) => s.includes('config'))).toBe(true)
  })
})
