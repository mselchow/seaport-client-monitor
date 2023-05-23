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
    webpack(config, { buildId, webpack }) {
        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env": {
                    BUILD_ID: JSON.stringify(buildId),
                },
            })
        );

        return config;
    },
};

module.exports = nextConfig;
