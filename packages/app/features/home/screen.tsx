import { Trans } from '@lingui/react/macro'
import logo from 'app/assets/logo.png'
import { useTheme } from 'app/provider/theme'
import { Button, Image, ScrollView, Text, XStack, YStack } from 'tamagui'
import { AuthTestButton } from './auth-test-button'
import { LoginTest } from './login-test'

export function HomeScreen() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <YStack bg="$background" flex={1}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          {
            padding: 24,
            gap: 32,
            alignItems: 'center',
            maxWidth: 800,
            width: '100%',
            alignSelf: 'center',
          } as any
        }
      >
        {/* Theme Toggle Button */}
        <YStack
          style={{
            width: '100%',
            alignItems: 'flex-end',
            marginTop: 8,
          }}
        >
          <Button onPress={toggleTheme} size="$3" style={{ minWidth: 120 }}>
            <Text color="white" fontWeight="600">
              {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Text>
          </Button>
        </YStack>

        {/* Logo and NEXPO Header */}
        <XStack
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          {typeof logo === 'number' ? (
            // React Native: logo is a number (require id)
            <Image source={logo} width={128} height={128} objectFit="contain" alt="NEXPO Logo" />
          ) : (
            // Web (Next.js): logo is an object with src property
            <Image src={logo.src} width={128} height={128} objectFit="contain" alt="NEXPO Logo" />
          )}
          <Text style={{ fontSize: 48, fontWeight: '800', letterSpacing: 2 }}>NEXPO</Text>
        </XStack>

        <Text
          style={{ fontSize: 16, textAlign: 'center', marginBottom: 16 }}
          color="$color"
          opacity={0.7}
        >
          <Trans>Test authentication and protected endpoints</Trans>
        </Text>

        {/* Auth Testing Section */}
        <YStack
          style={{
            width: '100%',
            gap: 24,
            maxWidth: 500,
            alignItems: 'center',
          }}
        >
          <LoginTest />
          <AuthTestButton />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
