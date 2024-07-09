import type { Metadata } from "next";

import Tables from "@/app/tables/tables-page";

export const metadata: Metadata = {
    title: "Hours Left",
};

export default async function Page() {
    return <Tables />;
}
