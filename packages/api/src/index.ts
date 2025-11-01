import { z } from 'zod'
import { publicProcedure, router } from './trpc'

// Example types - replace with your actual types
type User = { id: string; name: string }

// Mock database - replace with your actual database
const db = {
  user: {
    findMany: async (): Promise<User[]> => {
      return [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
      ]
    },
    findById: async (id: string): Promise<User | undefined> => {
      const users = await db.user.findMany()
      return users.find((u) => u.id === id)
    },
    create: async (data: { name: string }): Promise<User> => {
      const id = String(Date.now())
      return { id, name: data.name }
    },
  },
}

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource
    const users = await db.user.findMany()
    return users
  }),

  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts
    // Retrieve the user with the given ID
    const user = await db.user.findById(input)
    return user
  }),

  userCreate: publicProcedure.input(z.object({ name: z.string() })).mutation(async (opts) => {
    const { input } = opts
    // Create a new user in the database
    const user = await db.user.create(input)
    return user
  }),

  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(async (opts) => {
      const name = opts.input?.name ?? 'world'
      return { greeting: `Hello ${name}!` }
    }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter

// Export the router for server-side usage
export { appRouter }
