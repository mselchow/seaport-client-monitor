import { useUser } from "@clerk/nextjs";
import {
    addDays,
    endOfMonth,
    endOfWeek,
    endOfYear,
    getDay,
    startOfDay,
} from "date-fns";

import DashboardSummaryCard from "@/components/dashboard/DashboardSummaryCard";
import { GoalsType } from "@/components/settings/GoalSettings";
import { useClockifySummaryReports } from "@/lib/clockify";
import { formatHoursCompact, secToHours, secToTime } from "@/lib/utils";

type GoalPeriod = "daily" | "weekly" | "monthly" | "yearly";

function countWeekdaysRemaining(end: Date) {
    let date = startOfDay(new Date());
    const lastDate = startOfDay(end);
    let count = 0;

    while (date <= lastDate) {
        const day = getDay(date);
        if (day >= 1 && day <= 5) {
            count += 1;
        }
        date = addDays(date, 1);
    }

    return count;
}

function goalContext(
    period: GoalPeriod,
    actual: number,
    target: number
): string | null {
    if (!target || target <= 0) {
        return null;
    }

    const remaining = target - actual;
    if (remaining <= 0) {
        const above = Math.abs(remaining);
        return above > 0
            ? `${formatHoursCompact(above)} above goal`
            : "Goal reached";
    }

    if (period === "daily") {
        return `${formatHoursCompact(remaining)} to goal`;
    }

    if (period === "weekly") {
        const workdays = countWeekdaysRemaining(
            endOfWeek(new Date(), { weekStartsOn: 1 })
        );

        if (workdays > 0) {
            return `${formatHoursCompact(
                remaining / workdays
            )}/day needed across ${workdays} workday${workdays === 1 ? "" : "s"}`;
        }

        return `${formatHoursCompact(remaining)} to goal`;
    }

    const end =
        period === "monthly" ? endOfMonth(new Date()) : endOfYear(new Date());
    const workdays = countWeekdaysRemaining(end);

    if (workdays > 0) {
        const weeklyPace = (remaining / workdays) * 5;
        return `${formatHoursCompact(weeklyPace)}/wk needed`;
    }

    return `${formatHoursCompact(remaining)} to goal`;
}

export default function DashboardSummaryCards() {
    const { user, isLoaded } = useUser();
    const summaryReports = useClockifySummaryReports();

    const reports = {
        daily: summaryReports.data?.TODAY,
        weekly: summaryReports.data?.THIS_WEEK,
        monthly: summaryReports.data?.THIS_MONTH,
        yearly: summaryReports.data?.THIS_YEAR,
    };

    const actualHours = {
        daily: secToHours(reports.daily?.totals?.[0]?.totalTime),
        weekly: secToHours(reports.weekly?.totals?.[0]?.totalTime),
        monthly: secToHours(reports.monthly?.totals?.[0]?.totalTime),
        yearly: secToHours(reports.yearly?.totals?.[0]?.totalTime),
    };

    const displayTime = {
        daily: summaryReports.isFetched
            ? secToTime(reports.daily?.totals?.[0]?.totalTime)
            : "",
        weekly: summaryReports.isFetched
            ? secToTime(reports.weekly?.totals?.[0]?.totalTime)
            : "",
        monthly: summaryReports.isFetched
            ? secToTime(reports.monthly?.totals?.[0]?.totalTime)
            : "",
        yearly: summaryReports.isFetched
            ? secToTime(reports.yearly?.totals?.[0]?.totalTime)
            : "",
    };

    const goals =
        isLoaded && user ? (user.publicMetadata.goals as GoalsType) : null;

    const cards: Array<{
        period: GoalPeriod;
        title: string;
        content: string;
        goal?: number;
    }> = [
        {
            period: "daily",
            title: "Today",
            content: displayTime.daily,
            goal: goals?.daily,
        },
        {
            period: "weekly",
            title: "This week",
            content: displayTime.weekly,
            goal: goals?.weekly,
        },
        {
            period: "monthly",
            title: "This month",
            content: displayTime.monthly,
            goal: goals?.monthly,
        },
        {
            period: "yearly",
            title: "This year",
            content: displayTime.yearly,
            goal: goals?.yearly,
        },
    ];

    return (
        <>
            {cards.map((card) => {
                const actual = actualHours[card.period];
                const target = card.goal ?? 0;
                const progress =
                    target > 0 ? Math.round((actual / target) * 100) : null;

                return (
                    <DashboardSummaryCard
                        key={card.period}
                        cardTitle={card.title}
                        cardContent={card.content}
                        isLoading={summaryReports.isLoading}
                        progress={progress}
                        target={target > 0 ? target : null}
                        context={
                            target > 0
                                ? goalContext(card.period, actual, target)
                                : null
                        }
                    />
                );
            })}
        </>
    );
}
