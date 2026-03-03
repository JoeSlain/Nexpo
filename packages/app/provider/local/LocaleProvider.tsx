'use client'

import { setupI18n } from '@lingui/core'
import { I18nProvider, type TransRenderProps } from '@lingui/react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LOCALE, isSupportedLocale } from '../../config/locales.js'

export type LocaleInfo = {
  languageTag: string
  languageCode: string | null
  regionCode: string | null
  currencyCode: string | null
  currencySymbol: string | null
  decimalSeparator: string | null
  digitGroupingSeparator: string | null
  textDirection: 'ltr' | 'rtl' | null
  measurementSystem: 'metric' | 'us' | 'uk' | null
  temperatureUnit: 'celsius' | 'fahrenheit' | null
}

type LocaleContextType = {
  locale: LocaleInfo
  setLocale: (locale: string) => void
}

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur']

function getTextDirection(languageCode: string | null): 'ltr' | 'rtl' {
  return languageCode && RTL_LANGUAGES.includes(languageCode) ? 'rtl' : 'ltr'
}

function getMeasurementSystem(regionCode: string | null): 'metric' | 'us' | 'uk' {
  if (regionCode === 'US') return 'us'
  if (regionCode === 'UK') return 'uk'
  return 'metric'
}

function getTemperatureUnit(regionCode: string | null): 'celsius' | 'fahrenheit' {
  return regionCode === 'US' ? 'fahrenheit' : 'celsius'
}

function parseLanguageTag(tag: string): { languageCode: string | null; regionCode: string | null } {
  const [languageCode, regionCode] = tag.split('-')
  return {
    languageCode: languageCode || null,
    regionCode: regionCode || null,
  }
}

function getFormatterPart(
  formatter: Intl.NumberFormat,
  value: number,
  type: string
): string | null {
  return formatter.formatToParts(value).find((part) => part.type === type)?.value || null
}

function buildLocaleInfo(languageTag: string, formatter?: Intl.NumberFormat): LocaleInfo {
  const { languageCode, regionCode } = parseLanguageTag(languageTag)
  return {
    languageTag,
    languageCode,
    regionCode,
    currencyCode: formatter?.resolvedOptions().currency || null,
    currencySymbol: formatter ? getFormatterPart(formatter, 1, 'currency') : null,
    decimalSeparator: formatter ? getFormatterPart(formatter, 1.1, 'decimal') : '.',
    digitGroupingSeparator: formatter ? getFormatterPart(formatter, 1000, 'group') : ',',
    textDirection: getTextDirection(languageCode),
    measurementSystem: getMeasurementSystem(regionCode),
    temperatureUnit: getTemperatureUnit(regionCode),
  }
}

const DEFAULT_LOCALE_INFO: LocaleInfo = buildLocaleInfo('en')

const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE_INFO,
  setLocale: () => {},
})

export function useLocale(): LocaleContextType {
  return useContext(LocaleContext)
}

function getInitialLocale(): LocaleInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return DEFAULT_LOCALE_INFO
  }
  return buildLocaleInfo(navigator.language, new Intl.NumberFormat(navigator.language))
}

function getLinguiLocale(languageCode: string | null): string {
  if (!languageCode) return DEFAULT_LOCALE
  return isSupportedLocale(languageCode) ? languageCode : DEFAULT_LOCALE
}

function DefaultComponent({ children }: TransRenderProps): JSX.Element {
  return <>{children}</>
}

export const LocaleProvider: FC<{
  children: ReactNode
  initialLocale?: string
}> = ({ children, initialLocale }) => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const [locale, setLocaleState] = useState<LocaleInfo>(() => {
    if (initialLocale) {
      return buildLocaleInfo(initialLocale)
    }
    return DEFAULT_LOCALE_INFO
  })

  useEffect(() => {
    if (initialLocale) {
      const browserLocale = typeof navigator !== 'undefined' ? navigator.language : initialLocale
      setLocaleState(buildLocaleInfo(initialLocale, new Intl.NumberFormat(browserLocale)))
    } else {
      setLocaleState(getInitialLocale())
    }
  }, [initialLocale])

  const linguiLocale = getLinguiLocale(locale.languageCode)

  const linguiInstance = useMemo(() => {
    let messages = {}

    try {
      messages = require(`../../locales/${linguiLocale}/messages`).messages || {}
    } catch {
      console.warn(
        `Messages for locale "${linguiLocale}" not found. Run 'yarn lingui:compile' to compile messages.`
      )
    }

    return setupI18n({
      locale: linguiLocale,
      messages: { [linguiLocale]: messages },
    })
  }, [linguiLocale])

  function setLocale(languageTag: string): void {
    const { languageCode } = parseLanguageTag(languageTag)
    setLocaleState({ ...locale, languageTag, languageCode })

    if (languageCode) {
      const currentLang = (params?.lang as string) || initialLocale?.split('-')[0]

      if (currentLang && isSupportedLocale(currentLang)) {
        router.push(pathname.replace(`/${currentLang}`, `/${languageCode}`))
      } else {
        const newPath = pathname === '/' ? `/${languageCode}` : `/${languageCode}${pathname}`
        router.push(newPath)
      }
    }
  }

  return (
    <I18nProvider i18n={linguiInstance} defaultComponent={DefaultComponent}>
      <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
    </I18nProvider>
  )
}
