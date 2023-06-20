import Head from "next/head";
import Table from "@/components/Table";
import { useClockifyData } from "@/lib/clockify";
import ClockifyProject from "@/lib/clockifyProject";
import { useUser } from "@clerk/nextjs";

const Tables = () => {
    const tableHeaders = [
        {
            label: "Client",
            accessor: "name",
            dataType: "string",
            sortable: true,
        },
        {
            label: "Hours Remaining",
            accessor: "hoursRemaining",
            dataType: "number",
            sortable: true,
        },
    ];

    const result = useClockifyData();
    const { user, isLoaded } = useUser();

    let excludedClients = isLoaded ? user.publicMetadata.excludedClients : [];
    if (excludedClients === undefined) {
        excludedClients = [];
    }
    let clockifyData, msData, blockData, projData;

    // Map Clockify data to wrapper, then filter out excluded clients
    if (result.isError || result.data?.message !== undefined) {
        // We had an error, show error message below
    } else if (!result.isLoading && isLoaded) {
        clockifyData = result.data;
        clockifyData = clockifyData.map((data) => new ClockifyProject(data));
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
                <title>Tables | Seaport Client Monitor</title>
            </Head>
            {result.isError || result.data?.message !== undefined ? (
                <div className="text-center">
                    <p>We countered an error fetching Clockify data.</p>
                    <p>
                        Please try again later, or make sure that you have saved
                        your Clockify API in under Settings.
                    </p>
                </div>
            ) : (
                <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Table
                        title="Managed Services"
                        data={msData}
                        headers={tableHeaders}
                        isLoading={result.isLoading}
                    />
                    <Table
                        title="Block Hours"
                        data={blockData}
                        headers={tableHeaders}
                        isLoading={result.isLoading}
                    />
                    <Table
                        title="Projects"
                        data={projData}
                        headers={tableHeaders}
                        isLoading={result.isLoading}
                    />
                </div>
            )}
        </>
    );
};

export default Tables;
