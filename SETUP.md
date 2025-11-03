# Quick Setup Guide

Follow these steps to set up this template after cloning it.

## Step 1: Install Dependencies

```bash
yarn install
```

## Step 2: Create Environment Files

This project uses environment-specific configuration files for development and production.

### Next.js App

Environment files are already created in `apps/next/`:
- `.env.development` - Development environment variables (auto-loaded when `NODE_ENV=development`)
- `.env.production` - Production environment variables (auto-loaded when `NODE_ENV=production`)
- `.env.local` - Local overrides (gitignored, create this if you need local-only overrides)

1. **Update development values** in `apps/next/.env.development`:
   - Set `NEXT_PUBLIC_SUPABASE_URL` to `http://127.0.0.1:54321` (local Supabase)
   - Get your local Supabase anon key by running `yarn supabase:status` and set `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Update production values** in `apps/next/.env.production` (for later):
   - Replace placeholder values with your actual production Supabase credentials

3. **Create `.env.local`** (optional, for local-only overrides):
   ```bash
   touch apps/next/.env.local
   ```

### Expo App

Environment files are already created in `apps/expo/`:
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.local` - Local overrides (gitignored, create this if you need local-only overrides)

1. **Update development values** in `apps/expo/.env.development`:
   - Set `EXPO_PUBLIC_SUPABASE_URL` to `http://127.0.0.1:54321` (local Supabase)
   - Get your local Supabase anon key by running `yarn supabase:status` and set `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Set `EXPO_PUBLIC_API_URL` to `http://localhost:3000/api/trpc` (or your machine's IP for physical devices)

2. **Update production values** in `apps/expo/.env.production` (for later):
   - Replace placeholder values with your actual production credentials

3. **Create `.env.local`** (optional, for local-only overrides):
   ```bash
   touch apps/expo/.env.local
   ```

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

Copy the local environment variables and add them to your `.env.development` files (or `.env.local` for overrides) if you want to use local Supabase.

## Step 5: Test Locally

### Start Next.js

```bash
yarn web
```

Visit http://localhost:3000

### Start Expo

```bash
cd apps/expo
yarn ios
# or
yarn android
```

## Step 6: Setup EAS (Expo Application Services)

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Login to EAS

```bash
eas login
```

### Configure EAS Build

The `eas.json` configuration file is already set up with build profiles:
- **development**: For development client builds
- **preview**: For internal distribution builds
- **production**: For production app store builds

You can customize it if needed:

```bash
cd apps/expo
npm run eas:configure
```

### Configure Environment Variables in EAS

Set up your production environment variables in EAS:

```bash
cd apps/expo
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-production-anon-key"
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://your-domain.com/api/trpc"
```

Or configure them in the [EAS dashboard](https://expo.dev/accounts/[your-account]/projects/nexpo/secrets).

### Available EAS Scripts

The project includes several EAS-related scripts in `apps/expo/package.json`:

**Build:**
- `npm run eas:build:android` - Build for Android
- `npm run eas:build:ios` - Build for iOS
- `npm run eas:build:all` - Build for both platforms
- `npm run eas:build:android:profile` - Build Android with production profile
- `npm run eas:build:ios:profile` - Build iOS with production profile

**Submit:**
- `npm run eas:submit:android` - Submit Android build to Play Store
- `npm run eas:submit:ios` - Submit iOS build to App Store

**Update:**
- `npm run eas:update` - Publish OTA update (interactive)
- `npm run eas:update:republish` - Publish update to production branch

**Configuration:**
- `npm run eas:configure` - Configure EAS Build

## Step 7: Deploy to Vercel

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

