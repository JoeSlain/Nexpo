// Test helpers for API tests
import type { User } from '@supabase/supabase-js'

export interface TestUser {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

/**
 * Create a mock user for testing
 */
export function createMockUser(overrides?: Partial<TestUser>): TestUser {
  return {
    id: crypto.randomUUID(),
    name: 'Test User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create multiple mock users
 */
export function createMockUsers(count: number): TestUser[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      name: `Test User ${i + 1}`,
    })
  )
}

/**
 * Create a test tRPC context
 */
export function createTestContext(user?: User) {
  return {
    user: user || {
      id: crypto.randomUUID(),
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  }
}

/**
 * Wait for a specified amount of time (useful for async operations)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
