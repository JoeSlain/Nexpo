import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { initTRPC } from '@trpc/server'
import type { AppRouter } from 'api'

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Record<string, never>>().create()

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Inference helpers for input types
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
