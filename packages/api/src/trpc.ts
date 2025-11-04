import type { User } from '@supabase/supabase-js'
import { initTRPC, TRPCError } from '@trpc/server'

/**
 * Context type for tRPC
 */
export interface Context {
  user: User | null
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create()

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Protected procedure that requires authentication
 * Throws UNAUTHORIZED error if user is not authenticated
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be authenticated to access this resource',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // TypeScript will now know user is non-null
    },
  })
})
