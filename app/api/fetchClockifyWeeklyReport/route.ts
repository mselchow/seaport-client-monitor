import { auth } from "@clerk/nextjs";
import { captureMessage } from "@sentry/nextjs";
import { format, startOfWeek, endOfWeek } from "date-fns";

import { getClockifyKey } from "@/lib/clerk";
import { parseDayNumber } from "@/lib/utils";

export async function POST(request: Request) {
    const userAuth = auth();
    const body = await request.json();

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!userAuth.userId) {
        return new Response("Unauthorized", { status: 401 });
    }

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

    const dateRangeStart = format(
        startOfWeek(new Date(), { weekStartsOn: clockifyWeekStart }),
        "yyyy-MM-dd'T'00:00:00"
    );
    const dateRangeEnd = format(
        endOfWeek(new Date(), { weekStartsOn: clockifyWeekStart }),
        "yyyy-MM-dd'T'23:59:59"
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
