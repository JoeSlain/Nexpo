import { defineConfig } from '@lingui/cli'

const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = require('../config/locales.js')

export default defineConfig({
  sourceLocale: DEFAULT_LOCALE,
  locales: SUPPORTED_LOCALES,
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['<rootDir>'],
    },
  ],
})
