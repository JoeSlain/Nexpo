import { i18n } from '@lingui/core'
import * as Localization from 'expo-localization'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

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

export const useLocale = () => useContext(LocaleContext)

// Helper function to get initial locale from device
function getInitialLocale(): LocaleInfo {
  const localizationLocale = Localization.getLocales()[0]

  const localeInfo: LocaleInfo = {
    languageTag: localizationLocale.languageTag,
    languageCode: localizationLocale.languageCode || null,
    regionCode: localizationLocale.regionCode || null,
    currencyCode: localizationLocale.currencyCode || null,
    currencySymbol: localizationLocale.currencySymbol || null,
    decimalSeparator: localizationLocale.decimalSeparator || null,
    digitGroupingSeparator: localizationLocale.digitGroupingSeparator || null,
    textDirection: localizationLocale.textDirection || 'ltr',
    measurementSystem: localizationLocale.measurementSystem || 'metric',
    temperatureUnit: localizationLocale.temperatureUnit || 'celsius',
  }

  // Ensure Lingui's locale is activated with the device locale
  if (localeInfo.languageCode) {
    // Use the language code part for Lingui (e.g., 'en' from 'en-US')
    const linguiLocale = localeInfo.languageCode
    // Only set if the locale is supported (falling back to 'en')
    const supportedLocales = ['en', 'fr']
    const localeToActivate = supportedLocales.includes(linguiLocale)
      ? linguiLocale
      : 'en'

    // If Lingui doesn't have an active locale yet, activate it
    if (!i18n.locale) {
      i18n.activate(localeToActivate)
    }
  }

  return localeInfo
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleInfo>(getInitialLocale)

  // Re-initialize if device locale changes (e.g., user changes system language)
  useEffect(() => {
    const updatedLocale = getInitialLocale()
    setLocaleState(updatedLocale)
  }, [])

  // Wrapper for `setLocale` to update the state based on a string input
  const setLocale = (languageTag: string) => {
    const updatedLocale: LocaleInfo = {
      ...locale,
      languageTag,
      languageCode: languageTag.split('-')[0] || null,
    }
    setLocaleState(updatedLocale)

    // When locale is manually changed, also update Lingui
    const linguiLocale = languageTag.split('-')[0] || 'en'
    const supportedLocales = ['en', 'fr']
    const localeToActivate = supportedLocales.includes(linguiLocale) ? linguiLocale : 'en'

    // Activate the new locale in Lingui
    i18n.activate(localeToActivate)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
