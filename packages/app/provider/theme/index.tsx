import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

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

// Detect system preference
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  // Check for React Native environment
  if (
    typeof navigator !== 'undefined' &&
    'product' in navigator &&
    navigator.product === 'ReactNative'
  ) {
    // For React Native, we'll need to check appearance - fallback to light for now
    // This will be handled by the native implementation
    return 'light'
  }

  // Web: use matchMedia
  if (typeof window.matchMedia !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

// Hook to listen to system theme changes (web only)
function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    // Fallback for older browsers
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return systemTheme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSystemTheme()

  // Initialize with system theme for SSR consistency
  // Then update from localStorage after hydration
  const [theme, setThemeState] = useState<Theme | 'system'>(() => {
    // For SSR, always start with 'system' to avoid hydration mismatch
    if (typeof window === 'undefined') {
      return 'system'
    }
    // On client, try to load from localStorage
    const stored = localStorage.getItem('theme') as Theme | 'system' | null
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
      return stored
    }
    return 'system'
  })

  const setTheme = (newTheme: Theme | 'system') => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }

  const resolvedTheme: Theme = theme === 'system' ? systemTheme : theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
