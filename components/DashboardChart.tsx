import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, XAxis, Bar, LabelList } from "recharts";

interface DashboardChartProps {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
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
                        <BarChart data={data}>
                            <XAxis
                                dataKey="day"
                                interval={0}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
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