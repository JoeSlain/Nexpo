# End-to-End (E2E) Tests

This directory contains Playwright end-to-end tests for the Next.js web application.

## Overview

The e2e tests cover:
- **Home Page** (`home.spec.ts`) - Tests for the main landing page across all locales
- **User Page** (`user.spec.ts`) - Tests for user-specific pages
- **API Routes** (`api.spec.ts`) - Tests for API endpoints
- **Navigation** (`navigation.spec.ts`) - Tests for navigation and routing
- **Accessibility** (`accessibility.spec.ts`) - Tests for accessibility features
- **Authentication** (`auth.spec.ts`) - Tests for sign-in and sign-out flows

## Running Tests

### From the Next.js app directory:
```bash
# Run all tests
yarn test:e2e

# Run tests in UI mode (interactive)
yarn test:e2e:ui

# Run tests in headed mode (see browser)
yarn test:e2e:headed

# Debug tests
yarn test:e2e:debug

# View test report
yarn test:e2e:report
```

### From the root directory:
```bash
# Run all e2e tests
yarn test:e2e

# Run tests in UI mode
yarn test:e2e:ui

# Run tests in headed mode
yarn test:e2e:headed
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:
- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_TEST_BASE_URL` env var)
- **Test Directory**: `./e2e`
- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Automatically starts the Next.js dev server before tests

### Environment Variables

For authentication tests, you can configure test credentials:
- `TEST_USER_EMAIL` - Email for test user (default: `test@test.com`)
- `TEST_USER_PASSWORD` - Password for test user (default: `password`)

## Writing Tests

### Test Structure

Tests are organized by feature/page:
- `home.spec.ts` - Home page tests
- `user.spec.ts` - User page tests
- `api.spec.ts` - API endpoint tests
- `navigation.spec.ts` - Navigation and routing tests
- `accessibility.spec.ts` - Accessibility tests
- `auth.spec.ts` - Authentication tests (sign-in/sign-out)

### Helper Utilities

The `helpers.ts` file provides utility functions:
- `getLocalizedUrl(path, locale)` - Get URL for a route with locale
- `getHomeUrl(locale)` - Get home page URL
- `getUserUrl(userId, locale)` - Get user page URL
- `waitForPageLoad(page)` - Wait for page to fully load
- `isElementVisible(page, selector)` - Check if element is visible
- `t(key, locale)` - Get translated text for a given locale

### Locale-Specific Translations

Tests use locale-specific translations from `helpers.ts`:
- English (`en`): "Demo Features", "Internationalization (i18n)"
- Czech (`cs`): "Demo funkce", "Mezinárodní lokalizace (i18n)"
- French (`fr`): "Fonctionnalités de démonstration", "Internationalisation (i18n)"

### Example Test

```typescript
import { test, expect } from '@playwright/test'
import { t, type SupportedLocale } from './helpers'

test('should display demo sections for locale en', async ({ page }) => {
  const locale: SupportedLocale = 'en'
  await page.goto(`/${locale}`)
  
  // Use translated text for the locale
  const demoFeaturesText = t('Demo Features', locale)
  await expect(page.getByText(demoFeaturesText, { exact: false })).toBeVisible()
})
```

## Locale Support

Tests run for all supported locales: `en`, `cs`, `fr`. Tests are automatically parameterized for each locale where applicable and use locale-specific translations.

## CI/CD Integration

The tests are configured to:
- Run in parallel on CI
- Retry failed tests (2 retries on CI)
- Generate HTML reports
- Take screenshots on failure
- Collect traces on retry

## Best Practices

1. **Use test IDs** - Prefer `testID` attributes for stable selectors
2. **Wait for elements** - Always wait for elements before interacting
3. **Test across locales** - Test key features across all supported locales
4. **Use translations** - Use the `t()` helper function for locale-specific text
5. **Keep tests independent** - Each test should be able to run in isolation
6. **Use page object pattern** - For complex pages, consider extracting page objects

## Troubleshooting

### Tests fail with "Cannot connect to server"
- Ensure the dev server is running or Playwright's webServer config will start it automatically
- Check that port 3000 is available

### Tests are flaky
- Increase wait timeouts
- Use `waitForLoadState('networkidle')` for pages with dynamic content
- Check for race conditions in async operations

### Screenshots and videos
- Screenshots are automatically taken on test failure
- Videos can be enabled in `playwright.config.ts` by setting `video: 'on'`

### Translation issues
- Ensure translations match the actual locale files in `packages/app/locales/{locale}/messages.po`
- Update `helpers.ts` translations if new text is added to the app

