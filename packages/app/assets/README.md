# Shared Assets

This directory contains shared image assets that can be used in both Next.js and Expo apps.

## Available Assets

- `logo.png` - The application logo

## Usage

### Direct Import (Recommended)

```tsx
import logo from 'app/assets/logo.png'

// In Next.js/web
<img src={logo as string} alt="Logo" />

// In Expo/React Native with expo-image
import { Image } from 'expo-image'
<Image source={logo} style={{ width: 200, height: 200 }} />
```

### Using the Logo Component

```tsx
import { Logo } from 'app/components/Logo.example'

<Logo width={200} height={200} />
```

### Import from Assets Index

```tsx
import { logo } from 'app/assets'

// Use the same way as direct import
```

## Notes

- Images are automatically handled by:
  - Next.js webpack config (web)
  - Metro bundler (React Native/Expo)
- TypeScript declarations are included in `assets.d.ts`
- The logo component (`Logo.example.tsx`) handles platform differences automatically





