/**
 * Example component showing how to use the logo in both Next.js and Expo
 *
 * Usage:
 * import { Logo } from 'app/components/Logo.example'
 */

import logo from 'app/assets/logo.png'
import { Image } from 'expo-image'
import { Platform } from 'react-native'

export function Logo({
  width = 200,
  height = 200,
  style,
}: {
  width?: number
  height?: number
  style?: any
}) {
  // For Expo/React Native, use expo-image
  if (Platform.OS !== 'web') {
    return <Image source={logo} style={[{ width, height }, style]} contentFit="contain" />
  }

  // For Next.js/web, use img tag
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo as string} alt="Logo" width={width} height={height} style={style} />
  )
}
