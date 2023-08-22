import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!userId) {
        res.status(401);
        return;
    }

    // get data from request
    const goals = req.body.goals;

    // check for required input
    if (!goals) {
        res.status(400).json({
            message: "Request body missing value for 'goals'.",
        });
    }

    const result = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            goals,
        },
    });

    res.status(200).json(result);
}
