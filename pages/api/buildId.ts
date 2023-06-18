import { NextApiRequest, NextApiResponse } from "next";

// API route that returns the current BUILD_ID from Webpack
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ buildId: process.env.BUILD_ID });
}
