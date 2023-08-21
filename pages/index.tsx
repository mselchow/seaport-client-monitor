import { useUser } from "@clerk/nextjs";
import {
    useClockifySummaryReport,
    useClockifyWeeklyReport,
    useClockifyData,
} from "@/lib/clockify";

import { secToTime, secToHours } from "@/lib/utils";
import ClockifyProject, { ClockifyJSON } from "@/lib/clockifyProject";
import { format, parse } from "date-fns";

import DashboardSummaryCard from "@/components/DashboardSummaryCard";
import DashboardChart from "@/components/DashboardChart";
import Table from "@/components/Table";
import { GoalsType } from "@/components/settings/GoalSettings";

interface WeeklyReportType {
    date: string;
    duration: number;
}

export default function Home() {
    const clockifyData = useClockifyData();
    const { user, isLoaded } = useUser();

    const reportToday = useClockifySummaryReport("TODAY");
    const reportWeek = useClockifySummaryReport("THIS_WEEK");
    const reportMonth = useClockifySummaryReport("THIS_MONTH");
    const reportYear = useClockifySummaryReport("THIS_YEAR");

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

    const goals =
        isLoaded && user ? (user.publicMetadata.goals as GoalsType) : null;

    const goalProgress = goals
        ? {
              daily:
                  Math.round(
                      secToHours(reportToday.data?.totals[0]?.totalTime) /
                          goals.daily
                  ) * 100,
              weekly:
                  Math.round(
                      secToHours(reportWeek.data?.totals[0]?.totalTime) /
                          goals.weekly
                  ) * 100,
              monthly:
                  Math.round(
                      secToHours(reportMonth.data?.totals[0]?.totalTime) /
                          goals.monthly
                  ) * 100,
              yearly: Math.round(
                  (secToHours(reportYear.data?.totals[0]?.totalTime) /
                      goals.yearly) *
                      100
              ),
          }
        : null;

    const reportWeekly = useClockifyWeeklyReport();
    const hoursByDay = reportWeekly.isFetched
        ? reportWeekly.data?.totalsByDay.map(
              ({ date, duration }: WeeklyReportType) => ({
                  day: format(parse(date, "yyyy-MM-dd", new Date()), "EEEE"),
                  hours: secToHours(duration),
                  label: secToTime(duration),
              })
          )
        : [];

    const tableHeaders = [
        {
            label: "Client",
            accessor: "nameWithDate" as keyof ClockifyProject,
            dataType: "string",
            sortable: false,
        },
        {
            label: "Type",
            accessor: "type" as keyof ClockifyProject,
            dataType: "string",
            sortable: false,
        },
        {
            label: "Hours Remaining",
            accessor: "hoursRemaining" as keyof ClockifyProject,
            dataType: "number",
            sortable: false,
        },
    ];

    let excludedClients =
        isLoaded && user
            ? (user.publicMetadata.excludedClients as string[])
            : [];
    if (excludedClients === undefined) {
        excludedClients = [];
    }

    let tableData: ClockifyProject[] | null = null;

    // Map Clockify data to wrapper, then filter out excluded clients
    if (clockifyData.isError || clockifyData.data?.message !== undefined) {
        // TODO: we had an error, show error message
    } else if (!clockifyData.isLoading && isLoaded) {
        tableData = clockifyData.data.map(
            (data: ClockifyJSON) => new ClockifyProject(data)
        );

        if (tableData) {
            tableData = tableData
                .filter((proj) => {
                    if (!excludedClients.includes(proj.clientId)) {
                        return proj;
                    }
                })
                .sort((a, b) => {
                    return Number(a.hoursRemaining) - Number(b.hoursRemaining);
                })
                .slice(0, 10);
        }
    }

    return (
        <div className="space-y-4">
            {clockifyData.isError ||
            clockifyData.data?.message !== undefined ? (
                <div className="text-center">
                    <p>We countered an error fetching Clockify data.</p>
                    <p>
                        Please try again later, or make sure that you have saved
                        your Clockify API in under Settings.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <DashboardChart
                            title="Hours Logged This Week"
                            data={hoursByDay}
                            isLoading={reportWeekly.isLoading}
                        />
                        <Table
                            title="Hours Remaining"
                            data={tableData}
                            headers={tableHeaders}
                            isLoading={clockifyData.isLoading}
                            expectedRows={11}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
