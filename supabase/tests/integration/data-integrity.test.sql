-- Integration tests for data integrity and constraints
BEGIN;

SELECT plan(3);

-- Test 1: Users table has primary key
SELECT has_pk('public', 'users', 'Users table should have a primary key');

-- Test 2: Name lookup index should exist
SELECT has_index('public', 'users', 'users_name_idx', 'Users table should have an index on name');

-- Test 3: Created_at should have a default value
SELECT col_has_default('public', 'users', 'created_at', 'created_at should have default value');

SELECT * FROM finish();
ROLLBACK;
