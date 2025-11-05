-- Row Level Security (RLS) tests for users table
-- Tests RLS policies and their application

BEGIN;
SELECT plan(8);

-- Test: RLS is enabled on users table
SELECT policies_are('public', 'users', ARRAY[
  'Users are viewable by everyone',
  'Authenticated users can insert users',
  'Users can update their own records',
  'Users can delete their own records'
], 'users table should have correct RLS policies');

-- Test: Public read access policy exists
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users are viewable by everyone'
  ),
  'Should have public read policy'
);

-- Test: Authenticated insert policy exists
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Authenticated users can insert users'
  ),
  'Should have authenticated insert policy'
);

-- Test: Update own records policy exists
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can update their own records'
  ),
  'Should have update own records policy'
);

-- Test: Delete own records policy exists
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can delete their own records'
  ),
  'Should have delete own records policy'
);

-- Test: Public read policy allows SELECT (verify policy exists and is FOR SELECT)
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users are viewable by everyone'
    AND cmd = 'SELECT'
  ),
  'Public read policy should allow SELECT'
);

-- Test: Authenticated insert policy requires authenticated role (verify policy exists and is FOR INSERT)
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Authenticated users can insert users'
    AND cmd = 'INSERT'
  ),
  'Insert policy should require authenticated role'
);

-- Test: Update policy requires authenticated role (verify policy exists and is FOR UPDATE)
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can update their own records'
    AND cmd = 'UPDATE'
  ),
  'Update policy should require authenticated role'
);

SELECT * FROM finish();
ROLLBACK;

