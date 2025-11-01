-- Seed data for local development
-- This file runs automatically after migrations when using `supabase db reset`

-- Insert sample users
INSERT INTO public.users (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Alice'),
  ('00000000-0000-0000-0000-000000000002', 'Bob'),
  ('00000000-0000-0000-0000-000000000003', 'Charlie')
ON CONFLICT (id) DO NOTHING;

