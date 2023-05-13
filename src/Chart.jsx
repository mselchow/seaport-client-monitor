import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    LabelList,
    Cell,
} from "recharts";
import { Typography } from "@material-tailwind/react";

const Chart = ({ title, data }) => {
    if (!data.length) {
        return;
    }

    const width = 850;
    const height = data.length * 35 + 50;

    return (
        <div className="pb-10">
            <Typography variant="h4" className="pb-2">
                {title}
            </Typography>
            <BarChart
                layout="vertical"
                width={width}
                height={height}
                data={data}
                barCategoryGap={4}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                    type="number"
                    domain={[0, 120]}
                    tickCount={7}
                    tickMargin={8}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    width={250}
                    tickMargin={8}
                />
                <Bar dataKey="value" fill="rgba(255, 159, 64, 0.4)">
                    <LabelList
                        dataKey="value"
                        position="right"
                        offset={5}
                        formatter={(value) => {
                            return value + "%";
                        }}
                    />
                    {data.map((bar, index) => {
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
        </div>
    );
};

export default Chart;
