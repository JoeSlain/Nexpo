# Quick Setup Guide

Follow these steps to set up this template after cloning it.

## Step 1: Install Dependencies

```bash
yarn install
```

## Step 2: Create Environment Files

### Next.js App

```bash
cp apps/next/.env.example apps/next/.env.local
```

Edit `apps/next/.env.local` and fill in your Supabase credentials.

### Expo App

```bash
cp apps/expo/.env.example apps/expo/.env
```

Edit `apps/expo/.env` and fill in your Supabase credentials and API URL.

## Step 3: Update Supabase Project ID

Edit `supabase/config.toml` and change:

```toml
project_id = "my-project"
```

to your desired project name.

## Step 4: Start Supabase Locally

```bash
yarn supabase:start
```

Wait for all services to start, then run:

```bash
yarn supabase:status
```

Copy the local environment variables and add them to your `.env.local` (Next.js) and `.env` (Expo) files if you want to use local Supabase.

## Step 5: Test Locally

### Start Next.js

```bash
yarn web
```

Visit http://localhost:3000

### Start Expo

```bash
cd apps/expo
expo run:ios
# or
expo run:android
```

## Step 6: Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set root directory to `apps/next`
4. Add environment variables in Vercel dashboard
5. Deploy!

## Troubleshooting

### Port Already in Use

If you get port conflicts, you can:
- Change the port in `apps/next/package.json` (Next.js)
- Use `yarn supabase:stop` to stop Supabase services

### Cannot Connect to Supabase

Make sure Supabase is running:
```bash
yarn supabase:status
```

If it's not running:
```bash
yarn supabase:start
```

### Build Errors

Clear caches:
```bash
rm -rf .turbo
rm -rf apps/next/.next
rm -rf node_modules
yarn install
```

