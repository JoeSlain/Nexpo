import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { TamaguiProvider } from 'tamagui'
import { config } from '../../../packages/app/tamagui.config'
import { view } from './storybook.requires'

// Refer to https://github.com/storybookjs/react-native/tree/master/app/react-native#getstorybookui-options
// To find allowed options for getStorybookUI
const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
})

// Wrap Storybook UI with TamaguiProvider
const App = () => (
  <TamaguiProvider config={config}>
    <StorybookUIRoot />
  </TamaguiProvider>
)

export default App
