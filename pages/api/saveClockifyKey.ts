import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

import { saveClockifyKey } from "@/lib/clerk";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        return res.status(401);
    }

    // get data from request
    const body = req.body;

    // check for required input
    if (!body.clockifyKey) {
        res.status(400).json({
            message: "clockifyKey missing from body of request",
        });
        return;
    }

    const result = await saveClockifyKey(auth, body.clockifyKey);

    res.status(200).json(result);
}
