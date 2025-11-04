'use client'

import { createClient, type Session, type User } from '@supabase/supabase-js'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

/**
 * Cross-platform Supabase client utility
 * Detects platform and creates appropriate client
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_*) are set.'
    )
  }

  // Check if we're in Expo/React Native
  // __DEV__ is defined in React Native/Expo environments
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

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider')
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

  // Create a no-op client that throws errors when used if supabase is null
  // This prevents the app from crashing when env vars are missing
  const safeSupabase =
    supabase ||
    ({
      auth: {
        getSession: () =>
          Promise.resolve({
            data: { session: null },
            error: new Error('Supabase client not initialized'),
          }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () =>
          Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
        signUp: () =>
          Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase client not initialized') }),
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
