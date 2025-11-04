'use client'

import { Trans } from '@lingui/react/macro'
import { useAuth } from 'app/provider/supabase'
import { trpc } from 'app/provider/trpc'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import { Button, Text } from 'tamagui'

export function AuthTestButton() {
  const { user } = useAuth()
  const [isTesting, setIsTesting] = useState(false)
  const utils = trpc.useUtils()

  const handleTestAuth = async () => {
    setIsTesting(true)
    try {
      const result = await utils.testAuth.fetch()

      Alert.alert(
        'Success',
        `Authenticated!\n\nUser ID: ${result.user.id}\nEmail: ${result.user.email}\n\nMessage: ${result.message}`,
        [{ text: 'OK' }]
      )
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred'
      const isUnauthorized =
        errorMessage.includes('UNAUTHORIZED') || error?.data?.code === 'UNAUTHORIZED'

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
    <View
      style={{
        padding: 16,
        gap: 12,
        maxWidth: 400,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
        <Trans>Test Protected tRPC Procedure</Trans>
      </Text>
      <Text style={{ fontSize: 12, textAlign: 'center', color: '#666', marginBottom: 8 }}>
        <Trans>Current Status: {user ? 'Authenticated' : 'Not Authenticated'}</Trans>
      </Text>
      <Button
        onPress={handleTestAuth}
        backgroundColor={user ? '#059669' : '#dc2626'}
        disabled={isTesting}
        style={{ minWidth: 200 }}
      >
        <Text color="white">
          <Trans>
            {isTesting
              ? 'Testing...'
              : user
                ? 'Test Auth (Authenticated)'
                : 'Test Auth (Not Authenticated)'}
          </Trans>
        </Text>
      </Button>
      <Text style={{ fontSize: 11, textAlign: 'center', color: '#999', marginTop: 4 }}>
        <Trans>
          Click to test the protected tRPC procedure. This will work whether you're authenticated or
          not, but will show different results.
        </Trans>
      </Text>
    </View>
  )
}
