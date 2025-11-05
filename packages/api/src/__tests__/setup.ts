// Test setup file for Vitest
// This file runs before all tests

import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key'
})

afterAll(() => {
  // Cleanup after all tests
})
