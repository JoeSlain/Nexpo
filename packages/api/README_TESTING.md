# API Package Testing

This document describes how to test the API package using Vitest.

## Setup

### Install Dependencies

Dependencies are already installed in `package.json`. If you need to reinstall:

```bash
cd packages/api
yarn install
```

### Environment Variables

For testing, create a `.env.test` file or set these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key
```

The test setup file (`src/__tests__/setup.ts`) will use these values or fall back to test defaults.

## Running Tests

### Run All Tests

```bash
yarn test
```

### Watch Mode

```bash
yarn test:watch
```

### UI Mode

```bash
yarn test:ui
```

### Coverage Report

```bash
yarn test:coverage
```

## Test Structure

```
src/
├── __tests__/
│   ├── setup.ts          # Test setup and configuration
│   ├── helpers.ts        # Test helper functions
│   ├── helpers.test.ts   # Unit tests for helper functions
│   ├── trpc.test.ts      # Unit tests for tRPC middleware
│   └── router.test.ts    # Integration tests for tRPC router
└── __mocks__/
    └── supabase.ts       # Mock Supabase client
```

## Test Types

### Unit Tests
- **`helpers.test.ts`** - Tests pure helper functions (createMockUser, wait, etc.)
- **`trpc.test.ts`** - Tests tRPC middleware logic (protectedProcedure)
- Fast, isolated tests with no external dependencies

### Integration Tests
- **`router.test.ts`** - Tests tRPC procedures end-to-end with mocked Supabase
- Tests complete procedures and their interactions

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { createMockUser } from './helpers'

describe('createMockUser', () => {
  it('should create a user with default values', () => {
    const user = createMockUser()
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name', 'Test User')
  })
})
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { appRouter } from '../index'
import { createTestContext } from './helpers'

describe('My Procedure', () => {
  const ctx = createTestContext()
  const caller = appRouter.createCaller(ctx)

  it('should do something', async () => {
    const result = await caller.myProcedure()
    expect(result).toBeDefined()
  })
})
```

### Mocking Supabase

The Supabase client is automatically mocked in tests. To customize the mock behavior:

```typescript
import * as supabaseModule from '../supabase'

vi.mocked(supabaseModule.createServerClient).mockReturnValue({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      then: vi.fn((callback) => {
        callback({ data: mockData, error: null })
      }),
    })),
  })),
} as any)
```

### Test Helpers

Use the helper functions from `__tests__/helpers.ts`:

- `createMockUser()` - Create a mock user
- `createMockUsers(count)` - Create multiple mock users
- `createTestContext(user?)` - Create a test tRPC context
- `wait(ms)` - Wait for async operations

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Services**: Always mock Supabase in unit tests
3. **Test Error Cases**: Test both success and error scenarios
4. **Use Helpers**: Use test helpers for consistent test data
5. **Clear Mocks**: Clear mocks between tests using `beforeEach`

