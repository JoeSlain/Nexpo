// Unit tests for test helper functions
import { describe, expect, it } from 'vitest'
import { createMockUser, createMockUsers, createTestContext, wait } from './helpers'

describe('Test Helpers - Unit Tests', () => {
  describe('createMockUser', () => {
    it('should create a user with default values', () => {
      const user = createMockUser()

      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name', 'Test User')
      expect(user).toHaveProperty('created_at')
      expect(user).toHaveProperty('updated_at')
      expect(typeof user.id).toBe('string')
      expect(user.id.length).toBeGreaterThan(0)
    })

    it('should create a user with valid UUID format', () => {
      const user = createMockUser()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      expect(user.id).toMatch(uuidRegex)
    })

    it('should override default values with provided overrides', () => {
      const customId = 'custom-id-123'
      const customName = 'Custom User Name'
      const user = createMockUser({
        id: customId,
        name: customName,
      })

      expect(user.id).toBe(customId)
      expect(user.name).toBe(customName)
    })

    it('should allow partial overrides', () => {
      const user = createMockUser({ name: 'Only Name Override' })

      expect(user.name).toBe('Only Name Override')
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('created_at')
      expect(user).toHaveProperty('updated_at')
    })

    it('should create unique users on each call', () => {
      const user1 = createMockUser()
      const user2 = createMockUser()

      expect(user1.id).not.toBe(user2.id)
    })

    it('should create valid ISO timestamp strings', () => {
      const user = createMockUser()

      expect(() => new Date(user.created_at!)).not.toThrow()
      expect(() => new Date(user.updated_at!)).not.toThrow()
      expect(new Date(user.created_at!).getTime()).toBeGreaterThan(0)
    })
  })

  describe('createMockUsers', () => {
    it('should create the specified number of users', () => {
      const count = 5
      const users = createMockUsers(count)

      expect(users).toHaveLength(count)
    })

    it('should create zero users when count is 0', () => {
      const users = createMockUsers(0)

      expect(users).toHaveLength(0)
      expect(users).toEqual([])
    })

    it('should create users with sequential names', () => {
      const users = createMockUsers(3)

      expect(users[0].name).toBe('Test User 1')
      expect(users[1].name).toBe('Test User 2')
      expect(users[2].name).toBe('Test User 3')
    })

    it('should create unique users', () => {
      const users = createMockUsers(10)
      const ids = users.map((u) => u.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should create users with all required properties', () => {
      const users = createMockUsers(3)

      users.forEach((user) => {
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('created_at')
        expect(user).toHaveProperty('updated_at')
      })
    })
  })

  describe('createTestContext', () => {
    it('should create context with default user when no user provided', () => {
      const ctx = createTestContext()

      expect(ctx).toHaveProperty('user')
      expect(ctx.user).toBeDefined()
      expect(ctx.user.id).toBeDefined()
      expect(ctx.user.email).toBe('test@example.com')
      expect(ctx.user.aud).toBe('authenticated')
    })

    it('should use provided user when given', () => {
      const customUser = {
        id: 'custom-user-id',
        email: 'custom@example.com',
        user_metadata: { name: 'Custom' },
        app_metadata: {},
        aud: 'authenticated' as const,
        created_at: '2024-01-01T00:00:00Z',
      }

      const ctx = createTestContext(customUser)

      expect(ctx.user).toBe(customUser)
      expect(ctx.user.id).toBe('custom-user-id')
      expect(ctx.user.email).toBe('custom@example.com')
    })

    it('should create context with valid user structure', () => {
      const ctx = createTestContext()

      expect(ctx.user).toHaveProperty('id')
      expect(ctx.user).toHaveProperty('email')
      expect(ctx.user).toHaveProperty('user_metadata')
      expect(ctx.user).toHaveProperty('app_metadata')
      expect(ctx.user).toHaveProperty('aud')
      expect(ctx.user).toHaveProperty('created_at')
    })
  })

  describe('wait', () => {
    it('should wait for the specified time', async () => {
      const start = Date.now()
      await wait(100)
      const end = Date.now()
      const elapsed = end - start

      // Allow some tolerance for test execution time
      expect(elapsed).toBeGreaterThanOrEqual(90)
      expect(elapsed).toBeLessThan(200)
    })

    it('should wait for 0ms without error', async () => {
      const start = Date.now()
      await wait(0)
      const end = Date.now()

      // Should complete almost instantly
      expect(end - start).toBeLessThan(50)
    })

    it('should return a promise', () => {
      const result = wait(10)

      expect(result).toBeInstanceOf(Promise)
    })

    it('should resolve after waiting', async () => {
      let resolved = false
      await wait(50).then(() => {
        resolved = true
      })

      expect(resolved).toBe(true)
    })
  })
})
