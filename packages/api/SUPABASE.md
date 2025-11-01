# Supabase Setup

This project uses Supabase as the database and backend service.

## Local Development with Docker

This project includes Supabase CLI for local development. You can run Supabase locally using Docker.

### Starting Local Supabase

```bash
# Start Supabase (starts all Docker containers)
yarn supabase:start

# Check status of local Supabase
yarn supabase:status

# Stop Supabase (stops all Docker containers)
yarn supabase:stop

# Reset database (runs migrations and seed data)
yarn supabase:reset

# View logs
yarn supabase:logs
```

### Local Development Environment Variables

When running locally, use these values (automatically set by Supabase CLI):

```bash
# Local Supabase URL (default port 54321)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# Get the anon key from: yarn supabase:status
# Or check: supabase/.temp/keys.json
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key

# Service role key for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

You can also run `yarn supabase:status` to see all connection details including API keys.

### Local Supabase Studio

When Supabase is running locally, you can access:
- **Supabase Studio**: http://localhost:54323
- **API URL**: http://127.0.0.1:54321
- **Database**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### Database Migrations

Migrations are stored in `supabase/migrations/` and run automatically when you start or reset the database.

To create a new migration:
```bash
yarn supabase migration new migration_name
```

To apply migrations:
```bash
yarn supabase db reset  # Resets and applies all migrations + seed data
```

### Seed Data

Seed data is automatically loaded from `supabase/seed.sql` when you run `yarn supabase:reset`.

## Environment Variables (Production)

You need to set the following environment variables:

### For Server-Side (API Package)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # Optional, for admin operations
```

### For Client-Side (Next.js)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Client-Side (Expo/React Native)

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Or you can reuse the `NEXT_PUBLIC_*` variables.

## Getting Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

## Usage

### Server-Side (tRPC, API Routes)

```typescript
import { createServerClient } from 'api'

const supabase = createServerClient()
const { data, error } = await supabase.from('users').select('*')
```

### Client-Side (Next.js)

```typescript
import { getBrowserClient } from '@/utils/supabase/client'

const supabase = getBrowserClient()
const { data, error } = await supabase.from('users').select('*')
```

### Client-Side (Expo/React Native)

```typescript
import { getExpoClient } from '@/utils/supabase/client'

const supabase = getExpoClient()
const { data, error } = await supabase.from('users').select('*')
```

## Database Schema

The API currently expects a `users` table with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Adjust the schema and queries in `packages/api/src/index.ts` to match your actual database structure.

## Security Notes

⚠️ **IMPORTANT**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. It has admin privileges and bypasses Row Level Security (RLS).

Use:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side code
- `SUPABASE_SERVICE_ROLE_KEY` only in server-side code (API routes, tRPC procedures)

