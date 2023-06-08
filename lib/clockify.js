import { useQuery } from "@tanstack/react-query";

export function useClockifyData() {
    const result = useQuery(
        ["clockifyData"],
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

async function getClockifyUserId() {
    const response = await fetch("/api/fetchClockifyUser");
    const data = await response.json();
    return data;
}

export function useClockifySummaryReport(timeframe) {
    const result = useQuery(
        ["clockifySummaryReport", timeframe],
        async () => {
            const clockifyUserId = await getClockifyUserId().then(
                (data) => data.id
            );

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clockifyUserId: clockifyUserId,
                    timeframe: timeframe,
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
        }
    );

    return result;
}

export function useClockifyWeeklyReport() {
    const result = useQuery(
        ["clockifyWeeklyReport"],
        async () => {
            const clockifyUserId = await getClockifyUserId().then(
                (data) => data.id
            );

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clockifyUserId: clockifyUserId,
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
        }
    );

    return result;
}
