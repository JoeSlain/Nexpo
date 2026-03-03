'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'api'
import { useState } from 'react'
import { resolveLocalHostUrl } from '../../utils/resolve-localhost-url'
import { useAuth } from '../supabase'

export const trpc = createTRPCReact<AppRouter>()

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
} as const

let clientQueryClientSingleton: QueryClient | undefined

function getQueryClient(): QueryClient {
  // Server: always make a new query client
  if (typeof window === 'undefined') {
    return new QueryClient(queryClientOptions)
  }
  // Browser/Expo: use singleton pattern
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = new QueryClient(queryClientOptions)
  }
  return clientQueryClientSingleton
}

function getUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side (Next.js)
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    return `${base}/api/trpc`
  }

  // Expo — use env var if set
  if (process.env.EXPO_PUBLIC_API_URL) {
    return resolveLocalHostUrl(process.env.EXPO_PUBLIC_API_URL)
  }

  // Expo dev — default to localhost
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return resolveLocalHostUrl('http://localhost:3000/api/trpc')
  }

  // Next.js browser - use relative URL
  return '/api/trpc'
}

export function TRPCProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const { session, supabase } = useAuth()

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          headers: async () => {
            // Use context session, falling back to a fresh fetch
            const currentSession =
              session ??
              (await supabase.auth
                .getSession()
                .then(({ data }) => data.session)
                .catch(() => null))

            if (!currentSession?.access_token) return {}
            return { authorization: `Bearer ${currentSession.access_token}` }
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
