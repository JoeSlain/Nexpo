'use client'

import { createClient, type Session, type User } from '@supabase/supabase-js'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { resolveLocalHostUrl } from '../../utils/resolve-localhost-url'

/** Cross-platform Supabase client — detects platform and creates the appropriate client. */
function getSupabaseClient() {
  const rawSupabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!rawSupabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_*) are set.'
    )
  }

  const supabaseUrl = resolveLocalHostUrl(rawSupabaseUrl)

  // __DEV__ is only defined in React Native/Expo environments
  const isExpo = typeof __DEV__ !== 'undefined'

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Supabase will auto-detect AsyncStorage in React Native
      // For web, it uses localStorage by default
      autoRefreshToken: true,
      persistSession: true,
      // Only detect session in URL for web (not needed in mobile apps)
      detectSessionInUrl: !isExpo,
    },
  })
}

type SupabaseAuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  supabase: ReturnType<typeof getSupabaseClient>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | null>(null)

export function useAuth(): SupabaseAuthContextType {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useAuth must be used within SupabaseAuthProvider')
  }
  return context
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState<ReturnType<typeof getSupabaseClient> | null>(() => {
    try {
      return getSupabaseClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      // Return null to prevent the app from crashing during SSR or when env vars are missing
      return null
    }
  })

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // No-op client that returns errors when env vars are missing, preventing app crashes
  const notInitializedError = new Error('Supabase client not initialized')
  const safeSupabase =
    supabase ||
    ({
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: notInitializedError }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: notInitializedError }),
        signUp: () => Promise.resolve({ data: null, error: notInitializedError }),
        signOut: () => Promise.resolve({ error: notInitializedError }),
      },
    } as unknown as ReturnType<typeof getSupabaseClient>)

  const value: SupabaseAuthContextType = {
    user,
    session,
    loading,
    supabase: safeSupabase,
  }

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
}
