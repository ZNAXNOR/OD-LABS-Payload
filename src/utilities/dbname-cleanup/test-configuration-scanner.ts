/**
 * Simple test to verify ConfigurationScanner implementation
 */

import { PayloadConfigurationScanner } from './configuration-scanner'
import { DbNameUsageExtractor } from './dbname-usage-extractor'

// Simple test that can be run without module loading issues
function basicTest() {
  console.log('Running basic functionality test...')

  try {
    const scanner = new PayloadConfigurationScanner()
    console.log('✓ PayloadConfigurationScanner created successfully')

    const extractor = new DbNameUsageExtractor()
    console.log('✓ DbNameUsageExtractor created successfully')

    console.log('✓ All basic tests passed!')
    return true
  } catch (error) {
    console.error('✗ Basic test failed:', error)
    return false
  }
}

// Test the basic functionality
async function testConfigurationScanner() {
  console.log('Testing ConfigurationScanner...')

  const scanner = new PayloadConfigurationScanner()

  // Test with a mock configuration
  const mockConfig = {
    slug: 'posts',
    dbName: 'blog_posts',
    fields: [
      {
        name: 'title',
        type: 'text',
        dbName: 'post_title',
      },
      {
        name: 'content',
        type: 'richText',
      },
      {
        name: 'metadata',
        type: 'group',
        fields: [
          {
            name: 'seoTitle',
            type: 'text',
            dbName: 'seo_title',
          },
          {
            name: 'tags',
            type: 'array',
            fields: [
              {
                name: 'tagName',
                type: 'text',
                dbName: 'tag',
              },
            ],
          },
        ],
      },
    ],
  }

  const usages = scanner.extractDbNameUsages(mockConfig, '/test/collections/posts.ts')

  console.log('Found dbName usages:', usages.length)
  usages.forEach((usage, index) => {
    console.log(`${index + 1}. ${usage.fieldName} (${usage.fieldType}): ${usage.dbNameValue}`)
    console.log(`   Location: ${usage.location}`)
    console.log(`   Nesting Level: ${usage.nestingLevel}`)
    console.log(`   Full Path: ${usage.context.fullPath}`)
    if (usage.context.identifierPath) {
      console.log(`   Identifier Path: ${usage.context.identifierPath}`)
    }
    if (usage.context.estimatedDatabaseName) {
      console.log(`   Estimated DB Name: ${usage.context.estimatedDatabaseName}`)
    }
    console.log('')
  })
}

// Test the DbNameUsageExtractor directly
function testDbNameUsageExtractor() {
  console.log('Testing DbNameUsageExtractor...')

  const extractor = new DbNameUsageExtractor()

  const mockUsage = {
    location: 'fields[2].fields[1].fields[0].dbName',
    fieldName: 'tagName',
    dbNameValue: 'tag',
    fieldType: 'text',
    nestingLevel: 3,
    context: {
      parentFields: ['metadata', 'tags'],
      collectionSlug: 'posts',
      isNested: true,
      fullPath: 'metadata.tags.tagName',
      identifierPath: 'metadata.tags.tag',
      estimatedDatabaseName: 'posts_metadata_tags_tag',
      wouldExceedLimit: false,
      parentFieldTypes: ['group', 'array'],
      fieldDepth: 2,
      isInArray: true,
      isInGroup: true,
      isInBlocks: false,
      arrayNestingLevel: 1,
      groupNestingLevel: 1,
      blocksNestingLevel: 0,
    },
  }

  const metadata = extractor.generateUsageMetadata(mockUsage as any)

  console.log('Usage Metadata:')
  console.log('- Identifier Analysis:', metadata.identifierAnalysis)
  console.log('- Nesting Analysis:', metadata.nestingAnalysis)
  console.log('- Strategic Analysis:', metadata.strategicAnalysis)
}

// Export test functions
export { basicTest, testConfigurationScanner, testDbNameUsageExtractor }

// Run basic test if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  basicTest()
}
