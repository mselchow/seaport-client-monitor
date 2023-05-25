import { useQuery } from "@tanstack/react-query";

export function useBuildId() {
    const result = useQuery(
        ["buildId"],
        async () => {
            const response = await fetch("/api/buildId");
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
