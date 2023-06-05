import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";

export default async function handler(req, res) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        return res.status(401);
    }

    const clockifyKey = await getClockifyKey(auth);

    const apiURL = "https://api.clockify.me/api/v1/user";

    const apiHeaders = { "X-Api-Key": clockifyKey };

    const apiRes = await fetch(apiURL, { headers: apiHeaders });

    const data = await apiRes.json();

    if (!apiRes.ok) {
        throw new Error(`error communicating with Clockify`);
    }

    res.status(200).json(data);
}
