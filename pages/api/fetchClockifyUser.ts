import { getAuth } from "@clerk/nextjs/server";
import { captureMessage } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { getClockifyKey } from "@/lib/clerk";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        return res.status(401);
    }

    const clockifyKey = await getClockifyKey(auth);

    if (clockifyKey === null) {
        res.status(400).json({
            message: "Clockify API key not found for user.",
        });
        return;
    }

    const apiURL = "https://api.clockify.me/api/v1/user";
    const apiHeaders = { "X-Api-Key": clockifyKey };

    const apiRes = await fetch(apiURL, { headers: apiHeaders });
    const data = await apiRes.json();

    if (!apiRes.ok) {
        const error = `error communicating with Clockify ${apiRes.status}: ${apiRes.statusText}`;
        captureMessage(error);
        throw new Error(error);
    }

    res.status(200).json(data);
}
