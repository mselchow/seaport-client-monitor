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
        { name: "3BL Media", value: 63 },
        { name: "AG Mednet", value: 96 },
        { name: "C.H. Newton Builders", value: 72 },
        { name: "Dysis Medical Inc", value: 60 },
        { name: "Ori, Inc.", value: 44 },
        { name: "Specified Technologies, Inc.", value: 97 },
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
