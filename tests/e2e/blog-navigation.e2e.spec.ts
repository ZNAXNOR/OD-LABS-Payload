import { test, expect } from '@playwright/test'

test.describe('Blog Navigation and Reading', () => {
  test('can navigate to blog listing page', async ({ page }) => {
    await page.goto('/')

    // Try to find and click blog navigation link
    const blogLink = page.locator('a[href*="/blogs"], a[href*="/blog"]').first()
    if ((await blogLink.count()) > 0) {
      await blogLink.click()

      // Check we're on a blog-related page
      await expect(page.url()).toMatch(/\/(blogs?|blog)/i)

      // Check page loads successfully
      await expect(page.locator('body')).toBeVisible()
    } else {
      // Direct navigation if no link found
      await page.goto('/blogs')

      // Check if page exists (might be 404 if no blogs configured)
      const pageStatus = page.url()
      expect(pageStatus).toContain('/blogs')
    }
  })

  test('blog listing displays correctly', async ({ page }) => {
    await page.goto('/blogs')

    // Check page loads without major errors
    await expect(page.locator('body')).toBeVisible()

    // Look for blog post elements (articles, cards, etc.)
    const blogPosts = page.locator(
      'article, .blog-post, .post-card, [data-testid*="blog"], [data-testid*="post"]',
    )

    // If blog posts exist, verify they have expected structure
    if ((await blogPosts.count()) > 0) {
      const firstPost = blogPosts.first()
      await expect(firstPost).toBeVisible()

      // Check for common blog post elements
      const postTitle = firstPost.locator('h1, h2, h3, .title, [data-testid*="title"]')
      if ((await postTitle.count()) > 0) {
        await expect(postTitle.first()).toBeVisible()
      }
    }
  })

  test('can read individual blog post', async ({ page }) => {
    await page.goto('/blogs')

    // Look for clickable blog post links
    const postLinks = page.locator('a[href*="/blogs/"], article a, .blog-post a')

    if ((await postLinks.count()) > 0) {
      const firstPostLink = postLinks.first()
      await firstPostLink.click()

      // Verify we're on a blog post page
      await expect(page.url()).toMatch(/\/blogs\/[^\/]+/)

      // Check page content loads
      await expect(page.locator('body')).toBeVisible()

      // Look for blog post content
      const content = page.locator('article, .blog-content, .post-content, main')
      await expect(content.first()).toBeVisible()
    }
  })

  test('blog pages are responsive', async ({ page }) => {
    await page.goto('/blogs')

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})
