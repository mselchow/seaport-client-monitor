import { ApexOptions } from "apexcharts";

import { hoursToTime } from "@/lib/utils";

export default function getDashboardChartOptions(
    resolvedTheme: string
): ApexOptions {
    const fontFamily = "ui-sans-serif, system-ui, sans-serif";
    const dataLabelFontSize = "12px";
    const chartColor = resolvedTheme === "light" ? "#0f172a" : "#f8fafc";

    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            background: "transparent",
            fontFamily: fontFamily,
            parentHeightOffset: 0,
            animations: {
                easing: "easeout",
                speed: 1000,
                animateGradually: {
                    enabled: false,
                },
            },
            toolbar: {
                show: false,
            },
        },

        grid: {
            show: false,
        },

        colors: [chartColor],

        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                dataLabels: {
                    position: "top",
                },
            },
        },

        xaxis: {
            labels: {
                formatter: (val: unknown) =>
                    (val as string).toString().substring(0, 3),
            },
        },

        yaxis: {
            show: false,
            min: 0,
            labels: {
                style: {
                    fontSize: "14px",
                    fontFamily: fontFamily,
                },
            },
        },

        tooltip: {
            enabled: true,
            style: {
                fontFamily: fontFamily,
            },
            marker: {
                show: false,
            },
        },

        dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -25,
            formatter: (val: unknown) => hoursToTime(val as number),
            style: {
                fontSize: dataLabelFontSize,
                fontWeight: "normal",
                fontFamily: fontFamily,
                colors: [resolvedTheme === "light" ? "#0f172a" : "#f8fafc"],
            },
        },

        theme: {
            mode: resolvedTheme as "light" | "dark",
        },
    };

    return chartOptions;
}
