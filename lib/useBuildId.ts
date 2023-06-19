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
            cacheTime: Infinity,
            staleTime: 15 * 60 * 1000,
            refetchInterval: 15 * 60 * 1000,
            refetchOnWindowFocus: true,
        }
    );

    return result;
}
