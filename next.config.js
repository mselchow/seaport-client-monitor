/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/",
                destination: "/charts/",
                permanent: true,
            },
        ];
    },
    webpack(config, { buildId, webpack, dev }) {
        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env": {
                    BUILD_ID: JSON.stringify(dev ? "development" : buildId),
                },
            })
        );

        return config;
    },
};

module.exports = nextConfig;
