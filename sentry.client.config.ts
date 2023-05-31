// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // 100% of errors will be sent
    sampleRate: 1.0,

    // Don't send replays for non-errors
    replaysSessionSampleRate: 0.0,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [],
});
