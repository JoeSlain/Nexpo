import { config } from 'app/tamagui.config'
import type { ReactNode } from 'react'
import { TamaguiProvider } from 'tamagui'

export default function TamaguiProviderComponent({ children }: { children: ReactNode }) {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>
}
