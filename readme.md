
<img width="800" height="364" alt="NEXPO banner" src="https://github.com/user-attachments/assets/9ab52f3e-fe95-40ed-9a54-a7e5e80b555f" />

A production-ready monorepo template for building cross-platform applications with Next.js and React Native (Expo)

Based on [Fernando Rojo's work](https://github.com/nandorojo/solito/tree/master/example-monorepos/blank)



## 🎯 Quick Start
### ⚡️ Instantly clone & deploy on vercel
(You still need to setup supabase manually)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJoeSlain%2Fnexpo)

### Manual setup
1. Click "Use this template" on GitHub
2. Clone your new repository
3. Follow the [Setup Instructions](#-setup-instructions) below


## 📦 What's Included

- **Solito** - Cross-platform navigation between Next.js and React Native
- **Next.js 16** - React framework for production
- **Expo SDK 54** - React Native framework
- **React 19** with React Compiler
- **tRPC** - End-to-end typesafe APIs
- **Supabase** - Backend as a service (database, auth, storage)
- **Lingui** - Internationalization (i18n)
- **Tamagui** - Universal design system
- **Storybook** - Component development and testing (web & native)
- **Sentry** - Error tracking and monitoring
- **Turborepo** - Monorepo build system
- **Biome** - Fast formatter and linter
- **Husky** - Git hooks

## 🗂 Project Structure

```
.
├── apps/
│   ├── expo/          # React Native app (Expo)
│   ├── next/           # Next.js web app
│   ├── storybook-native/  # React Native Storybook
│   └── storybook-web/     # Web Storybook
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

This project uses environment-specific configuration files for development and production. Each app has separate `.env.development` and `.env.production` files.

#### Environment File Structure

**Next.js (`apps/next/`):**
- `.env.development` - Development environment variables (auto-loaded when `NODE_ENV=development`)
- `.env.production` - Production environment variables (auto-loaded when `NODE_ENV=production`)
- `.env.local` - Local overrides (gitignored, highest priority, never commit this file)

**Expo (`apps/expo/`):**
- `.env.development` - Development environment variables (loaded via helper script)
- `.env.production` - Production environment variables (loaded via helper script)
- `.env.local` - Local overrides (gitignored, highest priority, never commit this file)

> **Note**: Next.js automatically loads environment files based on `NODE_ENV`. Expo uses a custom helper script (`scripts/load-env.js`) to achieve the same behavior.

#### Setup Instructions

1. **Update development values** in `apps/next/.env.development` and `apps/expo/.env.development`:
   - Set your local Supabase URL: `http://127.0.0.1:54321`
   - Get your local Supabase anon key by running `yarn supabase:status`
   - For Expo, set `EXPO_PUBLIC_API_URL` to `http://localhost:3000/api/trpc` (or your machine's IP for physical devices)

2. **Update production values** in `apps/next/.env.production` and `apps/expo/.env.production`:
   - Replace placeholder values with your actual production Supabase credentials
   - Set production API URLs
   - Configure production Sentry DSNs

3. **Create `.env.local` files** (optional, for local overrides):
   ```bash
   # These files are gitignored and should contain only your local secrets
   touch apps/next/.env.local
   touch apps/expo/.env.local
   ```

#### Required Variables

**Next.js:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - (Optional) For server-side operations with elevated permissions
- `NEXT_PUBLIC_SENTRY_DSN` - (Optional) Sentry DSN for client-side error tracking
- `SENTRY_DSN` - (Optional) Server-side Sentry DSN
- `SENTRY_ORG` - (Optional) Sentry organization slug
- `SENTRY_PROJECT` - (Optional) Sentry project slug

**Expo:**
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `EXPO_PUBLIC_API_URL` - Your Next.js API URL (for tRPC)
- `EXPO_PUBLIC_SENTRY_DSN` - (Optional) Sentry DSN for error tracking

**Root (for lingui-ai-translate):**
- `OPENAI_API_KEY` - (Optional) OpenAI API key for automated translations. Get your key from [platform.openai.com](https://platform.openai.com/api-keys)

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

This will:
- Automatically load `.env.development` and `.env.local` (if exists) based on `NODE_ENV=development`
- Start the Next.js dev server
- Run on http://localhost:3000

You can also run directly from the `apps/next` directory:
```bash
cd apps/next
yarn dev
```

> **Note**: Next.js automatically loads environment files based on `NODE_ENV`. No `dotenv-cli` needed.

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

The Expo scripts automatically load `.env.development` and `.env.local` (if exists) via the `load-env.js` helper script.

## 🚀 Deployment

### Vercel (Next.js)

1. Connect your repository to Vercel
2. Set the root directory to `apps/next`
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your production Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your production Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your production service role key
   - `SENTRY_*` - (Optional) Sentry configuration for production

   > **Note**: Vercel automatically sets `NODE_ENV=production` during build, so Next.js will load `.env.production` automatically. However, you should set production values in Vercel's environment variables dashboard for security.

4. Vercel will automatically detect:
   - Framework: Next.js
   - Build Command: `cd ../.. && npx turbo run build --filter=next-app`
   - Output Directory: `.next`

Or use the deploy button above after updating the repository URL.

### Expo (Mobile Apps)

Deploy using EAS (Expo Application Services):

#### Prerequisites

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to EAS**:
   ```bash
   eas login
   ```

#### Configuration

The `eas.json` file is already configured with build profiles:
- **development**: Development client builds (simulator/APK)
- **preview**: Internal distribution builds (APK)
- **production**: Production app store builds (App Bundle/IPA)

3. **Configure environment variables in EAS**:
   ```bash
   cd apps/expo
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-production-anon-key"
   eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://your-domain.com/api/trpc"
   eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "your-sentry-dsn"  # Optional
   ```

   Or configure them in the [EAS dashboard](https://expo.dev/accounts/[your-account]/projects/nexpo/secrets).

4. **Update submit credentials** (optional, for automated submissions):
   Edit `apps/expo/eas.json` and update the `submit.production` section with your:
   - Apple ID, App Store Connect App ID, and Team ID (for iOS)
   - Google Play service account key path (for Android)

#### Build and Submit

5. **Build for production**:
   ```bash
   cd apps/expo
   
   # Build for iOS
   npm run eas:build:ios:profile
   
   # Build for Android
   npm run eas:build:android:profile
   
   # Build for both platforms
   npm run eas:build:all -- --profile production
   ```

6. **Submit to app stores**:
   ```bash
   cd apps/expo
   
   # Submit iOS build
   npm run eas:submit:ios
   
   # Submit Android build
   npm run eas:submit:android
   ```

#### OTA Updates

Publish over-the-air updates without rebuilding:

```bash
cd apps/expo

# Publish update to production channel
npm run eas:update:republish

# Or use interactive mode
npm run eas:update
```

#### Available EAS Scripts

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

## 📚 Storybook

This template includes Storybook for both web and React Native, allowing you to develop and test UI components in isolation.

### Web Storybook

Start the web Storybook to view and test components in a browser environment:

```bash
yarn storybook:web
```

This will start Storybook on http://localhost:6006

### React Native Storybook

Start the React Native Storybook to view and test components in a mobile environment:

```bash
yarn storybook:native
```

This will start Storybook on http://localhost:7007 and open the Expo app with Storybook UI integrated.

You can also run it directly from the `apps/storybook-native` directory:

```bash
cd apps/storybook-native
yarn storybook
# or run the Expo app directly
yarn ios
# or
yarn android
```

### Story Locations

Stories are automatically loaded from:
- `apps/storybook-web/src/**/*.stories.tsx` (web stories)
- `apps/storybook-native/src/**/*.stories.tsx` (native stories)
- `packages/ui/src/**/*.stories.tsx` (shared UI package stories)

### Features

- **Tamagui Integration** - Both Storybook apps use the shared Tamagui config from `packages/app/tamagui.config.ts`
- **Monorepo Support** - Stories from shared packages are automatically loaded
- **TypeScript Support** - Full TypeScript support for stories
- **Addons** - Web Storybook includes accessibility, docs, and testing addons

### Writing Stories

When writing stories that should work in both web and React Native:

```tsx
import type { Meta, StoryObj } from '@storybook/react' // web
// or '@storybook/react-native' for native-only stories

import { YourComponent } from './YourComponent'

const meta = {
  title: 'UI/YourComponent',
  component: YourComponent,
  // ... rest of config
} satisfies Meta<typeof YourComponent>

export default meta
```

For platform-specific stories, use platform-specific story files or conditional imports.

## 🆕 Add new dependencies

### Pure JS dependencies

If you're installing a JavaScript-only dependency that will be used across platforms, install it in `packages/app`:

```bash
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### Native dependencies

If you're installing a library with any native code, you must install it in `apps/expo`:

```bash
cd apps/expo
yarn add react-native-reanimated
cd ../..
yarn
```

You can also install the native library inside of `packages/app` if you want to get autoimport for that package inside of the app folder. However, you need to be careful and install the exact same version in both packages. If the versions mismatch at all, you'll potentially get terrible bugs. This is a classic monorepo issue.

To check for and fix version mismatches, use the `check-deps` command:

```bash
# Check for version mismatches
yarn check-deps

# Automatically fix version mismatches
yarn check-deps:fix
```

Always run `yarn check-deps` after installing dependencies to ensure all packages are using compatible versions.

## 🛠 Development Commands

```bash
# Install dependencies
yarn install

# Start Next.js dev server (loads .env.local automatically)
yarn web

# Start Expo dev server (loads .env automatically)
yarn native

# Start Storybook
yarn storybook:web      # Web Storybook (port 6006)
yarn storybook:native  # React Native Storybook (port 7007)

# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# EAS commands (from apps/expo directory)
cd apps/expo
npm run eas:build:android      # Build for Android
npm run eas:build:ios          # Build for iOS
npm run eas:submit:android     # Submit Android build
npm run eas:submit:ios         # Submit iOS build
npm run eas:update             # Publish OTA update

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

# Dependency management
yarn check-deps          # Check for version mismatches across packages
yarn check-deps:fix      # Automatically fix version mismatches
```

### Environment Variables in Scripts

**Next.js:**
- Automatically loads `.env.development` when `NODE_ENV=development` (default for `yarn dev`)
- Automatically loads `.env.production` when `NODE_ENV=production` (default for `yarn build` and `yarn start`)
- Always loads `.env.local` last (highest priority, gitignored)
- No `dotenv-cli` needed - Next.js handles this natively

**Expo:**
- Uses `scripts/load-env.js` helper to load environment files based on `NODE_ENV`
- Loads `.env.development` when `NODE_ENV=development` (default for `yarn start`, `yarn ios`, `yarn android`)
- Loads `.env.production` when `NODE_ENV=production` (for `yarn build:ios`, `yarn build:android`)
- Always loads `.env.local` last (highest priority, gitignored)

All `yarn` commands within each app directory automatically load the appropriate environment files based on `NODE_ENV`, so you don't need to manually source or export environment variables.

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
