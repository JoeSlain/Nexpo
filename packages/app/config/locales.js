/**
 * Centralized locale configuration
 *
 * This is the single source of truth for all locale configuration.
 * It's a JavaScript file (not TypeScript) so it works with:
 * - Lingui config files (CommonJS require)
 * - Next.js (supports .js imports)
 * - React Native/Metro bundler
 * - TypeScript code (can import from .js files)
 *
 * To add a new locale:
 * 1. Add the locale code (e.g., 'de', 'es', 'ja') to the SUPPORTED_LOCALES array below
 * 2. The locale will automatically be included in:
 *    - Lingui configuration files
 *    - Next.js middleware
 *    - LocaleProvider components (web & native)
 *    - Next.js static params generation
 * 3. Create translation files in packages/app/locales/{locale}/messages.po
 * 4. Run `yarn lingui:compile` to compile translations
 *
 * Supported locales are used across:
 * - lingui.config.js (root and packages/app)
 * - apps/next/middleware.ts
 * - packages/app/provider/local/LocaleProvider.tsx
 * - packages/app/provider/local/LocaleProvider.native.tsx
 * - apps/next/app/[lang]/layout.tsx (generateStaticParams)
 */
module.exports = {
  SUPPORTED_LOCALES: ['en', 'cs', 'fr'],
  DEFAULT_LOCALE: 'en',
  getLanguageCode: (locale) => locale.split('-')[0],
  isSupportedLocale: (locale) => {
    const languageCode = module.exports.getLanguageCode(locale)
    return module.exports.SUPPORTED_LOCALES.includes(languageCode)
  },
}
