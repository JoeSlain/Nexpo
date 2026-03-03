-- Integration tests for authentication and user management
BEGIN;

-- Test 1: User table exists and has correct structure
SELECT plan(5);

SELECT has_table('public', 'users', 'Users table should exist');

SELECT has_column('public', 'users', 'id', 'Users table should have id column');
SELECT has_column('public', 'users', 'name', 'Users table should have name column');
SELECT has_column('public', 'users', 'created_at', 'Users table should have created_at column');
SELECT has_column('public', 'users', 'updated_at', 'Users table should have updated_at column');

SELECT * FROM finish();
ROLLBACK;
