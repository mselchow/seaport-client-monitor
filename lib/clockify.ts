import { useQuery } from "@tanstack/react-query";

interface ClockifyUserJSON {
    id: string;
    settings: {
        weekStart: string;
        timeZone: string;
    };
}

export function useClockifyData() {
    const result = useQuery(
        ["clockify", "data"],
        async () => {
            const response = await fetch("/api/fetchClockifyData");
            const data = await response.json();
            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: 5 * 60 * 1000,
            refetchInterval: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
        }
    );

    return result;
}

export function useClockifyUser() {
    const result = useQuery(
        ["clockify", "user"],
        async () => {
            const response = await fetch("/api/fetchClockifyUser");
            const data = await response.json();
            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        }
    );

    return result;
}

export function useClockifySummaryReport(timeframe: string) {
    const clockifyUserData = useClockifyUser();
    const clockifyUser: ClockifyUserJSON = clockifyUserData?.data;

    const result = useQuery(
        ["clockify", "data", "summaryReport", timeframe],
        async () => {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clockifyUserId: clockifyUser.id,
                    timeframe: timeframe,
                    weekStart: clockifyUser.settings.weekStart,
                }),
            };
            const response = await fetch(
                "/api/fetchClockifySummaryReport",
                options
            );
            const data = await response.json();
            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: 5 * 60 * 1000,
            refetchInterval: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            enabled: !!clockifyUser,
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
                    weekStart: clockifyUser.settings.weekStart,
                }),
            };
            const response = await fetch(
                "/api/fetchClockifyWeeklyReport",
                options
            );
            const data = await response.json();
            return data;
        },
        {
            cacheTime: Infinity,
            staleTime: 5 * 60 * 1000,
            refetchInterval: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            enabled: !!clockifyUser,
        }
    );

    return result;
}
