import { useQuery } from "@tanstack/react-query";

export function useClockifyData() {
    const result = useQuery(["clockifyData"], async () => {
        const response = await fetch("/api/fetchClockifyData");
        const data = await response.json();
        return data;
    });

    return result;
}
