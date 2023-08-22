import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LabelList,
    Cell,
} from "recharts";

import { TypographyH3 } from "@/components/ui/typography";
import ClockifyProject from "@/lib/clockifyProject";

interface ChartProps {
    title: string;
    data: ClockifyProject[] | null;
}

const Chart = ({ title, data }: ChartProps) => {
    if (!data) {
        return null;
    }

    const width = 850;
    const height = data.length * 35 + 50;

    return (
        <div className="pb-10">
            <TypographyH3 className="pb-2">{title}</TypographyH3>
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
                    <XAxis
                        type="number"
                        domain={[0, 120]}
                        fontSize={12}
                        tickCount={7}
                        tickMargin={4}
                        axisLine={false}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={225}
                        tickMargin={8}
                        fontSize={14}
                        tickLine={false}
                    />
                    <Bar dataKey="pctHoursUsed" fill="rgba(255, 159, 64, 0.4)">
                        <LabelList
                            dataKey="pctHoursUsed"
                            position="right"
                            className="fill-primary"
                            fontSize="14"
                            offset={5}
                            formatter={(value: string) => {
                                return value + "%";
                            }}
                        />
                        {data.map((bar, index) => {
                            let barColor;
                            if (bar.pctHoursUsed < 50) {
                                barColor = "rgb(53, 229, 145, 1.0)";
                            } else if (bar.pctHoursUsed < 75) {
                                barColor = "rgb(225, 229, 53, 1.0)";
                            } else if (bar.pctHoursUsed <= 100) {
                                barColor = "rgb(229, 145, 53, 1.0)";
                            } else {
                                barColor = "rgb(229, 57, 53, 1.0)";
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
