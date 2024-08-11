import { ApexOptions } from "apexcharts";

type formatterType = (val: unknown) => string | number;

const fontFamily = "ui-sans-serif, system-ui, sans-serif";
const dataLabelFontSize = "12px";

export const getApexChartOptions = (
    theme: string,
    isHorizontal = false,
    yaxisFontSize = "12px",
    dataLabelsFormatter: formatterType,
    color: string
): ApexOptions => {
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

        colors: [color],

        plotOptions: {
            bar: {
                horizontal: isHorizontal,
                borderRadius: 4,
                dataLabels: {
                    position: "top",
                },
            },
        },

        yaxis: {
            min: 0,
            max: 120,
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
                        min: 0,
                        max: 120,
                        labels: {
                            style: {
                                fontSize: "11px",
                            },
                        },
                    },
                },
            },
        ],

        dataLabels: {
            enabled: true,
            offsetX: 35,
            formatter: dataLabelsFormatter,
            style: {
                fontSize: dataLabelFontSize,
                fontWeight: "normal",
                fontFamily: fontFamily,
                colors: [color],
            },
        },

        theme: {
            mode: theme as "light" | "dark",
        },
    };

    return chartOptions;
};
