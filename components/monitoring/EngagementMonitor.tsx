"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import HealthBadge from "@/components/monitoring/HealthBadge";
import HorizontalBarSkeleton from "@/components/skeletons/HorizontalBarSkeleton";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ClockifyProject from "@/lib/clockifyProject";
import { cn, formatHoursCompact } from "@/lib/utils";

interface EngagementMonitorProps {
    data: ClockifyProject[] | null;
    isLoading: boolean;
}

type TypeFilter = "All" | "Managed Services" | "Block Hours" | "Project";

const typeFilters: Array<{ label: string; value: TypeFilter }> = [
    { label: "All", value: "All" },
    { label: "Managed Services", value: "Managed Services" },
    { label: "Block Hours", value: "Block Hours" },
    { label: "Projects", value: "Project" },
];

function balanceContext(project: ClockifyProject) {
    if (project.type === "Managed Services") {
        const monthly = project.monthlyAllotment;
        const rollover = project.rolloverMultiple;

        if (monthly && rollover !== null && rollover >= 0) {
            return `${formatHoursCompact(monthly)}/mo · ${rollover.toFixed(
                1
            )}× banked`;
        }

        return `${project.pctHoursUsed}% of accrued hours used`;
    }

    return `${project.pctHoursUsed}% used · ${project.pctHoursRemaining}% remaining`;
}

export default function EngagementMonitor({
    data,
    isLoading,
}: EngagementMonitorProps) {
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
    const [attentionOnly, setAttentionOnly] = useState(false);
    const [query, setQuery] = useState("");

    const counts = useMemo(() => {
        const source = data ?? [];

        return {
            All: source.length,
            "Managed Services": source.filter(
                (project) => project.type === "Managed Services"
            ).length,
            "Block Hours": source.filter(
                (project) => project.type === "Block Hours"
            ).length,
            Project: source.filter((project) => project.type === "Project")
                .length,
            attention: source.filter(
                (project) => project.health.level !== "healthy"
            ).length,
        };
    }, [data]);

    const filteredData = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return [...(data ?? [])]
            .filter(
                (project) =>
                    typeFilter === "All" || project.type === typeFilter
            )
            .filter(
                (project) =>
                    !attentionOnly || project.health.level !== "healthy"
            )
            .filter((project) => {
                if (!normalizedQuery) {
                    return true;
                }

                return (
                    project.name.toLowerCase().includes(normalizedQuery) ||
                    project.fullName.toLowerCase().includes(normalizedQuery)
                );
            })
            .sort((a, b) => {
                if (b.health.rank !== a.health.rank) {
                    return b.health.rank - a.health.rank;
                }

                return a.name.localeCompare(b.name);
            });
    }, [attentionOnly, data, query, typeFilter]);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
                <div className="flex flex-col gap-4">
                    <div>
                        <CardTitle className="text-xl">
                            Engagement health
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Balances are normalized by engagement type so risk
                            is comparable across differently sized agreements.
                        </CardDescription>
                    </div>

                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {typeFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    type="button"
                                    size="sm"
                                    variant={
                                        typeFilter === filter.value
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setTypeFilter(filter.value)}
                                    className="gap-1.5"
                                >
                                    {filter.label}
                                    <span
                                        className={cn(
                                            "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                                            typeFilter === filter.value
                                                ? "bg-primary-foreground/15 text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {counts[filter.value]}
                                    </span>
                                </Button>
                            ))}
                            <Button
                                type="button"
                                size="sm"
                                variant={attentionOnly ? "secondary" : "ghost"}
                                onClick={() =>
                                    setAttentionOnly((value) => !value)
                                }
                                aria-pressed={attentionOnly}
                                className="gap-1.5"
                            >
                                Needs attention
                                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-900 tabular-nums dark:bg-amber-950/70 dark:text-amber-300">
                                    {counts.attention}
                                </span>
                            </Button>
                        </div>

                        <label className="relative block w-full xl:max-w-xs">
                            <span className="sr-only">Search engagements</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search clients or projects"
                                className="pl-9"
                            />
                        </label>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isLoading ? (
                    <div className="p-6">
                        <HorizontalBarSkeleton expectedRows={7} />
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="font-medium">
                            No engagements match these filters.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Try another engagement type, clear the attention
                            filter, or change your search.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(180px,.75fr)_minmax(210px,1fr)] gap-4 border-b bg-muted/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                            <div>Client / engagement</div>
                            <div>Balance</div>
                            <div>Health</div>
                        </div>
                        <div className="divide-y">
                            {filteredData.map((project) => (
                                <div
                                    key={project.uid}
                                    className="grid gap-4 px-6 py-4 transition-colors hover:bg-muted/20 md:grid-cols-[minmax(0,1.4fr)_minmax(180px,.75fr)_minmax(210px,1fr)] md:items-center"
                                >
                                    <div className="min-w-0">
                                        <div className="truncate font-semibold">
                                            {project.name}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {project.engagementMeta}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="font-semibold tabular-nums">
                                            {project.balanceLabel}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                                            {balanceContext(project)}
                                        </div>
                                    </div>

                                    <div>
                                        <HealthBadge health={project.health} />
                                        <div className="mt-1.5 text-xs text-muted-foreground">
                                            {project.health.reason}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
