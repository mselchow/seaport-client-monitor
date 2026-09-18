"use client";

import { useUser } from "@clerk/nextjs";
import { getDay, parse } from "date-fns";

import DashboardChart from "@/components/dashboard/DashboardChart";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import DashboardAttention from "@/components/monitoring/DashboardAttention";
import { useClockifyData, useClockifyWeeklyReport } from "@/lib/clockify";
import ClockifyProject, { ClockifyJSON } from "@/lib/clockifyProject";
import { secToHours, secToTime } from "@/lib/utils";

interface WeeklyReportType {
    date: string;
    duration: number;
}

const dashboardWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export default function HomePage() {
    const clockifyData = useClockifyData();
    const reportWeekly = useClockifyWeeklyReport();
    const { user, isLoaded } = useUser();

    const hoursByDay = reportWeekly.isFetched
        ? dashboardWeekdays.map((day, dayIndex) => {
              const matchingDay = reportWeekly.data?.totalsByDay.find(
                  ({ date }: WeeklyReportType) =>
                      getDay(parse(date, "yyyy-MM-dd", new Date())) ===
                      dayIndex
              );
              const duration = matchingDay?.duration;

              return {
                  day,
                  hours: secToHours(duration),
                  label: secToTime(duration),
              };
          })
        : [];

    let excludedClients =
        isLoaded && user
            ? (user.publicMetadata.excludedClients as string[])
            : [];
    if (excludedClients === undefined) {
        excludedClients = [];
    }

    let projects: ClockifyProject[] | null = null;
    const hasClockifyError =
        clockifyData.isError || clockifyData.data?.message !== undefined;

    if (!hasClockifyError && !clockifyData.isLoading && isLoaded) {
        projects = Array.isArray(clockifyData.data)
            ? clockifyData.data
                  .map((data: ClockifyJSON) => new ClockifyProject(data))
                  .filter(
                      (project: ClockifyProject) =>
                          !excludedClients.includes(project.clientId)
                  )
            : [];
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Monitor client-hour health and your billable pace.
                </p>
            </div>

            {hasClockifyError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-5">
                    <p className="font-semibold">
                        We encountered an error fetching Clockify data.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try refreshing, or confirm that your Clockify API key is
                        saved under Settings.
                    </p>
                </div>
            ) : (
                <>
                    <DashboardAttention
                        data={projects}
                        isLoading={clockifyData.isLoading || !isLoaded}
                    />

                    <section className="space-y-3">
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                My billable pace
                            </h2>
                        </div>
                        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <DashboardSummaryCards />
                        </div>
                    </section>

                    <DashboardChart
                        title="Weekly hours"
                        data={hoursByDay}
                        isLoading={reportWeekly.isLoading}
                    />
                </>
            )}
        </div>
    );
}
