import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useClockifyData } from "@/lib/clockify";
import ClockifyProject, { ClockifyJSON } from "@/lib/clockifyProject";
import Chart from "@/components/Chart";

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
    if (result.isError) {
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
            <Head>
                <title>Charts | Seaport Client Monitor</title>
            </Head>
            <div className="flex w-full flex-col lg:px-[10%] xl:px-[15%]">
                {result.isLoading || !isLoaded ? (
                    <Loader2 className="h-8 w-8 animate-spin place-self-center" />
                ) : result.isError ? (
                    <div className="text-center">
                        <p>We countered an error fetching Clockify data.</p>
                        <p>
                            Please try again later, or make sure that you have
                            saved your Clockify API in under Settings.
                        </p>
                    </div>
                ) : (
                    <>
                        <Chart title="Managed Services" data={msData} />
                        <Chart title="Block Hours" data={blockData} />
                        <Chart title="Projects" data={projData} />
                    </>
                )}
            </div>
        </>
    );
};

export default Charts;
