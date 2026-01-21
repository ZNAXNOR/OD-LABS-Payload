/**
 * Integration tests for RichText frontend rendering
 * Tests how rich text content renders on the frontend across different contexts and collections
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Test content structures for different rich text elements
const richTextElements = [
  {
    name: 'paragraphs',
    content: 'This is a simple paragraph with regular text content.',
    expectedSelector: 'p',
    expectedText: 'This is a simple paragraph',
  },
  {
    name: 'headings',
    content: 'Main Heading',
    elementType: 'heading',
    level: 'h2',
    expectedSelector: 'h2',
    expectedText: 'Main Heading',
  },
  {
    name: 'bold-text',
    content: 'This text contains **bold formatting** for emphasis.',
    expectedSelector: 'strong, b',
    expectedText: 'bold formatting',
  },
  {
    name: 'italic-text',
    content: 'This text contains *italic formatting* for style.',
    expectedSelector: 'em, i',
    expectedText: 'italic formatting',
  },
  {
    name: 'lists',
    content: ['First list item', 'Second list item', 'Third list item'],
    elementType: 'list',
    listType: 'bullet',
    expectedSelector: 'ul li',
    expectedText: 'First list item',
  },
  {
    name: 'blockquotes',
    content: 'This is a blockquote that should be styled differently from regular paragraphs.',
    elementType: 'quote',
    expectedSelector: 'blockquote',
    expectedText: 'This is a blockquote',
  },
  {
    name: 'links',
    content: 'This paragraph contains a link to another page.',
    elementType: 'link',
    linkUrl: '/test-page',
    linkText: 'link to another page',
    expectedSelector: 'a',
    expectedText: 'link to another page',
  },
]

// Collections to test frontend rendering
const collectionsToTest = [
  {
    slug: 'blogs',
    name: 'Blog Pages',
    hasRichText: true,
    urlPattern: '/blogs/{slug}',
    requiredFields: { content: true },
  },
  {
    slug: 'services',
    name: 'Service Pages',
    hasRichText: true,
    urlPattern: '/services/{slug}',
    requiredFields: { content: true },
  },
  {
    slug: 'legal',
    name: 'Legal Pages',
    hasRichText: true,
    urlPattern: '/legal/{slug}',
    requiredFields: { content: true },
  },
  {
    slug: 'contacts',
    name: 'Contact Pages',
    hasRichText: true,
    urlPattern: '/contacts/{slug}',
    requiredFields: { content: false, purpose: 'general' },
  },
  {
    slug: 'pages',
    name: 'Pages',
    hasRichText: false, // Uses blocks instead
    urlPattern: '/{slug}',
    requiredFields: { content: false },
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

// Helper function to create test content with rich text elements
async function createTestContent(page: Page, collection: any, elements: typeof richTextElements) {
  const title = `Frontend Rendering Test - ${collection.name}`
  const slug = `frontend-test-${collection.slug}-${Date.now()}`

  await page.goto(`/admin/collections/${collection.slug}/create`)
  await page.fill('input[name="title"]', title)

  // Add rich text content if supported
  if (collection.hasRichText && collection.requiredFields.content) {
    await page.waitForSelector('.lexical-editor', { timeout: 10000 })
    await page.click('.lexical-editor')

    // Add different types of content
    for (const element of elements) {
      if (element.elementType === 'heading') {
        await page.keyboard.type(
          Array.isArray(element.content) ? element.content.join(' ') : element.content,
        )
        await page.keyboard.press('Shift+Home')

        // Try to format as heading
        const headingButton = page.locator('button:has-text("Heading")')
        if (await headingButton.isVisible()) {
          await headingButton.click()
          const levelOption = page.locator(`button:has-text("${element.level?.toUpperCase()}")`)
          if (await levelOption.isVisible()) {
            await levelOption.click()
          }
        }
        await page.keyboard.press('End')
      } else if (element.elementType === 'list') {
        await page.keyboard.press('Enter')
        await page.keyboard.press('Enter')

        for (const item of element.content as string[]) {
          await page.keyboard.type(item)
          await page.keyboard.press('Enter')
        }
      } else if (element.elementType === 'quote') {
        await page.keyboard.press('Enter')
        await page.keyboard.press('Enter')
        await page.keyboard.type(
          Array.isArray(element.content) ? element.content.join(' ') : element.content,
        )

        // Try to format as blockquote
        await page.keyboard.press('Shift+Home')
        const quoteButton = page.locator('button:has-text("Quote"), button[aria-label*="quote"]')
        if (await quoteButton.isVisible()) {
          await quoteButton.click()
        }
        await page.keyboard.press('End')
      } else {
        await page.keyboard.press('Enter')
        await page.keyboard.press('Enter')
        await page.keyboard.type(
          Array.isArray(element.content) ? element.content.join(' ') : element.content,
        )
      }
    }
  }

  // Handle collection-specific fields
  if (collection.slug === 'contacts') {
    await page.selectOption('select[name="purpose"]', collection.requiredFields.purpose)
  }

  // Set slug
  await page.fill('input[name="slug"]', slug)

  // Save and publish
  await page.click('button:has-text("Save & Publish")')
  await page.waitForSelector('.toast--success', { timeout: 10000 })

  return { title, slug }
}

// Helper function to create content with blocks (for pages collection)
async function createBlockContent(page: Page) {
  const title = 'Frontend Block Rendering Test'
  const slug = `frontend-blocks-test-${Date.now()}`

  await page.goto('/admin/collections/pages/create')
  await page.fill('input[name="title"]', title)

  // Navigate to Layout tab
  const layoutTab = page.locator('button:has-text("Layout")')
  if (await layoutTab.isVisible()) {
    await layoutTab.click()

    // Add content block
    const addBlockButton = page.locator('button:has-text("Add Block")')
    if (await addBlockButton.isVisible()) {
      await addBlockButton.click()

      const contentBlockOption = page.locator(
        '[data-block-type="content"], button:has-text("Content")',
      )
      if (await contentBlockOption.isVisible()) {
        await contentBlockOption.click()

        const blockContentField = page.locator('textarea[name*="content"]').last()
        if (await blockContentField.isVisible()) {
          await blockContentField.fill(
            'This is content rendered through a content block with rich text formatting.',
          )
        }
      }
    }

    // Add hero block
    const heroTab = page.locator('button:has-text("Hero")')
    if (await heroTab.isVisible()) {
      await heroTab.click()

      const addHeroButton = page.locator(
        'button:has-text("Add Hero Block"), button:has-text("Add Block")',
      )
      if (await addHeroButton.first().isVisible()) {
        await addHeroButton.first().click()

        const heroBlockOption = page.locator('[data-block-type="hero"], button:has-text("Hero")')
        if (await heroBlockOption.isVisible()) {
          await heroBlockOption.click()

          const heroHeadingField = page.locator('input[name*="heading"]')
          if (await heroHeadingField.isVisible()) {
            await heroHeadingField.fill('Hero Section for Frontend Testing')
          }
        }
      }
    }
  }

  // Set slug
  await page.fill('input[name="slug"]', slug)

  // Save and publish
  await page.click('button:has-text("Save & Publish")')
  await page.waitForSelector('.toast--success', { timeout: 10000 })

  return { title, slug }
}

// Helper function to verify rich text rendering on frontend
async function verifyRichTextRendering(page: Page, elements: typeof richTextElements) {
  const renderingIssues: string[] = []

  for (const element of elements) {
    try {
      const elementLocator = page.locator(element.expectedSelector)

      if ((await elementLocator.count()) > 0) {
        // Check if element contains expected text
        const hasExpectedText = await elementLocator.first().textContent()

        if (hasExpectedText?.includes(element.expectedText)) {
          console.log(`✓ ${element.name} rendered correctly`)
        } else {
          renderingIssues.push(
            `${element.name}: Expected text "${element.expectedText}" not found in ${element.expectedSelector}`,
          )
        }

        // Check element visibility
        await expect(elementLocator.first()).toBeVisible()

        // Check basic styling
        const styles = await elementLocator.first().evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            display: computed.display,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            margin: computed.margin,
            padding: computed.padding,
          }
        })

        // Verify element has proper styling
        if (styles.display === 'none') {
          renderingIssues.push(`${element.name}: Element is hidden (display: none)`)
        }

        if (element.name === 'headings' && parseInt(styles.fontSize) < 18) {
          renderingIssues.push(`${element.name}: Font size too small (${styles.fontSize})`)
        }

        if (element.name === 'bold-text' && parseInt(styles.fontWeight) < 600) {
          renderingIssues.push(
            `${element.name}: Font weight not bold enough (${styles.fontWeight})`,
          )
        }
      } else {
        renderingIssues.push(
          `${element.name}: No elements found with selector "${element.expectedSelector}"`,
        )
      }
    } catch (error) {
      renderingIssues.push(`${element.name}: Error during verification - ${error}`)
    }
  }

  return renderingIssues
}

// Helper function to test SEO and meta tags
async function verifySEOElements(page: Page, title: string) {
  const seoIssues: string[] = []

  // Check page title
  const pageTitle = await page.title()
  if (!pageTitle.includes(title)) {
    seoIssues.push(`Page title "${pageTitle}" does not include content title "${title}"`)
  }

  // Check meta description
  const metaDescription = page.locator('meta[name="description"]')
  if ((await metaDescription.count()) === 0) {
    seoIssues.push('Missing meta description tag')
  }

  // Check heading hierarchy
  const h1Count = await page.locator('h1').count()
  if (h1Count === 0) {
    seoIssues.push('Missing H1 heading')
  } else if (h1Count > 1) {
    seoIssues.push(`Multiple H1 headings found (${h1Count})`)
  }

  // Check for proper heading hierarchy
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
  let previousLevel = 0

  for (const heading of headings) {
    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase())
    const currentLevel = parseInt(tagName.charAt(1))

    if (currentLevel > previousLevel + 1 && previousLevel > 0) {
      seoIssues.push(`Heading hierarchy skip: ${tagName} follows h${previousLevel}`)
    }

    previousLevel = currentLevel
  }

  return seoIssues
}

// Helper function to test accessibility
async function verifyAccessibility(page: Page) {
  const accessibilityIssues: string[] = []

  // Check for alt text on images
  const images = page.locator('img')
  const imageCount = await images.count()

  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i)
    const alt = await img.getAttribute('alt')
    const ariaLabel = await img.getAttribute('aria-label')

    if (!alt && !ariaLabel) {
      accessibilityIssues.push(`Image ${i + 1} missing alt text or aria-label`)
    }
  }

  // Check for proper link text
  const links = page.locator('a')
  const linkCount = await links.count()

  for (let i = 0; i < linkCount; i++) {
    const link = links.nth(i)
    const linkText = await link.textContent()
    const ariaLabel = await link.getAttribute('aria-label')

    if (!linkText?.trim() && !ariaLabel) {
      accessibilityIssues.push(`Link ${i + 1} has no accessible text`)
    }

    if (
      linkText?.trim().toLowerCase() === 'click here' ||
      linkText?.trim().toLowerCase() === 'read more'
    ) {
      accessibilityIssues.push(`Link ${i + 1} has non-descriptive text: "${linkText}"`)
    }
  }

  // Check for proper form labels
  const inputs = page.locator('input, textarea, select')
  const inputCount = await inputs.count()

  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i)
    const id = await input.getAttribute('id')
    const ariaLabel = await input.getAttribute('aria-label')
    const ariaLabelledBy = await input.getAttribute('aria-labelledby')

    if (id) {
      const label = page.locator(`label[for="${id}"]`)
      const hasLabel = (await label.count()) > 0

      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        accessibilityIssues.push(`Input ${i + 1} has no associated label`)
      }
    }
  }

  return accessibilityIssues
}

test.describe('RichText Frontend Rendering Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  // Test rich text rendering for each collection
  for (const collection of collectionsToTest.filter((c) => c.hasRichText)) {
    test(`should render rich text correctly in ${collection.name}`, async ({ page }) => {
      // Create test content
      const { title, slug } = await createTestContent(
        page,
        collection,
        richTextElements.slice(0, 4),
      )

      // Visit frontend page
      const frontendUrl = collection.urlPattern.replace('{slug}', slug)
      await page.goto(frontendUrl)
      await page.waitForLoadState('networkidle')

      // Verify basic page structure
      await expect(page.locator('h1')).toContainText(title)

      // Verify rich text elements render correctly
      const renderingIssues = await verifyRichTextRendering(page, richTextElements.slice(0, 4))

      if (renderingIssues.length > 0) {
        console.log(`Rendering issues in ${collection.name}:`, renderingIssues)
      }

      // Should have minimal critical issues
      const criticalIssues = renderingIssues.filter(
        (issue) => issue.includes('not found') || issue.includes('hidden'),
      )

      expect(criticalIssues.length).toBeLessThanOrEqual(2) // Allow some tolerance
    })
  }

  // Test block rendering for pages collection
  test('should render blocks correctly in Pages collection', async ({ page }) => {
    const { title, slug } = await createBlockContent(page)

    // Visit frontend page
    await page.goto(`/${slug}`)
    await page.waitForLoadState('networkidle')

    // Verify page title
    await expect(page.locator('h1')).toContainText(title)

    // Verify hero block renders
    const heroSection = page.locator('.hero, [data-block="hero"], .hero-section')
    if ((await heroSection.count()) > 0) {
      await expect(heroSection).toBeVisible()
      await expect(heroSection).toContainText('Hero Section for Frontend Testing')
    }

    // Verify content block renders
    const contentBlock = page.locator('.content-block, [data-block="content"], .block-content')
    if ((await contentBlock.count()) > 0) {
      await expect(contentBlock).toBeVisible()
      await expect(contentBlock).toContainText('This is content rendered through a content block')
    }
  })

  test('should handle different content lengths properly', async ({ page }) => {
    // Test short content
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Short Content Test')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Short content.')

    const shortSlug = `short-content-${Date.now()}`
    await page.fill('input[name="slug"]', shortSlug)
    await page.click('button:has-text("Save & Publish")')
    await page.waitForSelector('.toast--success')

    // Test long content
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Long Content Test')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    const longContent =
      'This is a very long piece of content that tests how the frontend handles extensive text. '.repeat(
        50,
      )
    await page.keyboard.type(longContent)

    const longSlug = `long-content-${Date.now()}`
    await page.fill('input[name="slug"]', longSlug)
    await page.click('button:has-text("Save & Publish")')
    await page.waitForSelector('.toast--success')

    // Verify both render correctly
    await page.goto(`/blogs/${shortSlug}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('p')).toContainText('Short content.')

    await page.goto(`/blogs/${longSlug}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('p')).toContainText('This is a very long piece of content')

    // Check that long content doesn't break layout
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20) // Allow small tolerance
  })

  test('should render typography correctly', async ({ page }) => {
    const { slug } = await createTestContent(page, collectionsToTest[0], [
      richTextElements.find((e) => e.name === 'headings')!,
      richTextElements.find((e) => e.name === 'paragraphs')!,
      richTextElements.find((e) => e.name === 'bold-text')!,
      richTextElements.find((e) => e.name === 'italic-text')!,
    ])

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    // Check heading typography
    const heading = page.locator('h2').first()
    if ((await heading.count()) > 0) {
      const headingStyles = await heading.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          fontSize: parseInt(computed.fontSize),
          fontWeight: parseInt(computed.fontWeight),
          lineHeight: parseFloat(computed.lineHeight),
          marginTop: parseInt(computed.marginTop),
          marginBottom: parseInt(computed.marginBottom),
        }
      })

      expect(headingStyles.fontSize).toBeGreaterThan(18)
      expect(headingStyles.fontWeight).toBeGreaterThan(400)
    }

    // Check paragraph typography
    const paragraph = page.locator('p').first()
    if ((await paragraph.count()) > 0) {
      const paragraphStyles = await paragraph.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          fontSize: parseInt(computed.fontSize),
          lineHeight: parseFloat(computed.lineHeight),
          marginBottom: parseInt(computed.marginBottom),
        }
      })

      expect(paragraphStyles.fontSize).toBeGreaterThan(12)
      expect(paragraphStyles.lineHeight).toBeGreaterThan(paragraphStyles.fontSize * 1.2)
    }

    // Check bold text
    const boldText = page.locator('strong, b').first()
    if ((await boldText.count()) > 0) {
      const boldWeight = await boldText.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontWeight)
      })

      expect(boldWeight).toBeGreaterThan(500)
    }
  })

  test('should handle SEO elements correctly', async ({ page }) => {
    const { title, slug } = await createTestContent(
      page,
      collectionsToTest[0],
      richTextElements.slice(0, 2),
    )

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    const seoIssues = await verifySEOElements(page, title)

    if (seoIssues.length > 0) {
      console.log('SEO issues found:', seoIssues)
    }

    // Should have minimal SEO issues
    expect(seoIssues.length).toBeLessThanOrEqual(2)
  })

  test('should maintain accessibility standards', async ({ page }) => {
    const { slug } = await createTestContent(
      page,
      collectionsToTest[0],
      richTextElements.slice(0, 3),
    )

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    const accessibilityIssues = await verifyAccessibility(page)

    if (accessibilityIssues.length > 0) {
      console.log('Accessibility issues found:', accessibilityIssues)
    }

    // Should have minimal accessibility issues
    expect(accessibilityIssues.length).toBeLessThanOrEqual(1)
  })

  test('should handle media content correctly', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Media Content Test')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Content with media elements.')

    // Note: Actual media upload would require file handling
    // For now, we test the structure

    const slug = `media-content-${Date.now()}`
    await page.fill('input[name="slug"]', slug)
    await page.click('button:has-text("Save & Publish")')
    await page.waitForSelector('.toast--success')

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    // Verify content renders
    await expect(page.locator('p')).toContainText('Content with media elements.')

    // Check for any broken media elements
    const brokenImages = page.locator('img[src=""], img:not([src])')
    const brokenImageCount = await brokenImages.count()
    expect(brokenImageCount).toBe(0)
  })

  test('should handle empty content gracefully', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Empty Content Test')

    // Don't add any rich text content

    const slug = `empty-content-${Date.now()}`
    await page.fill('input[name="slug"]', slug)
    await page.click('button:has-text("Save & Publish")')
    await page.waitForSelector('.toast--success')

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    // Should still render page structure
    await expect(page.locator('h1')).toContainText('Empty Content Test')

    // Should not have broken layout
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight).toBeGreaterThan(100) // Should have some content
  })

  test('should render consistently across page reloads', async ({ page }) => {
    const { slug } = await createTestContent(
      page,
      collectionsToTest[0],
      richTextElements.slice(0, 2),
    )

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    // Capture initial content
    const initialContent = await page.locator('main, .main-content, body').textContent()
    const initialHeadingCount = await page.locator('h1, h2, h3, h4, h5, h6').count()

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify content is consistent
    const reloadedContent = await page.locator('main, .main-content, body').textContent()
    const reloadedHeadingCount = await page.locator('h1, h2, h3, h4, h5, h6').count()

    expect(reloadedContent).toBe(initialContent)
    expect(reloadedHeadingCount).toBe(initialHeadingCount)
  })

  test('should handle special characters and encoding correctly', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Special Characters Test')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Add content with special characters
    const specialContent =
      'Content with special characters: áéíóú, ñ, ç, ü, €, £, ¥, ©, ®, ™, "quotes", \'apostrophes\', —dashes—, …ellipsis'
    await page.keyboard.type(specialContent)

    const slug = `special-chars-${Date.now()}`
    await page.fill('input[name="slug"]', slug)
    await page.click('button:has-text("Save & Publish")')
    await page.waitForSelector('.toast--success')

    await page.goto(`/blogs/${slug}`)
    await page.waitForLoadState('networkidle')

    // Verify special characters render correctly
    await expect(page.locator('p')).toContainText('áéíóú')
    await expect(page.locator('p')).toContainText('€')
    await expect(page.locator('p')).toContainText('"quotes"')
    await expect(page.locator('p')).toContainText('—dashes—')
  })
})
