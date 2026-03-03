import 'server-only'

import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { appRouter } from 'api'
import { cache } from 'react'
import { getQueryClient } from './query-client'

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getServerQueryClient = cache(getQueryClient)

function createTRPCContext() {
  return { user: null }
}

const caller = appRouter.createCaller(createTRPCContext())

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getServerQueryClient
)
