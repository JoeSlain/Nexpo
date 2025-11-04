import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createServerClient } from 'api'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      // Extract auth token from Authorization header
      const authHeader = req.headers.get('authorization')
      const accessToken = authHeader?.replace('Bearer ', '')

      let user = null

      if (accessToken) {
        try {
          const supabase = createServerClient(accessToken)
          const {
            data: { user: authUser },
            error,
          } = await supabase.auth.getUser(accessToken)

          if (!error && authUser) {
            user = authUser
          }
        } catch (error) {
          // Invalid token, user will remain null
          console.error('Error verifying auth token:', error)
        }
      }

      return {
        user,
      }
    },
  })

export { handler as GET, handler as POST }
