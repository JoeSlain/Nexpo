# Database Tests

This directory contains database tests using pgTAP (PostgreSQL Testing Framework).

## Overview

Database tests verify:
- Schema structure (tables, columns, types, constraints)
- Row Level Security (RLS) policies
- Database triggers
- Database functions

## Running Tests

### Run All Database Tests

```bash
# From project root
yarn test:db

# Or directly
supabase test db
```

### Run Specific Test File

```bash
supabase test db --file supabase/tests/database/schema.test.sql
```

### Prerequisites

- Supabase CLI must be installed (v1.11.4+)
- Local Supabase must be running (`yarn supabase:start`)

## Test Files

### `schema.test.sql`
Tests database schema:
- Table existence
- Column existence and types
- Column constraints (NOT NULL, etc.)
- Indexes

### `rls.test.sql`
Tests Row Level Security policies:
- Policy existence
- Policy roles (public, authenticated)
- Policy operations (SELECT, INSERT, UPDATE, DELETE)

### `triggers.test.sql`
Tests database triggers:
- Trigger existence
- Trigger functions
- Trigger timing (BEFORE, AFTER)
- Trigger events (INSERT, UPDATE, DELETE)

### `functions.test.sql`
Tests database functions:
- Function existence
- Function return types
- Function language
- Function behavior

## Writing Tests

### Test Structure

All tests use pgTAP syntax:

```sql
BEGIN;
SELECT plan(1); -- Number of tests

-- Your tests here
SELECT has_table('public', 'users', 'users table should exist');

SELECT * FROM finish();
ROLLBACK;
```

### Common pgTAP Functions

- `has_table(schema, table, description)` - Check table exists
- `has_column(schema, table, column, description)` - Check column exists
- `col_type_is(schema, table, column, type, description)` - Check column type
- `has_index(schema, table, index, description)` - Check index exists
- `has_policy(schema, table, policy, description)` - Check RLS policy exists
- `has_trigger(schema, table, trigger, description)` - Check trigger exists
- `has_function(schema, function, args, description)` - Check function exists

### Example Test

```sql
BEGIN;
SELECT plan(3);

-- Test table exists
SELECT has_table('public', 'users', 'users table should exist');

-- Test column exists
SELECT has_column('public', 'users', 'id', 'id column should exist');

-- Test column type
SELECT col_type_is('public', 'users', 'id', 'uuid', 'id should be UUID type');

SELECT * FROM finish();
ROLLBACK;
```

## Resources

- [pgTAP Documentation](https://pgtap.org/)
- [Supabase Testing Guide](https://supabase.com/docs/guides/database/testing)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)

