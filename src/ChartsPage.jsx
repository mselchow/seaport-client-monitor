import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@material-tailwind/react";
import Chart from "./Chart";
import fetchClockifyData from "./fetchClockifyData";

const ChartsPage = () => {
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
        <div>
            <Chart title="Managed Services" data={chartData} />
            <Chart title="Block Hours" data={chartData} />
            <Chart title="Projects" data={chartData} />
        </div>
    );
};

export default ChartsPage;
