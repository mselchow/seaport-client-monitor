import { useClockifyReport, useClockifyData } from "@/lib/clockify";
import { secToTime } from "@/lib/utils";
import DashboardSummaryCard from "@/components/DashboardSummaryCard";
import Table from "@/components/Table";
import { useUser } from "@clerk/nextjs";
import ClockifyProject from "@/lib/clockifyProject";

export default function Home() {
    const clockifyData = useClockifyData();
    const { user, isLoaded } = useUser();

    const reportToday = useClockifyReport("TODAY");
    const reportWeek = useClockifyReport("THIS_WEEK");
    const reportMonth = useClockifyReport("THIS_MONTH");
    const reportYear = useClockifyReport("THIS_YEAR");

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
            .slice(0, 12);
    }

    return (
        <div className="flex flex-1 flex-col gap-8">
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
            <div className="grid gap-4 md:grid-cols-2">
                <div>Chart</div>
                <div>
                    <Table
                        title="Hours Remaining"
                        data={tableData}
                        headers={tableHeaders}
                        isLoading={clockifyData.isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
