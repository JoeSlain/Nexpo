# Blank Solito Example Monorepo 🕴

```sh
npx create-solito-app@latest my-solito-app
```

## ⚡️ Instantly clone & deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnandorojo%2Fsolito%2Ftree%2Fmaster%2Fexample-monorepos%2Fblank&env=ENABLE_ROOT_PATH_BUILD_CACHE&root-directory=apps/next&envDescription=Set%20this%20environment%20variable%20to%201%20for%20Turborepo%20to%20cache%20your%20node_modules.&envLink=https%3A%2F%2Ftwitter.com%2Fjaredpalmer%2Fstatus%2F1488954563533189124&project-name=solito-app&repo-name=solito-app&demo-title=Solito%20App%20%E2%9A%A1%EF%B8%8F&demo-description=React%20Native%20%2B%20Next.js%20starter%20with%20Solito.%20Made%20by%20Fernando%20Rojo.&demo-url=https%3A%2F%2Fsolito.dev%2Fstarter&demo-image=https%3A%2F%2Fsolito.dev%2Fimg%2Fog.png&build-command=cd+..%2F..%3Bnpx+turbo+run+build+--filter%3Dnext-app)

## 📦 Included packages

- `tamagui` for styling
- `solito` for cross-platform navigation
- `moti` for animations
- Expo SDK 54
- Next.js 16
- React Navigation 7
- React 19
- React Compiler
- Lingui for i18n
- Sentry for error tracking
- Biome for linting and formatting
- Husky for pre-commit hooks
- Lint-staged for pre-commit linting

For more, see the [compatibility docs](https://solito.dev/compatibility).

## 🗂 Folder layout

- `apps` entry points for each app

  - `expo`
  - `next`

- `packages` shared packages across apps
  - `app` you'll be importing most files from `app/`
    - `features` (don't use a `screens` folder. organize by feature.)
    - `provider` (all the providers that wrap the app, and some no-ops for Web.)
    - `navigation` Next.js has a `pages/` folder. React Native doesn't. This folder contains navigation-related code for RN. You may use it for any navigation code, such as custom links.

You can add other folders inside of `packages/` if you know what you're doing and have a good reason to.

## 🏁 Start the app

- Install dependencies: `yarn`

- Next.js local dev: `yarn web`
  - Runs `yarn next`
- Expo local dev:
  - First, build a dev client onto your device or simulator
    - `cd apps/expo`
    - Then, either `expo run:ios`, or `eas build`
  - After building the dev client, from the root of the monorepo...
    - `yarn native` (This runs `expo start --dev-client`)

## 🔔 Sentry Error Tracking

This project includes Sentry for error tracking and monitoring on both Next.js and Expo apps.

### Configuration

Set the following environment variables:

**For Next.js:**
- `NEXT_PUBLIC_SENTRY_DSN` - Client-side DSN (public)
- `SENTRY_DSN` - Server-side and edge DSN
- `SENTRY_ORG` - Your Sentry organization slug (for source map uploads)
- `SENTRY_PROJECT` - Your Sentry project slug (for source map uploads)

**For Expo:**
- `EXPO_PUBLIC_SENTRY_DSN` - Client-side DSN (public)

Get your DSN from https://sentry.io/settings/<org>/projects/<project>/keys/

### Configuration Files

- **Next.js**: `apps/next/sentry.client.config.ts`, `apps/next/sentry.server.config.ts`, `apps/next/sentry.edge.config.ts`
- **Expo**: `apps/expo/sentry.config.ts`

Sentry is automatically initialized in both apps. Error boundaries and automatic error reporting are enabled by default.

## 🆕 Add new dependencies

### Pure JS dependencies

If you're installing a JavaScript-only dependency that will be used across platforms, install it in `packages/app`:

```sh
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### Native dependencies

If you're installing a library with any native code, you must install it in `apps/expo`:

```sh
cd apps/expo
yarn add react-native-reanimated

cd ../..
yarn
```

You can also install the native library inside of `packages/app` if you want to get autoimport for that package inside of the `app` folder. However, you need to be careful and install the _exact_ same version in both packages. If the versions mismatch at all, you'll potentially get terrible bugs. This is a classic monorepo issue. I use `lerna-update-wizard` to help with this (you don't need to use Lerna to use that lib).
