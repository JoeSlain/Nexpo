'use client'

import { SafeArea } from 'app/provider/safe-area'
import { LocaleProvider } from './local/LocaleProvider'
import { NavigationProvider } from './navigation'
import TamaguiProvider from './tamagui'

export function Provider({ children, locale }: { children: React.ReactNode; locale?: string }) {
  return (
    <LocaleProvider initialLocale={locale}>
      <SafeArea>
        <TamaguiProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </TamaguiProvider>
      </SafeArea>
    </LocaleProvider>
  )
}
