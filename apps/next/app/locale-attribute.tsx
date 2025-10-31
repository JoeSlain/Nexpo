'use client'

import { useEffect } from 'react'
import { useLocale } from 'app/provider/local/LocaleProvider'

export function LocaleAttribute() {
  const { locale } = useLocale()

  useEffect(() => {
    // Update the HTML lang attribute based on the locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale.languageTag
    }
  }, [locale.languageTag])

  return null
}

