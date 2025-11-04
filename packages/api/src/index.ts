import { z } from 'zod'
import { createServerClient } from './supabase'
import { protectedProcedure, publicProcedure, router } from './trpc'

// Example types - replace with your actual types
type User = { id: string; name: string }

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('users').select('id, name')

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    return data as User[]
  }),

  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts
    const supabase = createServerClient()
    const { data, error } = await supabase.from('users').select('id, name').eq('id', input).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return undefined
      }
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return data as User | undefined
  }),

  userCreate: publicProcedure.input(z.object({ name: z.string() })).mutation(async (opts) => {
    const { input } = opts
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('users')
      .insert({ name: input })
      .select('id, name')
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return data as User
  }),

  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(async (opts) => {
      const name = opts.input?.name ?? 'world'
      return { greeting: `Hello ${name}!` }
    }),

  /**
   * Protected procedure to test Supabase authentication
   * Returns the authenticated user's information
   */
  testAuth: protectedProcedure.query(async ({ ctx }) => {
    return {
      authenticated: true,
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        metadata: ctx.user.user_metadata,
      },
      message: 'Authentication successful! You are authenticated.',
    }
  }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter

// Export the router for server-side usage
export { appRouter }

export type { SupabaseClient } from './supabase'
// Export Supabase utilities
export { createServerClient } from './supabase'
