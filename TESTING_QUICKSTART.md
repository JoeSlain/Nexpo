# Testing Quick Start Guide

This guide will help you get started with testing your database and API in the Nexpo monorepo.

## Prerequisites

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start Supabase locally:**
   ```bash
   yarn supabase:start
   ```

## Quick Start

### 1. Database Tests

Database tests use pgTAP and run via Supabase CLI.

**Run database tests:**
```bash
yarn test:db
```

**Test files location:**
- `supabase/tests/database/schema.test.sql` - Schema structure tests
- `supabase/tests/database/rls.test.sql` - Row Level Security tests
- `supabase/tests/database/triggers.test.sql` - Trigger tests
- `supabase/tests/database/functions.test.sql` - Function tests

### 2. API Tests

API tests use Vitest and test tRPC procedures.

**Install dependencies (if not already installed):**
```bash
cd packages/api
yarn install
```

**Run API tests:**
```bash
# From project root
yarn test:api

# Or from packages/api
cd packages/api
yarn test
```

**Watch mode (for development):**
```bash
cd packages/api
yarn test:watch
```

**UI mode (interactive):**
```bash
cd packages/api
yarn test:ui
```

**Coverage report:**
```bash
cd packages/api
yarn test:coverage
```

## Test Structure

### Database Tests (`supabase/tests/database/`)

- **schema.test.sql** - Tests table structure, columns, types, indexes
- **rls.test.sql** - Tests Row Level Security policies
- **triggers.test.sql** - Tests database triggers
- **functions.test.sql** - Tests database functions

### API Tests (`packages/api/src/__tests__/`)

**Unit Tests:**
- **helpers.test.ts** - Unit tests for helper functions (createMockUser, wait, etc.)
- **trpc.test.ts** - Unit tests for tRPC middleware (protectedProcedure)

**Integration Tests:**
- **router.test.ts** - Integration tests for tRPC procedures
- **helpers.ts** - Test helper functions
- **setup.ts** - Test environment setup

### Test Utilities (`packages/api/src/__mocks__/`)

- **supabase.ts** - Mock Supabase client for testing

## Writing New Tests

### Database Test Example

```sql
BEGIN;
SELECT plan(2);

SELECT has_table('public', 'my_table', 'my_table should exist');
SELECT has_column('public', 'my_table', 'id', 'id column should exist');

SELECT * FROM finish();
ROLLBACK;
```

### API Test Example

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

## Available Commands

### Root Level

```bash
yarn test              # Run all tests (via Turbo)
yarn test:db           # Run database tests
yarn test:api          # Run API tests
yarn test:watch        # Watch mode for all tests
yarn test:coverage     # Coverage report for all tests
```

### API Package

```bash
cd packages/api
yarn test              # Run tests once
yarn test:watch        # Watch mode
yarn test:ui           # Interactive UI
yarn test:coverage     # Coverage report
```

## Next Steps

1. **Run the tests** to verify everything works:
   ```bash
   yarn test:db
   yarn test:api
   ```

2. **Add more tests** for your specific use cases:
   - Add database tests for new tables/columns
   - Add API tests for new tRPC procedures
   - Add integration tests for end-to-end flows

3. **Set up CI/CD** (see `TESTING_PLAN.md` for GitHub Actions example)

## Troubleshooting

### Database Tests Fail

- Ensure Supabase is running: `yarn supabase:start`
- Check Supabase CLI version: `supabase --version` (should be v1.11.4+)
- Verify tests are in `supabase/tests/database/` directory

### API Tests Fail

- Ensure dependencies are installed: `cd packages/api && yarn install`
- Check that test environment variables are set
- Verify Vitest is installed: `yarn list vitest`

### Tests Hang or Timeout

- Check if Supabase is running and accessible
- Verify environment variables are correct
- Check for port conflicts (54321, 54322, 54323)

## Resources

- [Full Testing Plan](./TESTING_PLAN.md) - Comprehensive testing strategy
- [Database Tests README](./supabase/tests/README.md) - Database testing guide
- [API Tests README](./packages/api/README_TESTING.md) - API testing guide
- [Supabase Testing Docs](https://supabase.com/docs/guides/database/testing)
- [Vitest Documentation](https://vitest.dev/)

