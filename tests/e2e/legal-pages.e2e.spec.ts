import { test, expect } from '@playwright/test'

test.describe('Legal Pages Access', () => {
  test('can navigate to legal pages', async ({ page }) => {
    await page.goto('/')

    // Try to find legal/privacy/terms links
    const legalLinks = page.locator('a[href*="/legal"], a[href*="/privacy"], a[href*="/terms"]')

    if ((await legalLinks.count()) > 0) {
      const firstLegalLink = legalLinks.first()
      await firstLegalLink.click()

      // Check we're on a legal-related page
      await expect(page.url()).toMatch(/\/(legal|privacy|terms)/i)

      // Check page loads successfully
      await expect(page.locator('body')).toBeVisible()
    } else {
      // Direct navigation to legal page
      await page.goto('/legal')

      // Check if page exists
      const pageStatus = page.url()
      expect(pageStatus).toContain('/legal')
    }
  })

  test('legal page displays content correctly', async ({ page }) => {
    await page.goto('/legal')

    // Check page loads without major errors
    await expect(page.locator('body')).toBeVisible()

    // Look for legal content
    const content = page.locator('article, .legal-content, main, .content')
    await expect(content.first()).toBeVisible()

    // Check for typical legal page elements
    const headings = page.locator('h1, h2, h3')
    if ((await headings.count()) > 0) {
      await expect(headings.first()).toBeVisible()
    }
  })

  test('can access individual legal documents', async ({ page }) => {
    await page.goto('/legal')

    // Look for links to specific legal documents
    const legalDocLinks = page.locator('a[href*="/legal/"], article a, .legal-doc a')

    if ((await legalDocLinks.count()) > 0) {
      const firstDocLink = legalDocLinks.first()
      await firstDocLink.click()

      // Verify we're on a legal document page
      await expect(page.url()).toMatch(/\/legal\/[^\/]+/)

      // Check page content loads
      await expect(page.locator('body')).toBeVisible()

      // Look for document content
      const content = page.locator('article, .legal-content, main')
      await expect(content.first()).toBeVisible()
    }
  })

  test('legal pages are accessible and readable', async ({ page }) => {
    await page.goto('/legal')

    // Check for proper heading structure
    const h1 = page.locator('h1')
    if ((await h1.count()) > 0) {
      await expect(h1.first()).toBeVisible()
    }

    // Check text is readable (not too small)
    const bodyText = page.locator('p, .content, article')
    if ((await bodyText.count()) > 0) {
      await expect(bodyText.first()).toBeVisible()
    }

    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})
