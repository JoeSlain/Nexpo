/**
 * Example component showing how to use the logo in both Next.js and Expo
 *
 * Usage:
 * import { Logo } from 'app/components/Logo.example'
 */

import logo from 'app/assets/logo.png'
import { Image } from 'expo-image'
import type { CSSProperties } from 'react'
import type { ImageStyle, StyleProp } from 'react-native'
import { Platform } from 'react-native'

type LogoProps = {
  width?: number
  height?: number
  style?: StyleProp<ImageStyle> | CSSProperties
}

export function Logo({ width = 200, height = 200, style }: LogoProps) {
  if (Platform.OS !== 'web') {
    return (
      <Image
        source={logo}
        style={[{ width, height }, style as StyleProp<ImageStyle>]}
        contentFit="contain"
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo as string}
      alt="Logo"
      width={width}
      height={height}
      style={style as CSSProperties}
    />
  )
}
