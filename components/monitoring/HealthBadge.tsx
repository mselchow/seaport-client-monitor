import { AlertTriangle, CheckCircle2, OctagonAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { EngagementHealth } from "@/lib/clockifyProject";

interface HealthBadgeProps {
    health: EngagementHealth;
    compact?: boolean;
}

export default function HealthBadge({
    health,
    compact = false,
}: HealthBadgeProps) {
    const config = {
        healthy: {
            icon: CheckCircle2,
            className:
                "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
        },
        watch: {
            icon: AlertTriangle,
            className:
                "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300",
        },
        critical: {
            icon: OctagonAlert,
            className:
                "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300",
        },
    }[health.level];

    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide",
                compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
                config.className
            )}
        >
            <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            {health.label}
        </span>
    );
}
