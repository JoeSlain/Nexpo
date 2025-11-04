import { Trans } from '@lingui/react/macro'
import logo from 'app/assets/logo.png'
import { ScrollView, View } from 'react-native'
import { Image, Text } from 'tamagui'
import { AuthTestButton } from './auth-test-button'
import { LoginTest } from './login-test'

export function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        gap: 32,
        alignItems: 'center',
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
      }}
    >
      {/* Logo and NEXPO Header */}
      <View
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
      </View>

      <Text style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 16 }}>
        <Trans>Test authentication and protected endpoints</Trans>
      </Text>

      {/* Auth Testing Section */}
      <View
        style={{
          width: '100%',
          gap: 24,
          maxWidth: 500,
          alignItems: 'center',
        }}
      >
        <LoginTest />
        <AuthTestButton />
      </View>
    </ScrollView>
  )
}
