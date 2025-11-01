'use client'

import { createClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client for Next.js
 * Use this in client components and browser code
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Get or create a singleton Supabase client for the browser
 */
let browserClient: ReturnType<typeof createBrowserClient> | undefined

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}
