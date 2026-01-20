/**
 * Integration tests for RichText responsive behavior
 * Tests rich text rendering and editor functionality across different screen sizes
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Common viewport sizes for testing
const viewports = [
  { width: 1920, height: 1080, name: 'desktop-large', category: 'desktop' },
  { width: 1366, height: 768, name: 'desktop-standard', category: 'desktop' },
  { width: 1024, height: 768, name: 'tablet-landscape', category: 'tablet' },
  { width: 768, height: 1024, name: 'tablet-portrait', category: 'tablet' },
  { width: 414, height: 896, name: 'mobile-large', category: 'mobile' },
  { width: 375, height: 667, name: 'mobile-standard', category: 'mobile' },
  { width: 320, height: 568, name: 'mobile-small', category: 'mobile' },
]

// Test content with various rich text elements
const testContent = {
  title: 'Responsive Rich Text Test',
  richText: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'This is a responsive rich text test with various elements to ensure proper rendering across all device sizes.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Responsive Heading',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          tag: 'h2',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'First list item with longer text to test wrapping behavior',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'listitem',
          listType: 'bullet',
          value: 1,
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Second list item',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'listitem',
          listType: 'bullet',
          value: 2,
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'This is a blockquote that should adapt to different screen sizes and maintain proper typography scaling.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'quote',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
}

// Helper function to login as admin
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="email"]', 'admin@test.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}

// Helper function to create a test document with rich text content
async function createResponsiveTestDocument(page: Page, collection: string, viewport: any) {
  await page.goto(`/admin/collections/${collection}/create`)

  const title = `${testContent.title} - ${viewport.name}`
  await page.fill('input[name="title"]', title)

  // Add rich text content if the collection supports it
  if (['blogs', 'services', 'legal', 'contacts'].includes(collection)) {
    await page.waitForSelector('.lexical-editor', { timeout: 10000 })
    await page.click('.lexical-editor')

    // Add test content
    const contentText =
      'This is responsive rich text content that should adapt to different screen sizes. It includes various formatting elements to test typography scaling and layout behavior across devices.'
    await page.keyboard.type(contentText)

    // Add a heading
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Responsive Heading')

    // Try to format as heading if toolbar is available
    await page.keyboard.press(
      'Shift+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft',
    )

    const headingButton = page.locator('button:has-text("Heading"), button[aria-label*="heading"]')
    if (await headingButton.isVisible()) {
      await headingButton.click()
      const h2Option = page.locator('button:has-text("H2")')
      if (await h2Option.isVisible()) {
        await h2Option.click()
      }
    }

    // Add more content
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.keyboard.type(
      'Additional paragraph content to test text wrapping and responsive behavior on different screen sizes.',
    )
  }

  // Handle collection-specific fields
  if (collection === 'contacts') {
    await page.selectOption('select[name="purpose"]', 'general')
  }

  // Generate slug
  const slug = `responsive-test-${viewport.name}-${Date.now()}`
  await page.fill('input[name="slug"]', slug)

  // Save and publish
  await page.click('button:has-text("Save & Publish")')
  await page.waitForSelector('.toast--success', { timeout: 10000 })

  return { title, slug }
}

// Helper function to test editor responsiveness
async function testEditorResponsiveness(page: Page, viewport: any) {
  const issues: string[] = []

  // Check if editor is visible and properly sized
  const editor = page.locator('.lexical-editor')
  if (await editor.isVisible()) {
    const editorBox = await editor.boundingBox()

    if (editorBox) {
      // Editor should not overflow viewport
      if (editorBox.width > viewport.width) {
        issues.push(
          `Editor width (${editorBox.width}px) exceeds viewport width (${viewport.width}px)`,
        )
      }

      // Editor should have reasonable minimum width
      const minWidth = viewport.category === 'mobile' ? 280 : 400
      if (editorBox.width < minWidth) {
        issues.push(
          `Editor width (${editorBox.width}px) is too narrow for ${viewport.category} (min: ${minWidth}px)`,
        )
      }

      // Editor should be accessible (not too small)
      if (editorBox.height < 100) {
        issues.push(`Editor height (${editorBox.height}px) is too small`)
      }
    }
  }

  // Check toolbar responsiveness
  const toolbar = page.locator('.lexical-toolbar, .rich-text-toolbar')
  if (await toolbar.isVisible()) {
    const toolbarBox = await toolbar.boundingBox()

    if (toolbarBox && toolbarBox.width > viewport.width) {
      issues.push(
        `Toolbar width (${toolbarBox.width}px) exceeds viewport width (${viewport.width}px)`,
      )
    }
  }

  // Test typing responsiveness
  await page.click('.lexical-editor')
  const testText = 'Responsive typing test'
  await page.keyboard.type(testText)

  // Verify text appears
  const hasText = await page.locator('.lexical-editor').textContent()
  if (!hasText?.includes(testText)) {
    issues.push('Typed text not visible in editor')
  }

  return issues
}

// Helper function to test frontend rendering responsiveness
async function testFrontendResponsiveness(
  page: Page,
  collection: string,
  slug: string,
  viewport: any,
) {
  const issues: string[] = []

  const frontendUrl = collection === 'pages' ? `/${slug}` : `/${collection}/${slug}`
  await page.goto(frontendUrl)
  await page.waitForLoadState('networkidle')

  // Check main content container
  const mainContent = page.locator('main, .main-content, .content')
  if (await mainContent.isVisible()) {
    const contentBox = await mainContent.boundingBox()

    if (contentBox) {
      // Content should not overflow viewport
      if (contentBox.width > viewport.width) {
        issues.push(
          `Content width (${contentBox.width}px) exceeds viewport width (${viewport.width}px)`,
        )
      }

      // Content should have proper margins on larger screens
      if (viewport.category === 'desktop' && contentBox.width === viewport.width) {
        issues.push('Content should have margins on desktop screens')
      }
    }
  }

  // Check rich text content
  const richTextContent = page.locator('.rich-text, .content-block, [data-rich-text]')
  if (await richTextContent.isVisible()) {
    const richTextBox = await richTextContent.boundingBox()

    if (richTextBox && richTextBox.width > viewport.width) {
      issues.push(
        `Rich text content width (${richTextBox.width}px) exceeds viewport width (${viewport.width}px)`,
      )
    }
  }

  // Check typography scaling
  const headings = page.locator('h1, h2, h3, h4, h5, h6')
  const headingCount = await headings.count()

  for (let i = 0; i < headingCount; i++) {
    const heading = headings.nth(i)
    const headingBox = await heading.boundingBox()

    if (headingBox) {
      // Headings should not overflow
      if (headingBox.width > viewport.width) {
        const tagName = await heading.evaluate((el) => el.tagName.toLowerCase())
        issues.push(
          `${tagName} heading width (${headingBox.width}px) exceeds viewport width (${viewport.width}px)`,
        )
      }

      // Check font size is appropriate for viewport
      const fontSize = await heading.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize)
      })

      const expectedMinSize = viewport.category === 'mobile' ? 18 : 24
      const expectedMaxSize = viewport.category === 'mobile' ? 32 : 48

      if (fontSize < expectedMinSize || fontSize > expectedMaxSize) {
        const tagName = await heading.evaluate((el) => el.tagName.toLowerCase())
        issues.push(
          `${tagName} font size (${fontSize}px) not appropriate for ${viewport.category} (expected: ${expectedMinSize}-${expectedMaxSize}px)`,
        )
      }
    }
  }

  // Check paragraph text
  const paragraphs = page.locator('p')
  const paragraphCount = await paragraphs.count()

  if (paragraphCount > 0) {
    const firstParagraph = paragraphs.first()
    const paragraphBox = await firstParagraph.boundingBox()

    if (paragraphBox && paragraphBox.width > viewport.width) {
      issues.push(
        `Paragraph width (${paragraphBox.width}px) exceeds viewport width (${viewport.width}px)`,
      )
    }

    // Check line height and readability
    const lineHeight = await firstParagraph.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).lineHeight)
    })

    const fontSize = await firstParagraph.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize)
    })

    const lineHeightRatio = lineHeight / fontSize
    if (lineHeightRatio < 1.2 || lineHeightRatio > 1.8) {
      issues.push(
        `Line height ratio (${lineHeightRatio.toFixed(2)}) not optimal for readability (expected: 1.2-1.8)`,
      )
    }
  }

  // Check for horizontal scrolling
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  const viewportWidth = viewport.width

  if (bodyWidth > viewportWidth + 5) {
    // Allow 5px tolerance
    issues.push(
      `Page has horizontal scroll: body width (${bodyWidth}px) > viewport width (${viewportWidth}px)`,
    )
  }

  return issues
}

test.describe('RichText Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  // Test editor responsiveness across all viewports
  for (const viewport of viewports) {
    test(`should render editor responsively on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // Test with blogs collection (has rich text)
      await page.goto('/admin/collections/blogs/create')
      await page.fill('input[name="title"]', `Editor Test ${viewport.name}`)

      // Wait for editor to load
      await page.waitForSelector('.lexical-editor', { timeout: 10000 })

      // Test editor responsiveness
      const editorIssues = await testEditorResponsiveness(page, viewport)

      // Report any issues
      if (editorIssues.length > 0) {
        console.log(`Editor issues on ${viewport.name}:`, editorIssues)
      }

      // Verify editor is functional
      await page.click('.lexical-editor')
      await page.keyboard.type('Test content')
      await expect(page.locator('.lexical-editor')).toContainText('Test content')

      // Verify no critical layout issues
      const criticalIssues = editorIssues.filter(
        (issue) => issue.includes('exceeds viewport width') || issue.includes('too small'),
      )

      expect(criticalIssues).toHaveLength(0)
    })
  }

  // Test frontend rendering responsiveness
  for (const viewport of viewports) {
    test(`should render frontend content responsively on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // Create test document
      const { slug } = await createResponsiveTestDocument(page, 'blogs', viewport)

      // Test frontend rendering
      const frontendIssues = await testFrontendResponsiveness(page, 'blogs', slug, viewport)

      // Report any issues
      if (frontendIssues.length > 0) {
        console.log(`Frontend issues on ${viewport.name}:`, frontendIssues)
      }

      // Verify no critical layout issues
      const criticalIssues = frontendIssues.filter(
        (issue) => issue.includes('exceeds viewport width') || issue.includes('horizontal scroll'),
      )

      expect(criticalIssues).toHaveLength(0)
    })
  }

  // Test responsive behavior across different collections
  const collectionsToTest = ['blogs', 'services', 'legal', 'contacts']

  for (const collection of collectionsToTest) {
    test(`should handle ${collection} collection responsively`, async ({ page }) => {
      // Test on mobile and desktop
      const testViewports = [
        viewports.find((v) => v.name === 'mobile-standard')!,
        viewports.find((v) => v.name === 'desktop-standard')!,
      ]

      for (const viewport of testViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        // Create and test document
        const { slug } = await createResponsiveTestDocument(page, collection, viewport)
        const frontendIssues = await testFrontendResponsiveness(page, collection, slug, viewport)

        // Verify no critical issues
        const criticalIssues = frontendIssues.filter((issue) =>
          issue.includes('exceeds viewport width'),
        )

        expect(criticalIssues).toHaveLength(0)
      }
    })
  }

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
      { width: 1920, height: 1080 }, // Large desktop
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

  test('should handle long content responsively', async ({ page }) => {
    const longContentViewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 1366, height: 768, name: 'desktop' },
    ]

    for (const viewport of longContentViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // Create document with long content
      await page.goto('/admin/collections/blogs/create')
      await page.fill('input[name="title"]', `Long Content Test ${viewport.name}`)

      await page.waitForSelector('.lexical-editor')
      await page.click('.lexical-editor')

      // Add very long content
      const longText =
        'This is a very long paragraph that contains a lot of text to test how the rich text editor and frontend rendering handle content that might wrap across multiple lines and potentially cause layout issues on different screen sizes. '.repeat(
          10,
        )

      await page.keyboard.type(longText)

      // Add heading
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.type(
        'Very Long Heading That Might Cause Layout Issues On Smaller Screens And Should Wrap Properly',
      )

      // Save and publish
      const slug = `long-content-${viewport.name}-${Date.now()}`
      await page.fill('input[name="slug"]', slug)
      await page.click('button:has-text("Save & Publish")')
      await page.waitForSelector('.toast--success')

      // Test frontend rendering
      await page.goto(`/blogs/${slug}`)
      await page.waitForLoadState('networkidle')

      // Verify no horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5)

      // Verify content is readable
      const heading = page.locator('h1, h2, h3')
      await expect(heading).toBeVisible()

      const paragraph = page.locator('p').first()
      await expect(paragraph).toBeVisible()

      // Check text doesn't overflow
      const paragraphBox = await paragraph.boundingBox()
      if (paragraphBox) {
        expect(paragraphBox.width).toBeLessThanOrEqual(viewport.width)
      }
    }
  })

  test('should handle rich text blocks responsively', async ({ page }) => {
    // Test with pages collection that supports layout blocks
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile viewport

    await page.goto('/admin/collections/pages/create')
    await page.fill('input[name="title"]', 'Responsive Blocks Test')

    // Navigate to Layout tab
    const layoutTab = page.locator('button:has-text("Layout")')
    if (await layoutTab.isVisible()) {
      await layoutTab.click()

      // Add a content block
      const addBlockButton = page.locator('button:has-text("Add Block")')
      if (await addBlockButton.isVisible()) {
        await addBlockButton.click()

        // Select content block
        const contentBlockOption = page.locator(
          '[data-block-type="content"], button:has-text("Content")',
        )
        if (await contentBlockOption.isVisible()) {
          await contentBlockOption.click()

          // Add content to the block
          const blockContentField = page.locator('textarea[name*="content"]').last()
          if (await blockContentField.isVisible()) {
            await blockContentField.fill(
              'This is responsive block content that should adapt to different screen sizes.',
            )
          }
        }
      }
    }

    // Save and publish
    const slug = `responsive-blocks-${Date.now()}`
    await page.fill('input[name="slug"]', slug)
    await page.click('button:has-text("Save & Publish")')
    await page.waitForSelector('.toast--success')

    // Test on different viewports
    const testViewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1366, height: 768 }, // Desktop
    ]

    for (const viewport of testViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      await page.goto(`/${slug}`)
      await page.waitForLoadState('networkidle')

      // Verify blocks render properly
      const blockContent = page.locator('.content-block, .block, [data-block]')
      if (await blockContent.isVisible()) {
        const blockBox = await blockContent.boundingBox()

        if (blockBox) {
          // Block should not overflow viewport
          expect(blockBox.width).toBeLessThanOrEqual(viewport.width + 5)

          // Block should be visible
          expect(blockBox.height).toBeGreaterThan(0)
        }
      }

      // Check for horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5)
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

      for (let i = 0; i < headingCount; i++) {
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

      // Check paragraph readability
      const paragraphs = page.locator('p')
      const paragraphCount = await paragraphs.count()

      if (paragraphCount > 0) {
        const firstParagraph = paragraphs.first()
        await expect(firstParagraph).toBeVisible()

        // Check font size is readable
        const fontSize = await firstParagraph.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize)
        })

        const minFontSize = viewport.width <= 768 ? 14 : 16
        expect(fontSize).toBeGreaterThanOrEqual(minFontSize)
      }
    }
  })
})
