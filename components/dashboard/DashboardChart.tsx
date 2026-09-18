"use client";

import { BarChart3 } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import getDashboardChartOptions from "@/components/dashboard/DashboardChartOptions";
import DashboardChartSkeleton from "@/components/dashboard/DashboardChartSkeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    loading: () => <DashboardChartSkeleton />,
    ssr: false,
});

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
    const hasHours = data.some(({ hours }) => hours > 0);

    const header = (
        <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>
                Billable hours logged in Clockify across the current week.
            </CardDescription>
        </CardHeader>
    );

    if (!resolvedTheme) {
        return (
            <Card className="overflow-hidden">
                {header}
                <CardContent className="py-6">
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
        <Card className="overflow-hidden">
            {header}
            <CardContent className="pt-6">
                {isLoading ? (
                    <DashboardChartSkeleton />
                ) : !hasHours ? (
                    <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
                        <div className="rounded-full bg-muted p-3">
                            <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="mt-4 font-medium">
                            No billable hours logged this week yet.
                        </p>
                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            Hours will appear here after Clockify activity is
                            logged and synced.
                        </p>
                    </div>
                ) : (
                    <ReactApexChart
                        options={chartOptions}
                        series={series}
                        type="bar"
                        height="340px"
                        width="100%"
                    />
                )}
            </CardContent>
        </Card>
    );
}
