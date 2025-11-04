'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'api'
import { useState } from 'react'
import { useSupabaseAuth } from '../supabase'

export const trpc = createTRPCReact<AppRouter>()

let clientQueryClientSingleton: QueryClient | undefined

function getQueryClient() {
  // Detect if we're on the server (Next.js SSR)
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
        },
      },
    })
  }
  // Browser/Expo: use singleton pattern to keep the same query client
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
        },
      },
    })
  }
  return clientQueryClientSingleton
}

function getUrl() {
  // Detect platform and build appropriate URL
  if (typeof window === 'undefined') {
    // Server-side (Next.js)
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    return `${base}/api/trpc`
  }

  // Client-side
  // Check if we're in Expo (React Native) - __DEV__ is defined in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // Expo/React Native - use environment variable if set, otherwise fallback to localhost
    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL
    }
    // Development fallback - for physical devices, set EXPO_PUBLIC_API_URL to your machine's IP
    // e.g., 'http://192.168.1.100:3000/api/trpc'
    return 'http://localhost:3000/api/trpc'
  }

  // Check if EXPO_PUBLIC_API_URL is set (production Expo)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }

  // Next.js browser - use relative URL
  return '/api/trpc'
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const { session, supabase } = useSupabaseAuth()

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          headers: async () => {
            const headers: Record<string, string> = {}

            // Get current session - try from context first, then fetch if needed
            let currentSession = session
            if (!currentSession) {
              try {
                const {
                  data: { session: fetchedSession },
                } = await supabase.auth.getSession()
                currentSession = fetchedSession
              } catch (error) {
                // Session fetch failed, continue without auth
                console.error('Failed to get session for tRPC request:', error)
              }
            }

            if (currentSession?.access_token) {
              headers.authorization = `Bearer ${currentSession.access_token}`
            }

            return headers
          },
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
