import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from 'app/features/home/screen'
import { UserDetailScreen } from 'app/features/user/detail-screen'
import { useTheme } from 'app/provider/theme'
import { useTheme as useTamaguiTheme } from 'tamagui'

const Stack = createNativeStackNavigator<{
  home: undefined
  'user-detail': {
    id: string
  }
}>()

export function NativeNavigation() {
  const { resolvedTheme } = useTheme()
  const tamaguiTheme = useTamaguiTheme()

  // Get theme colors from Tamagui
  const backgroundColor =
    tamaguiTheme.background?.val || (resolvedTheme === 'dark' ? '#000000' : '#ffffff')
  const textColor = tamaguiTheme.color?.val || (resolvedTheme === 'dark' ? '#ffffff' : '#000000')

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          color: textColor,
        },
      }}
    >
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="user-detail"
        component={UserDetailScreen}
        options={{
          title: 'User',
        }}
      />
    </Stack.Navigator>
  )
}
