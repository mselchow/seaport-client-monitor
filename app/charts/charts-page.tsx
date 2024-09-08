"use client";

import { useUser } from "@clerk/nextjs";

import BarChart from "@/components/BarChart";
import { useClockifyData } from "@/lib/clockify";
import ClockifyProject, { ClockifyJSON } from "@/lib/clockifyProject";

const Charts = () => {
    const result = useClockifyData();
    const { user, isLoaded } = useUser();

    let excludedClients =
        isLoaded && user
            ? (user.publicMetadata.excludedClients as string[])
            : [];
    if (excludedClients === undefined) {
        excludedClients = [];
    }
    let clockifyData: ClockifyProject[],
        msData: ClockifyProject[] | null = null,
        blockData: ClockifyProject[] | null = null,
        projData: ClockifyProject[] | null = null;

    // Map Clockify data to wrapper, then filter out excluded clients
    if (result.isError || result.data?.message !== undefined) {
        // We had an error, show error message below
    } else if (!result.isLoading && isLoaded) {
        clockifyData = result.data.map(
            (data: ClockifyJSON) => new ClockifyProject(data)
        );

        clockifyData = clockifyData.filter((proj) => {
            if (!excludedClients.includes(proj.clientId)) {
                return proj;
            }
        });

        msData = clockifyData.filter((proj) => proj.type == "Managed Services");
        blockData = clockifyData.filter((proj) => proj.type == "Block Hours");
        projData = clockifyData.filter((proj) => proj.type == "Project");
    }

    return (
        <>
            <div className="flex w-full flex-col lg:px-[10%] xl:px-[15%]">
                {result.isError || result.data?.message !== undefined ? (
                    <div className="text-center">
                        <p>We countered an error fetching Clockify data.</p>
                        <p>
                            Please try again later, or make sure that you have
                            saved your Clockify API in under Settings.
                        </p>
                    </div>
                ) : result.isError ? (
                    <div className="text-center">
                        <p>We countered an error fetching Clockify data.</p>
                        <p>
                            Please try again later, or make sure that you have
                            saved your Clockify API in under Settings.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-grow flex-col gap-4">
                        <BarChart
                            title="Managed Services"
                            data={msData}
                            isLoading={result.isLoading} //NOTE: do we need (result.isLoading || !isLoaded) which is what we had before
                        />
                        <BarChart
                            title="Block Hours"
                            data={blockData}
                            isLoading={result.isLoading}
                        />
                        <BarChart
                            title="Projects"
                            data={projData}
                            isLoading={result.isLoading}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Charts;
