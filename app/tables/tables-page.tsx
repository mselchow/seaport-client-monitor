"use client";

import { useUser } from "@clerk/nextjs";

import EngagementMonitor from "@/components/monitoring/EngagementMonitor";
import { useClockifyData } from "@/lib/clockify";
import ClockifyProject, { ClockifyJSON } from "@/lib/clockifyProject";

const Tables = () => {
    const result = useClockifyData();
    const { user, isLoaded } = useUser();

    let excludedClients =
        isLoaded && user
            ? (user.publicMetadata.excludedClients as string[])
            : [];
    if (excludedClients === undefined) {
        excludedClients = [];
    }

    const hasClockifyError =
        result.isError || result.data?.message !== undefined;

    let clockifyData: ClockifyProject[] | null = null;

    if (!hasClockifyError && !result.isLoading && isLoaded) {
        clockifyData = Array.isArray(result.data)
            ? result.data
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
                <h1 className="text-2xl font-bold tracking-tight">Hours left</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Review every active engagement by normalized balance and
                    health, regardless of billing model.
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
                <EngagementMonitor
                    data={clockifyData}
                    isLoading={result.isLoading || !isLoaded}
                />
            )}
        </div>
    );
};

export default Tables;
