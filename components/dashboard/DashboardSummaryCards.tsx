import { useUser } from "@clerk/nextjs";

import DashboardSummaryCard from "@/components/dashboard/DashboardSummaryCard";
import { GoalsType } from "@/components/settings/GoalSettings";
import { useClockifySummaryReport } from "@/lib/clockify";
import { secToTime, secToHours } from "@/lib/utils";

export default function DashboardSummaryCards() {
    const { user, isLoaded } = useUser();

    // get summary data from Clockify
    const reportToday = useClockifySummaryReport("TODAY");
    const reportWeek = useClockifySummaryReport("THIS_WEEK");
    const reportMonth = useClockifySummaryReport("THIS_MONTH");
    const reportYear = useClockifySummaryReport("THIS_YEAR");

    // convert time to display format 0h 0m
    const timeToday = reportToday.isFetched
        ? secToTime(reportToday.data?.totals[0]?.totalTime)
        : "";
    const timeWeek = reportWeek.isFetched
        ? secToTime(reportWeek.data?.totals[0]?.totalTime)
        : "";
    const timeMonth = reportMonth.isFetched
        ? secToTime(reportMonth.data?.totals[0]?.totalTime)
        : "";
    const timeYear = reportYear.isFetched
        ? secToTime(reportYear.data?.totals[0]?.totalTime)
        : "";

    // get goals metadata from Clerk (if it exists)
    const goals =
        isLoaded && user ? (user.publicMetadata.goals as GoalsType) : null;

    // calculate progress against goal
    const goalProgress = goals
        ? {
              daily: Math.round(
                  (secToHours(reportToday.data?.totals[0]?.totalTime) /
                      goals.daily) *
                      100
              ),
              weekly: Math.round(
                  (secToHours(reportWeek.data?.totals[0]?.totalTime) /
                      goals.weekly) *
                      100
              ),
              monthly: Math.round(
                  (secToHours(reportMonth.data?.totals[0]?.totalTime) /
                      goals.monthly) *
                      100
              ),
              yearly: Math.round(
                  (secToHours(reportYear.data?.totals[0]?.totalTime) /
                      goals.yearly) *
                      100
              ),
          }
        : null;

    return (
        <>
            <DashboardSummaryCard
                cardTitle="Today"
                cardContent={timeToday}
                isLoading={reportToday.isLoading}
                progress={goalProgress?.daily}
            />
            <DashboardSummaryCard
                cardTitle="This Week"
                cardContent={timeWeek}
                isLoading={reportWeek.isLoading}
                progress={goalProgress?.weekly}
            />
            <DashboardSummaryCard
                cardTitle="This Month"
                cardContent={timeMonth}
                isLoading={reportMonth.isLoading}
                progress={goalProgress?.monthly}
            />
            <DashboardSummaryCard
                cardTitle="This Year"
                cardContent={timeYear}
                isLoading={reportYear.isLoading}
                progress={goalProgress?.yearly}
            />
        </>
    );
}
