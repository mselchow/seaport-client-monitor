import { auth } from "@clerk/nextjs";
import { captureMessage } from "@sentry/nextjs";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import { getClockifyKey } from "@/lib/clerk";
import { parseDayNumber } from "@/lib/utils";

export async function POST(request: Request) {
    const userAuth = auth();
    const body = await request.json();

    // check for request body parameters
    if (!body) {
        return new Response("Request body missing.", { status: 400 });
    } else if (!body.clockifyUserId) {
        return new Response(
            "Request body missing value for 'clockifyUserId'.",
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
    const clockifyUserId = body.clockifyUserId;
    const clockifyWeekStart = body.weekStart
        ? (parseDayNumber(body.weekStart) as unknown as Day)
        : 0;
    const clockifyTimezone = body.timezone ? body.timezone : "UTC";

    const nowInTimezone = utcToZonedTime(new Date(), clockifyTimezone);
    const weekStartInTimezone = startOfWeek(nowInTimezone, {
        weekStartsOn: clockifyWeekStart,
    });
    const weekEndInTimezone = endOfWeek(nowInTimezone, {
        weekStartsOn: clockifyWeekStart,
    });

    const dateRangeStart = format(
        zonedTimeToUtc(weekStartInTimezone, clockifyTimezone),
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    const dateRangeEnd = format(
        zonedTimeToUtc(weekEndInTimezone, clockifyTimezone),
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );

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
    const data = await apiRes.json();

    if (!apiRes.ok) {
        const error = `error communicating with Clockify ${apiRes.status}: ${apiRes.statusText}`;
        captureMessage(error);
        throw new Error(error);
    }

    return Response.json(data);
}
