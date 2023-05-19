import { getAuth } from "@clerk/nextjs/server";
import { saveClockifyKey } from "@/lib/clerk.js";

export default async function handler(req, res) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        return res.status(401);
    }

    // get data from request
    const body = req.body;

    // check for required input
    if (!body.clockifyKey) {
        return res.status(400).json({ data: "Clockify key not found." });
    }

    saveClockifyKey(auth, body.clockifyKey);

    res.status(200).json({ result: "ok" });
}
