import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";
import {
    formatISO,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
} from "date-fns";

// formatRFC3339(new Date(2019, 8, 18, 19, 0, 52, 234), { fractionDigits: 3 })

export default async function handler(req, res) {
    const auth = getAuth(req);
    const body = req.body;

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!auth.userId) {
        res.status(401);
    }

    // check for request body parameters
    if (!body) {
        res.status(400).json({ message: "Request body missing." });
    } else if (!body.clockifyUserId) {
        res.status(400).json({
            message: "Request body missing value for 'clockifyUserId'.",
        });
    } else if (!body.timeframe) {
        res.status(400).json({
            message:
                "Request body missing value for 'timeframe'. Valid options are one of: THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR",
        });
    }

    const clockifyKey = await getClockifyKey(auth);
    const clockifyWorkspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
    const timeframe = body.timeframe;
    const clockifyUserId = body.clockifyUserId;
    let dateRangeStart, dateRangeEnd;

    // set start/end dates based on timeframe parameter
    switch (timeframe) {
        case "THIS_WEEK":
            dateRangeStart = startOfWeek(new Date());
            dateRangeEnd = endOfWeek(new Date());
            break;
        case "LAST_WEEK":
            break;
        case "THIS_MONTH":
            dateRangeStart = startOfMonth(new Date());
            dateRangeEnd = endOfMonth(new Date());
            break;
        case "LAST_MONTH":
            break;
        case "THIS_YEAR":
            break;
        default:
            res.status.json({
                message:
                    "Invalid value provided for 'timeframe'. Valid options are one of: THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR",
            });
    }

    dateRangeStart = formatISO(dateRangeStart, { format: "extended" });
    dateRangeEnd = formatISO(dateRangeEnd);

    const apiURL =
        "https://reports.api.clockify.me/v1/workspaces/" +
        clockifyWorkspaceId +
        "/reports/summary";

    const requestOptions = {
        method: "POST",
        headers: {
            "X-Api-Key": clockifyKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amountShown: "HIDE_AMOUNT",
            dateRangeStart: "2023-05-28T00:00:00Z",
            dateRangeEnd: "2023-06-03T23:59:59Z",
            summaryFilter: {
                groups: ["project"],
                sortColumn: "DURATION",
            },
            sortOrder: "DESCENDING",
            users: {
                contains: "CONTAINS",
                ids: [clockifyUserId],
            },
        }),
    };

    const apiRes = await fetch(apiURL, requestOptions);
    const data = await apiRes.json();

    if (!apiRes.ok) {
        console.log(apiRes.statusText);
        throw new Error(`error communicating with Clockify`);
    }

    res.status(200).json(data);
}
