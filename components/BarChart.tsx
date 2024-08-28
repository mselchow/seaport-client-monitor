"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

import getBarChartOptions from "@/components/BarChartOptions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ClockifyProject from "@/lib/clockifyProject";

interface ChartProps {
    title: string;
    data: ClockifyProject[] | null;
}

const CHART_HEIGHT_MULTIPLIER = 40;

export default function BarChart({ title, data }: ChartProps) {
    const { resolvedTheme } = useTheme();

    if (!data || !resolvedTheme) {
        return null;
    }

    const chartHeight = 100 + data.length * CHART_HEIGHT_MULTIPLIER;

    const chartOptions = getBarChartOptions(resolvedTheme);

    const dataMap = data.map(({ nameWithDate, pctHoursUsed }) => ({
        x: nameWithDate,
        y: pctHoursUsed,
    }));

    const series = [
        {
            name: "% Used",
            data: dataMap,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className={`h-[${chartHeight}px]`}>
                <ReactApexChart
                    options={chartOptions}
                    series={series}
                    type="bar"
                    height={chartHeight}
                />
            </CardContent>
        </Card>
    );
}
