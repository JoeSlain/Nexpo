/**
 * Centralized locale configuration (single source of truth).
 * Plain JS so it works with CommonJS (lingui config) and ESM/TS imports alike.
 *
 * To add a locale: add its code to SUPPORTED_LOCALES, create
 * packages/app/locales/{locale}/messages.po, then run `yarn lingui:compile`.
 */
const SUPPORTED_LOCALES = ['en', 'cs', 'fr']
const DEFAULT_LOCALE = 'en'

function getLanguageCode(locale) {
  return locale.split('-')[0]
}

function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(getLanguageCode(locale))
}

module.exports = { SUPPORTED_LOCALES, DEFAULT_LOCALE, getLanguageCode, isSupportedLocale }
