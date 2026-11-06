import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "...",
    // other options
  });
}
