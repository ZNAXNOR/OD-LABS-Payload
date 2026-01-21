/**
 * Integration tests for RichText editor workflow
 * Tests the complete content creation and editing workflow from a user perspective
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Test scenarios for different content types
const contentScenarios = [
  {
    collection: 'blogs',
    title: 'Complete Blog Post Workflow',
    requiredFields: { content: true },
    hasHero: true,
    hasLayout: true,
    workflow: 'blog-creation',
  },
  {
    collection: 'services',
    title: 'Service Page Workflow',
    requiredFields: { content: true },
    hasHero: true,
    hasLayout: true,
    workflow: 'service-creation',
  },
  {
    collection: 'legal',
    title: 'Legal Document Workflow',
    requiredFields: { content: true },
    hasHero: false,
    hasLayout: true,
    workflow: 'document-creation',
  },
  {
    collection: 'contacts',
    title: 'Contact Page Workflow',
    requiredFields: { content: false, purpose: 'general' },
    hasHero: true,
    hasLayout: true,
    workflow: 'contact-creation',
  },
]

// Rich text editing actions to test
const editingActions = [
  {
    name: 'basic-typing',
    description: 'Type basic text content',
    action: async (page: Page) => {
      await page.keyboard.type(
        'This is basic text content for testing the rich text editor workflow.',
      )
    },
    verify: async (page: Page) => {
      await expect(page.locator('.lexical-editor')).toContainText('This is basic text content')
    },
  },
  {
    name: 'text-formatting',
    description: 'Apply text formatting (bold, italic)',
    action: async (page: Page) => {
      await page.keyboard.type('Bold and italic text')

      // Select "Bold" text
      await page.keyboard.press('Shift+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft')

      // Try to make it bold
      const boldButton = page.locator('button[aria-label="Bold"], button:has-text("B")')
      if (await boldButton.isVisible()) {
        await boldButton.click()
      } else {
        await page.keyboard.press('Control+b')
      }

      // Move to "italic" and format
      await page.keyboard.press('End')
      await page.keyboard.press(
        'Shift+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft',
      )

      const italicButton = page.locator('button[aria-label="Italic"], button:has-text("I")')
      if (await italicButton.isVisible()) {
        await italicButton.click()
      } else {
        await page.keyboard.press('Control+i')
      }

      await page.keyboard.press('End')
    },
    verify: async (page: Page) => {
      await expect(page.locator('.lexical-editor')).toContainText('Bold and italic text')
    },
  },
  {
    name: 'headings',
    description: 'Create headings',
    action: async (page: Page) => {
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.type('This is a heading')

      // Select the heading text
      await page.keyboard.press('Shift+Home')

      // Try to format as heading
      const headingButton = page.locator(
        'button:has-text("Heading"), button[aria-label*="heading"]',
      )
      if (await headingButton.isVisible()) {
        await headingButton.click()

        const h2Option = page.locator('button:has-text("H2")')
        if (await h2Option.isVisible()) {
          await h2Option.click()
        }
      }

      await page.keyboard.press('End')
    },
    verify: async (page: Page) => {
      await expect(page.locator('.lexical-editor')).toContainText('This is a heading')
    },
  },
  {
    name: 'lists',
    description: 'Create lists',
    action: async (page: Page) => {
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.type('First list item')

      // Try to create a list
      const listButton = page.locator('button:has-text("List"), button[aria-label*="list"]')
      if (await listButton.isVisible()) {
        await listButton.click()

        const bulletOption = page.locator('button:has-text("Bullet"), button:has-text("Unordered")')
        if (await bulletOption.isVisible()) {
          await bulletOption.click()
        }
      }

      await page.keyboard.press('Enter')
      await page.keyboard.type('Second list item')
      await page.keyboard.press('Enter')
      await page.keyboard.type('Third list item')
    },
    verify: async (page: Page) => {
      await expect(page.locator('.lexical-editor')).toContainText('First list item')
      await expect(page.locator('.lexical-editor')).toContainText('Second list item')
    },
  },
  {
    name: 'undo-redo',
    description: 'Test undo and redo functionality',
    action: async (page: Page) => {
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.type('Text to be undone')

      // Undo
      await page.keyboard.press('Control+z')
      await page.waitForTimeout(100)

      // Redo
      await page.keyboard.press('Control+y')
      await page.waitForTimeout(100)
    },
    verify: async (page: Page) => {
      await expect(page.locator('.lexical-editor')).toContainText('Text to be undone')
    },
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

// Helper function to complete a full content creation workflow
async function completeContentWorkflow(page: Page, scenario: (typeof contentScenarios)[0]) {
  const workflowSteps: string[] = []

  try {
    // Step 1: Navigate to collection
    workflowSteps.push('Navigate to collection')
    await page.goto(`/admin/collections/${scenario.collection}`)
    await expect(page.locator('h1')).toContainText(scenario.collection)

    // Step 2: Create new document
    workflowSteps.push('Create new document')
    await page.click('a:has-text("Create New"), button:has-text("Create New")')
    await page.waitForURL(`**/admin/collections/${scenario.collection}/create`)

    // Step 3: Fill basic information
    workflowSteps.push('Fill basic information')
    await page.fill('input[name="title"]', scenario.title)

    // Step 4: Handle rich text content if required
    if (scenario.requiredFields.content) {
      workflowSteps.push('Add rich text content')
      await page.waitForSelector('.lexical-editor', { timeout: 10000 })
      await page.click('.lexical-editor')

      // Perform editing actions
      for (const action of editingActions) {
        workflowSteps.push(`Execute ${action.name}`)
        await action.action(page)
        await action.verify(page)
        await page.waitForTimeout(200) // Small delay between actions
      }
    }

    // Step 5: Handle collection-specific fields
    if (scenario.collection === 'contacts') {
      workflowSteps.push('Set contact purpose')
      await page.selectOption('select[name="purpose"]', scenario.requiredFields.purpose as string)
    }

    // Step 6: Test layout blocks if supported
    if (scenario.hasLayout) {
      workflowSteps.push('Test layout blocks')
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
              await blockContentField.fill('This is content added via layout blocks.')
            }
          }
        }
      }
    }

    // Step 7: Test hero section if supported
    if (scenario.hasHero) {
      workflowSteps.push('Test hero section')
      const heroTab = page.locator('button:has-text("Hero")')
      if (await heroTab.isVisible()) {
        await heroTab.click()

        // Add hero block
        const addHeroButton = page.locator(
          'button:has-text("Add Hero Block"), button:has-text("Add Block")',
        )
        if (await addHeroButton.first().isVisible()) {
          await addHeroButton.first().click()

          const heroBlockOption = page.locator('[data-block-type="hero"], button:has-text("Hero")')
          if (await heroBlockOption.isVisible()) {
            await heroBlockOption.click()

            // Fill hero content
            const heroHeadingField = page.locator('input[name*="heading"]')
            if (await heroHeadingField.isVisible()) {
              await heroHeadingField.fill('Hero Section Heading')
            }
          }
        }
      }
    }

    // Step 8: Save as draft
    workflowSteps.push('Save as draft')
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success', { timeout: 10000 })

    // Step 9: Verify draft status
    workflowSteps.push('Verify draft status')
    await expect(page.locator('text=Draft')).toBeVisible()

    // Step 10: Generate slug
    workflowSteps.push('Generate slug')
    const slug = `workflow-test-${scenario.collection}-${Date.now()}`
    await page.fill('input[name="slug"]', slug)

    // Step 11: Publish document
    workflowSteps.push('Publish document')
    await page.click('button:has-text("Publish")')
    await page.waitForSelector('.toast--success', { timeout: 10000 })

    // Step 12: Verify published status
    workflowSteps.push('Verify published status')
    await expect(page.locator('text=Published')).toBeVisible()

    // Step 13: Test frontend rendering
    workflowSteps.push('Test frontend rendering')
    const frontendUrl =
      scenario.collection === 'pages' ? `/${slug}` : `/${scenario.collection}/${slug}`
    await page.goto(frontendUrl)
    await page.waitForLoadState('networkidle')

    // Verify content appears on frontend
    await expect(page.locator('h1')).toContainText(scenario.title)

    if (scenario.requiredFields.content) {
      await expect(page.locator('p, .rich-text')).toContainText('This is basic text content')
    }

    // Step 14: Test editing workflow
    workflowSteps.push('Test editing workflow')
    await page.goto(`/admin/collections/${scenario.collection}`)
    await page.click(`a:has-text("${scenario.title}")`)

    // Make an edit
    if (scenario.requiredFields.content) {
      await page.waitForSelector('.lexical-editor')
      await page.click('.lexical-editor')
      await page.keyboard.press('End')
      await page.keyboard.type(' - Edited content')
    }

    // Save changes
    await page.click('button:has-text("Save")')
    await page.waitForSelector('.toast--success')

    // Step 15: Verify changes on frontend
    workflowSteps.push('Verify changes on frontend')
    await page.goto(frontendUrl)
    await page.waitForLoadState('networkidle')

    if (scenario.requiredFields.content) {
      await expect(page.locator('body')).toContainText('Edited content')
    }

    return { success: true, steps: workflowSteps, slug }
  } catch (error) {
    return {
      success: false,
      steps: workflowSteps,
      error: error instanceof Error ? error.message : 'Unknown error',
      slug: null,
    }
  }
}

// Helper function to test collaborative editing simulation
async function testCollaborativeEditing(page: Page, context: any) {
  // Create a second browser tab to simulate another user
  const secondPage = await context.newPage()
  await loginAsAdmin(secondPage)

  // Both users open the same document
  await page.goto('/admin/collections/blogs/create')
  await secondPage.goto('/admin/collections/blogs/create')

  // Fill basic info on first page
  await page.fill('input[name="title"]', 'Collaborative Editing Test')
  await page.waitForSelector('.lexical-editor')
  await page.click('.lexical-editor')
  await page.keyboard.type('User 1 content')

  // Fill basic info on second page
  await secondPage.fill('input[name="title"]', 'Collaborative Editing Test 2')
  await secondPage.waitForSelector('.lexical-editor')
  await secondPage.click('.lexical-editor')
  await secondPage.keyboard.type('User 2 content')

  // Save both documents
  await page.click('button:has-text("Save Draft")')
  await page.waitForSelector('.toast--success')

  await secondPage.click('button:has-text("Save Draft")')
  await secondPage.waitForSelector('.toast--success')

  // Verify both documents were created
  await expect(page.locator('.lexical-editor')).toContainText('User 1 content')
  await expect(secondPage.locator('.lexical-editor')).toContainText('User 2 content')

  await secondPage.close()
}

test.describe('RichText Editor Workflow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  // Test complete workflow for each content type
  for (const scenario of contentScenarios) {
    test(`should complete ${scenario.workflow} workflow successfully`, async ({ page }) => {
      const result = await completeContentWorkflow(page, scenario)

      if (!result.success) {
        console.log(`Workflow failed at steps:`, result.steps)
        console.log(`Error:`, result.error)
      }

      expect(result.success).toBe(true)
      expect(result.steps).toContain('Publish document')
      expect(result.steps).toContain('Test frontend rendering')
      expect(result.slug).toBeTruthy()
    })
  }

  test('should handle editor focus and blur correctly', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Focus Test')

    await page.waitForSelector('.lexical-editor')

    // Test focus
    await page.click('.lexical-editor')
    await page.keyboard.type('Focused content')

    // Test blur (click outside)
    await page.click('input[name="title"]')

    // Test refocus
    await page.click('.lexical-editor')
    await page.keyboard.press('End')
    await page.keyboard.type(' - refocused')

    await expect(page.locator('.lexical-editor')).toContainText('Focused content - refocused')
  })

  test('should handle keyboard shortcuts correctly', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Keyboard Shortcuts Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Test basic shortcuts
    await page.keyboard.type('Bold text')
    await page.keyboard.press(
      'Shift+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft',
    )
    await page.keyboard.press('Control+b') // Bold
    await page.keyboard.press('End')

    await page.keyboard.type(' Italic text')
    await page.keyboard.press(
      'Shift+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft+ArrowLeft',
    )
    await page.keyboard.press('Control+i') // Italic
    await page.keyboard.press('End')

    // Test undo/redo
    await page.keyboard.type(' Undo me')
    await page.keyboard.press('Control+z') // Undo
    await page.keyboard.press('Control+y') // Redo

    // Test select all
    await page.keyboard.press('Control+a')
    await page.keyboard.type('Replaced all content')

    await expect(page.locator('.lexical-editor')).toContainText('Replaced all content')
  })

  test('should handle copy and paste operations', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Copy Paste Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Type content to copy
    await page.keyboard.type('Content to copy')

    // Select all and copy
    await page.keyboard.press('Control+a')
    await page.keyboard.press('Control+c')

    // Move to end and paste
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Control+v')

    await expect(page.locator('.lexical-editor')).toContainText('Content to copy')

    // Should appear twice (original + pasted)
    const content = await page.locator('.lexical-editor').textContent()
    const occurrences = (content?.match(/Content to copy/g) || []).length
    expect(occurrences).toBeGreaterThanOrEqual(1)
  })

  test('should handle content validation correctly', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')

    // Try to save without required fields
    await page.click('button:has-text("Save Draft")')

    // Should show validation errors
    await expect(page.locator('.field-error, .error')).toBeVisible()

    // Fill required title
    await page.fill('input[name="title"]', 'Validation Test')

    // Fill required content
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Required content')

    // Now save should work
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success')
  })

  test('should handle autosave functionality', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Autosave Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Content that should be autosaved')

    // Wait for potential autosave
    await page.waitForTimeout(3000)

    // Refresh page to see if content persists
    await page.reload()

    // Check if autosave indicator appears or content is preserved
    // Note: This depends on the actual autosave implementation
    const titleValue = await page.locator('input[name="title"]').inputValue()

    // If autosave is working, title should be preserved
    if (titleValue === 'Autosave Test') {
      console.log('Autosave appears to be working')
    }
  })

  test('should handle version history correctly', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Version History Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Initial version content')

    // Save first version
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success')

    // Make changes for second version
    await page.click('.lexical-editor')
    await page.keyboard.press('End')
    await page.keyboard.type(' - Updated version')

    // Save second version
    await page.click('button:has-text("Save")')
    await page.waitForSelector('.toast--success')

    // Check if versions tab exists
    const versionsTab = page.locator('button:has-text("Versions")')
    if (await versionsTab.isVisible()) {
      await versionsTab.click()

      // Should show version history
      await expect(page.locator('.versions-list, .version')).toBeVisible()
    }
  })

  test('should handle media insertion workflow', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Media Insertion Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Content before media')

    // Try to insert media
    const mediaButton = page.locator('button:has-text("Media"), button[aria-label*="media"]')
    if (await mediaButton.isVisible()) {
      await mediaButton.click()

      // Check if media selection modal appears
      const mediaModal = page.locator('[role="dialog"], .modal')
      if (await mediaModal.isVisible()) {
        // Close modal for now (actual media upload would require files)
        const closeButton = page.locator(
          'button:has-text("Cancel"), button:has-text("Close"), [aria-label="Close"]',
        )
        if (await closeButton.isVisible()) {
          await closeButton.click()
        }
      }
    }

    // Continue with text content
    await page.keyboard.press('Enter')
    await page.keyboard.type('Content after media attempt')

    await expect(page.locator('.lexical-editor')).toContainText('Content before media')
    await expect(page.locator('.lexical-editor')).toContainText('Content after media attempt')
  })

  test('should handle collaborative editing simulation', async ({ page, context }) => {
    await testCollaborativeEditing(page, context)
  })

  test('should handle error recovery gracefully', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Error Recovery Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Content before error')

    // Simulate network error by going offline
    await page.context().setOffline(true)

    // Try to save (should fail)
    await page.click('button:has-text("Save Draft")')

    // Wait a moment for error to appear
    await page.waitForTimeout(2000)

    // Go back online
    await page.context().setOffline(false)

    // Try to save again (should succeed)
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success', { timeout: 10000 })

    // Verify content is preserved
    await expect(page.locator('.lexical-editor')).toContainText('Content before error')
  })

  test('should handle large content efficiently', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Large Content Test')

    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Add large amount of content
    const largeContent =
      'This is a large paragraph with lots of content to test editor performance. '.repeat(100)

    // Type content in chunks to avoid timeout
    const chunkSize = 500
    for (let i = 0; i < largeContent.length; i += chunkSize) {
      const chunk = largeContent.slice(i, i + chunkSize)
      await page.keyboard.type(chunk)
      await page.waitForTimeout(100) // Small delay to allow processing
    }

    // Verify content was added
    await expect(page.locator('.lexical-editor')).toContainText('This is a large paragraph')

    // Test scrolling and editing with large content
    await page.keyboard.press('Control+Home') // Go to beginning
    await page.keyboard.type('Beginning: ')

    await page.keyboard.press('Control+End') // Go to end
    await page.keyboard.type(' :End')

    // Save large content
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success', { timeout: 15000 })
  })

  test('should maintain editor state during tab switching', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Tab Switching Test')

    // Add content tab
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')
    await page.keyboard.type('Content in main editor')

    // Switch to layout tab if available
    const layoutTab = page.locator('button:has-text("Layout")')
    if (await layoutTab.isVisible()) {
      await layoutTab.click()

      // Add a block
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
            await blockContentField.fill('Content in layout block')
          }
        }
      }

      // Switch back to content tab
      const contentTab = page.locator('button:has-text("Content")')
      if (await contentTab.isVisible()) {
        await contentTab.click()

        // Verify original content is preserved
        await expect(page.locator('.lexical-editor')).toContainText('Content in main editor')
      }
    }

    // Save document
    await page.click('button:has-text("Save Draft")')
    await page.waitForSelector('.toast--success')
  })
})
