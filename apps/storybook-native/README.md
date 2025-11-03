# React Native Storybook

This is a React Native Storybook app for viewing and testing UI components with Tamagui integration.

## Features

- ✅ React Native Storybook integration
- ✅ Tamagui provider configured (same as web version)
- ✅ Monorepo support for shared UI components
- ✅ Expo integration
- ✅ TypeScript support

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Run Storybook

```bash
yarn start
# or
yarn ios
# or
yarn android
```

The app will start with Storybook UI integrated.

## Configuration

### Storybook Setup

- **Main Config**: `.storybook/main.ts` - Storybook configuration
- **Preview**: `.storybook/preview.tsx` - Global decorators and parameters
- **Entry Point**: `.storybook/index.tsx` - Wraps Storybook UI with TamaguiProvider

### Tamagui Integration

Tamagui is configured using the shared config from `packages/app/tamagui.config.ts`, ensuring consistency with the web Storybook and the main app.

### Story Locations

Stories are automatically loaded from:
- `src/**/*.stories.tsx` (local stories)
- `packages/ui/src/**/*.stories.tsx` (shared UI package stories)

## Writing Stories for React Native

When writing stories that should work in both web and React Native Storybook:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native'
// or use '@storybook/react-vite' for web-only stories

import { ExampleButton } from './ExampleButton'

const meta = {
  title: 'UI/ExampleButton',
  component: ExampleButton,
  // ... rest of config
} satisfies Meta<typeof ExampleButton>

export default meta
```

Note: For stories shared between web and native, you may need platform-specific story files or conditional imports.

## Monorepo Integration

The app is configured to work with the monorepo:
- Metro bundler resolves workspace packages
- Stories from `packages/ui` are automatically loaded
- Tamagui config is shared from `packages/app`



