import { CheckCircle2 } from "lucide-react";

import HealthBadge from "@/components/monitoring/HealthBadge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ClockifyProject from "@/lib/clockifyProject";

interface DashboardAttentionProps {
    data: ClockifyProject[] | null;
    isLoading: boolean;
}

function secondaryMetric(project: ClockifyProject) {
    if (
        project.type === "Managed Services" &&
        project.rolloverMultiple !== null &&
        project.rolloverMultiple >= 0
    ) {
        return `${project.rolloverMultiple.toFixed(1)}× monthly allocation`;
    }

    return `${project.pctHoursUsed}% of ${project.type === "Managed Services" ? "accrued hours" : "budget"} used`;
}

export default function DashboardAttention({
    data,
    isLoading,
}: DashboardAttentionProps) {
    const allAttention = (data ?? [])
        .filter((project) => project.health.level !== "healthy")
        .sort((a, b) => {
            if (b.health.rank !== a.health.rank) {
                return b.health.rank - a.health.rank;
            }

            return a.name.localeCompare(b.name);
        });
    const attention = allAttention.slice(0, 6);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30 pb-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <CardTitle className="text-lg">Needs attention</CardTitle>
                        <CardDescription className="mt-1">
                            Client-hour conditions worth reviewing now.
                        </CardDescription>
                    </div>
                    {!isLoading && attention.length > 0 ? (
                        <div className="text-sm font-medium text-muted-foreground">
                            {attention.length}
                            {allAttention.length > attention.length ? "+" : ""}{" "}
                            flagged
                        </div>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="space-y-3 p-5">
                        {[0, 1, 2].map((row) => (
                            <div
                                key={row}
                                className="h-16 animate-pulse rounded-md bg-muted"
                            />
                        ))}
                    </div>
                ) : attention.length === 0 ? (
                    <div className="flex items-center gap-3 p-6">
                        <div className="rounded-full bg-emerald-50 p-2 dark:bg-emerald-950/40">
                            <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div>
                            <p className="font-medium">
                                No client-hour issues need attention.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Current balances and rollover levels are within
                                their monitoring thresholds.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y">
                        {attention.map((project) => (
                            <div
                                key={project.uid}
                                className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(150px,.8fr)_minmax(180px,1fr)] sm:items-center"
                            >
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        {project.name}
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        {project.engagementMeta}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-semibold tabular-nums">
                                        {project.balanceLabel}
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                                        {secondaryMetric(project)}
                                    </div>
                                </div>

                                <div className="sm:justify-self-end sm:text-right">
                                    <HealthBadge
                                        health={project.health}
                                        compact
                                    />
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {project.health.reason}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
