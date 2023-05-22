import Head from "next/head";
import { Spinner } from "@material-tailwind/react";
import Table from "@/components/Table";
import { useClockifyData } from "@/lib/useClockifyData";
import ClockifyProject from "@/lib/clockifyProject";

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

    let clockifyData, msData, blockData, projData;

    if (result.isError) {
        // We had an error, show error message below
    } else if (!result.isLoading) {
        clockifyData = result.data;
        clockifyData = clockifyData.map((data) => new ClockifyProject(data));

        msData = clockifyData.filter((proj) => proj.type == "Managed Services");
        blockData = clockifyData.filter((proj) => proj.type == "Block Hours");
        projData = clockifyData.filter((proj) => proj.type == "Project");
    }

    return (
        <>
            <Head>
                <title>Tables | Seaport Client Monitor</title>
            </Head>
            {result.isLoading ? (
                <Spinner className="h-8 w-8 place-self-center" />
            ) : result.isError ? (
                "We countered an error fetching Clockify data. Please try again later."
            ) : (
                <div className="w-full xl:w-2/3">
                    <Table
                        title="Managed Services"
                        data={msData}
                        headers={tableHeaders}
                    />
                    <Table
                        title="Block Hours"
                        data={blockData}
                        headers={tableHeaders}
                    />
                    <Table
                        title="Projects"
                        data={projData}
                        headers={tableHeaders}
                    />
                </div>
            )}
        </>
    );
};

export default Tables;
