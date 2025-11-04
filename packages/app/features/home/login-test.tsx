'use client'

import { Trans } from '@lingui/react/macro'
import { useAuth } from 'app/provider/supabase'
import { useState } from 'react'
import { Alert, TextInput, View } from 'react-native'
import { Button, Text } from 'tamagui'

export function LoginTest() {
  const { user, loading, supabase } = useAuth()
  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('password')
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    setIsSigningIn(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        Alert.alert('Sign In Error', error.message)
      } else {
        Alert.alert('Success', 'Signed in successfully!')
      }
    } catch (_error) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        Alert.alert('Sign Out Error', error.message)
      }
    } catch (_error) {
      Alert.alert('Error', 'An unexpected error occurred')
    }
  }

  if (loading) {
    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Text>Loading auth state...</Text>
      </View>
    )
  }

  if (user) {
    return (
      <View
        style={{
          padding: 16,
          gap: 16,
          maxWidth: 400,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <View style={{ gap: 8, alignItems: 'center', width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            <Trans>Signed In</Trans>
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            <Trans>Email: {user.email}</Trans>
          </Text>
          {user.id && (
            <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
              <Trans>User ID: {user.id.slice(0, 8)}...</Trans>
            </Text>
          )}
        </View>
        <Button onPress={handleSignOut}>
          <Text color="white">
            <Trans>Sign Out</Trans>
          </Text>
        </Button>
      </View>
    )
  }

  return (
    <View
      style={{
        padding: 16,
        gap: 16,
        width: '100%',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        <Trans>Supabase Auth Test</Trans>
      </Text>

      <View style={{ gap: 12 }}>
        <View>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>
            <Trans>Email</Trans>
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isSigningIn}
          />
        </View>

        <View>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>
            <Trans>Password</Trans>
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            editable={!isSigningIn}
          />
        </View>
      </View>

      <Button onPress={handleSignIn} backgroundColor="#2563eb" disabled={isSigningIn}>
        <Text color="white">
          <Trans>{isSigningIn ? 'Signing In...' : 'Sign In'}</Trans>
        </Text>
      </Button>
    </View>
  )
}
