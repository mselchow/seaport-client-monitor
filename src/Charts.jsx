import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    LabelList,
    Cell,
} from "recharts";
import fetchClockifyData from "./fetchClockifyData";

const Charts = ({ title }) => {
    const results = useQuery(["data"], fetchClockifyData);

    if (results.isLoading) {
        return (
            <div className="container mx-auto pt-2">
                <h2>Loading...</h2>
            </div>
        );
    }

    const chartData = [
        { name: "***REMOVED***", value: 63 },
        { name: "***REMOVED***", value: 96 },
        { name: "***REMOVED***", value: 72 },
        { name: "***REMOVED***", value: 60 },
        { name: "***REMOVED***", value: 44 },
        { name: "***REMOVED***", value: 97 },
    ];

    const width = 850;
    const height = chartData.length * 35 + 50;

    return (
        <BarChart
            layout="vertical"
            width={width}
            height={height}
            data={chartData}
            barCategoryGap={4}
        >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
                type="number"
                domain={[0, 120]}
                tickCount={7}
                tickMargin={8}
            />
            <YAxis dataKey="name" type="category" width={250} tickMargin={8} />
            <Bar dataKey="value" fill="rgba(255, 159, 64, 0.4)">
                <LabelList
                    dataKey="value"
                    position="right"
                    offset={5}
                    formatter={(value) => {
                        return value + "%";
                    }}
                />
                {chartData.map((bar, index) => {
                    let barColor;
                    if (bar.value < 50) {
                        barColor = "rgba(255, 159, 64, 1.0)";
                    } else if (bar.value < 75) {
                        barColor = "rgba(255, 205, 86, 1.0)";
                    } else {
                        barColor = "rgba(255, 99, 132, 1.0)";
                    }
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                })}
            </Bar>
        </BarChart>
    );
};

export default Charts;
