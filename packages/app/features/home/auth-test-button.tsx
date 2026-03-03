'use client'

import { Trans } from '@lingui/react/macro'
import { useAuth } from 'app/provider/supabase'
import { trpc } from 'app/provider/trpc'
import { useState } from 'react'
import { Alert } from 'react-native'
import { Button, Text, YStack } from 'tamagui'

export function AuthTestButton() {
  const { user } = useAuth()
  const [isTesting, setIsTesting] = useState(false)
  const utils = trpc.useUtils()

  function getButtonLabel(): string {
    if (isTesting) return 'Testing...'
    if (user) return 'Test Auth (Authenticated)'
    return 'Test Auth (Not Authenticated)'
  }

  async function handleTestAuth() {
    setIsTesting(true)
    try {
      const result = await utils.testAuth.fetch()

      Alert.alert(
        'Success',
        `Authenticated!\n\nUser ID: ${result.user.id}\nEmail: ${result.user.email}\n\nMessage: ${result.message}`,
        [{ text: 'OK' }]
      )
    } catch (error: unknown) {
      const errorObj = error as { message?: string; data?: { code?: string } }
      const errorMessage = errorObj?.message || 'Unknown error occurred'
      const errorCode = errorObj?.data?.code
      const isUnauthorized = errorMessage.includes('UNAUTHORIZED') || errorCode === 'UNAUTHORIZED'

      Alert.alert(
        isUnauthorized ? 'Not Authenticated' : 'Error',
        isUnauthorized
          ? 'You must be authenticated to access this resource. Please sign in first.'
          : errorMessage,
        [{ text: 'OK' }]
      )
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <YStack
      padding={16}
      gap={12}
      maxWidth={400}
      width="100%"
      alignSelf="center"
      alignItems="center"
    >
      <YStack gap={8} alignItems="center" width="100%">
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
          <Trans>Test Protected tRPC Procedure</Trans>
        </Text>
        <Text style={{ fontSize: 12, textAlign: 'center', color: '#666', width: '100%' }}>
          <Trans>Current Status: {user ? 'Authenticated' : 'Not Authenticated'}</Trans>
        </Text>
      </YStack>
      <YStack alignItems="center" gap={8} width="100%">
        <Button
          onPress={handleTestAuth}
          disabled={isTesting}
          testID="auth-test-button"
          style={{
            minWidth: 200,
            backgroundColor: user ? '#059669' : '#dc2626',
          }}
        >
          <Text color="white">
            <Trans>{getButtonLabel()}</Trans>
          </Text>
        </Button>
        <Text
          style={{
            fontSize: 11,
            textAlign: 'center',
            color: '#999',
            width: '100%',
            paddingHorizontal: 8,
          }}
        >
          <Trans>
            Click to test the protected tRPC procedure. This will work whether you're authenticated
            or not, but will show different results.
          </Trans>
        </Text>
      </YStack>
    </YStack>
  )
}
