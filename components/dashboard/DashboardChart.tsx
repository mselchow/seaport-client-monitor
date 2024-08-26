"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

import getDashboardChartOptions from "@/components/dashboard/DashboardChartOptions";
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
    const { resolvedTheme } = useTheme();

    if (!resolvedTheme) {
        return null;
    }

    const chartOptions = getDashboardChartOptions(resolvedTheme);

    const dataMap = data.map(({ day, hours }) => ({
        x: day,
        y: hours,
    }));

    const series = [
        {
            name: "Hours Logged",
            data: dataMap,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-5/6">
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
                    <ReactApexChart
                        options={chartOptions}
                        series={series}
                        type="bar"
                        height="500px"
                        width="100%"
                    />
                )}
            </CardContent>
        </Card>
    );
}
