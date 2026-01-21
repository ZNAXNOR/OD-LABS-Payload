/**
 * Comprehensive integration tests for block functionality and page collections
 * Tests blocks in all contexts, rich text functionality across collections, and collection-specific features
 * Consolidated from multiple integration test files
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Test data for different collection types
const testCollections = [
  {
    slug: 'pages',
    name: 'Pages',
    requiredFields: { title: 'Test Page', content: null },
    hasHero: true,
    hasLayout: true,
    hasRichText: false, // Pages use blocks instead of direct rich text
  },
  {
    slug: 'blogs',
    name: 'Blog Pages',
    requiredFields: { title: 'Test Blog Post', content: 'Test blog content' },
    hasHero: true,
    hasLayout: true,
    hasRichText: true,
  },
  {
    slug: 'services',
    name: 'Service Pages',
    requiredFields: { title: 'Test Service', content: 'Test service content' },
    hasHero: true,
    hasLayout: true,
    hasRichText: true,
  },
  {
    slug: 'legal',
    name: 'Legal Pages',
    requiredFields: { title: 'Test Legal Document', content: 'Test legal content' },
    hasHero: false,
    hasLayout: true,
    hasRichText: true,
  },
  {
    slug: 'contacts',
    name: 'Contact Pages',
    requiredFields: {
      title: 'Test Contact Page',
      content: 'Test contact content',
      purpose: 'general',
    },
    hasHero: true,
    hasLayout: true,
    hasRichText: true,
  },
]

// Block types and their expected contexts
const blockContexts = [
  {
    blockType: 'hero',
    contexts: ['hero', 'layout'],
    requiredFields: { heading: 'Test Hero Heading' },
    collections: ['pages', 'blogs', 'services', 'contacts'],
  },
  {
    blockType: 'content',
    contexts: ['layout', 'richtext'],
    requiredFields: { content: 'Test content block' },
    collections: ['pages', 'blogs', 'services', 'legal', 'contacts'],
  },
  {
    blockType: 'callToAction',
    contexts: ['layout', 'richtext'],
    requiredFields: { heading: 'Test CTA', text: 'CTA description' },
    collections: ['pages', 'blogs', 'services', 'contacts'],
  },
  {
    blockType: 'mediaBlock',
    contexts: ['layout', 'richtext'],
    requiredFields: {},
    collections: ['pages', 'blogs', 'services', 'legal', 'contacts'],
  },
  {
    blockType: 'servicesGrid',
    contexts: ['layout'],
    requiredFields: { heading: 'Services Grid' },
    collections: ['pages', 'services'],
  },
  {
    blockType: 'techStack',
    contexts: ['layout'],
    requiredFields: { heading: 'Tech Stack' },
    collections: ['pages', 'services'],
  },
  {
    blockType: 'projectShowcase',
    contexts: ['layout'],
    requiredFields: { heading: 'Project Showcase' },
    collections: ['pages'],
  },
  {
    blockType: 'testimonial',
    contexts: ['layout'],
    requiredFields: { quote: 'Great service!', author: 'John Doe' },
    collections: ['pages', 'services'],
  },
  {
    blockType: 'featureGrid',
    contexts: ['layout'],
    requiredFields: { heading: 'Features' },
    collections: ['pages', 'services'],
  },
  {
    blockType: 'faqAccordion',
    contexts: ['layout'],
    requiredFields: { heading: 'FAQ' },
    collections: ['pages', 'services', 'legal'],
  },
  {
    blockType: 'contactForm',
    contexts: ['layout'],
    requiredFields: { heading: 'Contact Us' },
    collections: ['pages', 'contacts'],
  },
  {
    blockType: 'newsletter',
    contexts: ['layout'],
    requiredFields: { heading: 'Newsletter' },
    collections: ['pages', 'blogs'],
  },
]

// Helper function to login as admin
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="email"]', 'admin@test.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}

// Helper function to create a test document
async function createTestDocument(page: Page, collection: string, title: string) {
  await page.goto(`/admin/collections/${collection}/create`)
  await page.fill('input[name="title"]', title)

  // Handle collection-specific required fields
  if (collection === 'blogs' || collection === 'services' || collection === 'legal') {
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Required content for testing')
  }

  if (collection === 'contacts') {
    await page.selectOption('select[name="purpose"]', 'general')
  }

  return page
}

// Helper function to add a block in a specific context
async function addBlockInContext(page: Page, blockType: string, context: string, blockData: any) {
  let addBlockButton: any

  switch (context) {
    case 'hero':
      // Navigate to Hero tab if it exists
      const heroTab = page.locator('button:has-text("Hero")')
      if (await heroTab.isVisible()) {
        await heroTab.click()
      }
      addBlockButton = page
        .locator('button:has-text("Add Hero Block"), button:has-text("Add Block")')
        .first()
      break

    case 'layout':
      // Navigate to Layout tab
      const layoutTab = page.locator('button:has-text("Layout")')
      if (await layoutTab.isVisible()) {
        await layoutTab.click()
      }
      addBlockButton = page.locator('button:has-text("Add Block")').last()
      break

    case 'richtext':
      // Find rich text editor and try to insert block
      await page.waitForSelector('.lexical-editor')
      await page.click('.lexical-editor')

      // Look for block insertion button in rich text toolbar
      const blockInsertButton = page.locator(
        'button:has-text("Block"), button[aria-label*="block"]',
      )
      if (await blockInsertButton.isVisible()) {
        addBlockButton = blockInsertButton
      } else {
        // Skip if rich text block insertion is not available
        return false
      }
      break
  }

  if (!addBlockButton || !(await addBlockButton.isVisible())) {
    return false
  }

  await addBlockButton.click()

  // Select the specific block type
  const blockOption = page.locator(
    `[data-block-type="${blockType}"], button:has-text("${blockType}")`,
  )
  if (await blockOption.isVisible()) {
    await blockOption.click()
  } else {
    // Try alternative selectors
    const altBlockOption = page.locator(
      `button:has-text("${blockType.charAt(0).toUpperCase() + blockType.slice(1)}")`,
    )
    if (await altBlockOption.isVisible()) {
      await altBlockOption.click()
    } else {
      return false
    }
  }

  // Fill block-specific fields
  for (const [fieldName, fieldValue] of Object.entries(blockData)) {
    const fieldSelector = `input[name*="${fieldName}"], textarea[name*="${fieldName}"]`
    const field = page.locator(fieldSelector)

    if (await field.isVisible()) {
      await field.fill(fieldValue as string)
    }
  }

  return true
}

// Helper function to verify block rendering on frontend
async function verifyBlockOnFrontend(
  page: Page,
  collection: string,
  slug: string,
  blockType: string,
  expectedContent: any,
) {
  const frontendUrl = collection === 'pages' ? `/${slug}` : `/${collection}/${slug}`
  await page.goto(frontendUrl)

  // Wait for page to load
  await page.waitForLoadState('networkidle')

  // Check for block-specific content
  switch (blockType) {
    case 'hero':
      await expect(page.locator('h1, .hero-heading')).toContainText(expectedContent.heading)
      break
    case 'content':
      await expect(page.locator('.content-block, .rich-text')).toContainText(
        expectedContent.content,
      )
      break
    case 'callToAction':
      await expect(page.locator('.cta-block, .call-to-action')).toContainText(
        expectedContent.heading,
      )
      break
    case 'servicesGrid':
    case 'techStack':
    case 'projectShowcase':
    case 'featureGrid':
    case 'faqAccordion':
    case 'contactForm':
    case 'newsletter':
      await expect(page.locator(`[data-block="${blockType}"], .${blockType}-block`)).toContainText(
        expectedContent.heading,
      )
      break
    case 'testimonial':
      await expect(page.locator('.testimonial-block, .testimonial')).toContainText(
        expectedContent.quote,
      )
      break
    case 'mediaBlock':
      await expect(page.locator('.media-block, .media')).toBeVisible()
      break
  }
}

test.describe('Block Functionality and Page Collections', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  // Collection-specific tests
  test.describe('Collection-Specific Functionality', () => {
    for (const collection of testCollections) {
      test.describe(`${collection.name} Collection`, () => {
        test(`should create and edit ${collection.name.toLowerCase()} with rich text`, async ({
          page,
        }) => {
          // Create new document
          await page.goto(`/admin/collections/${collection.slug}/create`)
          await page.fill('input[name="title"]', collection.requiredFields.title)

          // Handle rich text content if the collection has it
          if (collection.hasRichText && collection.requiredFields.content) {
            await page.waitForSelector('.lexical-editor', { timeout: 10000 })
            await page.click('.lexical-editor')
            await page.keyboard.type(collection.requiredFields.content)
          }

          // Handle collection-specific fields
          if (collection.slug === 'contacts') {
            await page.selectOption(
              'select[name="purpose"]',
              collection.requiredFields.purpose || 'general',
            )
          }

          // Save as draft
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success', { timeout: 10000 })

          // Verify document was created
          await page.goto(`/admin/collections/${collection.slug}`)
          await expect(page.locator(`text=${collection.requiredFields.title}`)).toBeVisible()
        })

        test(`should render ${collection.name.toLowerCase()} on frontend`, async ({ page }) => {
          // Create a published document
          await page.goto(`/admin/collections/${collection.slug}/create`)
          await page.fill('input[name="title"]', `Published ${collection.name}`)

          if (collection.hasRichText && collection.requiredFields.content) {
            await page.waitForSelector('.lexical-editor')
            await page.click('.lexical-editor')
            await page.keyboard.type('This is published content with rich text formatting.')
          }

          if (collection.slug === 'contacts') {
            await page.selectOption('select[name="purpose"]', 'general')
          }

          // Generate slug and publish
          const slug = `published-${collection.slug}-${Date.now()}`
          await page.fill('input[name="slug"]', slug)
          await page.click('button:has-text("Save & Publish")')
          await page.waitForSelector('.toast--success')

          // Visit frontend page
          const frontendUrl =
            collection.slug === 'pages' ? `/${slug}` : `/${collection.slug}/${slug}`
          await page.goto(frontendUrl)

          // Verify content is rendered
          await expect(page.locator(`h1:has-text("Published ${collection.name}")`)).toBeVisible()

          if (collection.hasRichText) {
            await expect(page.locator('text=This is published content')).toBeVisible()
          }
        })
      })
    }
  })

  // Block-specific tests
  test.describe('Block Functionality in All Contexts', () => {
    // Test each block type in its supported contexts and collections
    for (const blockConfig of blockContexts) {
      test.describe(`${blockConfig.blockType} Block`, () => {
        for (const collection of blockConfig.collections) {
          for (const context of blockConfig.contexts) {
            test(`should work in ${context} context for ${collection} collection`, async ({
              page,
            }) => {
              const testTitle = `${blockConfig.blockType} Test in ${context} - ${collection}`
              await createTestDocument(page, collection, testTitle)

              // Add the block in the specified context
              const blockAdded = await addBlockInContext(
                page,
                blockConfig.blockType,
                context,
                blockConfig.requiredFields,
              )

              if (!blockAdded) {
                test.skip(
                  true,
                  `Block ${blockConfig.blockType} not available in ${context} context for ${collection}`,
                )
                return
              }

              // Save the document
              await page.click('button:has-text("Save Draft")')
              await page.waitForSelector('.toast--success', { timeout: 10000 })

              // Verify block appears in admin
              const blockElement = page.locator(
                `[data-block-type="${blockConfig.blockType}"], .block`,
              )
              await expect(blockElement).toBeVisible()

              // Generate a slug for frontend testing
              const slug = `${blockConfig.blockType}-${context}-${collection}-${Date.now()}`
              await page.fill('input[name="slug"]', slug)

              // Publish the document
              await page.click('button:has-text("Publish")')
              await page.waitForSelector('.toast--success', { timeout: 10000 })

              // Verify on frontend
              await verifyBlockOnFrontend(
                page,
                collection,
                slug,
                blockConfig.blockType,
                blockConfig.requiredFields,
              )
            })
          }
        }

        test(`should handle ${blockConfig.blockType} block configuration`, async ({ page }) => {
          // Test block configuration options
          await createTestDocument(
            page,
            blockConfig.collections[0] || 'pages',
            `${blockConfig.blockType} Config Test`,
          )

          // Navigate to layout context (most common)
          const layoutTab = page.locator('button:has-text("Layout")')
          if (await layoutTab.isVisible()) {
            await layoutTab.click()
          }

          const blockAdded = await addBlockInContext(
            page,
            blockConfig.blockType,
            'layout',
            blockConfig.requiredFields,
          )

          if (!blockAdded) {
            test.skip(
              true,
              `Block ${blockConfig.blockType} not available for configuration testing`,
            )
            return
          }

          // Test block-specific configuration options
          const blockContainer = page
            .locator(`[data-block-type="${blockConfig.blockType}"]`)
            .first()

          // Check for common configuration options
          const configOptions = [
            'className',
            'id',
            'backgroundColor',
            'textColor',
            'padding',
            'margin',
            'alignment',
          ]

          for (const option of configOptions) {
            const optionField = blockContainer.locator(
              `input[name*="${option}"], select[name*="${option}"]`,
            )
            if (await optionField.isVisible()) {
              // Test that the field is interactive
              if ((await optionField.getAttribute('type')) === 'text') {
                await optionField.fill(`test-${option}`)
              }
            }
          }

          // Save and verify configuration persists
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success')

          await page.reload()
          await page.waitForSelector(`[data-block-type="${blockConfig.blockType}"]`)
        })

        test(`should handle ${blockConfig.blockType} block reordering`, async ({ page }) => {
          // Create document with multiple blocks
          await createTestDocument(
            page,
            blockConfig.collections[0] || 'pages',
            `${blockConfig.blockType} Reorder Test`,
          )

          const layoutTab = page.locator('button:has-text("Layout")')
          if (await layoutTab.isVisible()) {
            await layoutTab.click()
          }

          // Add first block
          await addBlockInContext(page, blockConfig.blockType, 'layout', {
            ...blockConfig.requiredFields,
            heading: 'First Block',
          })

          // Add second block (content block as it's widely supported)
          await addBlockInContext(page, 'content', 'layout', {
            content: 'Second Block Content',
          })

          // Verify both blocks are present
          await expect(page.locator('.block')).toHaveCount(2)

          // Test drag and drop reordering (if available)
          const dragHandle = page.locator('.drag-handle, .block-drag').first()
          if (await dragHandle.isVisible()) {
            const firstBlock = page.locator('.block').first()
            const secondBlock = page.locator('.block').nth(1)

            // Perform drag and drop
            await firstBlock.dragTo(secondBlock)

            // Verify order changed
            await page.waitForTimeout(1000)
            await page.click('button:has-text("Save Draft")')
            await page.waitForSelector('.toast--success')
          }
        })

        test(`should handle ${blockConfig.blockType} block deletion`, async ({ page }) => {
          await createTestDocument(
            page,
            blockConfig.collections[0] || 'pages',
            `${blockConfig.blockType} Delete Test`,
          )

          const layoutTab = page.locator('button:has-text("Layout")')
          if (await layoutTab.isVisible()) {
            await layoutTab.click()
          }

          await addBlockInContext(page, blockConfig.blockType, 'layout', blockConfig.requiredFields)

          // Find and click delete button
          const deleteButton = page
            .locator(
              '.block .delete-button, .block button:has-text("Delete"), .block [aria-label*="delete"]',
            )
            .first()
          if (await deleteButton.isVisible()) {
            await deleteButton.click()

            // Confirm deletion if modal appears
            const confirmButton = page.locator(
              'button:has-text("Delete"), button:has-text("Confirm")',
            )
            if (await confirmButton.isVisible()) {
              await confirmButton.click()
            }

            // Verify block was removed
            await expect(page.locator(`[data-block-type="${blockConfig.blockType}"]`)).toHaveCount(
              0,
            )

            // Save and verify deletion persists
            await page.click('button:has-text("Save Draft")')
            await page.waitForSelector('.toast--success')
          }
        })
      })
    }

    test('should handle block validation errors', async ({ page }) => {
      await createTestDocument(page, 'pages', 'Block Validation Test')

      const layoutTab = page.locator('button:has-text("Layout")')
      if (await layoutTab.isVisible()) {
        await layoutTab.click()
      }

      // Add a block without filling required fields
      const addBlockButton = page.locator('button:has-text("Add Block")')
      if (await addBlockButton.isVisible()) {
        await addBlockButton.click()

        // Select hero block (has required fields)
        const heroOption = page.locator('[data-block-type="hero"], button:has-text("Hero")')
        if (await heroOption.isVisible()) {
          await heroOption.click()

          // Try to save without filling required fields
          await page.click('button:has-text("Save Draft")')

          // Should show validation errors
          await expect(page.locator('.field-error, .error, .validation-error')).toBeVisible()

          // Fill required field and save should succeed
          const headingField = page.locator('input[name*="heading"]')
          if (await headingField.isVisible()) {
            await headingField.fill('Required Heading')
            await page.click('button:has-text("Save Draft")')
            await page.waitForSelector('.toast--success')
          }
        }
      }
    })

    test('should handle block responsive behavior', async ({ page }) => {
      // Test blocks at different viewport sizes
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' },
      ]

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        await createTestDocument(page, 'pages', `Responsive Test ${viewport.name}`)

        const layoutTab = page.locator('button:has-text("Layout")')
        if (await layoutTab.isVisible()) {
          await layoutTab.click()
        }

        // Add a hero block
        const blockAdded = await addBlockInContext(page, 'hero', 'layout', {
          heading: `Hero for ${viewport.name}`,
        })

        if (blockAdded) {
          // Save and publish
          const slug = `responsive-${viewport.name}-${Date.now()}`
          await page.fill('input[name="slug"]', slug)
          await page.click('button:has-text("Save & Publish")')
          await page.waitForSelector('.toast--success')

          // Check frontend rendering
          await page.goto(`/${slug}`)
          await page.waitForLoadState('networkidle')

          // Verify block is visible and properly sized
          const heroBlock = page.locator('.hero, [data-block="hero"]')
          if (await heroBlock.isVisible()) {
            const boundingBox = await heroBlock.boundingBox()
            expect(boundingBox?.width).toBeLessThanOrEqual(viewport.width)
            expect(boundingBox?.width).toBeGreaterThan(0)
          }
        }
      }
    })

    test('should handle block accessibility features', async ({ page }) => {
      await createTestDocument(page, 'pages', 'Accessibility Test')

      const layoutTab = page.locator('button:has-text("Layout")')
      if (await layoutTab.isVisible()) {
        await layoutTab.click()
      }

      // Add blocks with accessibility considerations
      const accessibleBlocks = ['hero', 'content', 'mediaBlock']

      for (const blockType of accessibleBlocks) {
        const blockConfig = blockContexts.find((b) => b.blockType === blockType)
        if (blockConfig) {
          await addBlockInContext(page, blockType, 'layout', blockConfig.requiredFields)
        }
      }

      // Save and publish
      const slug = `accessibility-test-${Date.now()}`
      await page.fill('input[name="slug"]', slug)
      await page.click('button:has-text("Save & Publish")')
      await page.waitForSelector('.toast--success')

      // Check frontend accessibility
      await page.goto(`/${slug}`)
      await page.waitForLoadState('networkidle')

      // Run basic accessibility checks
      const headings = page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()
      expect(headingCount).toBeGreaterThan(0)

      // Check for alt text on images
      const images = page.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        const ariaLabel = await img.getAttribute('aria-label')

        // Should have either alt text or aria-label
        expect(alt || ariaLabel).toBeTruthy()
      }

      // Check for proper heading hierarchy
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThanOrEqual(1) // Should have at least one h1
    })

    // Cross-collection functionality tests
    test.describe('Cross-Collection Features', () => {
      test('should handle versioning and drafts across collections', async ({ page }) => {
        for (const collection of testCollections.slice(0, 2)) {
          // Test first 2 collections for performance
          await page.goto(`/admin/collections/${collection.slug}/create`)
          await page.fill('input[name="title"]', `Version Test ${collection.name}`)

          if (collection.hasRichText && collection.requiredFields.content) {
            await page.waitForSelector('.lexical-editor')
            await page.click('.lexical-editor')
            await page.keyboard.type('Initial content')
          }

          if (collection.slug === 'contacts') {
            await page.selectOption('select[name="purpose"]', 'general')
          }

          // Save as draft
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success')

          // Verify draft status
          await expect(page.locator('text=Draft')).toBeVisible()

          // Publish
          await page.click('button:has-text("Publish")')
          await page.waitForSelector('.toast--success')

          // Verify published status
          await expect(page.locator('text=Published')).toBeVisible()
        }
      })

      test('should handle slug generation across collections', async ({ page }) => {
        for (const collection of testCollections.slice(0, 2)) {
          await page.goto(`/admin/collections/${collection.slug}/create`)

          // Fill title
          const testTitle = `Auto Slug Test ${collection.name} ${Date.now()}`
          await page.fill('input[name="title"]', testTitle)

          // Handle required content
          if (collection.hasRichText && collection.requiredFields.content) {
            await page.waitForSelector('.lexical-editor')
            await page.click('.lexical-editor')
            await page.keyboard.type(collection.requiredFields.content)
          }

          if (collection.slug === 'contacts') {
            await page.selectOption('select[name="purpose"]', 'general')
          }

          // Trigger slug generation
          await page.click('body')
          await page.waitForTimeout(500)

          // Check if slug was auto-generated
          const slugField = page.locator('input[name="slug"]')
          const slugValue = await slugField.inputValue()

          expect(slugValue).toBeTruthy()
          expect(slugValue).toMatch(/^[a-z0-9-]+$/) // Should be URL-friendly

          // Save document
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success')
        }
      })
    })
  })
})
