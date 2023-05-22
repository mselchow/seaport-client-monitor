import Head from "next/head";
import { Spinner } from "@material-tailwind/react";
import { useClockifyData } from "@/lib/useClockifyData";
import ClockifyProject from "@/lib/clockifyProject";
import Chart from "@/components/Chart";

const Charts = () => {
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
                <title>Charts | Seaport Client Monitor</title>
            </Head>
            <div className="flex w-full flex-col xl:w-2/3">
                {result.isLoading ? (
                    <Spinner className="h-8 w-8 place-self-center" />
                ) : result.isError ? (
                    <div className="place-self-center">
                        We countered an error fetching Clockify data. Please try
                        again later.
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
