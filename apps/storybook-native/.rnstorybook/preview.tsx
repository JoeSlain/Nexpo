import type { Preview } from '@storybook/react-native'
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
