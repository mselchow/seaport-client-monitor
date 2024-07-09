import type { Metadata } from "next";

import Settings from "@/app/settings/[[...slug]]/settings-page";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function Page() {
    return <Settings />;
}
