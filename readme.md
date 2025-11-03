
<img width="800" height="364" alt="image" src="https://github.com/user-attachments/assets/b7f3f7bc-0061-4415-94bc-48b2d557f180" />

A production-ready monorepo template for building cross-platform applications with Next.js and React Native (Expo)

Based on [Fernando Rojo's work](https://github.com/nandorojo/solito/tree/master/example-monorepos/blank)

## 🎯 Quick Start

1. Click "Use this template" on GitHub
2. Clone your new repository
3. Follow the [Setup Instructions](#-setup-instructions)



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

- Node.js 20+ and Yarn 4.7.0+
- Docker (for local Supabase development)
- Git

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

Both apps use `dotenv-cli` to automatically load environment variables from their respective `.env` files when running yarn scripts. Environment variables are loaded from `.env` files in each app directory.

#### Root-level Environment Variables

Copy the root `.env.example` file:

```bash
cp .env.example .env
```

#### For Next.js App

Copy the example environment file and fill in your values:



> **Note**: Next.js scripts automatically load environment variables from `.env.local` via `dotenv-cli`.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)
- `NEXT_PUBLIC_SENTRY_DSN` - (Optional) Sentry DSN for error tracking
- `SENTRY_DSN` - (Optional) Server-side Sentry DSN
- `SENTRY_ORG` - (Optional) Sentry organization slug
- `SENTRY_PROJECT` - (Optional) Sentry project slug

#### For Expo App



> **Note**: Expo scripts automatically load environment variables from `.env` via `dotenv-cli`.

Required variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `EXPO_PUBLIC_API_URL` - Your Next.js API URL (for tRPC)
- `EXPO_PUBLIC_SENTRY_DSN` - (Optional) Sentry DSN for error tracking



Required variables:
- `OPENAI_API_KEY` - (Optional) OpenAI API key for automated translations using `lingui-ai-translate`. Get your key from [platform.openai.com](https://platform.openai.com/api-keys)

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

Both apps use `dotenv-cli` to automatically load environment variables from their respective `.env` files when running yarn scripts.

#### Web (Next.js)

```bash
yarn web
```

This will:
- Load environment variables from `apps/next/.env.local`
- Start the Next.js dev server
- Run on http://localhost:3000

You can also run directly from the `apps/next` directory:
```bash
cd apps/next
yarn dev
```

#### Mobile (Expo)

First, build a dev client:

```bash
cd apps/expo
yarn ios
# or
yarn android
```

Then, from the root:

```bash
yarn native
```

Or run directly from the `apps/expo` directory:
```bash
cd apps/expo
yarn start
```

The Expo scripts automatically load environment variables from `apps/expo/.env`.

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

### Workflow

The typical i18n workflow consists of three steps:

1. **Extract messages** - Extract translatable strings from your code
2. **Translate messages** - Translate messages using AI or manual translation
3. **Compile messages** - Compile translations for runtime use

### Extract messages

Extract translatable strings from your codebase:

```bash
yarn lingui:extract
```

This scans your code for `t` macros and other Lingui translation functions and generates `.po` files in `packages/app/locales/`.

### Translate messages

#### Using AI Translation (Recommended)

This template includes `lingui-ai-translate` for automated translations using OpenAI's API.

**Setup:**

1. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add it to your environment variables:

   For root `.env` (used by lingui-ai-translate):
   ```bash
   OPENAI_API_KEY=your-openai-api-key-here
   ```

   Or export it in your shell:
   ```bash
   export OPENAI_API_KEY=your-openai-api-key-here
   ```

3. Run the translation command:

   ```bash
   yarn lingui:translate
   ```

This will automatically translate all messages in your `.po` files to all configured locales using OpenAI's API. The translations preserve placeholders and formatting.

#### Manual Translation

You can also manually edit the `.po` files in `packages/app/locales/` to translate messages yourself.

### Compile messages

After translating, compile the messages for runtime use:

```bash
yarn lingui:compile
```

This generates optimized `.js` files that are used by your application at runtime.

## 🛠 Development Commands

```bash
# Install dependencies
yarn install

# Start Next.js dev server (loads .env.local automatically)
yarn web

# Start Expo dev server (loads .env automatically)
yarn native

# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Lingui commands
yarn lingui:extract      # Extract translatable messages from code
yarn lingui:translate   # Translate messages using AI (requires OPENAI_API_KEY)
yarn lingui:compile     # Compile translations for runtime use

# Supabase commands
yarn supabase:start      # Start local Supabase
yarn supabase:stop       # Stop local Supabase
yarn supabase:status     # Show connection details
yarn supabase:reset      # Reset database and run migrations
yarn supabase:logs       # View logs
```

### Environment Variables in Scripts

Both apps use `dotenv-cli` to automatically load environment variables when running yarn scripts:

- **Next.js**: Scripts automatically load from `apps/next/.env.local`
- **Expo**: Scripts automatically load from `apps/expo/.env`

All `yarn` commands within each app directory will automatically load the appropriate `.env` file, so you don't need to manually source or export environment variables.

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
