// API route that returns the current BUILD_ID from Webpack
export default function handler(req, res) {
    res.status(200).json({ buildId: process.env.BUILD_ID });
}
