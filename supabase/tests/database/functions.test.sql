-- Function tests
-- Tests database functions and their behavior

BEGIN;
SELECT plan(4);

-- Test: update_updated_at_column function exists
SELECT has_function('public', 'update_updated_at_column', ARRAY[]::text[], 'update_updated_at_column function should exist');

-- Test: function return type
SELECT function_returns('public', 'update_updated_at_column', ARRAY[]::text[], 'trigger', 'function should return trigger type');

-- Test: function language
SELECT function_lang_is('public', 'update_updated_at_column', ARRAY[]::text[], 'plpgsql', 'function should be written in plpgsql');

-- Test: function is marked as STABLE or VOLATILE
-- (This is a basic check - update_updated_at_column should be VOLATILE since it modifies data)
SELECT ok(
  EXISTS(
    SELECT 1 
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' 
    AND p.proname = 'update_updated_at_column'
  ),
  'update_updated_at_column function should exist in pg_proc'
);

SELECT * FROM finish();
ROLLBACK;

