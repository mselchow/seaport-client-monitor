import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";

export default async function handler(req, res) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        return res.status(401);
    }

    const clockifyKey = await getClockifyKey(auth);
    const clockifyWorkspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
    const excludedClients = "633a3a9208e5fd5b5e911579,6427472f780c565b87fa867d"; // SciAps, Ori

    const apiURL =
        "https://api.clockify.me/api/v1/workspaces/" +
        clockifyWorkspaceId +
        "/projects?hydrated=true&archived=false&clients=" +
        excludedClients +
        "&contains-client=false";

    const apiHeaders = { "X-Api-Key": clockifyKey };

    const apiRes = await fetch(apiURL, { headers: apiHeaders });

    const data = await apiRes.json();

    if (!apiRes.ok) {
        throw new Error(`error communicating with Clockify`);
    }

    res.status(200).json(data);
}
