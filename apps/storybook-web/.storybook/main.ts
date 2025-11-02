import type { StorybookConfig } from '@storybook/react-vite'

import { dirname, join } from 'path'

import { fileURLToPath } from 'url'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const dirname_ =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/**/*.mdx',
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-a11y'),
    // Note: @storybook/addon-vitest is only needed for testing, not dev mode
    // It's configured in vite.config.ts for actual test runs
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: async (config) => {
    // Resolve workspace packages
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      ui: join(dirname_, '../../../packages/ui/src'),
      'app/tamagui.config': join(dirname_, '../../../packages/app/tamagui.config'),
    }
    // Set Tamagui target for web
    config.define = {
      ...config.define,
      'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
    }
    return config
  },
}
export default config
