import { createClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client for Expo/React Native
 * Use this in React Native components and mobile code
 */
export function createExpoClient() {
  // In Expo, you can use Constants.expoConfig.extra for environment variables
  // or set them via .env file with expo-constants
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_*) are set.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: undefined, // Use AsyncStorage explicitly if needed
      autoRefreshToken: true,
      persistSession: true,
    },
  })
}

/**
 * Get or create a singleton Supabase client for Expo
 */
let expoClient: ReturnType<typeof createExpoClient> | undefined

export function getExpoClient() {
  if (!expoClient) {
    expoClient = createExpoClient()
  }
  return expoClient
}
