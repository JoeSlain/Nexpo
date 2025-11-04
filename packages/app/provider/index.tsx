'use client'

import { SafeArea } from 'app/provider/safe-area'
import { LocaleProvider } from './local/LocaleProvider'
import { NavigationProvider } from './navigation'
import { SupabaseAuthProvider } from './supabase'
import TamaguiProvider from './tamagui'
import { TRPCProvider } from './trpc'

export function Provider({ children, locale }: { children: React.ReactNode; locale?: string }) {
  return (
    <SupabaseAuthProvider>
      <TRPCProvider>
        <LocaleProvider initialLocale={locale}>
          <SafeArea>
            <TamaguiProvider>
              <NavigationProvider>{children}</NavigationProvider>
            </TamaguiProvider>
          </SafeArea>
        </LocaleProvider>
      </TRPCProvider>
    </SupabaseAuthProvider>
  )
}
