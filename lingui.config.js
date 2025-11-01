import { defineConfig } from '@lingui/cli'

const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = require('./packages/app/config/locales.js')

export default defineConfig({
  sourceLocale: DEFAULT_LOCALE,
  locales: SUPPORTED_LOCALES,
  catalogs: [
    {
      path: '<rootDir>/packages/app/locales/{locale}/messages',
      include: ['packages/app'],
    },
  ],
})
