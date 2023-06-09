import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const RefetchData = ({ query }) => {
    const queryClient = useQueryClient();
    const isFetching = useIsFetching({ queryKey: query });

    return (
        <Button
            className="h-8 w-8 px-0"
            variant="ghost"
            size="sm"
            disabled={isFetching}
            onClick={() => {
                queryClient.invalidateQueries({ queryKey: query });
            }}
        >
            <RefreshCw
                className={cn("h-4 w-4", isFetching ? "animate-spin" : "")}
            />
        </Button>
    );
};

export default RefetchData;
