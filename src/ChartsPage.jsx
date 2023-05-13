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
        { name: "***REMOVED***", value: 63 },
        { name: "***REMOVED***", value: 96 },
        { name: "***REMOVED***", value: 72 },
        { name: "***REMOVED***", value: 60 },
        { name: "***REMOVED***", value: 44 },
        { name: "***REMOVED***", value: 97 },
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
