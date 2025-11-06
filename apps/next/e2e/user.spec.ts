import { expect, test } from '@playwright/test'

const SUPPORTED_LOCALES = ['en', 'cs', 'fr']

test.describe('User Page', () => {
  for (const locale of SUPPORTED_LOCALES) {
    test(`should load user page for locale ${locale}`, async ({ page }) => {
      const testUserId = 'test-user-123'
      await page.goto(`/${locale}/users/${testUserId}`)

      // Check that the page has loaded
      await expect(page.locator('body')).toBeVisible()

      // Check that user ID is displayed
      await expect(page.getByText(`Hi ${testUserId}`, { exact: false })).toBeVisible()
    })

    test(`should navigate back from user page for locale ${locale}`, async ({ page }) => {
      const testUserId = 'test-user-456'

      // First go to home page
      await page.goto(`/${locale}`)
      const homeUrl = page.url()

      // Navigate to user page
      await page.goto(`/${locale}/users/${testUserId}`)
      await expect(page.getByText(`Hi ${testUserId}`, { exact: false })).toBeVisible()

      // Click the back button
      const backButton = page.getByText(`Hi ${testUserId}`, { exact: false })
      await backButton.click()

      // Should navigate back (check if URL changed or page content changed)
      await page.waitForTimeout(500) // Wait for navigation

      // Verify we're back (either URL changed or we're on a different page)
      const currentUrl = page.url()
      expect(currentUrl).not.toContain(`/users/${testUserId}`)
    })
  }

  test('should handle different user IDs', async ({ page }) => {
    const userIds = ['user-1', 'user-2', 'user-abc-123']

    for (const userId of userIds) {
      await page.goto(`/en/users/${userId}`)
      await expect(page.getByText(`Hi ${userId}`, { exact: false })).toBeVisible()
    }
  })
})
