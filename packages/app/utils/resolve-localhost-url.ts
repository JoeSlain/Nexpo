import { Platform } from 'react-native'

/**
 * On Android emulators, `localhost` and `127.0.0.1` are unreachable because
 * they refer to the emulator's own loopback. The special IP `10.0.2.2` is
 * routed to the host machine's loopback instead.
 *
 * This helper rewrites a URL's hostname when running on Android so that
 * local development servers are accessible from the emulator.
 */
export function resolveLocalHostUrl(url: string): string {
  if (Platform.OS !== 'android') {
    return url
  }

  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      parsed.hostname = '10.0.2.2'
      return parsed.toString()
    }
  } catch {
    // Invalid URL, return as-is
  }

  return url
}
