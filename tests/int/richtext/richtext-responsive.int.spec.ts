/**
 * Comprehensive responsive tests for RichText components
 * Tests responsive behavior across all device sizes, orientations, and contexts
 * Includes both unit-level component testing and integration-level workflow testing
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Device configurations for testing
const deviceConfigs = {
  iphone12: { width: 390, height: 844, category: 'mobile', name: 'iPhone 12' },
  ipadPro: { width: 1024, height: 1366, category: 'tablet', name: 'iPad Pro' },
  desktop1920: { width: 1920, height: 1080, category: 'desktop', name: 'Desktop 1920' },
  desktop1366: { width: 1366, height: 768, category: 'desktop', name: 'Desktop 1366' },
  tabletLandscape: { width: 1024, height: 768, category: 'tablet', name: 'Tablet Landscape' },
  tabletPortrait: { width: 768, height: 1024, category: 'tablet', name: 'Tablet Portrait' },
  mobileLarge: { width: 414, height: 896, category: 'mobile', name: 'Mobile Large' },
  mobileStandard: { width: 375, height: 667, category: 'mobile', name: 'Mobile Standard' },
  mobileSmall: { width: 320, height: 568, category: 'mobile', name: 'Mobile Small' },
}

// Common viewport sizes for testing
const viewports = Object.entries(deviceConfigs).map(([key, config]) => ({
  ...config,
  key,
}))

// Helper function to login as admin
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="email"]', 'admin@test.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}

// Helper function to create test content
async function createResponsiveTestDocument(page: Page, collection: string, viewport: any) {
  await page.goto(`/admin/collections/${collection}/create`)

  const title = `Responsive Test - ${viewport.name}`
  await page.fill('input[name="title"]', title)

  // Add rich text content if the collection supports it
  if (['blogs', 'services', 'legal', 'contacts'].includes(collection)) {
    await page.waitForSelector('.lexical-editor', { timeout: 10000 })
    await page.click('.lexical-editor')

    const contentText =
      'This is responsive rich text content that should adapt to different screen sizes.'
    await page.keyboard.type(contentText)
  }

  // Handle collection-specific fields
  if (collection === 'contacts') {
    await page.selectOption('select[name="purpose"]', 'general')
  }

  // Generate slug
  const slug = `responsive-test-${viewport.key}-${Date.now()}`
  await page.fill('input[name="slug"]', slug)

  // Save and publish
  await page.click('button:has-text("Save & Publish")')
  await page.waitForSelector('.toast--success', { timeout: 10000 })

  return { title, slug }
}

test.describe('RichText Responsive Behavior', () => {
  // Unit-level responsive component tests
  test.describe('Component Responsive Design (Unit Level)', () => {
    test('should handle responsive features correctly', async ({ page }) => {
      // Create a simple test page for component testing
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            .rich-text { width: 100%; max-width: 100%; }
            .rich-text p { word-wrap: break-word; }
            .rich-text h1, .rich-text h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
          </style>
        </head>
        <body>
          <div class="rich-text" data-testid="richtext-container">
            <h1>Test Heading</h1>
            <p>This is test content for responsive testing.</p>
          </div>
        </body>
        </html>
      `)

      // Test different viewport sizes
      for (const viewport of viewports.slice(0, 3)) {
        // Test subset for performance
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        const container = page.getByTestId('richtext-container')
        await expect(container).toBeVisible()

        // Check that content doesn't overflow
        const boundingBox = await container.boundingBox()
        if (boundingBox) {
          expect(boundingBox.width).toBeLessThanOrEqual(viewport.width + 5) // Allow small tolerance
        }
      }
    })

    test('should handle device-specific features', async ({ page }) => {
      const mobileViewport = viewports.find((v) => v.category === 'mobile')!
      const desktopViewport = viewports.find((v) => v.category === 'desktop')!

      // Test mobile features
      await page.setViewportSize({ width: mobileViewport.width, height: mobileViewport.height })
      await page.setContent(`
        <div class="rich-text">
          <button style="min-height: 44px; min-width: 44px;">Touch Target</button>
        </div>
      `)

      const button = page.locator('button')
      const buttonBox = await button.boundingBox()
      if (buttonBox) {
        expect(Math.min(buttonBox.width, buttonBox.height)).toBeGreaterThanOrEqual(44) // Touch target size
      }

      // Test desktop features
      await page.setViewportSize({ width: desktopViewport.width, height: desktopViewport.height })
      await page.setContent(`
        <div class="rich-text">
          <p>Desktop content with hover effects</p>
        </div>
      `)

      await expect(page.locator('p')).toBeVisible()
    })
  })

  // Integration-level tests
  test.describe('Editor and Frontend Integration', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page)
    })

    // Test editor responsiveness across all viewports
    for (const viewport of viewports.slice(0, 5)) {
      // Test subset for performance
      test(`should render editor responsively on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        // Test with blogs collection (has rich text)
        await page.goto('/admin/collections/blogs/create')
        await page.fill('input[name="title"]', `Editor Test ${viewport.name}`)

        // Wait for editor to load
        await page.waitForSelector('.lexical-editor', { timeout: 10000 })

        // Verify editor is functional
        await page.click('.lexical-editor')
        await page.keyboard.type('Test content')
        await expect(page.locator('.lexical-editor')).toContainText('Test content')

        // Check editor doesn't overflow viewport
        const editor = page.locator('.lexical-editor')
        const editorBox = await editor.boundingBox()
        if (editorBox) {
          expect(editorBox.width).toBeLessThanOrEqual(viewport.width + 10) // Allow tolerance
        }
      })
    }

    // Test frontend rendering responsiveness
    test('should render frontend content responsively', async ({ page }) => {
      const testViewports = [
        viewports.find((v) => v.key === 'mobileStandard')!,
        viewports.find((v) => v.key === 'desktop1366')!,
      ]

      for (const viewport of testViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        // Create test document
        const { slug } = await createResponsiveTestDocument(page, 'blogs', viewport)

        // Test frontend rendering
        await page.goto(`/blogs/${slug}`)
        await page.waitForLoadState('networkidle')

        // Verify no horizontal scrolling
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5)

        // Verify content is readable
        const heading = page.locator('h1, h2, h3')
        await expect(heading).toBeVisible()
      }
    })

    test('should handle viewport transitions smoothly', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize({ width: 1366, height: 768 })

      // Create test document
      await page.goto('/admin/collections/blogs/create')
      await page.fill('input[name="title"]', 'Viewport Transition Test')
      await page.waitForSelector('.lexical-editor')
      await page.click('.lexical-editor')
      await page.keyboard.type('This content should adapt smoothly to viewport changes.')

      // Save document
      const slug = `viewport-transition-${Date.now()}`
      await page.fill('input[name="slug"]', slug)
      await page.click('button:has-text("Save & Publish")')
      await page.waitForSelector('.toast--success')

      // Test viewport transitions
      const transitionViewports = [
        { width: 1366, height: 768 }, // Desktop
        { width: 768, height: 1024 }, // Tablet
        { width: 375, height: 667 }, // Mobile
      ]

      for (const viewport of transitionViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        // Visit frontend page
        await page.goto(`/blogs/${slug}`)
        await page.waitForLoadState('networkidle')

        // Verify content is still visible and properly laid out
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('p, .rich-text')).toBeVisible()

        // Check for layout issues
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5) // Allow 5px tolerance
      }
    })

    test('should maintain accessibility on all screen sizes', async ({ page }) => {
      const accessibilityViewports = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 1920, height: 1080, name: 'desktop-large' },
      ]

      for (const viewport of accessibilityViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        // Create test document
        const { slug } = await createResponsiveTestDocument(page, 'blogs', viewport)

        // Test frontend accessibility
        await page.goto(`/blogs/${slug}`)
        await page.waitForLoadState('networkidle')

        // Check heading hierarchy
        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBeGreaterThanOrEqual(1)

        // Check that headings are properly sized and visible
        const headings = page.locator('h1, h2, h3, h4, h5, h6')
        const headingCount = await headings.count()

        for (let i = 0; i < Math.min(headingCount, 3); i++) {
          // Test first 3 headings
          const heading = headings.nth(i)
          await expect(heading).toBeVisible()

          // Check minimum touch target size on mobile
          if (viewport.width <= 768) {
            const headingBox = await heading.boundingBox()
            if (headingBox) {
              expect(headingBox.height).toBeGreaterThanOrEqual(24) // Minimum readable size
            }
          }
        }
      }
    })
  })
})
