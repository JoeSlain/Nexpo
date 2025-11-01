'use client'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleSheet } from 'react-native'

export function StylesProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    // @ts-expect-error
    const sheet = StyleSheet.getSheet()
    return <style id={sheet.id}>{sheet.textContent}</style>
  })
  return <>{children}</>
}
