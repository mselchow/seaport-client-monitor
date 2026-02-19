import { useUser } from "@clerk/nextjs";

import DashboardSummaryCard from "@/components/dashboard/DashboardSummaryCard";
import { GoalsType } from "@/components/settings/GoalSettings";
import { useClockifySummaryReports } from "@/lib/clockify";
import { secToTime, secToHours } from "@/lib/utils";

export default function DashboardSummaryCards() {
    const { user, isLoaded } = useUser();

    // get summary data from Clockify
    const summaryReports = useClockifySummaryReports();
    const reportToday = summaryReports.data?.TODAY;
    const reportWeek = summaryReports.data?.THIS_WEEK;
    const reportMonth = summaryReports.data?.THIS_MONTH;
    const reportYear = summaryReports.data?.THIS_YEAR;

    // convert time to display format 0h 0m
    const timeToday = summaryReports.isFetched
        ? secToTime(reportToday?.totals?.[0]?.totalTime)
        : "";
    const timeWeek = summaryReports.isFetched
        ? secToTime(reportWeek?.totals?.[0]?.totalTime)
        : "";
    const timeMonth = summaryReports.isFetched
        ? secToTime(reportMonth?.totals?.[0]?.totalTime)
        : "";
    const timeYear = summaryReports.isFetched
        ? secToTime(reportYear?.totals?.[0]?.totalTime)
        : "";

    // get goals metadata from Clerk (if it exists)
    const goals =
        isLoaded && user ? (user.publicMetadata.goals as GoalsType) : null;

    // calculate progress against goal
    const goalProgress = goals
        ? {
              daily: Math.round(
                  (secToHours(reportToday?.totals?.[0]?.totalTime) /
                      goals.daily) *
                      100
              ),
              weekly: Math.round(
                  (secToHours(reportWeek?.totals?.[0]?.totalTime) /
                      goals.weekly) *
                      100
              ),
              monthly: Math.round(
                  (secToHours(reportMonth?.totals?.[0]?.totalTime) /
                      goals.monthly) *
                      100
              ),
              yearly: Math.round(
                  (secToHours(reportYear?.totals?.[0]?.totalTime) /
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
                isLoading={summaryReports.isLoading}
                progress={goalProgress?.daily}
            />
            <DashboardSummaryCard
                cardTitle="This Week"
                cardContent={timeWeek}
                isLoading={summaryReports.isLoading}
                progress={goalProgress?.weekly}
            />
            <DashboardSummaryCard
                cardTitle="This Month"
                cardContent={timeMonth}
                isLoading={summaryReports.isLoading}
                progress={goalProgress?.monthly}
            />
            <DashboardSummaryCard
                cardTitle="This Year"
                cardContent={timeYear}
                isLoading={summaryReports.isLoading}
                progress={goalProgress?.yearly}
            />
        </>
    );
}
