# Nexpo 🚀

A production-ready monorepo template for building cross-platform applications with Next.js and React Native (Expo), powered by Solito.

## 🎯 Quick Start

### Option 1: Use as GitHub Template

1. Click "Use this template" on GitHub
2. Clone your new repository
3. Follow the [Setup Instructions](#-setup-instructions)

### Option 2: Deploy to Vercel

After enabling the template repository, you can deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL&root-directory=apps/next)

> **Note**: Replace `YOUR_REPO_URL` with your repository URL after making this a template on GitHub.


## 📦 What's Included

- **Solito** - Cross-platform navigation between Next.js and React Native
- **Next.js 16** - React framework for production
- **Expo SDK 54** - React Native framework
- **React 19** with React Compiler
- **tRPC** - End-to-end typesafe APIs
- **Supabase** - Backend as a service (database, auth, storage)
- **Lingui** - Internationalization (i18n)
- **Tamagui** - Universal design system
- **Sentry** - Error tracking and monitoring
- **Turborepo** - Monorepo build system
- **Biome** - Fast formatter and linter
- **Husky** - Git hooks

## 🗂 Project Structure

```
.
├── apps/
│   ├── expo/          # React Native app (Expo)
│   └── next/           # Next.js web app
├── packages/
│   ├── app/            # Shared app code (features, providers, navigation)
│   └── api/            # tRPC router and Supabase server client
└── supabase/           # Supabase migrations and config
```

## 🏁 Setup Instructions

### Prerequisites

- Node.js 18+ and Yarn 4.7.0+
- Docker (for local Supabase development)
- Git

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

#### For Next.js App

Copy the example environment file and fill in your values:

```bash
cp apps/next/.env.example apps/next/.env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)
- `NEXT_PUBLIC_SENTRY_DSN` - (Optional) Sentry DSN for error tracking
- `SENTRY_DSN` - (Optional) Server-side Sentry DSN
- `SENTRY_ORG` - (Optional) Sentry organization slug
- `SENTRY_PROJECT` - (Optional) Sentry project slug

#### For Expo App

```bash
cp apps/expo/.env.example apps/expo/.env
```

Required variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `EXPO_PUBLIC_API_URL` - Your Next.js API URL (for tRPC)
- `EXPO_PUBLIC_SENTRY_DSN` - (Optional) Sentry DSN for error tracking

### 3. Setup Supabase

#### Local Development

Start Supabase locally:

```bash
yarn supabase:start
```

This will:
- Start all Docker containers
- Run database migrations
- Load seed data

Get your local environment variables:

```bash
yarn supabase:status
```

Access Supabase Studio at: http://localhost:54323

#### Production Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the project settings
3. Update your environment variables with production values
4. Push your database schema:

```bash
# Link to your Supabase project (only needed once)
supabase link --project-ref your-project-ref

# Push migrations to production
supabase db push
```

⚠️ **Important**: The template includes a seed file. Review and modify `supabase/seed.sql` before deploying to production.

### 4. Update Supabase Project ID

Update the project ID in `supabase/config.toml`:

```toml
project_id = "your-project-name"
```

This helps distinguish different Supabase projects on the same machine.

### 5. Update API URLs

#### Expo tRPC Client

Update the production API URL in `apps/expo/utils/trpc/client.tsx`:

```typescript
return process.env.EXPO_PUBLIC_API_URL || 'https://your-domain.com/api/trpc'
```

### 6. Start Development Servers

#### Web (Next.js)

```bash
yarn web
```

Runs on http://localhost:3000

#### Mobile (Expo)

First, build a dev client:

```bash
cd apps/expo
expo run:ios
# or
expo run:android
```

Then, from the root:

```bash
yarn native
```

## 🚀 Deployment

### Vercel (Next.js)

1. Connect your repository to Vercel
2. Set the root directory to `apps/next`
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SENTRY_*` (if using Sentry)

4. Vercel will automatically detect:
   - Framework: Next.js
   - Build Command: `cd ../.. && npx turbo run build --filter=next-app`
   - Output Directory: `.next`

Or use the deploy button above after updating the repository URL.

### Expo (Mobile Apps)

Deploy using EAS (Expo Application Services):

```bash
cd apps/expo
eas build --platform ios
eas build --platform android
```

Configure `EXPO_PUBLIC_API_URL` in EAS environment variables to point to your deployed Next.js API.

## 🔔 Sentry Configuration

This template includes Sentry for error tracking. To enable:

1. Create a project at [sentry.io](https://sentry.io)
2. Get your DSN from project settings
3. Set the environment variables (see above)
4. Sentry will automatically initialize in both apps

## 🌍 Internationalization (i18n)

This template uses Lingui for i18n. Supported locales are configured in `packages/app/lingui.config.js`.

### Extract messages

```bash
yarn lingui:extract
```

### Compile messages

```bash
yarn lingui:compile
```

## 🛠 Development Commands

```bash
# Install dependencies
yarn install

# Start Next.js dev server
yarn web

# Start Expo dev server
yarn native

# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Supabase commands
yarn supabase:start      # Start local Supabase
yarn supabase:stop       # Stop local Supabase
yarn supabase:status     # Show connection details
yarn supabase:reset      # Reset database and run migrations
yarn supabase:logs       # View logs
```

## 📚 Documentation

- [Solito Documentation](https://solito.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [tRPC Documentation](https://trpc.io)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## 📝 License

This template is available as open source under the terms of the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Important Notes

- Review and customize `supabase/seed.sql` before deploying to production
- Update all hardcoded URLs and API endpoints in your codebase
- Set up proper environment variables for all environments
- Configure Sentry for production error tracking
- Set up proper database backups in Supabase
- Review security settings in Supabase dashboard

## 🆘 Troubleshooting

### Supabase local setup issues

If you encounter issues with local Supabase:

```bash
# Reset everything
yarn supabase:stop
docker system prune -a --volumes
yarn supabase:start
```

### Port conflicts

If ports 3000, 54321, 54322, or 54323 are in use, you can:
- Change ports in respective config files
- Stop the conflicting services

### Build issues

Clear caches and rebuild:

```bash
# Clear Turbo cache
rm -rf .turbo

# Clear Next.js cache
rm -rf apps/next/.next

# Reinstall dependencies
rm -rf node_modules apps/*/node_modules packages/*/node_modules
yarn install
```
