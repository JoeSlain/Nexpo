import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,

  // Set profilesSampleRate to 1.0 to profile 100% of sampled transactions.
  // We recommend adjusting this value in production.
  profilesSampleRate: 1.0,

  // Enable capturing unhandled promise rejections
  enableCaptureFailedRequests: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable native crash reporting
  enableNative: true,
  enableNativeNagger: false,
})
