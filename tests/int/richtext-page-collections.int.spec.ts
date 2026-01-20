/**
 * Integration tests for RichText functionality across all page collections
 * Tests rich text rendering, block embedding, and collection-specific features
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

// Rich text test content with various features
const richTextTestContent = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'This is a test paragraph with ',
            type: 'text',
            version: 1,
          },
          {
            detail: 0,
            format: 1, // Bold
            mode: 'normal',
            style: '',
            text: 'bold text',
            type: 'text',
            version: 1,
          },
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: ' and ',
            type: 'text',
            version: 1,
          },
          {
            detail: 0,
            format: 2, // Italic
            mode: 'normal',
            style: '',
            text: 'italic text',
            type: 'text',
            version: 1,
          },
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '.',
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
            text: 'Test Heading',
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
            text: 'First list item',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'listitem',
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
        value: 2,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
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

// Helper function to create a document in a collection
async function createDocument(page: Page, collection: (typeof testCollections)[0]) {
  await page.goto(`/admin/collections/${collection.slug}/create`)

  // Fill required fields
  await page.fill('input[name="title"]', collection.requiredFields.title)

  // Handle rich text content if the collection has it
  if (collection.hasRichText && collection.requiredFields.content) {
    // Wait for rich text editor to load
    await page.waitForSelector('.lexical-editor', { timeout: 10000 })

    // Click in the editor and add content
    await page.click('.lexical-editor')
    await page.keyboard.type(collection.requiredFields.content)
  }

  // Handle collection-specific fields
  if (collection.slug === 'contacts') {
    await page.selectOption('select[name="purpose"]', collection.requiredFields.purpose)
  }

  // Save as draft first
  await page.click('button:has-text("Save Draft")')
  await page.waitForSelector('.toast--success', { timeout: 10000 })

  return page.url().split('/').pop() // Return document ID
}

// Helper function to test block embedding in rich text
async function testBlockEmbedding(page: Page, collection: (typeof testCollections)[0]) {
  if (!collection.hasRichText) return

  // Navigate to edit page
  await page.goto(`/admin/collections/${collection.slug}`)
  await page.click('tbody tr:first-child td:first-child a')

  // Find rich text editor
  await page.waitForSelector('.lexical-editor')
  await page.click('.lexical-editor')

  // Try to insert a block (if block insertion is available)
  const blockButton = page.locator('button:has-text("Block")')
  if (await blockButton.isVisible()) {
    await blockButton.click()

    // Check if block selection modal appears
    const blockModal = page.locator('[role="dialog"]')
    if (await blockModal.isVisible()) {
      // Select first available block
      const firstBlock = blockModal.locator('button').first()
      if (await firstBlock.isVisible()) {
        await firstBlock.click()

        // Verify block was inserted
        await expect(page.locator('.lexical-editor .block-node')).toBeVisible()
      }
    }
  }
}

test.describe('RichText Page Collections Integration', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  for (const collection of testCollections) {
    test.describe(`${collection.name} Collection`, () => {
      test(`should create and edit ${collection.name.toLowerCase()} with rich text`, async ({
        page,
      }) => {
        // Create new document
        const docId = await createDocument(page, collection)
        expect(docId).toBeTruthy()

        // Verify document was created
        await page.goto(`/admin/collections/${collection.slug}`)
        await expect(page.locator(`text=${collection.requiredFields.title}`)).toBeVisible()
      })

      test(`should render ${collection.name.toLowerCase()} rich text on frontend`, async ({
        page,
      }) => {
        // First create a published document
        await page.goto(`/admin/collections/${collection.slug}/create`)
        await page.fill('input[name="title"]', `Published ${collection.name}`)

        if (collection.hasRichText && collection.requiredFields.content) {
          await page.waitForSelector('.lexical-editor')
          await page.click('.lexical-editor')
          await page.keyboard.type('This is published content with rich text formatting.')
        }

        // Handle collection-specific fields
        if (collection.slug === 'contacts') {
          await page.selectOption('select[name="purpose"]', 'general')
        }

        // Generate slug
        const slug = `published-${collection.slug}-${Date.now()}`
        await page.fill('input[name="slug"]', slug)

        // Publish the document
        await page.click('button:has-text("Save & Publish")')
        await page.waitForSelector('.toast--success')

        // Visit frontend page
        const frontendUrl = collection.slug === 'pages' ? `/${slug}` : `/${collection.slug}/${slug}`
        await page.goto(frontendUrl)

        // Verify content is rendered
        await expect(page.locator(`h1:has-text("Published ${collection.name}")`)).toBeVisible()

        if (collection.hasRichText) {
          await expect(page.locator('text=This is published content')).toBeVisible()
        }
      })

      if (collection.hasRichText) {
        test(`should support rich text features in ${collection.name.toLowerCase()}`, async ({
          page,
        }) => {
          await page.goto(`/admin/collections/${collection.slug}/create`)
          await page.fill('input[name="title"]', `Rich Text Test ${collection.name}`)

          // Wait for rich text editor
          await page.waitForSelector('.lexical-editor')
          await page.click('.lexical-editor')

          // Test basic formatting
          await page.keyboard.type('Bold text')
          await page.keyboard.press(
            'Shift+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft',
          )

          // Try to make text bold (if toolbar is available)
          const boldButton = page.locator('button[aria-label="Bold"]')
          if (await boldButton.isVisible()) {
            await boldButton.click()
          }

          // Add new line and test heading
          await page.keyboard.press('End')
          await page.keyboard.press('Enter')
          await page.keyboard.type('This is a heading')

          // Try to make it a heading
          const headingButton = page.locator('button:has-text("Heading")')
          if (await headingButton.isVisible()) {
            await headingButton.click()
            const h2Option = page.locator('button:has-text("H2")')
            if (await h2Option.isVisible()) {
              await h2Option.click()
            }
          }

          // Save document
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success')

          // Verify rich text content was saved
          await page.reload()
          await page.waitForSelector('.lexical-editor')
          await expect(page.locator('.lexical-editor')).toContainText('Bold text')
          await expect(page.locator('.lexical-editor')).toContainText('This is a heading')
        })

        test(`should handle block embedding in ${collection.name.toLowerCase()} rich text`, async ({
          page,
        }) => {
          await testBlockEmbedding(page, collection)
        })
      }

      if (collection.hasLayout) {
        test(`should support layout blocks in ${collection.name.toLowerCase()}`, async ({
          page,
        }) => {
          await page.goto(`/admin/collections/${collection.slug}/create`)
          await page.fill('input[name="title"]', `Layout Test ${collection.name}`)

          // Handle required content field
          if (collection.hasRichText && collection.requiredFields.content) {
            await page.waitForSelector('.lexical-editor')
            await page.click('.lexical-editor')
            await page.keyboard.type('Required content')
          }

          // Handle collection-specific fields
          if (collection.slug === 'contacts') {
            await page.selectOption('select[name="purpose"]', 'general')
          }

          // Navigate to Layout tab
          const layoutTab = page.locator('button:has-text("Layout")')
          if (await layoutTab.isVisible()) {
            await layoutTab.click()

            // Try to add a layout block
            const addBlockButton = page.locator('button:has-text("Add Block")')
            if (await addBlockButton.isVisible()) {
              await addBlockButton.click()

              // Select first available block
              const blockOptions = page.locator('[data-block-type]')
              if (await blockOptions.first().isVisible()) {
                await blockOptions.first().click()

                // Verify block was added
                await expect(page.locator('.blocks-field .block')).toBeVisible()
              }
            }
          }

          // Save document
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success')
        })
      }

      if (collection.hasHero) {
        test(`should support hero blocks in ${collection.name.toLowerCase()}`, async ({ page }) => {
          await page.goto(`/admin/collections/${collection.slug}/create`)
          await page.fill('input[name="title"]', `Hero Test ${collection.name}`)

          // Handle required content field
          if (collection.hasRichText && collection.requiredFields.content) {
            await page.waitForSelector('.lexical-editor')
            await page.click('.lexical-editor')
            await page.keyboard.type('Required content')
          }

          // Handle collection-specific fields
          if (collection.slug === 'contacts') {
            await page.selectOption('select[name="purpose"]', 'general')
          }

          // Navigate to Hero tab (for blogs, services, contacts) or Hero section (for pages)
          const heroTab = page.locator('button:has-text("Hero")')
          if (await heroTab.isVisible()) {
            await heroTab.click()
          }

          // Try to add a hero block
          const addHeroButton = page.locator(
            'button:has-text("Add Hero Block"), button:has-text("Add Block")',
          )
          if (await addHeroButton.first().isVisible()) {
            await addHeroButton.first().click()

            // Select hero block type
            const heroBlockOption = page.locator('[data-block-type="hero"]')
            if (await heroBlockOption.isVisible()) {
              await heroBlockOption.click()

              // Fill hero content
              const heroTitleField = page.locator('input[name*="heading"]')
              if (await heroTitleField.isVisible()) {
                await heroTitleField.fill('Test Hero Heading')
              }

              // Verify hero block was added
              await expect(
                page.locator('.blocks-field .block[data-block-type="hero"]'),
              ).toBeVisible()
            }
          }

          // Save document
          await page.click('button:has-text("Save Draft")')
          await page.waitForSelector('.toast--success')
        })
      }

      test(`should validate required fields in ${collection.name.toLowerCase()}`, async ({
        page,
      }) => {
        await page.goto(`/admin/collections/${collection.slug}/create`)

        // Try to save without required fields
        await page.click('button:has-text("Save Draft")')

        // Should show validation errors
        await expect(page.locator('.field-error, .error')).toBeVisible()

        // Fill required fields and save should succeed
        await page.fill('input[name="title"]', collection.requiredFields.title)

        if (collection.hasRichText && collection.requiredFields.content) {
          await page.waitForSelector('.lexical-editor')
          await page.click('.lexical-editor')
          await page.keyboard.type(collection.requiredFields.content)
        }

        if (collection.slug === 'contacts') {
          await page.selectOption('select[name="purpose"]', collection.requiredFields.purpose)
        }

        await page.click('button:has-text("Save Draft")')
        await page.waitForSelector('.toast--success')
      })

      test(`should handle slug generation for ${collection.name.toLowerCase()}`, async ({
        page,
      }) => {
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

        // Trigger slug generation by clicking elsewhere or saving
        await page.click('body')
        await page.waitForTimeout(500) // Wait for slug generation

        // Check if slug was auto-generated
        const slugField = page.locator('input[name="slug"]')
        const slugValue = await slugField.inputValue()

        expect(slugValue).toBeTruthy()
        expect(slugValue).toMatch(/^[a-z0-9-]+$/) // Should be URL-friendly

        // Save document
        await page.click('button:has-text("Save Draft")')
        await page.waitForSelector('.toast--success')
      })
    })
  }

  test('should handle cross-collection relationships', async ({ page }) => {
    // Create a user first (for author relationships)
    await page.goto('/admin/collections/users/create')
    await page.fill('input[name="email"]', 'test-author@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success')

    // Test author relationship in blogs
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Test Blog with Author')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Blog content')

    // Set author relationship
    const authorField = page.locator('input[name="author"]')
    if (await authorField.isVisible()) {
      await authorField.click()
      await page.waitForSelector('.relationship-field__options')
      await page.click('.relationship-field__options li:first-child')
    }

    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success')

    // Verify relationship was saved
    await page.reload()
    await expect(page.locator('input[name="author"]')).toHaveValue(/test-author@example.com/)
  })

  test('should handle versioning and drafts across collections', async ({ page }) => {
    for (const collection of testCollections.slice(0, 2)) {
      // Test first 2 collections
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

      // Make changes and save as new version
      if (collection.hasRichText) {
        await page.waitForSelector('.lexical-editor')
        await page.click('.lexical-editor')
        await page.keyboard.press('End')
        await page.keyboard.type(' - Updated content')
      }

      await page.click('button:has-text("Save")')
      await page.waitForSelector('.toast--success')

      // Check versions tab
      const versionsTab = page.locator('button:has-text("Versions")')
      if (await versionsTab.isVisible()) {
        await versionsTab.click()
        await expect(page.locator('.versions-list .version')).toHaveCount(2)
      }
    }
  })
})
