import { auth } from "@clerk/nextjs/server";
import { captureMessage } from "@sentry/nextjs";
import { startOfWeek, endOfWeek } from "date-fns";
import { utcToZonedTime, format } from "date-fns-tz";

import { getClockifyKey } from "@/lib/clerk";

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
    const clockifyUserId = body.clockifyUserId;
    const clockifyTimezone = body.timezone ? body.timezone : "UTC";
    const dashboardWeekStart = 0;

    const nowInTimezone = utcToZonedTime(new Date(), clockifyTimezone);
    let dateRangeStart = startOfWeek(nowInTimezone, {
        weekStartsOn: dashboardWeekStart,
    });
    let dateRangeEnd = endOfWeek(nowInTimezone, {
        weekStartsOn: dashboardWeekStart,
    });

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
        "/reports/weekly";

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
            timeZone: clockifyTimezone,
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
    const responseText = await apiRes.text();

    if (!apiRes.ok) {
        const error = `error communicating with Clockify ${apiRes.status}: ${apiRes.statusText}${responseText ? ` - ${responseText}` : ""}`;
        captureMessage(error);
        return new Response(responseText || error, {
            status: apiRes.status,
        });
    }

    const data = responseText ? JSON.parse(responseText) : null;

    return Response.json(data);
}
