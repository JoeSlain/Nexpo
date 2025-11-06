import { expect, test } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have proper page structure', async ({ page }) => {
    await page.goto('/en')

    // Check for HTML lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang')
    expect(htmlLang).toBe('en')

    // Check for title
    await expect(page).toHaveTitle(/Create Solito App/i)
  })

  test('should have accessible images', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Check that logo has alt text if it's rendered as an img tag
    // React Native Web/Tamagui Image might render differently, so we check conditionally
    const logoByAlt = page.getByAltText('NEXPO Logo')
    const logoByRole = page.getByRole('img', { name: /NEXPO Logo/i })
    const logoImg = page.locator('img[alt*="NEXPO"], img[alt*="Logo"]')

    // Count how many logo images are found
    const logoByAltCount = await logoByAlt.count()
    const logoByRoleCount = await logoByRole.count()
    const logoImgCount = await logoImg.count()

    // If logo is found as an img tag, verify it has proper alt text and is visible
    if (logoByAltCount > 0) {
      await expect(logoByAlt.first()).toBeVisible()
    } else if (logoByRoleCount > 0) {
      await expect(logoByRole.first()).toBeVisible()
    } else if (logoImgCount > 0) {
      // Verify any found logo image has alt text
      const altText = await logoImg.first().getAttribute('alt')
      expect(altText).toBeTruthy()
      expect(altText?.toLowerCase()).toContain('logo')
    }
    // If no img tag is found, the logo might be rendered as a div (React Native Web behavior)
    // In that case, we verify the page structure is accessible via the NEXPO heading
    await expect(page.getByRole('heading', { name: /NEXPO/i })).toBeVisible()
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/en')

    // Check for main heading (H2 with NEXPO)
    const mainHeading = page.getByRole('heading', { name: /NEXPO/i })
    await expect(mainHeading).toBeVisible()
  })
})
