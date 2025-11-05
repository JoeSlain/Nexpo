-- Schema tests for users table
-- Tests table structure, columns, indexes, and constraints

BEGIN;
SELECT plan(12);

-- Test: users table exists
SELECT has_table('public', 'users', 'users table should exist');

-- Test: users table has required columns
SELECT has_column('public', 'users', 'id', 'users table should have id column');
SELECT has_column('public', 'users', 'name', 'users table should have name column');
SELECT has_column('public', 'users', 'created_at', 'users table should have created_at column');
SELECT has_column('public', 'users', 'updated_at', 'users table should have updated_at column');

-- Test: column types
SELECT col_type_is('public', 'users', 'id', 'uuid', 'id column should be UUID type');
SELECT col_type_is('public', 'users', 'name', 'text', 'name column should be TEXT type');
SELECT col_type_is('public', 'users', 'created_at', 'timestamp with time zone', 'created_at column should be TIMESTAMPTZ type');
SELECT col_type_is('public', 'users', 'updated_at', 'timestamp with time zone', 'updated_at column should be TIMESTAMPTZ type');

-- Test: column constraints
SELECT col_not_null('public', 'users', 'id', 'id column should be NOT NULL');
SELECT col_not_null('public', 'users', 'name', 'name column should be NOT NULL');

-- Test: indexes
SELECT has_index('public', 'users', 'users_name_idx', 'users table should have name index');

SELECT * FROM finish();
ROLLBACK;

