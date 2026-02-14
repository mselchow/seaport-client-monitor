import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://ce80df46a42843219381d89344c9fcdf@o4505273796657152.ingest.us.sentry.io/4505273814876160",
    tracesSampleRate: 1,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
