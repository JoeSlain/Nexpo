import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  // TODO: Adjust these sample rates for production
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,

  enableCaptureFailedRequests: true,
  enableNativeNagger: false,
})
