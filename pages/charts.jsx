import Head from "next/head";
import { Spinner } from "@material-tailwind/react";
import Chart from "@/components/Chart";
import { useClockifyData } from "@/lib/useClockifyData";
import ClockifyProject from "@/lib/clockifyProject";

const Charts = () => {
    const result = useClockifyData();

    let clockifyData, msData, blockData, projData;
    if (!result.isLoading) {
        clockifyData = result.data;
        clockifyData = clockifyData.map((data) => new ClockifyProject(data));

        msData = clockifyData.filter((proj) => proj.type == "Managed Services");
        blockData = clockifyData.filter((proj) => proj.type == "Block Hours");
        projData = clockifyData.filter((proj) => proj.type == "Project");
    }

    return (
        <>
            <Head>
                <title>Charts | Seaport Client Monitor</title>
            </Head>
            <div className="flex flex-col">
                {result.isLoading ? (
                    <Spinner />
                ) : result.isError ? (
                    "We countered an error fetching Clockify data. Please try again later."
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
