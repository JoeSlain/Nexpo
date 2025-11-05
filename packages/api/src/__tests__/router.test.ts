// Tests for tRPC router procedures
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { appRouter } from '../index'
import * as supabaseModule from '../supabase'
import { createMockUser, createTestContext } from './helpers'

// Mock the Supabase client
vi.mock('../supabase', () => {
  return {
    createServerClient: vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
          then: vi.fn((callback) => {
            callback({ data: [], error: null })
          }),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  }
})

describe('tRPC Router', () => {
  const ctx = createTestContext()
  const caller = appRouter.createCaller(ctx)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hello', () => {
    it('should return greeting with default name', async () => {
      const result = await caller.hello()
      expect(result).toEqual({ greeting: 'Hello world!' })
    })

    it('should return greeting with custom name', async () => {
      const result = await caller.hello({ name: 'Test' })
      expect(result).toEqual({ greeting: 'Hello Test!' })
    })
  })

  describe('userList', () => {
    it('should return list of users', async () => {
      const mockUsers = [createMockUser(), createMockUser({ name: 'User 2' })]

      // Mock the Supabase response
      const mockSelect = vi.fn(() => ({
        then: vi.fn((callback) => {
          callback({ data: mockUsers, error: null })
        }),
      }))

      vi.mocked(supabaseModule.createServerClient).mockReturnValue({
        from: vi.fn(() => ({
          select: mockSelect,
        })),
      } as any)

      const result = await caller.userList()
      expect(result).toEqual(mockUsers)
      expect(mockSelect).toHaveBeenCalledWith('id, name')
    })

    it('should throw error on database error', async () => {
      const mockSelect = vi.fn(() => ({
        then: vi.fn((callback) => {
          callback({ data: null, error: { message: 'Database error' } })
        }),
      }))

      vi.mocked(supabaseModule.createServerClient).mockReturnValue({
        from: vi.fn(() => ({
          select: mockSelect,
        })),
      } as any)

      await expect(caller.userList()).rejects.toThrow('Failed to fetch users')
    })
  })

  describe('userById', () => {
    it('should return user by id', async () => {
      const mockUser = createMockUser({ id: 'test-id' })
      const mockSingle = vi.fn().mockResolvedValue({ data: mockUser, error: null })

      vi.mocked(supabaseModule.createServerClient).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: mockSingle,
            })),
          })),
        })),
      } as any)

      const result = await caller.userById('test-id')
      expect(result).toEqual(mockUser)
      expect(mockSingle).toHaveBeenCalled()
    })

    it('should return undefined for non-existent user', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows returned' },
      })

      vi.mocked(supabaseModule.createServerClient).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: mockSingle,
            })),
          })),
        })),
      } as any)

      const result = await caller.userById('non-existent-id')
      expect(result).toBeUndefined()
    })
  })

  describe('userCreate', () => {
    it('should create a new user', async () => {
      const mockUser = createMockUser({ name: 'New User' })
      const mockSingle = vi.fn().mockResolvedValue({ data: mockUser, error: null })

      vi.mocked(supabaseModule.createServerClient).mockReturnValue({
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: mockSingle,
            })),
          })),
        })),
      } as any)

      const result = await caller.userCreate({ name: 'New User' })
      expect(result).toEqual(mockUser)
      expect(mockSingle).toHaveBeenCalled()
    })

    it('should throw error on database error', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => ({
          single: mockSingle,
        })),
      }))

      vi.mocked(supabaseModule.createServerClient).mockReturnValue({
        from: vi.fn(() => ({
          insert: mockInsert,
        })),
      } as any)

      await expect(caller.userCreate({ name: 'New User' })).rejects.toThrow('Failed to create user')
      expect(mockInsert).toHaveBeenCalledWith({ name: 'New User' })
    })
  })

  describe('testAuth', () => {
    it('should return authenticated user info', async () => {
      const authenticatedCtx = createTestContext({
        id: 'user-id',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      })

      const authenticatedCaller = appRouter.createCaller(authenticatedCtx)
      const result = await authenticatedCaller.testAuth()

      expect(result).toEqual({
        authenticated: true,
        user: {
          id: 'user-id',
          email: 'test@example.com',
          metadata: { name: 'Test User' },
        },
        message: 'Authentication successful! You are authenticated.',
      })
    })
  })
})
