import { auth } from "@clerk/nextjs/server";
import { captureMessage } from "@sentry/nextjs";
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
import { utcToZonedTime, format } from "date-fns-tz";

import { getClockifyKey } from "@/lib/clerk";
import { parseDayNumber } from "@/lib/utils";

export async function POST(request: Request) {
    const userAuth = await auth();
    const body = await request.json();

    // check for request body parameters
    if (!body) {
        return new Response("Request body missing.", { status: 400 });
    } else if (!body.clockifyUserId) {
        return new Response(
            "Request body missing value for 'clockifyUserId'.",
            { status: 400 }
        );
    } else if (!body.timeframe) {
        return new Response(
            "Request body missing value for 'timeframe'. Valid options are one of: TODAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR",
            { status: 400 }
        );
    } else if (!body.weekStart) {
        return new Response("Request body missing value 'weekStart'.", {
            status: 400,
        });
    } else if (!body.timezone) {
        return new Response("Request body missing value for 'timezone'.", {
            status: 400,
        });
    }

    const clockifyKey = await getClockifyKey(userAuth);

    if (clockifyKey === null) {
        return new Response("Clockify API key not found for user.", {
            status: 400,
        });
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
            return new Response(
                "Invalid value provided for 'timeframe'. Valid options are one of: TODAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR",
                { status: 400 }
            );
    }

    dateRangeStart = utcToZonedTime(dateRangeStart, clockifyTimezone);
    dateRangeEnd = utcToZonedTime(dateRangeEnd, clockifyTimezone);

    const dateStartString = format(dateRangeStart, "yyyy-MM-dd'T'HH:mm:ss", {
        timeZone: clockifyTimezone,
    });
    const dateEndString = format(dateRangeEnd, "yyyy-MM-dd'T'HH:mm:ss", {
        timeZone: clockifyTimezone,
    });

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

    return Response.json(data);
}
