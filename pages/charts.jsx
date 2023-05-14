import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@material-tailwind/react";
import Chart from "@/components/Chart";
import fetchClockifyData from "@/lib/fetchClockifyData";

const Charts = () => {
    const results = useQuery(["data"], fetchClockifyData);

    if (results.isLoading) {
        return <Spinner className="h-10 w-10" />;
    }

    const chartData = [
        { name: "***REMOVED***", value: 63 },
        { name: "***REMOVED***", value: 96 },
        { name: "***REMOVED***", value: 72 },
        { name: "***REMOVED***", value: 60 },
        { name: "***REMOVED***", value: 44 },
        { name: "***REMOVED***", value: 97 },
    ];

    return (
        <>
            <Head>
                <title>Charts | Seaport Client Monitor</title>
            </Head>
            <div className="flex flex-col">
                <Chart title="Managed Services" data={chartData} />
                <Chart title="Block Hours" data={chartData} />
                <Chart title="Projects" data={chartData} />
            </div>
        </>
    );
};

export default Charts;
