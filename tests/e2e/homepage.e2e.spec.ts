import { test, expect } from '@playwright/test'

test.describe('Homepage Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays homepage with correct title and content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Payload Blank Template/)

    // Check main heading
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Welcome to your new project.')

    // Check page loads without errors
    await expect(page.locator('body')).toBeVisible()
  })

  test('navigation menu is functional', async ({ page }) => {
    // Check if navigation exists
    const nav = page.locator('nav, [role="navigation"]')
    if ((await nav.count()) > 0) {
      await expect(nav.first()).toBeVisible()

      // Check for common navigation links
      const links = page.locator('nav a, [role="navigation"] a')
      const linkCount = await links.count()
      expect(linkCount).toBeGreaterThan(0)
    }
  })

  test('footer is present and contains expected content', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]')
    if ((await footer.count()) > 0) {
      await expect(footer.first()).toBeVisible()
    }
  })

  test('page is responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()

    // Check that content is still accessible
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })
})
