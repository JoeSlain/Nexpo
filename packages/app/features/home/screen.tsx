'use client'

import { Trans } from '@lingui/react/macro'
import { useLocale } from 'app/provider/local/LocaleProvider'
import { View } from 'react-native'
import { TextLink } from 'solito/link'
import { Text } from 'tamagui'
import { ExampleButton } from 'ui'
export function HomeScreen() {
  const { locale } = useLocale()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 32,
      }}
    >
      <ExampleButton>
        <Text>
          <Trans>This button is from the ui package</Trans>
        </Text>
      </ExampleButton>
      <H1>
        <Trans>Welcome to Nexpo.</Trans>
      </H1>
      <View style={{ maxWidth: 600, gap: 16 }}>
        <Text style={{ textAlign: 'center' }}>
          <Trans>
            Here is a basic starter to show you how you can navigate from one screen to another.
            This screen uses the same code on Next.js and React Native.
          </Trans>
        </Text>
      </View>
      <View style={{ maxWidth: 600, gap: 8, marginTop: 16 }}>
        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>
          <Trans>Locale Information:</Trans>
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 12 }}>
          <Trans>
            Language: {locale.languageTag} ({locale.languageCode})
          </Trans>
          {locale.regionCode && ` - Region: ${locale.regionCode}`}
        </Text>
        {locale.currencyCode && (
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            <Trans>
              Currency: {locale.currencySymbol} ({locale.currencyCode})
            </Trans>
          </Text>
        )}
        <Text style={{ textAlign: 'center', fontSize: 12 }}>
          <Trans>
            Measurement: {locale.measurementSystem} • Temperature: {locale.temperatureUnit}
          </Trans>
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextLink
          href="/users/test"
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'blue',
          }}
        >
          <Trans>Link</Trans>
        </TextLink>
      </View>
    </View>
  )
}

const H1 = ({ children }: { children: React.ReactNode }) => {
  return <Text style={{ fontWeight: '800', fontSize: 24 }}>{children}</Text>
}
