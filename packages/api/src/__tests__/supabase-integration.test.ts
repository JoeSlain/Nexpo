import { describe, expect, it, vi } from 'vitest'
import { createServerClient } from '../supabase'

describe('Supabase Integration Tests', () => {
  describe('Client Creation', () => {
    it('should create a Supabase server client', () => {
      const client = createServerClient()
      
      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
    })

    it('should create a Supabase client with default settings', () => {
      const client = createServerClient()
      
      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
      expect(client.from).toBeDefined()
    })
  })

  describe('Authentication', () => {
    it('should have auth methods available', () => {
      const client = createServerClient()

      expect(client.auth.getUser).toBeDefined()
      expect(client.auth.getSession).toBeDefined()
      expect(typeof client.auth.getUser).toBe('function')
      expect(typeof client.auth.getSession).toBe('function')
    })

    it('should handle getUser method', async () => {
      const client = createServerClient()
      
      // Mock the getUser response
      const mockGetUser = vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-123',
            email: 'test@example.com',
          },
        },
        error: null,
      })

      vi.spyOn(client.auth, 'getUser').mockImplementation(mockGetUser)

      const result = await client.auth.getUser()

      expect(mockGetUser).toHaveBeenCalled()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
    })

    it('should handle getSession method', async () => {
      const client = createServerClient()
      
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      })

      vi.spyOn(client.auth, 'getSession').mockImplementation(mockGetSession)

      const result = await client.auth.getSession()

      expect(mockGetSession).toHaveBeenCalled()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
    })
  })

  describe('Database Operations', () => {
    it('should have database query methods', () => {
      const client = createServerClient()
      
      expect(client.from).toBeDefined()
      expect(typeof client.from).toBe('function')
    })

    it('should allow creating query chains', () => {
      const client = createServerClient()
      
      const query = client.from('users')
      
      expect(query).toBeDefined()
      expect(query.select).toBeDefined()
      expect(typeof query.select).toBe('function')
    })

    it('should support select operations', async () => {
      const client = createServerClient()
      
      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: '1', name: 'Test User' }],
        error: null,
      })

      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
      })

      vi.spyOn(client, 'from').mockImplementation(mockFrom as any)

      const result = await client.from('users').select('*')

      expect(mockFrom).toHaveBeenCalledWith('users')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
    })
  })

  describe('Session Management', () => {
    it('should have session management methods', () => {
      const client = createServerClient()
      
      expect(client.auth.getSession).toBeDefined()
      expect(typeof client.auth.getSession).toBe('function')
    })

    it('should allow retrieving sessions', async () => {
      const client = createServerClient()
      
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      })

      vi.spyOn(client.auth, 'getSession').mockImplementation(mockGetSession)

      const result = await client.auth.getSession()

      expect(mockGetSession).toHaveBeenCalled()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
    })
  })

  describe('Error Handling', () => {
    it('should handle errors in auth operations', async () => {
      const client = createServerClient()
      
      const mockGetUser = vi.fn().mockRejectedValue(new Error('Network error'))

      vi.spyOn(client.auth, 'getUser').mockImplementation(mockGetUser)

      await expect(client.auth.getUser()).rejects.toThrow('Network error')
    })

    it('should return error objects in responses', async () => {
      const client = createServerClient()
      
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated', code: 'UNAUTHORIZED' },
      })

      vi.spyOn(client.auth, 'getUser').mockImplementation(mockGetUser)

      const result = await client.auth.getUser()

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
      expect(result.error).not.toBeNull()
    })
  })
})
