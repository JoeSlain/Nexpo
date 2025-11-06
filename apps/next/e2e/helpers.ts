/**
 * Helper utilities for e2e tests
 */

export const SUPPORTED_LOCALES = ['en', 'cs', 'fr'] as const
export const DEFAULT_LOCALE = 'en' as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Translations for each locale
 * These match the translations in packages/app/locales/{locale}/messages.po
 */
export const translations = {
  en: {
    'Demo Features': 'Demo Features',
    'Internationalization (i18n)': 'Internationalization (i18n)',
  },
  cs: {
    'Demo Features': 'Demo funkce',
    'Internationalization (i18n)': 'Mezinárodní lokalizace (i18n)',
  },
  fr: {
    'Demo Features': 'Fonctionnalités de démonstration',
    'Internationalization (i18n)': 'Internationalisation (i18n)',
  },
} as const

/**
 * Get translated text for a given locale
 */
export function t(
  key: keyof typeof translations.en,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  return translations[locale][key] || translations.en[key]
}

/**
 * Get the URL for a given route with locale
 */
export function getLocalizedUrl(path: string, locale: SupportedLocale = DEFAULT_LOCALE): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `/${locale}/${cleanPath}`
}

/**
 * Get the URL for the home page with locale
 */
export function getHomeUrl(locale: SupportedLocale = DEFAULT_LOCALE): string {
  return `/${locale}`
}

/**
 * Get the URL for a user page with locale
 */
export function getUserUrl(userId: string, locale: SupportedLocale = DEFAULT_LOCALE): string {
  return `/${locale}/users/${userId}`
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: any): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Check if element is visible and interactable
 */
export async function isElementVisible(page: any, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector)
    await element.waitFor({ state: 'visible', timeout: 5000 })
    return await element.isVisible()
  } catch {
    return false
  }
}
