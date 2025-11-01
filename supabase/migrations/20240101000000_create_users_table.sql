-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS users_name_idx ON public.users(name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE
  ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (adjust as needed for your security requirements)
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT
  USING (true);

-- Create policy for authenticated users to insert (adjust as needed)
CREATE POLICY "Authenticated users can insert users" ON public.users
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy for users to update their own records (adjust as needed)
CREATE POLICY "Users can update their own records" ON public.users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Create policy for users to delete their own records (adjust as needed)
CREATE POLICY "Users can delete their own records" ON public.users
  FOR DELETE
  USING (auth.uid()::text = id::text);

