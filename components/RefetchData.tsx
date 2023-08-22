import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RefetchDataProps {
    queryKey: string[];
}

const RefetchData = ({ queryKey }: RefetchDataProps) => {
    const queryClient = useQueryClient();
    const fetchingCount = useIsFetching({ queryKey: queryKey });
    const isFetching = fetchingCount !== 0;

    return (
        <Button
            className="px-0"
            variant="ghost"
            size="icon"
            disabled={isFetching}
            onClick={() => {
                queryClient.invalidateQueries({ queryKey: queryKey });
            }}
        >
            <RefreshCw
                className={cn("h-4 w-4", isFetching ? "animate-spin" : "")}
            />
        </Button>
    );
};

export default RefetchData;
