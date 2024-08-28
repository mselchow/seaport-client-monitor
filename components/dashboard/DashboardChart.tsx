"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    loading: () => <DashboardChartSkeleton />,
    ssr: false,
});

import getDashboardChartOptions from "@/components/dashboard/DashboardChartOptions";
import DashboardChartSkeleton from "@/components/dashboard/DashboardChartSkeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="h-5/6">
                    <DashboardChartSkeleton />
                </CardContent>
            </Card>
        );
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
                    <DashboardChartSkeleton />
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
