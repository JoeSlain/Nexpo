// Mock Supabase client for testing
import type { SupabaseClient } from '@supabase/supabase-js'

// Create a mock Supabase client
export function createMockSupabaseClient(): Partial<SupabaseClient> {
  const mockData: Record<string, any[]> = {
    users: [],
  }

  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => {
            const item = mockData[table]?.find((row: any) => row[column] === value)
            return Promise.resolve({
              data: item || null,
              error: item ? null : { code: 'PGRST116', message: 'No rows returned' },
            })
          },
          then: (resolve: any) => {
            const items = mockData[table]?.filter((row: any) => row[column] === value) || []
            resolve({ data: items, error: null })
          },
        }),
        then: (resolve: any) => {
          resolve({ data: mockData[table] || [], error: null })
        },
      }),
      insert: (values: any) => ({
        select: (columns?: string) => ({
          single: () => {
            const newItem = {
              id: crypto.randomUUID(),
              ...values,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            mockData[table] = mockData[table] || []
            mockData[table].push(newItem)
            return Promise.resolve({ data: newItem, error: null })
          },
          then: (resolve: any) => {
            const newItem = {
              id: crypto.randomUUID(),
              ...values,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            mockData[table] = mockData[table] || []
            mockData[table].push(newItem)
            resolve({ data: [newItem], error: null })
          },
        }),
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns?: string) => ({
            single: () => {
              const index = mockData[table]?.findIndex((row: any) => row[column] === value)
              if (index !== undefined && index >= 0) {
                mockData[table][index] = {
                  ...mockData[table][index],
                  ...values,
                  updated_at: new Date().toISOString(),
                }
                return Promise.resolve({ data: mockData[table][index], error: null })
              }
              return Promise.resolve({
                data: null,
                error: { code: 'PGRST116', message: 'No rows returned' },
              })
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (resolve: any) => {
            const initialLength = mockData[table]?.length || 0
            mockData[table] = mockData[table]?.filter((row: any) => row[column] !== value) || []
            resolve({ data: null, error: null })
          },
        }),
      }),
    }),
  } as any
}

export function resetMockData() {
  // This can be extended to reset all mock data
}
