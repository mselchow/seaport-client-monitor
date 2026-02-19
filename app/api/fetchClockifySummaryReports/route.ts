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
} from "date-fns";
import { utcToZonedTime, format } from "date-fns-tz";

import { getClockifyKey } from "@/lib/clerk";
import { parseDayNumber } from "@/lib/utils";

type SummaryTimeframe = "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "THIS_YEAR";

const timeframeList: SummaryTimeframe[] = [
    "TODAY",
    "THIS_WEEK",
    "THIS_MONTH",
    "THIS_YEAR",
];

const getDateRange = (
    timeframe: SummaryTimeframe,
    weekStart: number,
    timezone: string
) => {
    let dateRangeStart: Date, dateRangeEnd: Date;

    switch (timeframe) {
        case "TODAY":
            dateRangeStart = startOfDay(new Date());
            dateRangeEnd = endOfDay(new Date());
            break;
        case "THIS_WEEK":
            dateRangeStart = startOfWeek(new Date(), {
                weekStartsOn: weekStart as 0 | 1 | 2 | 3 | 4 | 5 | 6,
            });
            dateRangeEnd = endOfWeek(new Date(), {
                weekStartsOn: weekStart as 0 | 1 | 2 | 3 | 4 | 5 | 6,
            });
            break;
        case "THIS_MONTH":
            dateRangeStart = startOfMonth(new Date());
            dateRangeEnd = endOfMonth(new Date());
            break;
        case "THIS_YEAR":
            dateRangeStart = startOfYear(new Date());
            dateRangeEnd = endOfYear(new Date());
            break;
    }

    dateRangeStart = utcToZonedTime(dateRangeStart, timezone);
    dateRangeEnd = utcToZonedTime(dateRangeEnd, timezone);

    return {
        dateRangeStart: format(dateRangeStart, "yyyy-MM-dd'T'HH:mm:ss", {
            timeZone: timezone,
        }),
        dateRangeEnd: format(dateRangeEnd, "yyyy-MM-dd'T'HH:mm:ss", {
            timeZone: timezone,
        }),
    };
};

export async function POST(request: Request) {
    const userAuth = await auth();
    const body = await request.json();

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
    const clockifyUserId: string = body.clockifyUserId;
    const clockifyWeekStart = parseDayNumber(body.weekStart);
    const clockifyTimezone = body.timezone ? body.timezone : "America/New_York";
    const apiURL =
        "https://reports.api.clockify.me/v1/workspaces/" +
        clockifyWorkspaceId +
        "/reports/summary";

    try {
        const reportResults = await Promise.all(
            timeframeList.map(async (timeframe) => {
                const dateRange = getDateRange(
                    timeframe,
                    clockifyWeekStart,
                    clockifyTimezone
                );

                const apiRes = await fetch(apiURL, {
                    method: "POST",
                    headers: {
                        "X-Api-Key": clockifyKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amountShown: "HIDE_AMOUNT",
                        dateRangeStart: dateRange.dateRangeStart,
                        dateRangeEnd: dateRange.dateRangeEnd,
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
                });
                const data = await apiRes.json();

                if (!apiRes.ok) {
                    throw new Error(
                        `error communicating with Clockify ${apiRes.status}: ${apiRes.statusText}`
                    );
                }

                return [timeframe, data] as const;
            })
        );

        const reports = Object.fromEntries(reportResults);
        return Response.json(reports);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "error communicating with Clockify";
        captureMessage(message);
        throw error;
    }
}
