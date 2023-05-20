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
            refetchInterval: 1000 * 60 * 15,
            refetchIntervalInBackground: true,
        }
    );

    return result;
}
