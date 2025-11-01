# Local Supabase Setup

This directory contains the configuration for running Supabase locally with Docker.

## Quick Start

1. **Start Supabase locally:**
   ```bash
   yarn supabase:start
   ```

2. **Get connection details:**
   ```bash
   yarn supabase:status
   ```

3. **Access Supabase Studio:**
   - Open http://localhost:54323 in your browser

4. **Stop Supabase:**
   ```bash
   yarn supabase:stop
   ```

## Project Structure

```
supabase/
├── config.toml          # Supabase configuration
├── migrations/          # Database migrations
│   └── 20240101000000_create_users_table.sql
├── seed.sql            # Seed data for local development
└── README.md           # This file
```

## Database Migrations

Migrations are stored in `migrations/` and run automatically when you start or reset Supabase.

### Create a New Migration

```bash
yarn supabase:migration:new migration_name
```

This will create a new migration file in `supabase/migrations/` with a timestamp prefix.

### Apply Migrations

Migrations run automatically when you:
- Start Supabase: `yarn supabase:start`
- Reset the database: `yarn supabase:reset`

To apply pending migrations without resetting:
```bash
yarn supabase:migration:up
```

## Seed Data

Seed data is defined in `seed.sql` and runs automatically after migrations when you run `yarn supabase:reset`.

## Environment Variables

When running locally, set these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from yarn supabase:status>
SUPABASE_SERVICE_ROLE_KEY=<get from yarn supabase:status>
```

Run `yarn supabase:status` to see all connection details and API keys.

## Docker Containers

Supabase CLI manages Docker containers for you. The following services run in Docker:

- **PostgreSQL** (port 54322) - Main database
- **PostgREST** (port 54321) - REST API
- **Supabase Studio** (port 54323) - Web interface
- **Inbucket** (port 54324) - Email testing
- **GoTrue** - Authentication service
- **Realtime** - Real-time subscriptions
- **Storage** - File storage

## Troubleshooting

### Port Already in Use

If you get port conflicts, you can change ports in `config.toml`.

### Reset Everything

To completely reset your local Supabase instance:
```bash
yarn supabase:stop
yarn supabase:reset
```

### View Logs

```bash
yarn supabase:logs
```

### Database Connection

Connect directly to PostgreSQL:
```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

