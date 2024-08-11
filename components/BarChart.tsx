import { useTheme } from "next-themes";
import ReactApexChart from "react-apexcharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getApexChartOptions } from "@/lib/apexChartConfig";
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

    const chartOptions = getApexChartOptions(
        resolvedTheme,
        true,
        "14px",
        (val: unknown) => val + "%",
        resolvedTheme === "light" ? "#0f172a" : "#f8fafc"
    );

    const dataMap = data.map(({ name, pctHoursUsed }) => ({
        x: name,
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
