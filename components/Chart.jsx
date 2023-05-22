import {
    ResponsiveContainer,
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
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    id={title}
                    layout="vertical"
                    width={width}
                    height={height}
                    data={data}
                    barCategoryGap={4}
                    margin={{ top: 0, bottom: 0, left: 0, right: 10 }}
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
                        width={240}
                        tickMargin={8}
                    />
                    <Bar dataKey="pctHoursUsed" fill="rgba(255, 159, 64, 0.4)">
                        <LabelList
                            dataKey="pctHoursUsed"
                            position="right"
                            fill="black"
                            fontSize="14"
                            offset={5}
                            formatter={(value) => {
                                return value + "%";
                            }}
                        />
                        {data.map((bar, index) => {
                            let barColor;
                            if (bar.pctHoursUsed < 50) {
                                barColor = "rgb(53, 229, 145, 0.9)";
                            } else if (bar.pctHoursUsed < 75) {
                                barColor = "rgb(225, 229, 53, 0.9)";
                            } else if (bar.pctHoursUsed <= 100) {
                                barColor = "rgb(229, 145, 53, 0.9)";
                            } else {
                                barColor = "rgb(229, 57, 53, 0.9)";
                            }
                            return (
                                <Cell key={`cell-${index}`} fill={barColor} />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
