import { useUser } from "@clerk/nextjs";
import {
    useClockifySummaryReport,
    useClockifyWeeklyReport,
    useClockifyData,
} from "@/lib/clockify";

import { secToTime, secToHours } from "@/lib/utils";
import ClockifyProject from "@/lib/clockifyProject";
import { format, parse } from "date-fns";

import DashboardSummaryCard from "@/components/DashboardSummaryCard";
import DashboardChart from "@/components/DashboardChart";
import Table from "@/components/Table";

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

    const reportWeekly = useClockifyWeeklyReport();
    const hoursByDay = reportWeekly.isFetched
        ? reportWeekly.data?.totalsByDay.map(({ date, duration }) => ({
              day: format(parse(date, "yyyy-MM-dd", new Date()), "EEEE"),
              hours: secToHours(duration),
              label: secToTime(duration),
          }))
        : [];

    const tableHeaders = [
        {
            label: "Client",
            accessor: "name",
            dataType: "string",
            sortable: false,
        },
        {
            label: "Type",
            accessor: "type",
            dataType: "string",
            sortable: false,
        },
        {
            label: "Hours Remaining",
            accessor: "hoursRemaining",
            dataType: "number",
            sortable: false,
        },
    ];

    let excludedClients = isLoaded ? user.publicMetadata.excludedClients : [];
    if (excludedClients === undefined) {
        excludedClients = [];
    }

    let tableData;

    // Map Clockify data to wrapper, then filter out excluded clients
    if (clockifyData.isError) {
        // TODO: we had an error, show error message
    } else if (!clockifyData.isLoading && isLoaded) {
        tableData = clockifyData.data;
        tableData = tableData.map((data) => new ClockifyProject(data));
        tableData = tableData
            .filter((proj) => {
                if (!excludedClients.includes(proj.clientId)) {
                    return proj;
                }
            })
            .sort((a, b) => {
                return a.hoursRemaining - b.hoursRemaining;
            })
            .slice(0, 10);
    }

    return (
        <div className="space-y-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardSummaryCard
                    cardTitle="Today"
                    cardContent={timeToday}
                    isLoading={reportToday.isLoading}
                />
                <DashboardSummaryCard
                    cardTitle="This Week"
                    cardContent={timeWeek}
                    isLoading={reportWeek.isLoading}
                />
                <DashboardSummaryCard
                    cardTitle="This Month"
                    cardContent={timeMonth}
                    isLoading={reportMonth.isLoading}
                />
                <DashboardSummaryCard
                    cardTitle="This Year"
                    cardContent={timeYear}
                    isLoading={reportYear.isLoading}
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
        </div>
    );
}
