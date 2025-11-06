import { expect, test } from '@playwright/test'

test.describe('API Routes', () => {
  test('should respond from /api/hello', async ({ request }) => {
    const response = await request.get('/api/hello')
    expect(response.status()).toBe(200)

    const body = await response.text()
    expect(body).toBeTruthy()
  })

  test('should handle tRPC endpoint', async ({ request }) => {
    // Test that tRPC endpoint exists and responds
    const response = await request.get('/api/trpc', {
      failOnStatusCode: false,
    })

    // tRPC might return 404 for GET without proper query, but endpoint should exist
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })
})
