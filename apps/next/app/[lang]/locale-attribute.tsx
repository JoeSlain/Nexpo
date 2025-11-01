'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export function LocaleAttribute() {
  const params = useParams()
  const lang = params?.lang as string

  useEffect(() => {
    // Update the HTML lang attribute based on the locale
    if (typeof document !== 'undefined' && lang) {
      document.documentElement.lang = lang
    }
  }, [lang])

  return null
}
