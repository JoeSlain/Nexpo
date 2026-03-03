'use client'

import { Trans } from '@lingui/react/macro'
import { useLocale } from 'app/provider/local/LocaleProvider'
import type { ReactNode } from 'react'
import { Card, Text, XStack, YStack } from 'tamagui'

const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

interface InfoRowProps {
  label: ReactNode
  value: ReactNode
}

function InfoRow({ label, value }: InfoRowProps): ReactNode {
  return (
    <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 14, opacity: 0.7 }} color="$color">
        {label}:
      </Text>
      <Text style={{ fontSize: 14, fontWeight: '600' }} color="$color">
        {value}
      </Text>
    </XStack>
  )
}

export function LocaleDemo() {
  const { locale, setLocale } = useLocale()

  const currentLocaleInfo = SUPPORTED_LOCALES.find((l) => l.code === locale.languageCode)

  return (
    <View
      style={{
        padding: 16,
        gap: 16,
        width: '100%',
      }}
    >
      <YStack style={{ gap: 12, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          <Trans>Internationalization (i18n) Demo</Trans>
        </Text>
        <Text style={{ fontSize: 12, textAlign: 'center', opacity: 0.7 }} color="$color">
          <Trans>
            Use the useLocale hook to access locale information and switch languages dynamically
          </Trans>
        </Text>
      </YStack>

      <Card elevate size="$3" bordered style={{ padding: 16 }}>
        <YStack style={{ gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }} testID="current-locale-title">
            <Trans>Current Locale</Trans>
          </Text>
          <YStack style={{ gap: 8 }}>
            <InfoRow
              label={<Trans>Language</Trans>}
              value={
                <XStack style={{ gap: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>{currentLocaleInfo?.flag || '🌐'}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600' }} color="$color">
                    {currentLocaleInfo?.name || locale.languageCode}
                  </Text>
                </XStack>
              }
            />
            <InfoRow label={<Trans>Language Tag</Trans>} value={locale.languageTag} />
            <InfoRow label={<Trans>Language Code</Trans>} value={locale.languageCode || 'N/A'} />
            <InfoRow
              label={<Trans>Text Direction</Trans>}
              value={locale.textDirection?.toUpperCase() || 'LTR'}
            />
          </YStack>
        </YStack>
      </Card>

      <YStack style={{ gap: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '600' }}>
          <Trans>Switch Language</Trans>:
        </Text>
        <XStack
          style={{
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          {SUPPORTED_LOCALES.map((loc) => {
            const isActive = locale.languageCode === loc.code
            return (
              <Card
                key={loc.code}
                elevate
                size="$3"
                bordered
                onPress={() => setLocale(loc.code)}
                backgroundColor={isActive ? '$blue10' : undefined}
                testID={`locale-${loc.code}-card`}
                style={{
                  width: 90,
                  minHeight: 90,
                  paddingHorizontal: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.8,
                }}
                {...(isActive && {
                  pressStyle: { backgroundColor: '$blue10' },
                  hoverStyle: { backgroundColor: '$blue10', opacity: 1 },
                })}
              >
                <YStack style={{ gap: 6, alignItems: 'center' }}>
                  <Text style={{ fontSize: 28 }}>{loc.flag}</Text>
                  <Text
                    color={isActive ? 'white' : '$color'}
                    style={{
                      fontSize: 11,
                      fontWeight: isActive ? '700' : '600',
                      textAlign: 'center',
                    }}
                  >
                    {loc.name}
                  </Text>
                </YStack>
              </Card>
            )
          })}
        </XStack>
      </YStack>

      <Card elevate size="$3" bordered style={{ padding: 16, backgroundColor: '$blue2' }}>
        <YStack style={{ gap: 8 }}>
          <Text
            style={{ fontSize: 14, fontWeight: '600', opacity: 0.8 }}
            color="$color"
            testID="example-translated-text-title"
          >
            <Trans>Example Translated Text</Trans>:
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '500' }} color="$color">
            <Trans>
              This text changes based on the selected locale. The useLocale hook provides access to
              locale information and works seamlessly with Lingui for translations.
            </Trans>
          </Text>
        </YStack>
      </Card>

      <Card elevate size="$3" bordered style={{ padding: 16, backgroundColor: '$gray2' }}>
        <YStack style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600' }} color="$color">
            <Trans>Usage Example</Trans>:
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'monospace', opacity: 0.8 }} color="$color">
            {`const { locale, setLocale } = useLocale()

// Access locale info
locale.languageCode // "en", "cs", "fr"
locale.textDirection // "ltr" or "rtl"

// Change locale
setLocale('fr')`}
          </Text>
        </YStack>
      </Card>
    </View>
  )
}
