import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at home page
    await page.goto('/en')
    await expect(page.locator('body')).toBeVisible()

    // Navigate to user page
    await page.goto('/en/users/test-user')
    await expect(page.getByText('Hi test-user', { exact: false })).toBeVisible()

    // Navigate back to home
    await page.goto('/en')
    await expect(page.getByText('NEXPO')).toBeVisible()
  })

  test('should maintain locale in URL', async ({ page }) => {
    const locales = ['en', 'cs', 'fr']

    for (const locale of locales) {
      await page.goto(`/${locale}`)
      expect(page.url()).toContain(`/${locale}`)

      await page.goto(`/${locale}/users/test`)
      expect(page.url()).toContain(`/${locale}`)
    }
  })

  test('should handle locale switching', async ({ page }) => {
    // Start with English
    await page.goto('/en')
    expect(page.url()).toContain('/en')

    // Switch to French
    await page.goto('/fr')
    expect(page.url()).toContain('/fr')
    await expect(page.locator('body')).toBeVisible()

    // Switch to Czech
    await page.goto('/cs')
    expect(page.url()).toContain('/cs')
    await expect(page.locator('body')).toBeVisible()
  })
})
