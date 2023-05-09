import { useQuery } from "@tanstack/react-query";
import fetchClockifyData from "./fetchClockifyData";

const Charts = () => {
    const results = useQuery(["data"], fetchClockifyData);

    if (results.isLoading) {
        return (
            <div className="container mx-auto pt-2">
                <h2>Loading...</h2>
            </div>
        );
    }

    console.log(results.data);

    return <div className="container mx-auto pt-2">Test</div>;
};

export default Charts;
