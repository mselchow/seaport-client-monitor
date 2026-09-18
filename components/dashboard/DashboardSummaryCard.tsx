import { CheckCircle2 } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatHoursCompact } from "@/lib/utils";

interface DashboardSummaryCardProps {
    cardTitle: string;
    cardContent: string;
    isLoading: boolean;
    progress?: number | null;
    target?: number | null;
    context?: string | null;
}

export default function DashboardSummaryCard({
    cardTitle,
    cardContent,
    isLoading = false,
    progress = null,
    target = null,
    context = null,
}: DashboardSummaryCardProps) {
    const displayGoal =
        progress !== null && Number.isFinite(progress) && progress >= 0;
    const goalComplete = displayGoal && progress >= 100;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {cardTitle}
                </CardTitle>
                {goalComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : displayGoal ? (
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {progress}%
                    </span>
                ) : null}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="mt-3 h-2 w-full" />
                        <Skeleton className="mt-3 h-4 w-36" />
                    </>
                ) : (
                    <>
                        <div className="flex items-baseline gap-1.5">
                            <div className="text-2xl font-bold tracking-tight tabular-nums">
                                {cardContent}
                            </div>
                            {target ? (
                                <div className="text-xs text-muted-foreground tabular-nums">
                                    / {formatHoursCompact(target)}
                                </div>
                            ) : null}
                        </div>

                        {displayGoal ? (
                            <Progress value={progress} className="mt-3 h-1.5" />
                        ) : null}

                        <div className="mt-3 min-h-5 text-xs font-medium text-muted-foreground">
                            {context ?? "Set a goal in Settings to track pace."}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
