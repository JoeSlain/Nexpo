import type { Context } from '../trpc'
import { appRouter } from '../index'
import { describe, expect, it } from 'vitest'

describe('API Integration Tests', () => {
  describe('Unauthenticated requests', () => {
    it('should allow public hello query', async () => {
      const ctx: Context = { user: null }
      const caller = appRouter.createCaller(ctx)
      const result = await caller.hello({ name: 'World' })

      expect(result).toEqual({ greeting: 'Hello World!' })
    })

    it('should allow hello query without name', async () => {
      const ctx: Context = { user: null }
      const caller = appRouter.createCaller(ctx)
      const result = await caller.hello({})

      expect(result).toEqual({ greeting: 'Hello world!' })
    })

    it('should reject protected queries without auth', async () => {
      const ctx: Context = { user: null }
      const caller = appRouter.createCaller(ctx)

      await expect(caller.testAuth()).rejects.toThrow('You must be authenticated to access this resource')
    })
  })

  describe('Authenticated requests', () => {
    it('should allow protected queries with valid auth', async () => {
      const ctx: Context = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
      }
      const caller = appRouter.createCaller(ctx)

      const result = await caller.testAuth()

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('message')
      expect(result.user).toHaveProperty('id')
      expect(result.user).toHaveProperty('email')
    })

    it('should return user information in protected route', async () => {
      const ctx: Context = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
      }
      const caller = appRouter.createCaller(ctx)

      const result = await caller.testAuth()

      expect(result.user.id).toBe('test-user-id')
      expect(result.user.email).toBe('test@example.com')
    })
  })

  describe('End-to-end flow', () => {
    it('should handle complete auth flow', async () => {
      // 1. Public query works
      const publicCtx: Context = { user: null }
      const publicCaller = appRouter.createCaller(publicCtx)
      const publicResult = await publicCaller.hello({ name: 'Test' })
      expect(publicResult.greeting).toContain('Test')

      // 2. Protected query fails without auth
      await expect(publicCaller.testAuth()).rejects.toThrow()

      // 3. Protected query succeeds with auth
      const authCtx: Context = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
      }
      const authCaller = appRouter.createCaller(authCtx)
      const authResult = await authCaller.testAuth()
      expect(authResult.user).toBeDefined()
    })
  })

  describe('Error handling', () => {
    it('should handle invalid input gracefully', async () => {
      const ctx: Context = { user: null }
      const caller = appRouter.createCaller(ctx)

      // Test with invalid input type
      await expect(
        // @ts-expect-error Testing invalid input
        caller.hello({ name: 123 })
      ).rejects.toThrow()
    })

    it('should provide meaningful error messages', async () => {
      const ctx: Context = { user: null }
      const caller = appRouter.createCaller(ctx)

      try {
        await caller.testAuth()
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toBeTruthy()
        expect(error.code).toBeDefined()
      }
    })
  })
})
