import { Bar, BarChart, XAxis, LabelList } from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
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

const chartConfig = {
    hours: {
        label: "Hours",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

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
            <CardContent className="h-5/6 px-2">
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
                    <ChartContainer
                        config={chartConfig}
                        className="h-full min-h-[500px] w-full"
                    >
                        <BarChart accessibilityLayer data={data}>
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="hours"
                                fill="var(--color-hours)"
                                radius={4}
                            >
                                <LabelList
                                    position="top"
                                    dataKey="label"
                                    offset={12}
                                    className="fill-primary"
                                    fontSize={14}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
