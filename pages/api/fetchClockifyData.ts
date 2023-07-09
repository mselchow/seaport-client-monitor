import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";
import { NextApiRequest, NextApiResponse } from "next";
import { captureMessage } from "@sentry/nextjs";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        res.status(401);
        return;
    }

    const clockifyKey = await getClockifyKey(auth);

    if (clockifyKey === null) {
        res.status(400).json({
            message:
                "Clockify API key not found for user. Go to the Settings page to add your API key.",
        });
        return;
    }

    const clockifyWorkspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
    const excludedClients = "633a35abf0cbc914c037991c";

    const apiURL =
        "https://api.clockify.me/api/v1/workspaces/" +
        clockifyWorkspaceId +
        "/projects?hydrated=true&archived=false&clients=" +
        excludedClients +
        "&contains-client=false" +
        "&page-size=500";

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
