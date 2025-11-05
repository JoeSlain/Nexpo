-- Trigger tests for users table
-- Tests trigger existence and functionality

BEGIN;
SELECT plan(5);

-- Test: update_updated_at_column function exists
SELECT has_function('public', 'update_updated_at_column', ARRAY[]::text[], 'update_updated_at_column function should exist');

-- Test: trigger exists on users table
SELECT has_trigger('public', 'users', 'update_users_updated_at', 'users table should have update_users_updated_at trigger');

-- Test: trigger fires before update
SELECT trigger_is('public', 'users', 'update_users_updated_at', 'public', 'update_updated_at_column', 'trigger should call update_updated_at_column function');

-- Test: trigger timing (BEFORE)
SELECT ok(
  (SELECT t.tgtype & 2 = 2
   FROM pg_trigger t
   JOIN pg_class c ON t.tgrelid = c.oid
   JOIN pg_namespace n ON c.relnamespace = n.oid
   WHERE n.nspname = 'public'
   AND c.relname = 'users'
   AND t.tgname = 'update_users_updated_at'),
  'trigger should fire BEFORE UPDATE'
);

-- Test: trigger event (UPDATE)
SELECT ok(
  EXISTS(
    SELECT 1
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    AND event_object_table = 'users'
    AND trigger_name = 'update_users_updated_at'
    AND event_manipulation = 'UPDATE'
  ),
  'trigger should fire on UPDATE'
);

SELECT * FROM finish();
ROLLBACK;

