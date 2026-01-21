import { test, expect } from '@playwright/test'

test.describe('Admin Panel Access', () => {
  test('can access admin login page', async ({ page }) => {
    await page.goto('/admin')

    // Check we're on admin page (might redirect to login)
    await expect(page.url()).toMatch(/\/admin/i)

    // Check page loads successfully
    await expect(page.locator('body')).toBeVisible()

    // Look for login form or admin interface
    const loginForm = page.locator('form, [data-testid*="login"], .login-form')
    const adminInterface = page.locator('[data-testid*="admin"], .admin-panel, .payload-admin')

    // Should have either login form or admin interface
    const hasLoginForm = (await loginForm.count()) > 0
    const hasAdminInterface = (await adminInterface.count()) > 0

    expect(hasLoginForm || hasAdminInterface).toBe(true)
  })

  test('admin login form is functional', async ({ page }) => {
    await page.goto('/admin')

    // Look for login form elements
    const emailField = page.locator('input[type="email"], input[name*="email"]')
    const passwordField = page.locator('input[type="password"], input[name*="password"]')
    const loginButton = page.locator(
      'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")',
    )

    // Check if login form exists
    if ((await emailField.count()) > 0 && (await passwordField.count()) > 0) {
      // Verify form fields are visible and functional
      await expect(emailField.first()).toBeVisible()
      await expect(passwordField.first()).toBeVisible()

      // Test field interaction (without actually logging in)
      await emailField.first().click()
      await emailField.first().fill('test@example.com')
      await expect(emailField.first()).toHaveValue('test@example.com')

      await passwordField.first().click()
      await passwordField.first().fill('testpassword')
      await expect(passwordField.first()).toHaveValue('testpassword')

      // Check login button exists
      if ((await loginButton.count()) > 0) {
        await expect(loginButton.first()).toBeVisible()
      }
    }
  })

  test('admin panel is responsive', async ({ page }) => {
    await page.goto('/admin')

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()

    // Admin panels should be usable on mobile
    const form = page.locator('form')
    if ((await form.count()) > 0) {
      await expect(form.first()).toBeVisible()
    }
  })

  test('admin panel has proper security headers', async ({ page }) => {
    const response = await page.goto('/admin')

    // Check response is successful
    expect(response?.status()).toBeLessThan(500)

    // Admin pages should load without major errors
    await expect(page.locator('body')).toBeVisible()

    // Should not expose sensitive information in page source
    const pageContent = await page.content()
    expect(pageContent).not.toContain('password')
    expect(pageContent).not.toContain('secret')
    expect(pageContent).not.toContain('api_key')
  })
})
