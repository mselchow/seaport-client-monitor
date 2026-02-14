/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack(config, { buildId, webpack }) {
        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env.BUILD_ID": JSON.stringify(buildId),
            })
        );

        return config;
    },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "none-ov4",
    project: "seaport-client-monitor",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    webpack: {
        // Automatically tree-shake Sentry logger statements to reduce bundle size.
        treeshake: { removeDebugLogging: true },

        // Enables automatic instrumentation of Vercel Cron Monitors.
        automaticVercelMonitors: true,
    },
});
