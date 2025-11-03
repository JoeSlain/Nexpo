import type { Preview } from '@storybook/react-vite'
// React import needed for JSX in decorators (even with new JSX transform)
import React from 'react'
import { TamaguiProvider } from 'tamagui'
import { config } from '../../../packages/app/tamagui.config'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <TamaguiProvider config={config}>
        <Story />
      </TamaguiProvider>
    ),
  ],
}

export default preview
