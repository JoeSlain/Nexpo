import { Trans } from '@lingui/react/macro'
import logo from 'app/assets/logo.png'
import { useSafeArea } from 'app/provider/safe-area/use-safe-area'
import { useTheme } from 'app/provider/theme'
import { Button, Card, H2, H3, Image, ScrollView, Separator, Text, XStack, YStack } from 'tamagui'
import { AuthTestButton } from './auth-test-button'
import { LocaleDemo } from './locale-demo'
import { LoginTest } from './login-test'

const TECHNOLOGIES = [
  { name: 'Next.js 16', icon: '⚡' },
  { name: 'Expo SDK 54', icon: '📱' },
  { name: 'React 19', icon: '⚛️' },
  { name: 'tRPC', icon: '🔌' },
  { name: 'Supabase', icon: '🗄️' },
  { name: 'Tamagui', icon: '🎨' },
  { name: 'Lingui', icon: '🌍' },
  { name: 'Sentry', icon: '📊' },
] as const

export function HomeScreen() {
  const { resolvedTheme, setTheme } = useTheme()
  const { top, bottom, left, right } = useSafeArea()

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <YStack bg="$background" flex={1}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <YStack
          style={{
            padding: 24,
            gap: 32,
            alignItems: 'center',
            maxWidth: 900,
            width: '100%',
            alignSelf: 'center',
            flex: 0,
          }}
        >
          {/* Header Section */}
          <YStack
            style={{
              width: '100%',
              alignItems: 'center',
              gap: 24,
              marginTop: 16,
            }}
          >
            {/* Theme Toggle */}
            <XStack
              style={{
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <Button onPress={toggleTheme} size="$3" circular testID="theme-toggle-button">
                <Text color="white" fontWeight="600">
                  {resolvedTheme === 'dark' ? '☀️' : '🌙'}
                </Text>
              </Button>
            </XStack>

            {/* Logo and Title */}
            <XStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              {typeof logo === 'number' ? (
                <Image source={logo} width={96} height={96} objectFit="contain" alt="NEXPO Logo" />
              ) : (
                <Image src={logo.src} width={96} height={96} objectFit="contain" alt="NEXPO Logo" />
              )}
              <YStack gap={4}>
                <H2 style={{ fontSize: 42, fontWeight: '800', letterSpacing: 1 }}>NEXPO</H2>
                <Text style={{ fontSize: 14, opacity: 0.7 }} color="$color">
                  <Trans>Cross-platform monorepo template</Trans>
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Description */}
          <Text
            style={{ fontSize: 18, textAlign: 'center', lineHeight: 28, maxWidth: 600 }}
            color="$color"
            opacity={0.9}
          >
            <Trans>
              A production-ready monorepo template for building cross-platform applications with
              Next.js and React Native (Expo)
            </Trans>
          </Text>

          <Separator />

          {/* Key Features */}
          <YStack
            style={{
              width: '100%',
              gap: 16,
            }}
          >
            <H3 style={{ textAlign: 'center', marginBottom: 8 }}>
              <Trans>What's Included</Trans>
            </H3>
            <XStack
              style={{
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'center',
              }}
            >
              {TECHNOLOGIES.map((tech) => (
                <Card
                  key={tech.name}
                  elevate
                  size="$4"
                  bordered
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 20,
                    width: 100,
                    minHeight: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>{tech.icon}</Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: '600', textAlign: 'center' }}
                    color="$color"
                  >
                    {tech.name}
                  </Text>
                </Card>
              ))}
            </XStack>
          </YStack>

          <Separator />

          {/* Demo Section */}
          <YStack
            style={{
              width: '100%',
              gap: 24,
              maxWidth: 600,
            }}
          >
            <YStack style={{ gap: 8, alignItems: 'center' }}>
              <H3>
                <Trans>Demo Features</Trans>
              </H3>
              <Text style={{ fontSize: 14, textAlign: 'center' }} color="$color" opacity={0.7}>
                <Trans>
                  Try out authentication and protected API endpoints to see the template in action
                </Trans>
              </Text>
            </YStack>

            <YStack style={{ gap: 20 }}>
              <LoginTest />
              <AuthTestButton />
            </YStack>
          </YStack>

          <Separator />

          {/* Locale Demo Section */}
          <YStack
            style={{
              width: '100%',
              gap: 24,
              maxWidth: 600,
            }}
          >
            <YStack style={{ gap: 8, alignItems: 'center' }}>
              <H3>
                <Trans>Internationalization (i18n)</Trans>
              </H3>
              <Text style={{ fontSize: 14, textAlign: 'center' }} color="$color" opacity={0.7}>
                <Trans>
                  Test the useLocale hook to switch languages and see how translations work in
                  real-time
                </Trans>
              </Text>
            </YStack>

            <LocaleDemo />
          </YStack>

          {/* Quick Links */}
          <YStack
            style={{
              width: '100%',
              gap: 12,
              maxWidth: 500,
              paddingTop: 8,
            }}
          >
            <Text style={{ fontSize: 14, textAlign: 'center', opacity: 0.6 }} color="$color">
              <Trans>Check the README.md for setup instructions and documentation</Trans>
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
