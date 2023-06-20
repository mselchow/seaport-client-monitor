import { getAuth } from "@clerk/nextjs/server";
import { getClockifyKey } from "@/lib/clerk";
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    subWeeks,
    subMonths,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { captureMessage } from "@sentry/nextjs";
import { parseDayNumber } from "@/lib/utils";
import { utcToZonedTime, format } from "date-fns-tz";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

    if (clockifyKey === null) {
        res.status(400).json({
            message: "Clockify API key not found for user.",
        });
        return;
    }

    const clockifyWorkspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
    const timeframe: string = body.timeframe;
    const clockifyUserId: string = body.clockifyUserId;
    const clockifyWeekStart = body.weekStart
        ? (parseDayNumber(body.weekStart) as unknown as Day)
        : 0;
    const clockifyTimezone = body.timezone ? body.timezone : "America/New_York";

    let dateRangeStart: Date, dateRangeEnd: Date;

    // set start/end dates based on timeframe parameter
    switch (timeframe) {
        case "TODAY":
            dateRangeStart = startOfDay(new Date());
            dateRangeEnd = endOfDay(new Date());
            break;
        case "THIS_WEEK":
            dateRangeStart = startOfWeek(new Date(), {
                weekStartsOn: clockifyWeekStart,
            });
            dateRangeEnd = endOfWeek(new Date(), {
                weekStartsOn: clockifyWeekStart,
            });
            break;
        case "LAST_WEEK":
            dateRangeStart = startOfWeek(subWeeks(new Date(), 1), {
                weekStartsOn: clockifyWeekStart,
            });
            dateRangeEnd = endOfWeek(subWeeks(new Date(), 1), {
                weekStartsOn: clockifyWeekStart,
            });
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
            return;
    }

    dateRangeStart = utcToZonedTime(dateRangeStart, clockifyTimezone);
    dateRangeEnd = utcToZonedTime(dateRangeEnd, clockifyTimezone);

    const dateStartString = format(dateRangeStart, "yyyy-MM-dd'T'HH:mm:ss", {
        timeZone: clockifyTimezone,
    });
    const dateEndString = format(dateRangeEnd, "yyyy-MM-dd'T'HH:mm:ss", {
        timeZone: clockifyTimezone,
    });

    if (timeframe === "TODAY") {
        console.log(dateRangeStart, dateStartString);
    }

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
            dateRangeStart: dateStartString,
            dateRangeEnd: dateEndString,
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
        const error = `error communicating with Clockify ${apiRes.status}: ${apiRes.statusText}`;
        captureMessage(error);
        throw new Error(error);
    }

    res.status(200).json(data);
}
