import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    LabelList,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartDataType {
    day: string;
    hours: number;
    label: string;
}

interface DashboardChartProps {
    title: string;
    data: ChartDataType[];
    isLoading: boolean;
}

export default function DashboardChart({
    title,
    data,
    isLoading = false,
}: DashboardChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                {isLoading ? (
                    <div className="flex items-end justify-around">
                        <Skeleton className="h-[125px] w-[11%]" />
                        <Skeleton className="h-[250px] w-[11%]" />
                        <Skeleton className="h-[425px] w-[11%]" />
                        <Skeleton className="h-[500px] w-[11%]" />
                        <Skeleton className="h-[425px] w-[11%]" />
                        <Skeleton className="h-[250px] w-[11%]" />
                        <Skeleton className="h-[125px] w-[11%]" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart data={data} margin={{ top: 20 }}>
                            <XAxis
                                dataKey="day"
                                interval={0}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis hide={true} domain={[0, "dataMax"]} />
                            <Bar
                                dataKey="hours"
                                fill="#214E5F"
                                radius={[4, 4, 0, 0]}
                            >
                                <LabelList
                                    dataKey="label"
                                    position="top"
                                    className="fill-primary"
                                    fontSize="14"
                                    offset={10}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
