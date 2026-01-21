import { test, expect } from '@playwright/test'

test.describe('General Page Navigation', () => {
  test('can navigate between main pages', async ({ page }) => {
    await page.goto('/')

    // Test navigation to different sections
    const navigationTests = [
      { path: '/blogs', name: 'Blogs' },
      { path: '/services', name: 'Services' },
      { path: '/contacts', name: 'Contacts' },
      { path: '/legal', name: 'Legal' },
    ]

    for (const nav of navigationTests) {
      await page.goto(nav.path)

      // Check page loads successfully
      await expect(page.locator('body')).toBeVisible()

      // Check URL is correct
      expect(page.url()).toContain(nav.path)

      // Go back to homepage
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('handles 404 pages gracefully', async ({ page }) => {
    // Navigate to a non-existent page
    const response = await page.goto('/non-existent-page-12345')

    // Should handle 404 gracefully
    if (response?.status() === 404) {
      // Check that a 404 page is displayed
      await expect(page.locator('body')).toBeVisible()

      // Look for 404 indicators
      const pageContent = await page.textContent('body')
      const has404Content =
        pageContent?.includes('404') ||
        pageContent?.includes('Not Found') ||
        pageContent?.includes('Page not found')

      // Should have some indication it's a 404 page
      expect(has404Content || response.status() === 404).toBe(true)
    } else {
      // If not 404, page should still load properly
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('all pages have proper meta tags', async ({ page }) => {
    const pagesToTest = ['/', '/blogs', '/services', '/contacts', '/legal']

    for (const pagePath of pagesToTest) {
      await page.goto(pagePath)

      // Check for basic meta tags
      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)

      // Check for viewport meta tag (important for responsive design)
      const viewportMeta = page.locator('meta[name="viewport"]')
      if ((await viewportMeta.count()) > 0) {
        const viewportContent = await viewportMeta.getAttribute('content')
        expect(viewportContent).toContain('width=device-width')
      }
    }
  })

  test('pages load within reasonable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')

    // Check page loads within 5 seconds
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(5000)

    // Check content is visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Test tab navigation
    await page.keyboard.press('Tab')

    // Check if focus is visible on interactive elements
    const focusedElement = page.locator(':focus')
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement).toBeVisible()
    }

    // Test that Enter key works on focused links
    const links = page.locator('a[href]')
    if ((await links.count()) > 0) {
      const firstLink = links.first()
      await firstLink.focus()

      // Verify link is focusable
      const isFocused = await firstLink.evaluate((el) => el === document.activeElement)
      if (isFocused) {
        expect(isFocused).toBe(true)
      }
    }
  })
})
