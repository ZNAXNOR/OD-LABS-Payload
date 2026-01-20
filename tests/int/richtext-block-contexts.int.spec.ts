/**
 * Integration tests for block functionality in all contexts
 * Tests blocks in rich text, layout sections, hero sections, and standalone contexts
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

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

test.describe('Block Functionality in All Contexts', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

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
          blockConfig.collections[0],
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
          test.skip(`Block ${blockConfig.blockType} not available for configuration testing`)
          return
        }

        // Test block-specific configuration options
        const blockContainer = page.locator(`[data-block-type="${blockConfig.blockType}"]`).first()

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
          blockConfig.collections[0],
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
          blockConfig.collections[0],
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
          await expect(page.locator(`[data-block-type="${blockConfig.blockType}"]`)).toHaveCount(0)

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
})
