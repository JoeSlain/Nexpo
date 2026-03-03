import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        '**/*.stories.tsx',
        '**/*.d.ts',
        'dist/**',
        'assets/**',
        'locales/**',
      ],
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'app/assets': resolve(__dirname, './assets'),
      'app/provider': resolve(__dirname, './provider'),
      'app/features': resolve(__dirname, './features'),
    },
  },
})
