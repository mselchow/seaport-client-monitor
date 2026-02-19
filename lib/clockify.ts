import { useQuery } from "@tanstack/react-query";

interface ClockifyUserJSON {
    id: string;
    settings: {
        weekStart: string;
        timeZone: string;
    };
}

interface ClockifySummaryReports {
    TODAY: {
        totals?: Array<{ totalTime?: number }>;
    };
    THIS_WEEK: {
        totals?: Array<{ totalTime?: number }>;
    };
    THIS_MONTH: {
        totals?: Array<{ totalTime?: number }>;
    };
    THIS_YEAR: {
        totals?: Array<{ totalTime?: number }>;
    };
}

export function useClockifyData() {
    const result = useQuery(
        ["clockify", "data"],
        async () => {
            const response = await fetch("/api/fetchClockifyData");
            if (!response.ok) {
                throw new Error("Something went wrong fetching Clockify data.");
            }
            const data = await response.json();

            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    return result;
}

export function useClockifyUser() {
    const result = useQuery(
        ["clockify", "user"],
        async () => {
            const response = await fetch("/api/fetchClockifyUser");
            if (!response.ok) {
                throw new Error(
                    "Something went wrong fetching Clockify user data."
                );
            }
            const data = await response.json();

            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    return result;
}

export function useClockifySummaryReports() {
    const clockifyUserData = useClockifyUser();
    const clockifyUser: ClockifyUserJSON = clockifyUserData?.data;

    const result = useQuery<ClockifySummaryReports>(
        ["clockify", "data", "summaryReports"],
        async () => {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clockifyUserId: clockifyUser.id,
                    weekStart: clockifyUser?.settings?.weekStart || null,
                    timezone: clockifyUser?.settings?.timeZone || null,
                }),
            };
            const response = await fetch(
                "/api/fetchClockifySummaryReports",
                options
            );
            if (!response.ok) {
                throw new Error(
                    "Something went wrong fetching Clockify summary reports."
                );
            }
            const data = await response.json();

            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            enabled: !!clockifyUser,
            retry: 1,
        }
    );

    return result;
}

export function useClockifyWeeklyReport() {
    const clockifyUserData = useClockifyUser();
    const clockifyUser: ClockifyUserJSON = clockifyUserData?.data;

    const result = useQuery(
        ["clockify", "data", "weeklyReport"],
        async () => {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clockifyUserId: clockifyUser.id,
                    weekStart: clockifyUser?.settings?.weekStart || null,
                    timezone: clockifyUser?.settings?.timeZone || null,
                }),
            };
            const response = await fetch(
                "/api/fetchClockifyWeeklyReport",
                options
            );
            if (!response.ok) {
                throw new Error(
                    "Something went wrong fetching Clockify weekly report data."
                );
            }
            const data = await response.json();

            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            enabled: !!clockifyUser,
            retry: 1,
        }
    );

    return result;
}
