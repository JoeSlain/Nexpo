import { useTheme } from 'app/provider/theme'
import { config } from 'app/tamagui.config'
import type { ReactNode } from 'react'
import { TamaguiProvider, Theme } from 'tamagui'

export default function TamaguiProviderComponent({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <TamaguiProvider config={config} defaultTheme={resolvedTheme}>
      <Theme name={resolvedTheme} key={resolvedTheme}>
        {children}
      </Theme>
    </TamaguiProvider>
  )
}
