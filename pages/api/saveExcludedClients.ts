import { getAuth } from "@clerk/nextjs/server";
import { saveExcludedClients } from "@/lib/clerk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const auth = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth) {
        res.status(401);
        return;
    }

    // get data from request
    const body = req.body;

    // check for required input
    if (!body.excludedClients) {
        res.status(400).json({ data: "Excluded client data not found." });
    }

    const result = await saveExcludedClients(auth, body.excludedClients);

    res.status(200).json(result);
}
