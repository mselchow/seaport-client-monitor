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
};

module.exports = nextConfig;
