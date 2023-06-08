import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    subWeeks,
    subMonths,
} from "date-fns";

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
                "Request body missing value for 'timeframe'. Valid options are one of: TODAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR",
        });
    }

    const clockifyKey = await getClockifyKey(auth);
    const clockifyWorkspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
    const timeframe = body.timeframe;
    const clockifyUserId = body.clockifyUserId;
    let dateRangeStart, dateRangeEnd;

    // set start/end dates based on timeframe parameter
    switch (timeframe) {
        case "TODAY":
            dateRangeStart = new Date();
            dateRangeEnd = new Date();
            break;
        case "THIS_WEEK":
            dateRangeStart = startOfWeek(new Date());
            dateRangeEnd = endOfWeek(new Date());
            break;
        case "LAST_WEEK":
            dateRangeStart = startOfWeek(subWeeks(new Date(), 1));
            dateRangeEnd = endOfWeek(subWeeks(new Date(), 1));
            break;
        case "THIS_MONTH":
            dateRangeStart = startOfMonth(new Date());
            dateRangeEnd = endOfMonth(new Date());
            break;
        case "LAST_MONTH":
            dateRangeStart = startOfWeek(subMonths(new Date(), 1));
            dateRangeEnd = endOfWeek(subMonths(new Date(), 1));
            break;
        case "THIS_YEAR":
            dateRangeStart = startOfYear(new Date());
            dateRangeEnd = endOfYear(new Date());
            break;
        default:
            res.status(400).json({
                message:
                    "Invalid value provided for 'timeframe'. Valid options are one of: TODAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR",
            });
    }

    dateRangeStart = format(dateRangeStart, "yyyy-MM-dd'T'00:00:00");
    dateRangeEnd = format(dateRangeEnd, "yyyy-MM-dd'T'23:59:59");

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
            dateRangeStart: dateRangeStart,
            dateRangeEnd: dateRangeEnd,
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
        throw new Error(`error communicating with Clockify: ${apiRes.message}`);
    }

    res.status(200).json(data);
}
