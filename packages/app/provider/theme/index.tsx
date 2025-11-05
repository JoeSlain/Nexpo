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
  // Always start with 'light' to match server render and avoid hydration mismatch
  // Will update to actual system preference after hydration
  const [systemTheme, setSystemTheme] = useState<Theme>(() => {
    // On server, always return 'light'
    if (typeof window === 'undefined') {
      return 'light'
    }
    // On client first render, also return 'light' to match server
    // Will update in useEffect after hydration
    return 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return
    }

    // Update to actual system preference after hydration
    const actualSystemTheme = getSystemTheme()
    setSystemTheme(actualSystemTheme)

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

  // Initialize with 'system' for SSR consistency
  // This ensures both server and client start with the same value
  const [theme, setThemeState] = useState<Theme | 'system'>(() => {
    // Always start with 'system' on first render (both server and client)
    // Will update from localStorage after hydration
    return 'system'
  })

  // Update theme from localStorage after hydration
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = localStorage.getItem('theme') as Theme | 'system' | null
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
      setThemeState(stored)
    }
  }, [])

  const setTheme = (newTheme: Theme | 'system') => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }

  // resolvedTheme will be 'light' initially (matching server), then update after hydration
  const resolvedTheme: Theme = theme === 'system' ? systemTheme : theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
