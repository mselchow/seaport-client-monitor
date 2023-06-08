import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";
import { format, startOfWeek, endOfWeek } from "date-fns";

export default async function handler(req, res) {
    const auth = getAuth(req);
    const body = req.body;

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        return res.status(401);
    }

    // check for request body parameters
    if (!body) {
        return res.status(400).json({ message: "Request body missing." });
    } else if (!body.clockifyUserId) {
        return res.status(400).json({
            message: "Request body missing value for 'clockifyUserId'.",
        });
    }

    const clockifyKey = await getClockifyKey(auth);
    const clockifyWorkspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
    const clockifyUserId = body.clockifyUserId;

    const dateRangeStart = format(
        startOfWeek(new Date()),
        "yyyy-MM-dd'T'00:00:00"
    );
    const dateRangeEnd = format(endOfWeek(new Date()), "yyyy-MM-dd'T'23:59:59");

    const apiURL =
        "https://reports.api.clockify.me/v1/workspaces/" +
        clockifyWorkspaceId +
        "/reports/weekly";

    const requestOptions = {
        method: "POST",
        headers: {
            "X-Api-Key": clockifyKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amountShown: "HIDE_AMOUNT",
            dateRangeStart: dateRangeStart,
            dateRangeEnd: dateRangeEnd,
            users: {
                contains: "CONTAINS",
                ids: [clockifyUserId],
            },
            weeklyFilter: {
                group: "PROJECT",
                subgroup: "TIME",
            },
        }),
    };

    const apiRes = await fetch(apiURL, requestOptions);
    const data = await apiRes.json();

    if (!apiRes.ok) {
        throw new Error(`error communicating with Clockify: ${apiRes.message}`);
    }

    res.status(200).json(data);
}
