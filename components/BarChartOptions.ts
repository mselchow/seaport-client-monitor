import { ApexOptions } from "apexcharts";

export default function getBarChartOptions(resolvedTheme: string): ApexOptions {
    const fontFamily = "ui-sans-serif, system-ui, sans-serif";
    const dataLabelFontSize = "12px";
    const color = resolvedTheme === "light" ? "#0f172a" : "#f8fafc";
    const yaxisFontSize = "14px";

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
            show: true,
        },

        colors: [color],

        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                dataLabels: {
                    position: "top",
                },
            },
        },

        yaxis: {
            show: true,
            labels: {
                style: {
                    fontSize: yaxisFontSize,
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
            offsetX: 35,
            offsetY: 0,
            formatter: (val: unknown) => val + "%",
            style: {
                fontSize: dataLabelFontSize,
                fontWeight: "normal",
                fontFamily: fontFamily,
                colors: [color],
            },
        },

        theme: {
            mode: resolvedTheme as "light" | "dark",
        },

        responsive: [
            {
                breakpoint: 640 /* Tailwind 'sm' */,
                options: {
                    plotOptions: {
                        bar: {
                            horizontal: false,
                        },
                    },
                    dataLabels: {
                        offsetX: 0,
                        offsetY: -25,
                    },
                    xaxis: {
                        labels: {
                            style: {},
                        },
                    },
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: "11px",
                            },
                        },
                    },
                },
            },
        ],
    };

    return chartOptions;
}
