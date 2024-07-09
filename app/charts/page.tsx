import type { Metadata } from "next";

import Charts from "@/app/charts/charts-page";

export const metadata: Metadata = {
    title: "Hours Used",
};

export default async function Page() {
    return <Charts />;
}
