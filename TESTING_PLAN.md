# Database Testing Plan

A comprehensive testing strategy for your Nexpo monorepo that covers database, API, and cross-platform (web & mobile) testing using Vitest and Supabase testing tools.

## Overview

This plan implements a multi-layered testing approach:

1. **Database Layer Tests** - Using Supabase CLI + pgTAP for schema, RLS policies, and SQL functions
2. **API Layer Tests** - Using Vitest to test tRPC procedures and Supabase client operations
3. **Integration Tests** - End-to-end tests that verify the full stack works together
4. **Cross-Platform Tests** - Tests that work for both web (Next.js) and mobile (Expo) clients

## Table of Contents

- [Prerequisites](#prerequisites)
- [Test Structure](#test-structure)
- [1. Database Tests (Supabase CLI + pgTAP)](#1-database-tests-supabase-cli--pgtap)
- [2. API Tests (Vitest)](#2-api-tests-vitest)
- [3. Integration Tests](#3-integration-tests)
- [4. Cross-Platform Tests](#4-cross-platform-tests)
- [Test Utilities](#test-utilities)
- [Running Tests](#running-tests)
- [CI/CD Integration](#cicd-integration)

---

## Prerequisites

### Required Tools

1. **Supabase CLI** (v1.11.4+) - Already installed
2. **Vitest** - Will be installed
3. **React Native Testing Library** - For mobile component testing
4. **@testing-library/react** - For web component testing
5. **@testing-library/jest-native** - Additional matchers for React Native

### Environment Setup

Ensure you have:
- Local Supabase running (`yarn supabase:start`)
- Test database environment configured
- Environment variables for test mode

---

## Test Structure

```
.
├── supabase/
│   └── tests/
│       └── database/              # Database tests (pgTAP)
│           ├── schema.test.sql
│           ├── rls.test.sql
│           ├── functions.test.sql
│           └── triggers.test.sql
├── packages/
│   └── api/
│       └── src/
│           ├── __tests__/         # API tests
│           │   ├── helpers.test.ts  # Unit tests for helpers
│           │   ├── trpc.test.ts     # Unit tests for middleware
│           │   ├── router.test.ts   # Integration tests for router
│           │   └── setup.ts
│           └── __mocks__/        # Test mocks
│               └── supabase.ts
├── apps/
│   ├── next/
│   │   └── __tests__/            # Next.js specific tests
│   │       ├── api.test.ts
│   │       └── pages.test.tsx
│   └── expo/
│       └── __tests__/            # Expo/React Native tests
│           ├── components.test.tsx
│           └── screens.test.tsx
└── __tests__/
    └── integration/              # Integration tests
        ├── api-integration.test.ts
        └── e2e.test.ts
```

---

## Test Types Explained

### Unit Tests
**Purpose:** Test individual functions in isolation
**Characteristics:**
- Test pure functions (no side effects)
- Mock all external dependencies
- Fast execution
- No database or network calls
- Test a single unit of functionality

**Examples:**
- `helpers.test.ts` - Test helper functions (createMockUser, wait, etc.)
- `trpc.test.ts` - Test middleware logic
- Utility function tests

**Location:** `packages/api/src/__tests__/*.test.ts` (unit test files)

### Integration Tests
**Purpose:** Test how multiple components work together
**Characteristics:**
- Test interactions between components
- Mock external services (Supabase)
- Test complete procedures/endpoints
- May involve multiple layers

**Examples:**
- `router.test.ts` - Test tRPC procedures end-to-end with mocked Supabase
- API endpoint tests
- Service layer tests

**Location:** `packages/api/src/__tests__/router.test.ts`

### Database Tests
**Purpose:** Test database schema, RLS, triggers, and functions directly
**Characteristics:**
- Test at database level
- Use pgTAP framework
- Test schema structure
- Test RLS policies
- Test database functions and triggers

**Examples:**
- `schema.test.sql` - Schema structure tests
- `rls.test.sql` - Row Level Security tests
- `triggers.test.sql` - Trigger tests

**Location:** `supabase/tests/database/*.test.sql`

### E2E Tests (Future)
**Purpose:** Test complete user flows from frontend to backend
**Characteristics:**
- Test full stack
- Use real database (test instance)
- Test actual HTTP requests
- Test authentication flows
- Slower execution

**Examples:**
- Complete user registration flow
- Login and data fetching
- Error handling across layers

**Location:** `__tests__/integration/e2e.test.ts` (to be created)

---

## 1. Database Tests (Supabase CLI + pgTAP)

### Purpose
Test database schema, RLS policies, triggers, and functions directly at the database level.

### Setup

1. **Create tests directory:**
   ```bash
   mkdir -p supabase/tests/database
   ```

2. **Test files use pgTAP syntax** - Supabase CLI automatically runs these tests

### Test Files

#### `supabase/tests/database/schema.test.sql`
Tests database schema structure:
- Table existence
- Column types and constraints
- Indexes
- Foreign keys

#### `supabase/tests/database/rls.test.sql`
Tests Row Level Security policies:
- Public read access
- Authenticated user insert/update/delete
- Policy application with different user contexts

#### `supabase/tests/database/triggers.test.sql`
Tests database triggers:
- `updated_at` trigger functionality
- Trigger execution timing

#### `supabase/tests/database/functions.test.sql`
Tests database functions:
- `update_updated_at_column()` function
- Function return values
- Error handling

### Running Database Tests

```bash
# Run all database tests
yarn supabase test db

# Run specific test file
supabase test db --file supabase/tests/database/schema.test.sql
```

---

## 2. API Tests (Vitest)

### Purpose
Test tRPC procedures, Supabase client operations, and business logic.

### Setup

1. **Install Vitest and testing dependencies:**
   ```bash
   # In packages/api
   yarn add -D vitest @vitest/ui @vitest/coverage-v8
   yarn add -D @testing-library/react @testing-library/jest-dom
   yarn add -D @testing-library/react-native @testing-library/jest-native
   ```

2. **Create Vitest config** for each package/app that needs testing

### Test Categories

#### A. tRPC Router Tests (`packages/api/src/__tests__/router.test.ts`)
- Test all tRPC procedures
- Mock Supabase client
- Test input validation (Zod schemas)
- Test error handling
- Test authentication flows

#### B. Supabase Client Tests (`packages/api/src/__tests__/supabase.test.ts`)
- Test Supabase client creation
- Test connection to database
- Test query operations
- Test error handling

#### C. Utility Tests (`packages/api/src/__tests__/utils.test.ts`)
- Test helper functions
- Test data transformations
- Test validation logic

### Test Utilities

#### Mock Supabase Client
Create a mock Supabase client for testing:
- Mock database responses
- Simulate errors
- Test different user contexts

#### Test Helpers
- `createTestContext()` - Create test tRPC context
- `createMockUser()` - Create mock authenticated user
- `setupTestDatabase()` - Setup test database state

---

## 3. Integration Tests

### Purpose
Test the full stack: Database → API → Client

### Test Types

#### A. API Integration Tests (`__tests__/integration/api-integration.test.ts`)
- Test tRPC procedures against real database
- Test with actual Supabase client
- Test authentication flows end-to-end
- Test RLS policies in action

#### B. E2E Tests (`__tests__/integration/e2e.test.ts`)
- Test complete user flows
- Test web and mobile clients
- Test error scenarios
- Test performance

### Setup for Integration Tests

1. **Test Database Setup:**
   - Use separate test database or reset before each test
   - Seed test data
   - Clean up after tests

2. **Test Server:**
   - Start test Next.js server
   - Start test Expo server
   - Clean up after tests

---

## 4. Cross-Platform Tests

### Purpose
Ensure API and business logic work identically on web and mobile.

### Strategy

1. **Shared Test Suite:**
   - Create shared test utilities that work for both platforms
   - Test tRPC client behavior on both platforms
   - Test Supabase client on both platforms

2. **Platform-Specific Tests:**
   - Web: Test Next.js specific features
   - Mobile: Test Expo/React Native specific features

### Test Files

#### `packages/app/__tests__/trpc-client.test.ts`
Tests tRPC client that works on both platforms:
- Query execution
- Mutation execution
- Error handling
- Authentication

#### `apps/next/__tests__/api.test.ts`
Next.js specific tests:
- API route handlers
- Server-side rendering
- Middleware

#### `apps/expo/__tests__/api.test.ts`
Expo specific tests:
- Native module integration
- Platform-specific APIs

---

## Test Utilities

### Test Configuration

#### `packages/api/vitest.config.ts`
Vitest configuration for API package:
- Test environment setup
- Mock configuration
- Coverage settings

#### `apps/next/vitest.config.ts`
Vitest configuration for Next.js:
- React Testing Library setup
- Next.js specific mocks

#### `apps/expo/vitest.config.ts`
Vitest configuration for Expo:
- React Native Testing Library setup
- Expo specific mocks

### Test Helpers

#### `packages/api/src/__tests__/helpers.ts`
Shared test utilities:
- Database setup/teardown
- Mock user creation
- Test data factories

#### `__tests__/helpers/setup.ts`
Global test setup:
- Environment variables
- Database initialization
- Mock server setup

---

## Running Tests

### Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "turbo test",
    "test:db": "supabase test db",
    "test:api": "vitest --run packages/api",
    "test:web": "vitest --run apps/next",
    "test:mobile": "vitest --run apps/expo",
    "test:integration": "vitest --run __tests__/integration",
    "test:watch": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### Individual Package Scripts

Each package/app should have its own test scripts:

```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### Running Tests

```bash
# Run all tests
yarn test

# Run database tests only
yarn test:db

# Run API tests only
yarn test:api

# Run web tests only
yarn test:web

# Run mobile tests only
yarn test:mobile

# Run integration tests
yarn test:integration

# Watch mode (for development)
yarn test:watch

# Coverage report
yarn test:coverage
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-db:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: yarn supabase:start
      - run: yarn test:db

  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: yarn install
      - run: yarn supabase:start
      - run: yarn test:api

  test-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: yarn install
      - run: yarn test:web

  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: yarn install
      - run: yarn test:mobile
```

---

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Reset database state between tests
- Clean up resources after tests

### 2. Mock External Services
- Mock Supabase for unit tests
- Use real Supabase for integration tests
- Mock external APIs

### 3. Test Data Management
- Use factories for test data
- Seed test database consistently
- Clean up test data

### 4. Error Testing
- Test error scenarios
- Test edge cases
- Test validation failures

### 5. Performance Testing
- Test query performance
- Test API response times
- Test under load

---

## Next Steps

1. ✅ Create database test structure
2. ✅ Set up Vitest configuration
3. ✅ Create test utilities and helpers
4. ✅ Write initial test suite
5. ✅ Set up CI/CD integration
6. ✅ Add coverage reporting
7. ✅ Document test patterns

---

## Resources

- [Supabase Database Testing Docs](https://supabase.com/docs/guides/database/testing)
- [Expo Testing Guide](https://expo.dev/blog/how-to-build-a-solid-test-harness-for-expo-apps)
- [Vitest Documentation](https://vitest.dev/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [pgTAP Documentation](https://pgtap.org/)

