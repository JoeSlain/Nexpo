import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme | 'system'
  setTheme: (theme: Theme | 'system') => void
  resolvedTheme: Theme
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<Theme | 'system'>('system')

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    // For React Native, we can use AsyncStorage if available
    // For now, default to system preference
    // You can add AsyncStorage persistence if needed
  }, [])

  const setTheme = (newTheme: Theme | 'system') => {
    setThemeState(newTheme)
    // Persist to AsyncStorage if needed
  }

  const systemTheme: Theme = systemColorScheme === 'dark' ? 'dark' : 'light'
  const resolvedTheme: Theme = theme === 'system' ? systemTheme : theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
