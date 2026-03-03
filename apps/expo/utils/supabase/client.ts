import { createClient } from '@supabase/supabase-js'
import { resolveLocalHostUrl } from 'app/utils/resolve-localhost-url'

/** Client-side Supabase client for Expo/React Native. */
export function createExpoClient() {
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

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: undefined, // Use AsyncStorage explicitly if needed
      autoRefreshToken: true,
      persistSession: true,
    },
  })
}

/** Singleton Supabase client for Expo. */
let expoClient: ReturnType<typeof createExpoClient> | undefined

export function getExpoClient() {
  expoClient ??= createExpoClient()
  return expoClient
}
