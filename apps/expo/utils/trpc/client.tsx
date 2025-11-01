import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'api'
import { useState } from 'react'

export const trpc = createTRPCReact<AppRouter>()

let queryClientSingleton: QueryClient

function getQueryClient() {
  if (!queryClientSingleton) {
    queryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
        },
      },
    })
  }
  return queryClientSingleton
}

function getUrl() {
  // Use environment variable if set, otherwise fallback to defaults
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }

  // In development, you might want to use your local machine's IP
  // For production, set EXPO_PUBLIC_API_URL environment variable
  if (__DEV__) {
    // You can use Constants.expoConfig?.hostUri or a hardcoded local IP
    // For now, using localhost - in a real app, you'd want to detect the network IP
    // NOTE: When testing on a physical device, replace localhost with your machine's IP
    // e.g., 'http://192.168.1.100:3000/api/trpc'
    return 'http://localhost:3000/api/trpc'
  }

  // Production fallback - should be set via EXPO_PUBLIC_API_URL
  throw new Error(
    'EXPO_PUBLIC_API_URL environment variable is required in production. ' +
      'Please set it in your .env file or EAS environment variables.'
  )
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
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
