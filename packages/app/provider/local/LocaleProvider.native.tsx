import { setupI18n } from '@lingui/core'
import { I18nProvider, type TransRenderProps } from '@lingui/react'
import * as Localization from 'expo-localization'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { Text } from 'react-native'
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

const LocaleContext = createContext<LocaleContextType>({
  locale: {
    languageTag: 'en',
    languageCode: 'en',
    regionCode: null,
    currencyCode: null,
    currencySymbol: null,
    decimalSeparator: '.',
    digitGroupingSeparator: ',',
    textDirection: 'ltr',
    measurementSystem: 'metric',
    temperatureUnit: 'celsius',
  },
  setLocale: () => {},
})

export function useLocale(): LocaleContextType {
  return useContext(LocaleContext)
}

function getInitialLocale(): LocaleInfo {
  const deviceLocale = Localization.getLocales()[0]

  return {
    languageTag: deviceLocale.languageTag,
    languageCode: deviceLocale.languageCode || null,
    regionCode: deviceLocale.regionCode || null,
    currencyCode: deviceLocale.currencyCode || null,
    currencySymbol: deviceLocale.currencySymbol || null,
    decimalSeparator: deviceLocale.decimalSeparator || null,
    digitGroupingSeparator: deviceLocale.digitGroupingSeparator || null,
    textDirection: deviceLocale.textDirection || 'ltr',
    measurementSystem: deviceLocale.measurementSystem || 'metric',
    temperatureUnit: deviceLocale.temperatureUnit || 'celsius',
  }
}

function getLinguiLocale(languageCode: string | null): string {
  if (!languageCode) return DEFAULT_LOCALE
  return isSupportedLocale(languageCode) ? languageCode : DEFAULT_LOCALE
}

// Trans macro default component — uses Text for React Native
function DefaultComponent({ children }: TransRenderProps): JSX.Element {
  return <Text>{children}</Text>
}

type LocaleProviderProps = {
  children: ReactNode
}

export function LocaleProvider({ children }: LocaleProviderProps): JSX.Element {
  const [locale, setLocaleState] = useState<LocaleInfo>(getInitialLocale)
  const linguiLocale = getLinguiLocale(locale.languageCode)

  // Static requires for Metro bundler compatibility
  const linguiInstance = useMemo(() => {
    let messages = {}

    try {
      if (linguiLocale === 'cs') {
        messages = require('../../locales/cs/messages').messages || {}
      } else if (linguiLocale === 'fr') {
        messages = require('../../locales/fr/messages').messages || {}
      } else {
        messages = require('../../locales/en/messages').messages || {}
      }
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

  const setLocale = (languageTag: string) => {
    setLocaleState({
      ...locale,
      languageTag,
      languageCode: languageTag.split('-')[0] || null,
    })
  }

  return (
    <I18nProvider i18n={linguiInstance} defaultComponent={DefaultComponent}>
      <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
    </I18nProvider>
  )
}
