// Unit tests for tRPC middleware and utilities

import { TRPCError } from '@trpc/server'
import { describe, expect, it } from 'vitest'
import { protectedProcedure, router } from '../trpc'
import { createTestContext } from './helpers'

describe('tRPC Middleware - Unit Tests', () => {
  describe('protectedProcedure', () => {
    it('should throw UNAUTHORIZED error when user is null', async () => {
      const ctx = createTestContext()
      ctx.user = null

      const testRouter = router({
        test: protectedProcedure.query(async () => {
          return { success: true }
        }),
      })

      const caller = testRouter.createCaller(ctx)

      await expect(caller.test()).rejects.toThrow(TRPCError)
    })

    it('should throw UNAUTHORIZED error with correct message', async () => {
      const ctx = createTestContext()
      ctx.user = null

      const testRouter = router({
        test: protectedProcedure.query(async () => {
          return { success: true }
        }),
      })

      const caller = testRouter.createCaller(ctx)

      try {
        await caller.test()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        if (error instanceof TRPCError) {
          expect(error.code).toBe('UNAUTHORIZED')
          expect(error.message).toBe('You must be authenticated to access this resource')
        }
      }
    })

    it('should allow access when user is authenticated', async () => {
      const ctx = createTestContext()
      // ctx.user is already set by createTestContext

      const testRouter = router({
        test: protectedProcedure.query(async ({ ctx }) => {
          return { userId: ctx.user.id }
        }),
      })

      const caller = testRouter.createCaller(ctx)
      const result = await caller.test()

      expect(result).toEqual({ userId: ctx.user.id })
    })

    it('should pass user to next handler when authenticated', async () => {
      const ctx = createTestContext()
      const customUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated' as const,
        created_at: new Date().toISOString(),
      }
      ctx.user = customUser

      const testRouter = router({
        test: protectedProcedure.query(async ({ ctx }) => {
          return { user: ctx.user }
        }),
      })

      const caller = testRouter.createCaller(ctx)
      const result = await caller.test()

      expect(result.user).toBe(customUser)
    })
  })
})
