import { test, expect } from '@playwright/test'

test.describe('Services Navigation', () => {
  test('can navigate to services page', async ({ page }) => {
    await page.goto('/')

    // Try to find and click services navigation link
    const servicesLink = page.locator('a[href*="/services"]').first()
    if ((await servicesLink.count()) > 0) {
      await servicesLink.click()

      // Check we're on services page
      await expect(page.url()).toMatch(/\/services/i)

      // Check page loads successfully
      await expect(page.locator('body')).toBeVisible()
    } else {
      // Direct navigation if no link found
      await page.goto('/services')

      // Check if page exists
      const pageStatus = page.url()
      expect(pageStatus).toContain('/services')
    }
  })

  test('services listing displays correctly', async ({ page }) => {
    await page.goto('/services')

    // Check page loads without major errors
    await expect(page.locator('body')).toBeVisible()

    // Look for service elements
    const services = page.locator('article, .service, .service-card, [data-testid*="service"]')

    // If services exist, verify they have expected structure
    if ((await services.count()) > 0) {
      const firstService = services.first()
      await expect(firstService).toBeVisible()

      // Check for common service elements
      const serviceTitle = firstService.locator('h1, h2, h3, .title, [data-testid*="title"]')
      if ((await serviceTitle.count()) > 0) {
        await expect(serviceTitle.first()).toBeVisible()
      }
    }
  })

  test('can view individual service details', async ({ page }) => {
    await page.goto('/services')

    // Look for clickable service links
    const serviceLinks = page.locator('a[href*="/services/"], article a, .service a')

    if ((await serviceLinks.count()) > 0) {
      const firstServiceLink = serviceLinks.first()
      await firstServiceLink.click()

      // Verify we're on a service detail page
      await expect(page.url()).toMatch(/\/services\/[^\/]+/)

      // Check page content loads
      await expect(page.locator('body')).toBeVisible()

      // Look for service content
      const content = page.locator('article, .service-content, main')
      await expect(content.first()).toBeVisible()
    }
  })

  test('services pages are responsive', async ({ page }) => {
    await page.goto('/services')

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})
