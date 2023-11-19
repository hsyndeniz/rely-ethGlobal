import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    tracesSampleRate: 1.0,
  });
};
